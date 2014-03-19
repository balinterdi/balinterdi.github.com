---
layout: post
title: "Sorting arrays in Ember.js by various criteria"
date: 2014-03-05 08:02
comments: true
categories: ember.js
---

I concluded [the previous post on route refactoring][better-routes] by saying
that the fact that the `artists.songs` route now has the songs as its model will
pay dividends in the future.

I will show one thing that becomes really easy this way and also one
less-known Ember feature that builds on top of that.

## Showing list items in a certain order

Even with our superb routing, songs for an artist appear in random order,
differently at each load of the application. This is confusing and it is now
easy to remedy.

The controller backing the `artist.songs` template is now an ArrayController so
establishing a sort order is a piece of cake:

``` js
App.ArtistSongsController = Ember.ArrayController.extend({
  (...)
  sortAscending: false,
  sortProperties: ['rating', 'title'],
  (...)
});
```

What I say with these sorting-related definitions is that I want songs to be
shown in descending order of first their ratings and then -should the rating be
the same- by title. That's all there is to it, those tunes are now aptly sorted:

![Ascending ordering](http://f.cl.ly/items/1v3C3Q241g1w3k1X2c04/Screen%20Shot%202014-03-03%20at%2019.39.01.png)

## Sorting by multiple properties, in different directions

There is a slight deficiency in the above sorting API. It cannot sort multiple
properties if the sorting is to be done ascending for some properties and
descending for others. The `sortAscending` flag is "global" for the
whole `sortProperties` array.

Taking the above example, it is a perfectly valid request to have songs first
ordered in descending order of their rating and then in ascending order of their
title. But how can we do that?

## Reduce computed macros

The `Ember.computed.sort` macro in the [`reduce_computed_macros` package][rcm] provides
a clean way to do exactly that:

``` js
App.ArtistSongsController = Ember.ArrayController.extend({
  (...)
  sortProperties: ['rating:desc', 'title:asc'],
  sortedSongs: Ember.computed.sort('model', 'sortProperties'),
  (...)
});
```

The API is so explicit it does not need any explanation. In order for the songs
to appear in the specified order, we now need to iterate through `sortedSongs`
so the `{{#each}}` in the template becomes `{{#each sortedSongs}}`.

Let's take a look at how it has changed the order of the songs:

![Perfect ordering](http://f.cl.ly/items/1D1R183h0h103O0p421O/Screen%20Shot%202014-03-03%20at%2019.58.24.png)

Perfect, I would say that is the ordering that makes most sense.

## Wait, it gets better still

When first playing with `Ember.computed.sort`, my initial try was to set up
`sortedSongs` like that:

``` js
  sortedSongs: Ember.computed.sort('model', ['rating:desc', 'title:asc']),
```

That, however, throws an error. Taking a look at the code and the tests, I
realized that the second argument needs to be a property on the same object the
sorting is defined on. This seems "over-engineered" at first but in fact opens
up further possibilities.

Under the hood, `Ember.computed.sort` sets up an observer not only to the array
being sorted but also to the sort properties. That way, when the sorting
criteria changes, the list is reordered and rerendered automatically. This makes
it possible for the criteria to be easily modified via user action.

To give you an example, I'll make a button set the rating to happen only by title,
in ascending alphabetical order:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artist/songs">
  {{#if canCreateSong}}
    <div class="list-group-item">
      (...)
      <button class="btn btn-link pull-right" {{action "sortBy" "title:asc"}}>Sort by title</button>
    </div>
  {{/if}}
  (...)
</script>
{% endraw %}
{% endhighlight %}

The `sortBy` action handler sets the passed string as the value
for the `sortProperties` which will rearrange the list:

``` js
App.ArtistSongsController = Ember.ArrayController.extend({
  (...)
  sortProperties: ['rating:desc', 'title:asc'],
  sortedSongs: Ember.computed.sort('model', 'sortProperties'),

  actions: {
    sortBy: function(sortProperties) {
      this.set('sortProperties', [sortProperties]);
    },
    (...)
  }
});
```

Indeed when the link is clicked, the songs become ordered by title only:

![Ordering by only title](http://f.cl.ly/items/1H0v0w3C0u0Q2A2j451Z/Screen%20Shot%202014-03-03%20at%2021.12.00.png)

## Declarative sorting

Let me finish by pointing out that this arrangment makes it possible to have
several actions that set (or modify) the ordering criteria, without having to
write a single line of code to implement the sorting itself.

You gotta love this.

[better-routes]: http://balinterdi.com/2014/02/26/a-common-resource-route-pattern-in-ember-dot-js.html
[rcm]: https://github.com/emberjs/ember.js/blob/v1.4.0/packages/ember-runtime/lib/computed/reduce_computed_macros.js
