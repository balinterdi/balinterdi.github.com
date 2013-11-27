---
layout: post
title: "Profile your Ember app with ember-renderspeed"
date: 2013-11-27 18:56
comments: true
categories:
---
If your application has lots of things going on or you render a large list, you
might see your once snappy app lose some of that swiftness. Naturally, you want
to speed your application up and the first thing to do in these cases is to know
where the bottlenecks are.

One solution to this is to integrate [ember-renderspeed][1], a very simple library
released by the Discourse team. It shows the rendering time of your templates
and views on your development console, in a nicely nested form. Don't get
frightened by the verb "integrate". It is as easy as [downloading the js file][2] and
adding a script tag to it.

Once you did that, open your Javascript console in your browser, reload the page
and observe the profile of your application. It is enabled by default on the
Ember discussion forum, so you can take a look there. You will see something
like the following:

![ember-renderspeed screenshot](/images/ember-renderspeed-screenshot.png)

Under the hood, ember-renderspeed uses [Ember's instrumentation facilities][3], so
should ember-renderspeed not work for your problem, you can always roll your own
or use a third-party service, like [Caliper][4].

That said, ember-renderspeed is a very quick and easy way to profile your app
and can be the first tool you reach for when the need arises.

[1]: https://github.com/eviltrout/ember-renderspeed
[2]: https://raw.github.com/eviltrout/ember-renderspeed/master/ember-renderspeed.js
[3]: http://emberjs.com/api/classes/Ember.Instrumentation.html
[4]: http://caliper.io/
