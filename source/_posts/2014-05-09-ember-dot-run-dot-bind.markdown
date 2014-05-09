---
layout: post
title: "Ember.run.bind"
date: 2014-05-09 23:25
comments: true
categories: ember.js
---

Ember has several great features that are not widely known, like [its Dependency Injection system][1] I wrote about last week.

It has also really handy API methods in hiding. One usually stumbles on them
while looking for something in the superbly commented source code.

I hereby introduce such a handy method and hope to make that into a recurring
thing. Who knows? Eventually this might also grow into a series.

If it does, I would have to find a catchy name for it. "Ember Chispas" came to
mind and rings nice but unfortunately [Jeffrey Biles][2] already has a monopoly on it via his
"Ember Sparks" series. (*Chispa* is Spanish for spark.) We'll have to talk, Jeffrey :)

Anyway, let's see the first thingie.

## ... and in the runloop bind them

The run loop in Ember deserves its own blog post series, and I am probably not
the one who will write it. ([The official guide on the subject][4] is a good place
to start, [Alex Matchneer's "Everything You Never Wanted to Know About the Ember Run Loop"][3] is more elaborate).

For the sake of this chispa, it suffices to state that any async callback from a 3rd
party javascript library needs to be wrapped into an Ember.run.

Blatantly stealing [the example from the source code][5], here is how this is done:

```javascript
var that = this;
jQuery(window).on('resize', function(){
  Ember.run(function(){
    that.handleResize();
  });
});
```

See that beautiful `var that=this;`? It can be got ridden of via `Ember.run.bind`:

```javascript
jQuery(window).on('resize', Ember.run.bind(this, this.handleResize));
```

Less code to write and all the mustaches are gone (not that there is anything
wrong with &#123;&#123;mustaches&#125;&#125;, of course).

[1]: http://balinterdi.com/2014/05/01/dependency-injection-in-ember-dot-js.html
[2]: https://www.youtube.com/user/edisonstew
[3]: http://alexmatchneer.com/blog/2013/01/12/everything-you-never-wanted-to-know-about-the-ember-run-loop/
[4]: http://emberjs.com/guides/understanding-ember/run-loop/
[5]: https://github.com/emberjs/ember.js/blob/24dcb0c566284a7aa926e701d33f40717264b9b1/packages_es6/ember-metal/lib/run_loop.js#L153
