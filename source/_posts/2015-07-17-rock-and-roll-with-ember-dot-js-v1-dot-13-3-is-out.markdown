---
layout: post
title: "Rock and Roll with Ember.js v1.13.3 is out"
date: 2015-07-17 10:47
comments: true
categories: ember.js
perk: sample-chapter-download
---

It's Friday and if it's (every 2nd-6th) Friday, it's Rock and Roll release day!

Book version 1.13.3 is rolling out as we speak (ok, we don't speak and you
probably read this later, but you get the point) which contains the following
changes:

* **Upgrade to Ember version 1.13.3 (the book is in lockstep, too!)**
* **Update to Ember CLI 1.13.1**
* **Extended the Components chapter with closure actions.**

  [Closure actions][1] are an awesome new way to fire/handle actions introduced
  in 1.13 and so it has to be in the book!
* **Extended the Testing chapter with component integration tests.**

  Integration tests make component tests super simple to set up and so much more
  descriptive than unit tests. Our beloved star-rating component is now tested
  by the shiny new integration tests.
* **Get rid of `needs` in the controller.**

  There was one instance where I used this to get a nice placeholder text. As a
  preparation for Ember 2.0 where `needs` is going the way of the dodo, I
  removed that nasty `needs`.
* **Specify the band-songs relationship as sync.**

  Starting from 2.0, Ember Data relationships are assumed to be asynchronous
  unless otherwise specified. In the Rock & Roll application, we sideload the
  songs with the bands, so adding a `{ async: false }` option to the
  relationship was in order.
* **A few CSS fixes, one of them thanks to [lonekorean][2]**

The whole change list is observable [here][3].

Hoist the sails, Ember 2.0 (and with it, Rock and Roll with Ember 2.0) is on the horizon!

[1]: http://emberjs.com/blog/2015/06/12/ember-1-13-0-released.html#toc_closure-actions
[2]: https://twitter.com/lonekorean
[3]: https://github.com/balinterdi/rarwe-issues/issues?q=milestone%3A1.13.3+is%3Aclosed
