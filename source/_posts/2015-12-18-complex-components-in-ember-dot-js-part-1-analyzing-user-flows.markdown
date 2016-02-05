---
layout: post
title: "Complex Components in Ember.js - Part 1 - Analyzing user flows"
date: 2015-12-18 10:25
comments: true
categories: ember.js
perk: complex-component-design
---
In this post I continue the [Complex Component Design series][1] I started back in
September. I slightly renamed the series title as the original idea was to
design and develop the component in the parts of the series but since the
component is mostly "done", I prefer to show how it works and how the different
pieces fit together. I think this way of presenting things is still (perhaps
equally) valuable and we'll have a few open issues to work on "together" to
further improve the component.

The component I described in [the intro post][1] serves to select an item from a
list of items, either via a dropdown or by starting to type its name and then
selecting it. Here is a very short demo about how that looks in practice:

![Selecting an artist](/images/posts/complex-component-design-ember/ember-autocomplete-demo.gif)

We'll go through the main UI flows and see how they are implemented via
communication of the different layers of the component.

## Getting familiar with the component

The template we'll use (and which the above demo uses) to understand the
functioning of the component looks like this:

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
<div class="form-group">
  <label>Choose an artist</label>
  {{#auto-complete
        on-select=(action "selectArtist")
        on-input=(action "filterArtists")
        class="autocomplete-container" as |autocomplete isDropdownOpen inputValue
                                           toggleDropdown onSelect onInput|}}
    <div class="input-group">
      {{auto-complete-input
          autocomplete=autocomplete
          value=inputValue
          on-change=onInput
          type="text"
          class="combobox input-large form-control"
          placeholder="Select an artist"}}
      {{#auto-complete-list autocomplete=autocomplete isVisible=isDropdownOpen
              class="typeahead typeahead-long dropdown-menu" as |list|}}
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
        {{else}}
          <li><a href="#">No results.</a></li>
        {{/each}}
      {{/auto-complete-list}}
      {{#auto-complete-dropdown-toggle on-click=toggleDropdown
              class="input-group-addon dropdown-toggle"}}
        <span class="caret"></span>
      {{/auto-complete-dropdown-toggle}}
    </div>
  {{/auto-complete}}
</div>
{% endraw %}
{% endhighlight %}

This might seem somewhat daunting at first but as we grow acquainted with its
details, our intimidation will subside.

The top-level component is `auto-complete`. This is the "command center", the
piece that manages the "global" state of the whole widget, like whether the
dropdown is visible and what the current value of the input field is.

You might, with good reason, wonder why these are not handled by the
sub-component where it'd feel more appropriate: the current value of the input
field by `auto-complete-input` and the opened/closed state of the dropdown by
`auto-complete-dropdown-toggle`.

The answer is that a change in these states can be triggered from multiple
places and that several child components might need to know about them. The
dropdown can be closed by the user clicking on one of the items in the dropdown
(not on the little arrow of the toggle), while the current text in the input can
be modified by inferring the item when the user starts to type (not just by
actually typing out the whole text).

### Data down, actions up - all the way down (and up)

That slight violation of separation of concerns (or is it at all?) fits
perfectly with the most important component communication paradigm: Data down,
actions up.

The input, when its value changes, sends an action up to its parent, notifying
it of the change. The parent can then react to this, and communicate any data
(state) changes via the attribute bindings it has to the input. This is why
`auto-complete` needs to handle, or at least access, state that is used
downstream by its sub-components.

The classical way of passing down data (and establishing a binding) from the
parent to the child is through block parameters of the parent component. The
`auto-complete` component has quite some:

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
{{#auto-complete
      on-select=(action "selectArtist")
      on-input=(action "filterArtists")
      class="autocomplete-container" as |autocomplete isDropdownOpen inputValue
                                         toggleDropdown onSelect onInput|}}
  (...)
{{/auto-complete}}
{% endraw %}
{% endhighlight %}

The block parameters are those found between the pipes, after the `as` keyword.
You have to look into the component's own template to see where they come from:

{% highlight html %}
{% raw %}
<!-- addon/templates/components/auto-complete.hbs -->
{{yield this isDropdownOpen inputValue
        (action "toggleDropdown") (action "selectItem") (action "inputDidChange")}}
{% endraw %}
{% endhighlight %}

Parameters are matched by position, so what is yielded in the first position
becomes the first block parameter. In this case, we yield the component itself
as the first parameter, the aforementioned component states as the 2nd and 3rd
and then (closure) actions that will trigger functions in the `auto-complete`
component when called in one of the child components. These serve as "remote
controls" (a term used by [Miguel Camba][2] in his [awesome presentation at
EmberCamp][3]) for child components to control their parent.

The way of upward communication from child components is calling these actions
when appropriate.

We now have sufficient knowledge to follow the implemention of basic user flows,
so let's get into it.

## Understanding UX flows

### Manual selection from the dropdown

The most basic thing one can do with the widget is to pop open the list of
options.

I discarded the parts that are not relevant to understand this, so we're left
with the following:

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
<div class="form-group">
  <label>Choose an artist</label>
  {{#auto-complete
        on-select=(action "selectArtist")
        on-input=(action "filterArtists")
        class="autocomplete-container" as |autocomplete isDropdownOpen inputValue
                                           toggleDropdown onSelect onInput|}}
    <div class="input-group">
      {{#auto-complete-list autocomplete=autocomplete isVisible=isDropdownOpen
              class="typeahead typeahead-long dropdown-menu" as |list|}}
        (...)
      {{/auto-complete-list}}
      {{#auto-complete-dropdown-toggle on-click=toggleDropdown
              class="input-group-addon dropdown-toggle"}}
        <span class="caret"></span>
      {{/auto-complete-dropdown-toggle}}
    </div>
  {{/auto-complete}}
</div>
{% endraw %}
{% endhighlight %}

The `auto-complete-dropdown-toggle` is the component that can be clicked to open
or close the list of items. At a glance it seems like its `on-click` attribute
is the action that will be triggered when the user clicks it but let's see for
sure:

```js
// addon/components/auto-complete-dropdown-toggle.js
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: 'ember-autocomplete-toggle',
  'data-dropdown': 'dropdown',
  'on-click': null,

  toggleDropdown: Ember.on('click', function() {
    this.get('on-click')();
  })
});
```

Indeed, it just calls the action that was passed into it, which is
the `toggleDropdown` action of the topmost `auto-complete` component:

```js
// addon/components/auto-complete.js
import Ember from 'ember';

export default Ember.Component.extend({
  (...)
  actions: {
    toggleDropdown() {
      this.toggleProperty('isDropdownOpen');
    },
  }
});
```

The `toggleProperty` method flips the value of its parameter, so if it was false
it now becomes true. `isDropdownOpen` is yielded as a block parameter so when it
becomes true, `auto-complete-list` will rerender as one of its attributes,
`isVisible` has changed. That will then open the dropdown:

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
<div class="form-group">
  <label>Choose an artist</label>
  {{#auto-complete
      (...)
      class="autocomplete-container" as |autocomplete isDropdownOpen inputValue
                                           toggleDropdown onSelect onInput|}}
    <div class="input-group">
      {{#auto-complete-list autocomplete=autocomplete isVisible=isDropdownOpen
              class="typeahead typeahead-long dropdown-menu" as |list|}}
        (...)
      {{/auto-complete-list}}
    </div>
  {{/auto-complete}}
</div>
{% endraw %}
{% endhighlight %}

The same process is triggered when the toggle is clicked again, only this time
`isDropdownOpen` goes back to false and thus the dropdown is closed.

### Picking an item

The second feature we'll look at is more like the second half of the first one:
selecting an item by clicking (tapping) on it.

I have again restrained the template to the relevant bits, throwing away the
input and the toggle:

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
<div class="form-group">
  <label>Choose an artist</label>
  {{#auto-complete
        on-select=(action "selectArtist")
        on-input=(action "filterArtists")
        class="autocomplete-container" as |autocomplete isDropdownOpen inputValue
                                           toggleDropdown onSelect onInput|}}
    <div class="input-group">
      (...)
      {{#auto-complete-list autocomplete=autocomplete isVisible=isDropdownOpen
              class="typeahead typeahead-long dropdown-menu" as |list|}}
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
        {{else}}
          <li><a href="#">No results.</a></li>
        {{/each}}
      {{/auto-complete-list}}
      (...)
    </div>
  {{/auto-complete}}
</div>
{% endraw %}
{% endhighlight %}

When one of the items is clicked, the `on-click` attribute (which is the
`onSelect` closure action provided by `auto-complete`) is called in the
`auto-complete-option` component:

```js
// addon/components/auto-complete-option.js
import Ember from 'ember';

export default Ember.Component.extend({
  (...)
  selectOption: Ember.on('click', function() {
    this.get('on-click')(this.get('item'), this.get('label'));
  }),
});
```

So where is `onSelect` defined? It is one of the block parameters yielded by
`auto-complete`, more precisely the `(action "selectItem")` action:

{% highlight html %}
{% raw %}
<!-- addon/templates/components/auto-complete.hbs -->
{{yield this isDropdownOpen inputValue
        (action "toggleDropdown") (action "selectItem") (action "inputDidChange")}}
{% endraw %}
{% endhighlight %}

`selectItem` is quite straightforward:

```js
// addon/components/auto-complete.js
import Ember from 'ember';

export default Ember.Component.extend({
  (...)
  actions: {
    selectItem(item, value) {
      this.get('on-select')(item);
      this.set('isDropdownOpen', false);
      this.set('inputValue', value);
    },
    (...)
  }
});
```

It first calls the `on-select` action that was passed into it from the "outside"
(the controller), which just sets `selectedArtist` to the artist object
encapsulated in the list item. It then sets the `isDropdownOpen` flag to false
(which, by the mechanism seen in the previous point, closes the list) and sets
the text in the input to the item's label (the artist's name).

### Auto-completing an item

As the final example, let's see a more complicated use case. When the user
starts to type, the items that do not match the typed string will not be shown
as options. Also, the first matching item will be auto-completed and selected,
and the dropdown will be closed.

No surprises here, the same design principle will be applied as before. Pass
down an action that should be called from a child, then change some property
in the parent component that trickles down to the child which then rerenders
itself because of the changed attribute.

Let's see the relevants parts of the template:

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
<div class="form-group">
  <label>Choose an artist</label>
  {{#auto-complete
        on-select=(action "selectArtist")
        on-input=(action "filterArtists")
        class="autocomplete-container" as |autocomplete isDropdownOpen inputValue
                                           toggleDropdown onSelect onInput|}}
    <div class="input-group">
      {{auto-complete-input
          autocomplete=autocomplete
          value=inputValue
          on-change=onInput
          type="text"
          class="combobox input-large form-control"
          placeholder="Select an artist"}}
      {{#auto-complete-list autocomplete=autocomplete isVisible=isDropdownOpen
              class="typeahead typeahead-long dropdown-menu" as |list|}}
        {{#each matchingArtists as |artist|}}
          {{#auto-complete-option
              (...)
          {{/auto-complete-option}}
        {{else}}
          <li><a href="#">No results.</a></li>
        {{/each}}
      {{/auto-complete-list}}
      (...)
    </div>
  {{/auto-complete}}
</div>
{% endraw %}
{% endhighlight %}


We'll start by the `auto-complete-input` this time where the `input` event,
triggered by the user's typing, is handled:

```js
// addon/components/auto-complete-input.js
import Ember from 'ember';

export default Ember.TextField.extend({
  (...)
  valueDidChange: Ember.on('input', function() {
    const value = this.$().val();
    this.get('on-change')(value);
  })
});
```

This is almost the exact copy of calling the `on-select` action we saw before
from `auto-complete-option`. Here, the `on-change` function is called that was
passed down from the block param of `auto-complete`.

If we take a look in the template of `auto-complete` we see it creates a
`(action 'inputDidChange')` closure action and yield that, so that should be the
next thing to look at. Here is where most of the stuff happens:

```js
// addon/components/auto-complete.js
import Ember from 'ember';

export default Ember.Component.extend({
  (...)
  actions: {
    inputDidChange(value) {
      this.get('on-input')(value);
      this.set('isDropdownOpen', true);
      const firstOption = this.get('list.firstOption');
      if (firstOption) {
        const autocompletedLabel = firstOption.get('label');
        this.get('on-select')(firstOption.get('item'));
        this.set('inputValue', autocompletedLabel);
        this.get('input.element').setSelectionRange(value.length, autocompletedLabel.length);
      }
    }
  }
});
```

We first call the `on-input` action which filters out the artists that do not
match the typed prefix. The result of that is that `matchingArtists` will only
contain the artists that do match. The dropdown is then opened to display these
items (or an explanatory blurb if none matches). If there is at least one
matching item, the first one is selected (and becomes `selectedArtist`).

As an UX improvement, the "inferred" range from the label in the input is
selected, so that the user can continue typing and thus select another artist if
the first one was not what they meant. (See when I type "J" in the demo).

### Design concepts

I'm not totally happy with the current state of the component because of the
following:

1) The `auto-complete` component reaches inside the `auto-complete-input` one
(set in its `input` property) to call `setSelectionRange` on it (see the last
code snippet).

2) The same component retrieves the options from the list and gets its `item`
to select it. Again, this is quite intrusive and will break if the internals of
`auto-complete-option` change.

3) Still the `auto-complete` component yields an instance of itself as a block
parameter. This enables "downstream consumers" to access any of its properties
and methods, breaking its encapsulation.

In presenting about these concepts at the [Global Ember Meetup][7] and at
[Ember.js Belgium][8], I said that I like to think about components as the
objects of the UI.  Thinking about them as objects helps to deliver the point
that some (most?) object oriented practices should be applied to components,
too. If this assumption is correct, we can leverage OOP design concepts and
guidelines that we've been developing for decades, giving us a headstart on how
to design (and what to watch out for) complex component hierarchies.

For example, I consider the set of block parameters yielded by a component as
its public API. This means that yielding `this` from a component's template is
considered bad practice as it breaks encapsulation. In some cases, it's
relatively easy to find a way around it, in others it's much more difficult.
We'll see if I can pull it off in the above case.

As a closing thought, notice how 95% of the feature's implementation relied on
block parameters and closure actions. They are fantastic tools to work with and
I don't know how anything could be achieved without them before they existed.

## Pointers

Incidentally, [Miguel Camba][2] seems to think about components lately, too. I
already mentioned his fantastic talk at EmberCamp this year called ["Composable
components"][3], but above that he has released [ember-power-select][4], which
serves the same purpose as the `auto-complete` component in my blog post series.

However, it's much more mature and flexible so if you need a select dropdown in
your app, use `ember-power-select`, as my component is for learning and
demonstration purposes only. That said, I published it on Github under
[balinterdi/ember-cli-autocomplete][5] if you want to take a look or follow
along the blog posts while looking at its source code. I put a tag called
`ccd-part-one` on the repo for this blog post.

## In the next episode...

... of the series, I'd like to address (some of) my concerns I mentioned above
and see how to fix them. Stay tuned!

[1]: /2015/09/10/complex-component-design-in-ember-intro.html
[2]: https://twitter.com/miguelcamba
[3]: https://www.youtube.com/watch?v=6N4qsO22fmw
[4]: http://www.ember-power-select.com
[5]: https://github.com/balinterdi/ember-cli-autocomplete
[6]: https://github.com/balinterdi/ember-cli-autocomplete/releases/tag/ccd-part-one
[7]: https://www.bigmarker.com/global-ember-meetup/Inside-Ember-Mirage-and-Complex-Component-Design
[8]: http://www.meetup.com/Ember-js-Belgium/events/226904768/
