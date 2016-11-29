---
layout: post
title: "Complex Component Design in Ember.js - Intro"
date: 2015-09-10 11:07
comments: true
categories: ember.js
perk: complex-component-design
---

*This is the intro of the Complex Component Design series. Here are the posts in the series:*

* **Intro**
* [**Part 1 - Analyzing User Flows**](/2015/12/18/complex-components-in-ember-dot-js-part-1-analyzing-user-flows.html)
* [**Part 2 - Towards a more reactive component**](2016/02/04/complex-components-in-ember-dot-js-part-2-towards-a-more-reactive-component.html)
* [**Part 3 - Remove the observer**](/2016/04/08/complex-component-design-in-ember-replace-the-observer.html)
* [**Part 4 - Use the hash helper**](/2016/05/26/complex-component-design-in-ember-part-4-use-the-hash-helper.html)

- - - -

The title would probably better be "Somewhat Complex Component Design in Ember.js"
but any title including 'Somewhat' rules out pompousness. I therefore don't
claim that the series of blog posts I intend to start here will represent the
pinnacle of component design in Ember. There definitely are and definitely will
be more complex component structures and scenarios.

The component developed in the series is one that autocompletes as the user
starts to write the input and allows selecting from a fixed set of options.
Nothing extraordinary but complex enough so that the design/interaction
principles can be applied and explained while developing the component.

Important disclaimer: I am not an expert on component design (which, it seems
to me, is quite a complex topic). I got intrigued by it thanks to [Ryan Florence][1]
and his talks and learned most of the basics from him. My choice of component
probably also has to do something with Ryan. He developed the ic-autocomplete
component from which I took several ideas, sometimes simply copying the
implementation.

### Rationale

So you probably ask: why reinvent the wheel? Why develop something that is
already done and not something new?

First of all, I (and science says most of us) learn best by doing. I wanted to
use an example where I already have a sample implementation but also understand
why the original implementation did things as it did and see whether I can make
the component simpler or more robust. I wanted to face the problems, to feel
the pain of doing things a certain way, and find solutions for typical,
recurring problems.

It's also important to remember that when Ryan developed their autocomplete
component, there were no block parameters, no closure actions and no direct
attribute bindings. One still had to resort to observers in several cases.
Two-way bindings were still in, and the de-facto way of communication between
pieces of a component structure.

Ember has come a long way since then and its components converged toward those
of React in its reactive, "rerender everything" approach. Potentially some of
the ideas explained in the series can be applied to React and other libraries,
too, and thus might prove useful to more people.

### So many words, so little code

To have something (almost) tangible in this first intro post, too, let me show
you how one would interact with the finished(?) component. If you have read my
[earlier][2] [posts][3] or [my book][4], it will come as no surprise that I use it here to
select a great musician from a defined set of them:

![Selecting an
artist](/images/posts/complex-component-design-ember/ember-autocomplete-demo.gif)

This short intro and the demo have hopefully whetted your appetite and you'll
join me for the next part of the series:

[1]: https://twitter.com/ryanflorence
[2]: /2014/06/26/ember-gotcha-controllers-are-singletons.html
[3]: /2014/03/05/sorting-arrays-in-ember-dot-js-by-various-criteria.html
[4]: http://rockandrollwithemberjs.com
