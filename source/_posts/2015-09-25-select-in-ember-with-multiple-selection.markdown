---
layout: post
title: "Select in Ember with multiple selection"
date: 2015-09-25 14:24
comments: true
categories: ember.js
perk: general-signup
---
<iframe
  width="178" height="24" style="border:0px"
  src="https://mixonic.github.io/ember-community-versions/2015/09/25/select-in-ember-with-multiple-selection.html">
</iframe>

A few weeks ago I wrote a blog post about [how to do a select in Ember 2][1],
that seemed to be popular. I also received good comments about advanced versions
of the same problem, namely how the solution would have to change to deal with
the case if the items to select from are objects and how to tackle multiple
selections. I thus decided to do a Part 2, showing a solution for these cases.
Comment are welcome, as always.

### Multiple selection with simple strings as items

Let's tackle the easier problem first, being able to select more than one items,
but the items are simple string values. The values will serve both as the value
and the content of the options.

I added some extra Bootstrap markup and a list to see which items are selected:

{% highlight html %}
{% raw %}
<div class="container">
  <div class="row">
    <div class="col-sm-8">
      <h2>Select some bands</h2>
      <select style="height:100px" class="form-control" multiple onchange={{action "selectBand"}}>
        {{#each bands as |bandChoice|}}
        <option value={{bandChoice}} selected={{include selectedBands bandChoice}}>{{bandChoice}}</option>
        {{/each}}
      </select>
    </div>
    <div class="col-sm-4">
      {{#if selectedCount}}
        <h2>Selected bands ({{selectedCount}})</h2>
      {{else}}
        <h2>Selected bands</h2>
      {{/if}}
      <ul class="list-group">
        {{#each selectedBands as |band|}}
          <li class="list-group-item">{{band}}</li>
        {{else}}
          <li class="list-group-item">No band selected.</li>
        {{/each}}
      </ul>
    </div>
  </div>
</div>
{% endraw %}
{% endhighlight %}

I added the `multiple` attribute to the `select` tag to allow multiple
selections. Not much has changed from the earlier example. When the user
selects an option, whether in a way that clears the earlier selection (simple
click) or adds to it (ctrl/cmd + click), the `onchange` event is fired, and our
`selectBand` handler will handle it. We expect that handler to set
`selectedBands` so that the list of selected bands gets updated correctly. So
let's see the controller:

{% highlight html %}
{% raw %}
export default Ember.Controller.extend({
  bands: ['Pearl Jam', 'Tool', 'Long Distance Calling', 'Led Zeppelin'],

  selectedBands: [],

  selectedCount: Ember.computed.reads('selectedBands.length'),

  actions: {
    selectBand(event) {
      const selectedBands = Ember.$(event.target).val();
      this.set('selectedBands', selectedBands || []);
    }
  }
});
{% endraw %}
{% endhighlight %}

For multiple selections, jQuery, aliased as `Ember.$`, returns an array of the
selected options values as the select's value, so all we have to do is assign
this to the `selectedBands` property. In case nothing is selected, `val()`
returns `null`, so we guard against transferring this to `selectedBands` by
defaulting to an empty array.

There is one more thing you might have noticed, and that is the `include` helper
in the template. We want to mark the option as selected if its value is included
in the selectedBands:

{% highlight html %}
{% raw %}
<select style="height:100px" class="form-control" multiple onchange={{action "selectBand"}}>
  {{#each bands as |bandChoice|}}
  <option value={{bandChoice}} selected={{include selectedBands bandChoice}}>{{bandChoice}}</option>
  {{/each}}
</select>
{% endraw %}
{% endhighlight %}

The `include` helper is not provided by Ember but it is rather easy to write
ourselves:

{% highlight html %}
{% raw %}
import Ember from 'ember';

export function include(params) {
  const [items, value] = params;
  return items.indexOf(value) > -1;
}

export default Ember.Helper.helper(include);
{% endraw %}
{% endhighlight %}

That is all there is to it:

![Multiple selection](/images/posts/select-in-ember-with-multiple-selections/multiple-select-with-ember.gif)

### Multiple selection with objects as items

This is just a tad more difficult, as we cannot directly have objects as options
values. Let's assume that these objects have a property that identifies them
unambiguously (which is a fair assumption to make), usually referred to as `id`:


{% highlight html %}
{% raw %}
import Ember from 'ember';

export default Ember.Controller.extend({
  bands: [
    Ember.Object.create({ id: "1", name: 'Pearl Jam', formedIn: 1990 }),
    Ember.Object.create({ id: "2", name: 'Tool', formedIn: 1991 }),
    Ember.Object.create({ id: "3", name: 'Long Distance Calling', formedIn: 2003 }),
    Ember.Object.create({ id: "4", name: 'Led Zeppelin', formedIn: 1970 })
  ],
  (...)
});
{% endraw %}
{% endhighlight %}

We'll use the `id` as the option value and display the name:

{% highlight html %}
{% raw %}
(...)
<select style="height:100px" class="form-control" multiple onchange={{action "selectBand"}}>
  {{#each bands as |bandChoice|}}
    <option value={{bandChoice.id}} selected={{include selectedBandIds bandChoice.id}}>{{bandChoice.name}}</option>
  {{/each}}
</select>
(...)
{% endraw %}
{% endhighlight %}

On the controller, we collect the id of each selected band, and if we need to
display their names, we simply make the mapping between these two:


{% highlight html %}
{% raw %}
export default Ember.Controller.extend({
  (...)
  selectedBandIds: [],

  selectedBands: Ember.computed('selectedBandIds.[]', function() {
    return this.get('selectedBandIds').map((bandId) => {
      return this.get('bands').findBy('id', bandId);
    });
  }),
  (...)
});
{% endraw %}
{% endhighlight %}

`bands.findBy` is our makeshift store service, which allows us to find an object
in a collection by its id. If we used Ember Data, it would become
`store.findRecord('band', bandId)` or `store.peekRecord('band', bandId)`. The
only other difference from before is that we set `selectedBandIds` instead of
`selectedBands` in the action handler:

{% highlight html %}
{% raw %}
export default Ember.Controller.extend({
  (...)
  actions: {
    selectBand(event) {
      const selectedBandIds = Ember.$(event.target).val();
      this.set('selectedBandIds', selectedBandIds || []);
    }
  }
});
{% endraw %}
{% endhighlight %}

[1]: http://balinterdi.com/2015/08/29/how-to-do-a-select-dropdown-in-ember-20.html
