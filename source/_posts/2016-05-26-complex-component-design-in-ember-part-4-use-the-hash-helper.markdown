---
layout: post
title: "Complex Component Design in Ember - Part 4 - Use the hash helper"
date: 2016-05-26 09:21
comments: true
categories: ember.js
perk: complex-component-design
---

*This is the fourth and final part of my Complex Component Design series. Here are the preceding posts:*

* [**Intro**](/2015/09/10/complex-component-design-in-ember-intro.html)
* [**Part 1 - Analyzing User Flows**](/2015/12/18/complex-components-in-ember-dot-js-part-1-analyzing-user-flows.html)
* [**Part 2 - Towards a more reactive component**](/2016/02/04/complex-components-in-ember-dot-js-part-2-towards-a-more-reactive-component.html)
* [**Part 3 - Remove the observer**](/2016/04/08/complex-component-design-in-ember-replace-the-observer.html)
* **Part 4 - Use the hash helper**

You can find the code for this post [on Github.][2]
- - - -


After our last refactoring, the `ember-cli-autocomplete` component no longer
uses observers. However, the list of parameters the outermost, container
component, `auto-complete` returns is now unwieldily long:

{% highlight html %}
{% raw %}
<!-- tests/dummy/templates/index.hbs -->
{{#auto-complete
          on-select=(action "selectArtist")
          on-input=(action "filterArtists")
          options=matchingArtists
          displayProperty="name"
          class="autocomplete-container" as |isDropdownOpen inputValue options
                                             focusedIndex selectedIndex
                                             toggleDropdown onSelect onInput|}}

  (...)
{{/auto-complete}}
{% endraw %}
{% endhighlight %}

Not only does that look clumsy, it also makes refactoring more difficult and one
always constantly have to flip between the component's template (where params
are yielded from) and the template where the component is used to see if the
position of values match. So how can improve this?

## Components as functions

To understand several concepts about components, consider them functions.
Putting aside the fact that they can also emit DOM elements, you call them with
a list of arguments, usually, though not exclusively, a collection of key-value
pairs.  The component then does some internal stuff and returns a value from its
template via the `yield` keyword.

Our current case is another instance when treating them as functions can help us
find the solution. Ask yourself: what would you do if the return value of a
function you wrote grew to a long list of arguments? You would convert the
return value to a key-value collection, such as a hash, wouldn't you?

Well, in Ember's component land, we can do this by using the `hash` helper,
[introduced in Ember 2.3][1]. It takes a list of key-value pairs at invocation
time and outputs an object (a hash) with them:

{% highlight html %}
{% raw %}
{{#with (hash firstName='Mike' lastName='McCready' instrument='guitar') as |musician|}}
  Hello, I'm {{musician.firstName}} {{musician.lastName}} and I play the {{musician.instrument}}.
{{/with}}
{% endraw %}
{% endhighlight %}

We can use the `hash` helper to bring some sanity to the return value of `auto-complete`
parameters. It currently looks like this:

{% highlight html %}
{% raw %}
<!-- addon/templates/components/auto-complete.hbs -->
{{yield isDropdownOpen
        inputValue
        options
        focusedIndex
        selectedIndex
        (action "toggleDropdown")
        (action "selectOption")
        (action "inputDidChange")}}
{% endraw %}
{% endhighlight %}

So we introduce the `hash` helper to get the following:

{% highlight html %}
{% raw %}
<!-- addon/templates/components/auto-complete.hbs -->
{{yield (hash
    isOpen=isDropdownOpen
    inputValue=inputValue
    options=options
    focusedIndex=focusedIndex
    selectedIndex=selectedIndex
    toggleDropdown=(action "toggleDropdown")
    onSelect=(action "selectItem")
    onInput=(action "inputDidChange"))}}
{% endraw %}
{% endhighlight %}

## Modifying call sites

Now that the component's return value has changed, we should not forget to
modify the callers, the downstream components that use that value:

{% highlight html %}
{% raw %}
<!-- tests/dummy/app/templates/index.hbs -->
{{#auto-complete
      on-select=(action "selectArtist")
      on-input=(action "filterArtists")
      items=matchingArtists
      displayProperty="name"
      class="autocomplete-container" as |params|}}
  <div class="input-group">
    {{auto-complete-input
        value=params.inputValue
        on-change=params.onInput
        type="text"
        class="combobox input-large form-control"
        placeholder="Select an artist"}}
    {{#auto-complete-list
        isVisible=params.isOpen
        class="typeahead typeahead-long dropdown-menu"}}
      {{#each params.options as |option|}}
        {{#auto-complete-option
            index=option.index
            on-click=params.onSelect
            isFocused=(eq params.focusedIndex option.index)
            isSelected=(eq params.selectedIndex option.index)}}
          <a href="#">{{option.value}}</a>
        {{/auto-complete-option}}
      {{else}}
        <li><a href="#">No results.</a></li>
      {{/each}}
    {{/auto-complete-list}}
    {{#auto-complete-dropdown-toggle on-click=params.toggleDropdown class="input-group-addon dropdown-toggle"}}
      <span class="caret"></span>
    {{/auto-complete-dropdown-toggle}}
  </div>
{{/auto-complete}}
{% endraw %}
{% endhighlight %}

Instead of the long list of parameters, `auto-complete` now yields a single hash
parameter (called `params` above), whose keys are used in the child components
(`params.isOpen`, `params.options`, etc.)

## Polyfill it

Since we want our component to be usable not only in Ember >=2.3 applications,
where the `hash` helper is built in, we should add the
`ember-hash-helper-polyfill`, which makes the `hash` helper available in earlier
Ember versions, as a dependency of the addon:

```js
// package.json
{
  "name": "ember-cli-autocomplete",
  "version": "0.0.0",
  "dependencies": {
    (...)
    "ember-hash-helper-polyfill": "0.1.0"
  },
}
```

## Wrapping up

That wraps up my Complex Component Design in Ember.js series. Our component
improved by each post and I think we now have a pretty flexible and thus
reusable component. The main purpose of the series, however, is education, so I
hope that I was able to transfer some of the knowledge I've acquired by building
components.

If you would like to read the whole series as a pdf, just give my your email
address below and I'm sending it to you.

[1]: http://emberjs.com/blog/2016/01/15/ember-2-3-released.html
[2]: https://github.com/balinterdi/ember-cli-autocomplete/releases/tag/ccd-part-four
