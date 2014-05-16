---
layout: post
title: "Convert a view into a component"
date: 2014-02-05 09:44
comments: true
categories: ember.js
---

## Intro to components in Ember

Components landed in [Ember in 1.0.rc6][rc6], in June 2013. They are reusable widgets
that are built on top of HTML and provide a richer functionality. For the sake
of reusability, they are isolated from their surroundings, and -as opposed to
views- do not have access to their context. Everything a component has to know
from the outside world has to be passed in at creation. Anything it wants to
communicate to the outside world needs to be sent via events (or actions, in
Ember parlance).

Usability is meant not just between different parts of the same application but
across Ember applications, too. Once achieved, it would imply that a component
for a specific task needs to be written once and could be used anywhere, just
like jQuery plugins.

That is an ambitious goal which is to expected from an ambitious framework. We
are not quite there, yet, and [the specifics are still under discussion][reusable-components].
Nevertheless, components are a great thing and you should start using them
today, if you have not already.

## "View".replace("Component")

Wherever you would use a component today, you would have used a view before
components were possible. Views still have their role in an Ember app but when
existing html functionality is enhanced to give a richer, or more complex user
interaction and reusability is important, you should reach for components.

In this post, I'm going to show how to swap out an existing view with a
component. The example I'm going to use is the star rating view from the Rock &
Roll application.

## Star rating component

Here is what the star rating view looks like:

```js
App.StarRating = Ember.View.extend({
  classNames: ['rating-panel'],
  templateName: 'star-rating',
  rating: Ember.computed.alias('context.rating'),

  fullStars: Ember.computed.alias('rating'),
  numStars:  Ember.computed.alias('maxRating'),

  stars: function() {
    var ratings = [];
    var fullStars = this.starRange(1, this.get('fullStars'), 'full');
    var emptyStars = this.starRange(this.get('fullStars') + 1, this.get('numStars'), 'empty');
    Array.prototype.push.apply(ratings, fullStars);
    Array.prototype.push.apply(ratings, emptyStars);
    return ratings;
  }.property('fullStars', 'numStars'),

  starRange: function(start, end, type) {
    var starsData = [];
    for (var i = start; i <= end; i++) {
      starsData.push({ rating: i, full: type === 'full' });
    };
    return starsData;
  },
  actions: {
    setRating: function() {
      var newRating = $(event.target).data('rating');
      this.set('rating', newRating);
      App.Adapter.ajax('/songs/' + this.get('context.id'), {
        type: 'PUT',
        context: this,
        data: { rating: newRating }
      }).then(function() {
        console.log("Rating updated");
      }, function() {
        alert('Failed to set new rating');
      });
    }
  }
});
```

The most important thing about components is that they do not have access to
their context so any code that does use it needs to be changed.

Back when I wrote the code, I was, somewhat surprisingly, wise enough to use
properties whose semantics reflect the inner operation of the widget, namely
`fullStars` and `numStars`. Now we can reap the benefits of this foresight,
because the entire `stars` and `starRange` method can remain untouched. It is
only the definition of the `fullStars` property and the `setRating` action that
need to change.

Let's quickly sketch up the interface of the component. It will need the `item`
whose rating it sets/displays, the name of the action it sends to the outer
world when a new rating is set (`setAction`) and the maximum number of stars.

Having established that, the code transforms to the following:

```js
App.StarRatingComponent = Ember.Component.extend({
  classNames: ['rating-panel'],

  fullStars: Ember.computed.alias('item.rating'),

  (...)

  actions: {
    setRating: function() {
      var newRating = parseInt($(event.target).attr('data-rating'), 10);
      this.get('item').set('rating', newRating);
      this.sendAction('setAction', this.get('item'));
    }
  }
});
```

`fullStars` is now the rating property of the item (in our case, a song) that was passed in.

When a star is clicked, the `setRating` action is triggered. Here, again, the
rating is updated on the item that was passed in. After that, it sends the
action that was passed in as `setAction` to the controller it was used from,
passing along the item it received.  That is the aforementioned way of sending
messages outside.

(You might wonder what `sendAction` does. It is a shorthand form of
`sendAction(this.get('foo'), ...)`.)

### Rendering the component

The template will only have minor modifications made to it. Here is what it
looked like in its infancy, back when it was a view:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="star-rating">
  {{#each view.stars}}
    <span {{bind-attr data-rating=rating}}
      {{bind-attr class=":star-rating :glyphicon full:glyphicon-star:glyphicon-star-empty"}}
      {{action "setRating" target=view}}>
    </span>
  {{/each}}
</script>
{% endraw %}
{% endhighlight %}

And here is the shiny, new component form:

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

The `data-template-name` of a component needs to start with `components` and the
name of the component needs to have a dash in its name to prevent name
collisions with html tags.

The other changes relate to the essence of components, namely that they are not
embedded in their context but work in isolation. That is why we both property
lookups (in `#each stars`) and action handlers (`action "setRating"`) both target
the component and thus the target does not need to be defined explicitly.

Even more importantly, an action fired from a component's template will look for
that action in the component but will not bubble to the controller (or route).
That again enhances the component's isolation and thus its reusability and shows
the care that was made when desinging it.

(Unfortunately, if an action by that name is not found on the component, it will
die a silent death which makes debugging more difficult).

### Using the component

Now comes that part I love most. Using our polished component is just like
calling a function in a language where state is not shared. You pass in
everything the component needs to do its bidding and be done with it:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artists/songs">
  (...)
  {{#each songs}}
    <div class="list-group-item">
      {{title}}
      {{star-rating item=this maxRating=5 setAction="setRating"}}
    </div>
  (...)
  {{/each}}
</script>
{% endraw %}
{% endhighlight %}

### Handling the action sent from the component

We saw how the component will send the action passed in as `setAction` and pass
along the item (now: song) with it. We just need to handle it the classic Ember
way, either on the controller or the route:

``` js
App.ArtistsSongsRoute = Ember.Route.extend({
  (...)
  actions: {
    setRating: function(song) {
      App.Adapter.ajax('/songs/' + song.get('id'), {
        type: 'PUT',
        data: { rating: song.get('rating') }
      }).then(function() {
        console.log("Rating updated");
      }, function() {
        alert('Failed to set new rating');
      });
    }
  }
});
```

Observe how the action to update a song's rating to the backend had to be moved
to the route, instead of the view/component where it does not belong. Another
win for components.

Don't get confused by the two different `setRating` actions. The first is the
one defined on the component that gets triggered via the action helper from the
component's **template**, the second one is the action name that needs to be
passed in and has to match the name of the event handler on the route.

### Towards better reusability

I hope you got a taste of why components rock and what steps are taken in their
design towards their reusability. However, it's up to writers of components to
go all the way and make components general enough to fulfill this promise.

That's what I'm going to strive for in a later post.

- - - - -
*This was Part 1 of a mini-series on components. Here are the subsequent posts in the series:*

*Part 2: [Making an Ember.js Component More Reusable](/2014/02/12/making-an-emberjs-component-more-reusable.html)*

*Part 3: [Readers' Letters: Making an Ember.js Component Even Better](/2014/02/18/readers-letters-making-an-ember-dot-js-component-even-better.html)*

[rc6]: http://emberjs.com/blog/2013/06/23/ember-1-0-rc6.html
[reusable-components]: http://discuss.emberjs.com/t/some-ideas-i-had-about-composable-reusable-components/2850
