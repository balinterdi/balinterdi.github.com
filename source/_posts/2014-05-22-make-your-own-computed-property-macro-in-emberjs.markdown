---
layout: post
title: "Make your own computed property macro in Ember.js"
date: 2014-05-22 21:51
comments: true
categories: ember.js
---

The most common way to define computed properties (CPs) in Ember.js apps is to
call the `property` function extension, passing in the "dependent keys",
the path patterns that should trigger the recomputation of the property's value.

The entry-level, classical example is `fullName`:

```js
App.Person = Ember.Object.extend({
  fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')
});
```

`person.get('fullName')` will change if and only if either firstName or lastName
has changed. Its value gets cached between changes.

This simple, yet extremely powerful, construct is a fundemental piece of what
makes Ember apps a joy to work with and capable of scaling out to build complex
apps.

Let's now define a slightly more difficult computed property:

```js
latestPosts: function() {
  return this.get('sortedPosts').slice(0, 10);
}.property('sortedPosts.[]')
```

Assuming that `this.get('sortedPosts')` contains the sorted posts `latestPosts`
is going to contain the first ten of these.

This is a very common pattern. We only want to show the 10 most recent posts,
the three top scorers on a Hall of Fame board or the 10 latest notifications of
a user. The above CP definition gets the job done. I see two ways it can be improved,
though.

First, it is prone to errors that are hard to debug. If you misspell
`sortedPosts` in the property(...) call, you can spend a considerable amount of
time trying to find out why your property does not update correctly.

Second, if it is used in several places of the application, it is a good idea
to extract the common pattern and reuse it to cut down on development time and
make the code more robust.

### Eliminating the duplication

We need a repeatable way to create such computed properties that also eliminates
the risk of misspelling the property name:

``` js
function sliced(dependentKey, firstIndex, lastIndex) {
  return function() {
    return this.get(dependentKey).slice(firstIndex, lastIndex);
  }.property(dependentKey + ".[]");
}
```

This is exactly what we had before for `latestPosts`. Note the `.[]` in the
property path composition tucked after `dependentKey`. It guarantees that if any
of the elements in the array designated by `dependentKey` changes (elements are
added or removed), the property defined by `sliced` is going to be updated.

Then, whereever the need to slice up a certain array arises, we can use this
method to create it thusly:

```js
App.DaysController = Ember.ArrayController.extend({
  workDays: sliced('model', 0, 5),
  weekend: sliced('model', 5)
})
```

As usual, I put together an example to demonstrate how it works in practice:

<a class="jsbin-embed" href="http://emberjs.jsbin.com/zemow/2/embed?js,output">Sliced property generator</a><script src="http://static.jsbin.com/js/embed.js"></script>

### A couple of useful resources

A handful of computed property macros are [built into Ember][1], while
the [ember-cpm library][2] defines some more, so check these first if you
recurringly find yourself in need of a certain logic in computed properties.

If you still haven't found what you're looking for, this post hopefully sets you
on your way to define your own ones.

[1]: https://github.com/emberjs/ember.js/blob/master/packages/ember-metal/lib/computed.js
[2]: https://github.com/jamesarosen/ember-cpm
