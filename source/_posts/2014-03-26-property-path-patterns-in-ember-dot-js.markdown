---
layout: post
title: "Property path patterns in Ember.js"
date: 2014-03-26 00:00
comments: true
categories: ember.js
---

Property paths are the heart and soul of Ember.js apps. You use them in
templates and you define dependencies for computed properties and observers
through property paths.

In this post, I concentrate on this latter and show you various ways of
setting up these dependencies through a practical example. There is a [pretty good section in the guides][1]
about one path pattern. Here, I intend to cover more (all?) of them.

## Badges are back

I am going to build on the badges "micro-app" that I had started to develop in
[my previous post about getters in setters][2].

There are two minimal model classes, User and Badge:

```js
App.User  = Ember.Object.extend({
  name: ''
});

App.Badge = Ember.Object.extend({
  name: '',
  score: 0,
  unlocked: false
});
```

We also create a couple of instances to have some data to show and work with:

```js
var cory = App.User.create({ name: "Cory Filibuster" });

var rook = App.Badge.create({
  name: "R00k",
  score: 1,
  unlocked: true
});

var taciturn = App.Badge.create({
  name: "Taciturn",
  score: 10
});

var talkative = App.Badge.create({
  name: "Talkative",
  score: 100
});

var hemingway = App.Badge.create({
  name: "Hemingway",
  score: 1000
});
```

Our application looks like this initally:

![Initital state](/images/posts/ember-property-paths/screenshot-2.png)

## Simple property chain

The simplest, non-aggregate property path is just a series of names,
connected by dots. This designates a property that you can arrive at by
walking the path, segment by segment, where each of them gets you to another
object until you finally reach the property.

(If a path is very long, you should probably think about the dependencies
between your objects and the structure of your code.)

You see that the profile panel has the user's first name as its header. The
property that gets displayed there can be defined by such a path:

```js
App.IndexController = Ember.ArrayController.extend({
  (...)
  firstName: function() {
    return this.get('user.name').split(/\s+/)[0];
  }.property('user.name'),
});
```

This sets up a computed property (CP) that will be recomputed whenever
`user.name` changes. The arguments to the `property` call are called the dependent
keys of the CP and you can pass as many as you would like (although, thanks to
the various property path patterns, you will rarely need a lot).

Now, whenever the name property of the `user` property on the controller
changes, `firstName` is recomputed and this change gets propagated to all the
instances where `firstName` is used (e.g in the header of the panel).

Above that, the `user.name` key also triggers a change if the `user` object
itself changes. To see that, we turn to the thing you should only ever use for
demo purposes, the `__container__` object:

```js
var maggie = App.User.create({ name: "Maggie Raindance" });
App.__container__.lookup('controller:index').set('user', maggie);
```

You can see the name change in the header right away:

![User name changes](/images/posts/ember-property-paths/screenshot-1.png)

## Aggregate property paths

On other occasions, a CP should depend on an array of items. Whenever something
gets added to or removed from the array, the property needs to be updated.

One example of that is the number of badges in the profile panel:

```js
App.IndexController = Ember.ArrayController.extend({
  (...)
  badgeCount: function() {
    return this.get('model').length;
  }.property('model.[]'),
});
```

The model here is the array of badges so when we add another one through the New
badge panel, `badgeCount` gets its new value:

![Badge count gets updated](/images/posts/ember-property-paths/screenshot-3.png)

What I said about the `user.name` path triggering an update when the user
changes also holds true here. If the array of badges was swapped out for another
array, it would trigger the recalculation of `badgeCount`.

## Aggregate property path with a specified property

There are cases where the value of the CP becomes stale also when the items in
the dependent array stay the same, but a certain property of one of them
changes. Ember has a way to express this very succintly.

The example is the "Total score" in the profile panel:

```js
App.IndexController = Ember.ArrayController.extend({
  (...)
  totalScore: function() {
    var sum = function(s1, s2) { return s1 + s2; };
    return this.get('model').getEach('score').reduce(sum);
  }.property('model.@each.score'),
});
```

This is the most inclusive of the patterns we have seen so far. It prompts an
update if the model changes, if any item is added or removed and also if the score of
any item changes. If we type this at the console:

```js
App.__container__.lookup('controller:index').set('model.lastObject.score', 200);
```

, then the total score changes accordingly, even though no item was inserted or
deleted:

![Total score](/images/posts/ember-property-paths/screenshot-4.png)

## Brace yourself

To present the next pattern, let's assume that not all badge scores need to be
tallied to get the total but only the unlocked ones (which makes total sense).
So the dependent keys for `totalScore` needs to account for that. That's pretty
easy:

```js
App.IndexController = Ember.ArrayController.extend({
  (...)
  totalScore: function() {
    var sum = function(s1, s2) { return s1 + s2; };
    return this.get('model').filterBy('unlocked').getEach('score').reduce(sum);
  }.property('model.@each.score', 'model.@each.unlocked'),
});
```

When the second badge is unlocked, the score jumps from 1 to 11 (and the number
of badges from 1 to 2), so the dependent keys work fine:

```js
App.__container__.lookup('controller:index').get('model').objectAt(1).set('unlocked', true);
```

![Unlocked property change triggers update](/images/posts/ember-property-paths/screenshot-3.png)

Starting with Ember 1.4.0, though, there is a more concise way to define the
same, called "property brace expansion". It works very similar to argument
expansion in the shell:

```js
App.IndexController = Ember.ArrayController.extend({
  (...)
  totalScore: function() {
    var sum = function(s1, s2) { return s1 + s2; };
    return this.get('model').filterBy('unlocked').getEach('score').reduce(sum);
  }.property('model.@each.{score,unlocked}'),
});
```

This establishes that totalScore should be recomputed if *either* the `score`
*or* `unlocked` properties of any item in the model array changes.

An important restriction of property brace expansion is that the expansion part
can only be placed at the end of the path, so e.g `property('{foo,bar}.baz')`
will not have the desired effect.

## Computed property macros are the bee's knees

Computed property macros have several advantages. They are very expressive, very
performant and perhaps most importantly more robust than typing out the property
path patterns by hand where a typo can cause a considerable amount of
head-scratching.

They are also a joy to work with and compose. In fact, all the CP definitions
above can be re-defined by using only macros:

```js
App.IndexController = Ember.ArrayController.extend({
  (...)
  badgeCount: Ember.computed.alias('unlockedBadges.length'),
  unlockedBadges: Ember.computed.filterBy('model', 'unlocked'),
  unlockedScores: Ember.computed.mapBy('unlockedBadges', 'score'),
  totalScore: Ember.computed.sum('unlockedScores'),
});
```

They have one big disadvantage, though. It is very hard to use them in a blog
post to explain property path patterns.

(The code presented here can be found as [a gist on Github][4])

ps. Yes, [that Maggie Raindance.][5])

[1]: http://emberjs.com/guides/object-model/computed-properties-and-aggregate-data/
[2]: http://balinterdi.com/2014/03/19/ember-dot-js-getters-and-setters.html
[3]: https://github.com/emberjs/ember.js/blob/master/CHANGELOG.md#ember-140-february-13-2014
[4]: https://gist.github.com/balinterdi/9772966
[5]: https://www.youtube.com/watch?v=RtBbinpK5XI
