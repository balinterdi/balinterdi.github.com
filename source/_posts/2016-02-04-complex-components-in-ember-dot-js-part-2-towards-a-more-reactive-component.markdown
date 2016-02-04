---
layout: post
title: "Complex Components in Ember.js - Part 2 - Towards a more reactive component"
date: 2016-02-04 08:11
comments: true
categories: ember.js
perk: complex-component-design
---

*This is part 2 of my Complex Component Design series. Here are the preceding posts:*

* [**Intro**](/2015/09/10/complex-component-design-in-ember-intro.html)
* [**Analyzing User Flows**][1]

- - - -

In [the previous part of this series][1], the implementation of the main user
flows were explained in detail. I ended the post by saying that I was not
content with the implementation for several reasons, the most crucial of which
was that parent components needed to be passed down to children, so that
children can register themselves with their parent. That, in turn, allowed
parents to reach their children and call methods on them directly instead of
using events, actions and data bindings for communication. In this post, we'll
see how to get rid of these and replace them with more reactive solutions.

## Remove the need for direct access to the input

Currently, the autocomplete component (the parent) yields itself to its
children. `auto-complete-input` binds its own `autocomplete` attribute to it so
that it can register itself with its parent when inserted:

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
{{#auto-complete
      on-select=(action "selectArtist")
      on-input=(action "filterArtists")
      class="autocomplete-container" as
        |autocomplete isDropdownOpen inputValue
         toggleDropdown onSelect onInput|}}
  <div class="input-group">
    {{auto-complete-input
        autocomplete=autocomplete
        value=inputValue
        on-change=onInput
        type="text"
        class="combobox input-large form-control"
        placeholder="Select an artist"}}
    (...)
  </div>
(...)
{{/auto-complete}}
{% endraw %}
{% endhighlight %}


```js
// addon/components/auto-complete-input.js
import Ember from 'ember';

export default Ember.TextField.extend({
  autocomplete: null,

  registerWithAutocomplete: Ember.on('didInsertElement', function() {
    this.get('autocomplete').registerInput(this);
  }),
  (...)
});
```

This is needed when the item is autocompleted and the autocompleted segment is
pre-selected so that the user can type over it if it's not the item they had in
mind:

```js
// addon/components/auto-complete.js
export default Ember.Component.extend({
  (...)
  actions: {
    inputDidChange(value) {
      (...)
      Ember.run.scheduleOnce('afterRender', this, function() {
        (...)
        const firstOption = this.get('list.firstOption');
        if (firstOption) {
          const autocompletedLabel = firstOption.get('label');
          this.set('focusedOption', firstOption);
          this.get('on-select')(firstOption.get('item'));
          this.set('inputValue', autocompletedLabel);
          Ember.run.next(() => {
            this.get('input.element').setSelectionRange(value.length, autocompletedLabel.length);
          });
        }
      });
    }
  }
});
```

On the very last line, the component accesses the `input` directly, to select
(and highlight) the portion of the item that was autocompleted. That's why we
need the whole registration process.

Since `inputDidChange` is triggered from the `auto-complete-input` component, we
could get rid of this direct coupling if there was a way to react to the
action's result in the `auto-complete-input` itself. That way is called closure
actions.

### Fire, but don't forget

As opposed to the fire-and-forget nature of "ordinary" (aka. element) actions,
closure actions provide a way to react to the action's outcome at the source,
where the action was fired from.

Since closure actions are functions, they can have return values. If the action
triggers an async action, it's best to return a promise from the upstream
handler to which the event source can attach its handler to.

Let's see how that works in our case.

```js
// addon/components/auto-complete.js
export default Ember.Component.extend({
  (...)
  actions: {
    inputDidChange(value) {
      this.get('on-input')(value);
      this.set('isDropdownOpen', true);
      return new Ember.RSVP.Promise((resolve, reject) => {
        (...)
        Ember.run.scheduleOnce('afterRender', this, function() {
          const firstOption = this.get('list.firstOption');
          if (firstOption) {
            const autocompletedLabel = firstOption.get('label');
            this.set('focusedOption', firstOption);
            this.get('on-select')(firstOption.get('item'));
            this.set('inputValue', autocompletedLabel);
            Ember.run.next(() => {
              resolve({ start: value.length, end: autocompletedLabel.length });
            });
          }
        });
      });
    }
  }
});
```

The code did not change a lot, but now a promise is returned on line 8. It is
resolved on 18, where `start` and `end` designate the cursor positions of the
selection.

The action handler in the `auto-complete-input` component needs to be modified
to set the selection higlight itself:

```js
// addon/components/auto-complete-input.js
import Ember from 'ember';

export default Ember.TextField.extend({
  valueDidChange: Ember.on('input', function() {
    const value = this.$().val();
    this.get('on-change')(value).then(({ start, end }) => {
      this.get('element').setSelectionRange(start, end);
    });
  })
});
```

Calling `on-change` will call the above `inputDidChange` function. Instead of
firing the (element) action and forgetting about it, we now call the (closure)
action and then "wait" for the resulting promise to be resolved. Once it does,
we set the selection range.

We could now remove all the registration code and the passing down of the
autocomplete instance to the input component.

## Remove the need for direct access to the list options

There is still another instance of the same. It serves to give access to the
`autocomplete` component to the `auto-complete-option`, through the
`auto-complete-list`.

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
{{#auto-complete
      on-select=(action "selectArtist")
      on-input=(action "filterArtists")
      class="autocomplete-container" as |autocomplete isDropdownOpen inputValue
                                         toggleDropdown onSelect onInput|}}
  <div class="input-group">
    {{auto-complete-input
        value=inputValue
        on-change=onInput
        type="text"
        class="combobox input-large form-control"
        placeholder="Select an artist"}}
    {{#auto-complete-list autocomplete=autocomplete isVisible=isDropdownOpen class="typeahead typeahead-long dropdown-menu" as |list|}}
      {{#each matchingArtists as |artist|}}
        {{#auto-complete-option
            id=artist.id
            label=artist.name
            item=artist
            list=list
            on-click=onSelect
            activeId=selectedArtist.id}}
          <a href="#">{{artist.name}}</a>
        {{/auto-complete-option}}
      {{/each}}
    {{/auto-complete-list}}
    (...)
  </div>
{{/auto-complete}}
{% endraw %}
{% endhighlight %}

I am not copying all the registration code here as it's very boilerplatey. Each
option, when inserted into the DOM, registers itself with its list, while the
list registers itself with the `auto-complete` component. The latter has an
options property to access the options:

```js
// addon/components/auto-complete.js
options: Ember.computed.readOnly('list.options')
```

This access is needed to be able to cycle through the options by using the
cursor keys and then select one of them by using the return key. Here is the
code that handles keypresses (more precisely, keydowns):

```js
// addon/components/auto-complete.js
export default Ember.Component.extend({
  (...)
  keydownMap: {
    8:  'startBackspacing', // backspace
    13: 'selectOption',  // return
    27: 'closeDropdown', // escape
    38: 'focusPrevious', // up key
    40: 'focusNext', // down key
  },

  handleKeydown: Ember.on('keyDown', function(event) {
    const map = this.get('keydownMap');
    const code = event.keyCode;
    const method = map[code];
    if (method) {
      return this[method](event);
    }
  }),
  (...)
});
```

This is pretty simple so far. If a key we care about was pressed, we call the
appropriate method to handle it. Let's see how focusing works:

```js
// addon/components/auto-complete.js
export default Ember.Component.extend({
  (...)
  options: Ember.computed.readOnly('list.options'),

  focusPrevious: function(event) {
    event.preventDefault();
    const focused = this.get('focusedOption');
    let index = this.get('options').indexOf(focused);
    if (this.get('isDropdownOpen')) {
      index = index - 1;
    }
    this.focusOptionAtIndex(index);
  },

  focusNext: function(event) {
    event.preventDefault();
    let index = 0;
    const focused = this.get('focusedOption');
    if (focused) {
      index = this.get('options').indexOf(focused);
      if (this.get('isDropdownOpen')) {
        index = index + 1;
      }
    }
    this.focusOptionAtIndex(index);
  },

  focusOptionAtIndex: function(index) {
    const options = this.get('options');
    if (index === -1) {
      index = options.get('length') - 1;
    } else if (index === options.get('length')) {
      index = 0;
    }
    const option = this.get('options').objectAt(index);
    if (!option) {
      return;
    }
    this.focusOption(option);
  },

  focusOption: function(option) {
    const focused = this.get('focusedOption');
    if (focused) {
      focused.blur();
    }
    this.set('focusedOption', option);
    option.focus();
  },
  (...)
});
```

`focusPrevious` and `focusNext` make sure that the focused index is kept within
the bounds of the avaiable number of options and then focus the previous (or
next) one by calling `option.focus()` directly (line 49).

There is one more key press concerning related to options, the return key. It
should select the currently focused option, if there is one:

```js
// addon/components/auto-complete.js
export default Ember.Component.extend({
  (...)
  options: Ember.computed.readOnly('list.options'),
  selectOption: function(event) {
    event.preventDefault();
    const focused = this.get('focusedOption');
    if (focused) {
      this.send('selectItem', focused.get('item'), focused.get('label'));
    }
    this.set('isDropdownOpen', false);
  },
});
```

This code also leverages the access to the options, indirectly through
`this.get('focusedOption')`. Furthermore, it assumes that each option has an
`item` and `label` properties. Not stellar.

It won't be a piece of cake to get rid of direct coupling in all of these, so
let's get to it.

### Change the focused option without accessing the options

In the first step, we'll change the focused option without directly commanding
the options to focus/unfocus. We'll then tackle selecting the focused option.

We can use simple data binding to have the focused option available. By
maintaining and yielding a `focusedIndex` in the "control center", the
`autocomplete` component, `autocomplete-option` components can bind to it and
know whether they are focused or not.

Here is how code the templates need to change:

{% highlight html %}
{% raw %}
<!-- addon/templates/components/autocomplete.hbs -->
{{yield isDropdownOpen
        inputValue
        focusedIndex
        selectedIndex
        (action "toggleDropdown")
        (action "selectItem")
        (action "inputDidChange")}}
{% endraw %}
{% endhighlight %}

{% highlight html linenos %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
{{#auto-complete
      on-select=(action "selectArtist")
      on-input=(action "filterArtists")
      options=matchingArtists
      displayProperty="name"
      class="autocomplete-container" as |isDropdownOpen inputValue
                                         focusedIndex selectedIndex
                                         toggleDropdown onSelect onInput|}}
  <div class="input-group">
    {{auto-complete-input
        value=inputValue
        on-change=onInput
        type="text"
        class="combobox input-large form-control"
        placeholder="Select an artist"}}
    {{#auto-complete-list
        isVisible=isDropdownOpen
        class="typeahead typeahead-long dropdown-menu" as |list|}}
      {{#each matchingArtists as |artist index|}}
        {{#auto-complete-option
            label=artist.name
            item=artist
            on-click=onSelect
            isFocused=(eq focusedIndex index)
            isSelected=(eq selectedIndex index)}}
          <a href="#">{{artist.name}}</a>
        {{/auto-complete-option}}
      {{else}}
        <li><a href="#">No results.</a></li>
      {{/each}}
    {{/auto-complete-list}}
    (...)
  </div>
{{/auto-complete}}
{% endraw %}
{% endhighlight %}

Note the new `focusedIndex` and `selectedIndex` attributes, yielded by the
top-level component that `isFocused` and `isSelected` in the
`auto-complete-option` are bound to.

The `eq` helper comes from [ember-truth-helpers][2] and will evaluate to true if
its params are equal which is exactly what we want.

The `autocomplete` component needs to change to manage the new indexes instead
of setting its `focusedOption` and calling `option.set` directly:

```js
// addon/components/auto-complete.js
export default Ember.Component.extend({
  (...)
  optionsLength: Ember.computed.readOnly('options.length'),
  focusPrevious: function(event) {
    event.preventDefault();
    const currentIndex = this.get('focusedIndex');
    let newIndex;
    if (Ember.isNone(currentIndex)) {
      newIndex = this.get('optionsLength') - 1;
    } else if (currentIndex === 0) {
      newIndex = this.get('optionsLength') - 1;
    } else {
      newIndex = currentIndex - 1;
    }
    this.set('focusedIndex', newIndex);
    this.set('isDropdownOpen', true);
  },

  focusNext: function(event) {
    event.preventDefault();
    const currentIndex = this.get('focusedIndex');
    const lastIndex = this.get('optionsLength') - 1;
    let newIndex;
    if (Ember.isNone(currentIndex)) {
      newIndex = 0;
    } else if (currentIndex === lastIndex) {
      newIndex = 0;
    } else {
      newIndex = currentIndex + 1;
    }
    this.set('focusedIndex', newIndex);
    this.set('isDropdownOpen', true);
  },

  selectOption: function(event) {
    event.preventDefault();
    const focusedIndex = this.get('focusedIndex');
    if (Ember.isPresent(focusedIndex)) {
      this.set('selectedIndex', focusedIndex);
    }
    this.set('isDropdownOpen', false);
  },
});
```

That is simpler and less intrusive than before. (Setting `isDropdown` to true
has been added as before the option's `focus` method did the opening).

What's missing is for the selected item to be sent to the outer world (in other
words, for the `selectItem` to be triggered). Before, it was done by sending
the `selectItem` action with the focused option's item and label (see line 9 in
the last snippet of the previous section) but we can no longer indulge in
accessing the options directly. Consequently, it was replaced by setting the
`selectedIndex` to the `focusedIndex` (see line 39 above).

The problem now is that `selectItem` needs to be called with the item and the
label (the name of the selected artist to be set as the input's value) and only
the selected `auto-complete-option` component has that knowledge. So we need to
set up a way for the `auto-complete-option` components to know when they become
selected and then call that action. As these components are not the source of
the event that lead to an option being selected by key press, we choose to use
an observer:

```js
// addon/components/auto-complete-option.js
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: 'ember-autocomplete-option',
  classNameBindings: Ember.String.w('isSelected:active isFocused:focused'),

  label: null,
  item: null,
  'on-click': null,
  isFocused: false,
  isSelected: false,

  didClick: Ember.on('click', function() {
    this._selectItem();
  }),

  didBecomeSelected: Ember.observer('isSelected', function() {
    const isSelected = this.get('isSelected');
    if (isSelected) {
      this._selectItem();
    }
  }),

  _selectItem() {
    const item = this.get('item');
    this.get('on-click')(item, this.get('label'));
  }
});
```

Line 21 and 22 is where the option realizes it has become the selected option,
and then calls the corresponding (closure) action on line 28.

We're done, we got rid of all the direct passing of component instances,
registrations and direct property access and method calling. Even though we're
[Demeter compliant][3], there are things that could be improved.

### In the next episode...

One of these things is the observer. [Observers fell out of favor][4] some time
ago, and for a good reason. They can be over eager and lead to scenarios where
it is hard to see what's going on. To prove my point, let me show you a bug I've
just accidentally introduced. I call it the "JPJ is too good to be replaced" bug:

![JPJ is too good to be replaced](/images/posts/complex-component-design-ember/jpj-too-good-bug.gif)

(The code for this series is publicly available on Github [here][5]. I've tagged
where we are now with [ccd-part-two][6].)

So we're not done yet. In the next post of the series, we're going to fix that
bug by replacing the observer and make other worthy improvements. Stay tuned!

[1]: /2015/12/18/complex-components-in-ember-dot-js-part-1-analyzing-user-flows.html
[2]: https://github.com/jmurphyau/ember-truth-helpers
[3]: http://www.ccs.neu.edu/research/demeter/demeter-method/LawOfDemeter/paper-boy/demeter.pdf
[4]: https://www.youtube.com/watch?v=7PUX27RKCq0
[5]: https://github.com/balinterdi/ember-cli-autocomplete
[6]: https://github.com/balinterdi/ember-cli-autocomplete/releases/tag/ccd-part-two
