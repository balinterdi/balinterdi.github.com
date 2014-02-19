---
layout: post
title: "Readers' Letters: Making an Ember.js component even better"
date: 2014-02-18 19:52
comments: true
categories:
---

[Last time][making-component-more-reusable] I showed a way to make the
star-rating component more reusable. The solution employed a useful, low-level
method, `Ember.addObserver` and its destructive sibling, `Ember.removeObserver`.

A couple of my readers offered alternative solutions that, I think, make the
code simpler without harming reusability of the component.

This post is going to be sort of a "Readers' Letters", showing these solutions
and explaining how they are better than my original take.

## Ember.defineProperty

[David Chen][david-twitter] chimed in [in the comments][david-chen-comment] suggesting
using Ember.defineProperty instead of setting up and tearing down an observer:

``` js
App.StarRatingComponent = Ember.Component.extend({
  classNames: ['rating-panel'],

  numStars:  Ember.computed.alias('maxRating'),

  defineFullStars: function() {
    Ember.defineProperty(this, 'fullStars', Ember.computed.alias('item.' + this.get('ratingProperty')));
  }.on('init'),
  (...)

});
```

`Ember.defineProperty` makes a `fullStars` property on the component which is an
alias of `item.rating` (or `item.score`). We can concatanate 'item.' with that
property name in the body of `defineFullStars`, something I could not get around
earlier.

Finally, the `on` function, an extension to the Function prototype sets up a
listener and gets called when the component's `init` method is executed.

It is better, because there is a lot less code, it is more comprehensible and
there is no need for a second step, tearing down the observer.

## Passing in the value rating directly

[Ricardo Mendes][ricardo-twitter] takes my approach one step further
and shows that it is unnecessary to pass in the name of the ratingProperty.

Passing in the value of the property directly takes separation of concerns to
the next level. The component does not need to know about the name of the rating
property, all it needs to know is its value:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artists/songs">
  (...)
  {{#each songs}}
    <div class="list-group-item">
      {{title}}
      {{star-rating item=this rating=rating maxRating=5 setAction="setRating"}}
    </div>
  (...)
  {{#each}}
</script>
{% endraw %}
{% endhighlight %}

What changed is that instead of ratingProperty="rating" (which could be
ratingProperty="score"), the value of the rating itself is passed in. Note that
there are no quotes around `rating` which establishes a binding.

The definition of the `fullStars` property now could not be simpler and more
expressive:

```js
App.StarRatingComponent = Ember.Component.extend({
  classNames: ['rating-panel'],

  numStars:  Ember.computed.alias('maxRating'),
  fullStars: Ember.computed.alias('rating'),
  (...)
});
```

Since the component does not know about the rating property, it can't set the
item's rating which is a good thing since it's not its responsiblity. It just
sends an action to its context with the appropriate parameters:

```js
App.StarRatingComponent = Ember.Component.extend({
  (...)
  actions: {
    setRating: function() {
      var newRating = parseInt($(event.target).attr('data-rating'), 10);
      this.sendAction('setAction', {
        item: this.get('item'),
        rating: newRating
      });
    }
  }
});
```

This action is then handled by the controller:

```js
App.ArtistsSongsRoute = Ember.Route.extend({
  (...)
  actions: {
    setRating: function(params) {
      var song = params.item,
          rating = params.rating;

      song.set('rating', rating);
      App.Adapter.ajax('/songs/' + song.get('id'), {
        type: 'PUT',
        context: this,
        data: { rating: rating }
      })
      (...)
    }
  }
});
```

Clear separation of concerns, less and more expressive code.

## Replacing data-rating

A further simplification comes from [Tom de Smet][tom-twitter].

He rightfully pointed out that there is no need to get the rating that was
clicked on via a data attribute. It is already known at template rendering time
and can thus be passed to the action helper.

So this:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="components/star-rating">
  {{#each stars}}
    <span {{bind-attr data-rating=rating}}
      {{bind-attr class=":star-rating :glyphicon full:glyphicon-star:glyphicon-star-empty"}}
      {{action "setRating"}}>
    </span>
  {{/each}}
</script>
{% endraw %}
{% endhighlight %}

becomes this:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="components/star-rating">
  {{#each stars}}
    <span
      {{bind-attr class=":star-rating :glyphicon full:glyphicon-star:glyphicon-star-empty"}}
      {{action "setRating" rating}}>
    </span>
  {{/each}}
</script>
{% endraw %}
{% endhighlight %}

And then `setRating` simply receives the new rating as an argument:

``` js
App.StarRatingComponent = Ember.Component.extend({
  (...)
  actions: {
    setRating: function(newRating) {
      this.sendAction('setAction', {
        item: this.get('item'),
        rating: newRating
      });
    }
  }
});
```

Instead of adding an extra data-binding property, we rely on the `action` helper
and we do not need the additional fetching (and parsing) of the property.

### Give credit where credit is due

This week's post was made possible by [David][david-twitter], [Ricardo][ricardo-twitter] and [Tom][tom-twitter].  Their insights made the star-rating component impeccable for which they deserve a huge "thank
you!" from me.

[david-twitter]: https://twitter.com/darkbaby123
[making-component-more-reusable]: http://balinterdi.com/2014/02/12/making-an-emberjs-component-more-reusable.html
[david-chen-comment]: http://balinterdi.com/2014/02/12/making-an-emberjs-component-more-reusable.html#comment-1246422682
[ricardo-twitter]: https://twitter.com/locks
[tom-twitter]: https://twitter.com/de_smet_tom
