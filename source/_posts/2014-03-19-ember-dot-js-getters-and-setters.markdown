---
layout: post
title: "Ember.js getters and setters"
date: 2014-03-19 20:53
comments: true
categories: ember.js
---

To make all the magic fairy-dust sprinkling efficient, like auto-updating
templates and computed properties, Ember uses getters and setters instead of
accessing properties directly the javascript (and dare I say, the Angular) way. At
its most simplest form, it is `object.get(property)` and `object.set(property)`.

Howevers, it would not be Ember if we were not provided methods on top of these
primitives to make our hard lives as web developers simpler. In the following
post, I am going to show (some of) these methods through an example, so let's
go.

## Badges, badges, I want more badges

I am certainly in favor of having badges in every application. Discourse is
actively discoursing [their badge system][discourse-badges] so I quickly
sketched out something to get ahead of them.

Let me just paste the code here and then use it to explain what the getter and
setter methods are good for.

You can quickly scroll through the below templates. They are mostly there so
that you get the whole picture. The stuff relevant to this discussion is found
in the javascript code.

{% highlight html %}
{% raw %}
<script type="text/x-handlebars">
  <div class="container">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">Your badges, sir/ma'am.</h3>
      </div>
      <div class="panel-body">
        {{outlet}}
      </div>
    </div>
  </div>
 </script>
{% endraw %}
{% endhighlight %}

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="index">
  <ul class="list-group">
    {{#each badge in arrangedContent}}
      <li {{bind-attr class=":list-group-item badge.unlocked::locked"}}>
        {{badge.name}}
        <span class="badge">{{badge.score}}</span>
      </li>
    {{/each}}
    <li class="list-group-item">
      <em>Total:</em>
      <span class="pull-right">{{totalScore}}</span>
    </li>
  </ul>
  <div id="new-badge" class="row">
    <span class="col-xs-6">
      {{input class="input" type="text" placeholder="Badge name" value=name}}
    </span>
    <span class="col-xs-4">
      {{input class="small-input" type="text" placeholder="Score" value=score action="addBadge"}}
    </span>
    <span class="col-xs-2">
      <button class="btn btn-primary btn-sm pull-right" type="button"
          {{action "addBadge"}}>
          Add
      </button>
    </span>
  </div>
  <div id="unlock-all" class="row">
    <div class="col-xs-12">
      <button class="btn btn-danger btn-md" type="button"
        {{action "unlockAll"}}>
        Unlock all
      </button>
    </div>
  </div>
</script>
{% endraw %}
{% endhighlight %}

First, the badge class is defined and some badges created so that we have something to work with:

```js
App = Ember.Application.create();

App.Badge = Ember.Object.extend({
  name: '',
  score: 0,
  unlocked: false
});

var rook = App.Badge.create({
  name: "R00k",
  score: 1,
  unlocked: true
});

var talkative = App.Badge.create({
  name: "Talkative",
  score: 10
});

var hemingway = App.Badge.create({
  name: "Hemingway",
  score: 1000
});

App.Router.map(function() {
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return [rook, talkative, hemingway];
  }
});
```

### getProperties and setProperties

The first couple of methods come handy when working with a single object but
multiple properties.

``` js
App.IndexController = Ember.ArrayController.extend({
  sortProperties: ['score'],
  sortAscending: true,

  (...)

  actions: {
    addBadge: function() {
      var newBadgeProperties = this.getProperties(['name', 'score']);
      newBadgeProperties.score = parseInt(newBadgeProperties.score, 10);

      var newBadge = App.Badge.create(newBadgeProperties);
      this.get('model').pushObject(newBadge);
      this.setProperties({ name: '', score: '' });
    },

    (...)
  }
});
```

On line 9, we want to create a new object with the values provided in the input
boxes (addBadge is the action that gets triggered when the Add button is
clicked, check the template). `getProperties` will create a javascript object
creating key-value pairs for the passed properties. So the above might e.g yield
`{ name: "Silent Bob", score: "2" }`. That gets directly passed in to create a
new badge object.

On line 14, we use the mutating pair of `getProperties` to reset the input
fields. Pretty straightforward.

### getEach and setEach

Ember has us covered when we are working with an array and want to get (or set)
the same property of each item.

``` js
App.IndexController = Ember.ArrayController.extend({
  sortProperties: ['score'],
  sortAscending: true,

  totalScore: function() {
    var sum = function(s1, s2) { return s1 + s2; };
    return this.get('model').getEach('score').reduce(sum);
  }.property('model.@each.score'),

  actions: {
    (...)

    unlockAll: function() {
      this.get('model').setEach('unlocked', true);
    }
  }
});
```

When the "Unlock all" button launches the `unlockAll` action, it calls `setEach`
on the badges (line 14), making all of them unlocked (you can verify this in the
demo by seeing the color of the badge names turn darker - their css class has
been updated). Another advange of `setEach` is that it guards against calling
`set` on null or undefined values.

You might know the reader counterpart, `getEach` as `mapBy`. It goes through the
array and makes another array by getting the passed property on each item. So in
the above example (line 7), we first collect the score for each badge and then
sum them up by way of reduction. (A shiny example of a non-distributed
map-reduce :) ).

### A macro can make nice code nicer

I [have used a reduce computed macro][sorting-macro] before to set up sorting.
I have gotten the hang of it and realized I could use another couple of them
to make the above code simpler (and more performant):

``` js
App.IndexController = Ember.ArrayController.extend({
  sortProperties: ['score'],
  sortAscending: true,

  scores: Ember.computed.mapBy('model', 'score'),
  totalScore: Ember.computed.sum('scores'),

  (...)
});
```

The problem is that the subject under discussion, `getEach` is gone now, so
pretend you did not see this.

Finally, here is the jsbin, should you decide to play around with it:

<a class="jsbin-embed" href="http://emberjs.jsbin.com/qivah/4/embed?html,js,output">Getter and Setters</a><script src="http://static.jsbin.com/js/embed.js"></script>

I hope some of that sticks and you'll write less "bare" gets and sets.

[discourse-badges]: https://meta.discourse.org/t/initial-discourse-badge-design-spec
[sorting-macro]: http://balinterdi.com/2014/03/05/sorting-arrays-in-ember-dot-js-by-various-criteria.html

