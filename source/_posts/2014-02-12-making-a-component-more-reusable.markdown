---
layout: post
title: "Making a component more reusable"
date: 2014-02-12 07:54
comments: true
categories: ember.js
---

## Intro

[We saw how to turn the star-rating view into a component][view-to-component] to
make it more reusable, and less reliant on its context. Everything that the
component needs to do its job had to be passed in, and that is enough for it to
be reusable not just across screens in your application but also across
different applications.  Or is it? Let's take a look at the component code
again:

``` js
App.StarRatingComponent = Ember.Component.extend({
  classNames: ['rating-panel'],

  fullStars: Ember.computed.alias('item.rating'),
  numStars:  Ember.computed.alias('maxRating'),
  (...)
  actions: {
    setRating: function() {
      var newRating = parseInt($(event.target).attr('data-rating'), 10);
      this.get('item').set('rating', newRating);
      this.sendAction('setAction', this.get('item'));
    }
  }
```

Is something assumed about the object whose rating our component will display
and set? I'll give you some time to think about it.

## A glove that fits all hands

What we assume is that the `item` that gets passed in has a `rating` property.
If we really want our component to be used in all Ember applications (why not
reach for the *stars*?), then this should not be an assumption that we make.
After all, a player in a hockey team might have a `score` property and not
rating. We could get around that by aliasing `score` to `rating` in our
controller:

``` js
App.PlayerController = Ember.ObjectController.extend({
  rating: Ember.computed.alias('score');
});
```

However, this is inconvenient for the app developer and is only necessary
because the star-rating component is not flexible enough. It's as if I had to
reshape my hand to fit the glove.

So let's make it take the property name as a parameter, too:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artists/songs">
  {{#each songs}}
    <div class="list-group-item">
      {{title}}
      {{star-rating item=this ratingProperty="rating" maxRating=5 setAction="setRating"}}
    </div>
  (...)
  {{/each}}
</script>
{% endraw %}
{% endhighlight %}

That was easy, now comes the harder part, the component code. Previously, the
fullStars property of the component was just an alias for `item.rating`. We
can't do that anymore, since the name of the rating property is only known when
the component is used in a template, and can thus differ in each case.

Did Ember let us down this time? Before, it had kept the fullStars property of
our component in sync with the item's rating. We just sat back and took sips of
our mojito. Now, when the going gets tough, we are on our own.

Well, not really. We are doing some advanced stuff so it's no surprise that we
have to use advanced tools that are not needed in the majority of cases. Ember
has nice lower-level functions to support us.

We have to set up the property synchronization ourselves but it sounds scarier
than it is. We just have to watch when the item's rating (score, points,
etc.) property changes and set the fullStars property to that value:

```js
App.StarRatingComponent = Ember.Component.extend({
  classNames: ['rating-panel'],

  numStars:  Ember.computed.alias('maxRating'),
  fullStars: null,

  didInsertElement: function() {
    var property = this.get('ratingProperty');
    this.set('fullStars', this.get('item').get(property));
    Ember.addObserver(this.get('item'), property, this, this.ratingPropertyDidChange);
  },

  willDestroyElement: function() {
    var property = this.get('ratingProperty');
    Ember.removeObserver(this.get('item'), property, this.ratingPropertyDidChange);
  },

  ratingPropertyDidChange: function(item, ratingProperty) {
    this.set('fullStars', item.get(ratingProperty));
  },
  (...)
}
```

There are several things that might be new to you, dear reader, so let me go
through each of them.

The most important thing is the call to ['Ember.addObserver(object, property,
context, function)'][add-observer]. Whenever `property` of `object` changes, it
calls `function` with `context` as its `this`. (Providing a `context` is
optional).

The observer function (`ratingPropertyDidChange`) gets the object that was
changed as its first parameter and the property name that was changed. In this
case, it does not have to do anything else but set the `fullStars` property of
the component to the new value of the item's rating property.

The observer is set up in the `didInsertElement` function. It is a handy
lifecycle-event for Ember views (and thus components) which gets called after
the view has been inserted into the DOM. This time, we don't need it to be in
the DOM already but it serves as a convenient way to add the observer.

Lastly, since the observer was added manually, it has to be torn down manually,
too, when it is no longer needed. We do this in `willDestroyElement`, another
view lifecycle event which gets called before the element gets removed from the
DOM. Also, the code comments mention the following about `willDestroyElement`:

    If you write a `willDestroyElement()` handler, you can assume that your
    `didInsertElement()` handler was called earlier for the same element.

This makes `didInsertElement` - `willDestroyElement` a perfect pair for manually
setting up and tearing down event handlers (or observers) even if no DOM
manipulation has to be carried out.

I've made a jsbin to show how the star-rating component can now be used with
a `score` property while the component code stays identical:

<a class="jsbin-embed" href="http://emberjs.jsbin.com/sokov/4/embed?html,js,output">Reusable Star Rating component</a><script src="http://static.jsbin.com/js/embed.js"></script>

### Conclusion

We now have a star-rating component that is general enough to be used in all
contexts. Go ahead and use it in your Ember app and let me know if I missed
something.

Actually, there are a couple of featurettes -unrelated to its flexibility, as
far as I see- we can add which I might come back to.

[view-to-component]: http://localhost:4000/2014/02/05/convert-a-view-into-a-component.html
[add-observer]: http://emberjs.com/api/classes/Ember.Observable.html#method_addObserver
