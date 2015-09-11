---
layout: post
title: "Rock and Roll With Ember.js v1.13.9 Is Out"
date: 2015-09-11 11:42
comments: true
categories: ember.js
perk: sample-chapter-download
---

I have just released another update to the Rock and Roll with Ember.js book,
keeping it in sync with Ember 1.13.9. On top of that (mostly on top of that,
since there weren't as many things to do for the Ember upgrade), I added some
content, removed some other ones, fixed a few wrong paths in code comments,
clarified a few code lines to help people build the app along, and the like. The
usual stuff, quoi.

Here are the bigger chunks:

* Extended the Testing chapter with a (controller) unit test. I removed the
  component's unit test in an earlier update (integration tests are vastly
  superior for components) but now realized unit testing was missing.
* Switched to a dashless helper, `capitalize` instead of `capitalize-words`.
  Ember 1.13.0 and up auto-register helpers with and without dashes, so there is
  no need for the more verbose form.
* Fixed a few places where the `updateRating` action was still in the route.
  When I switched to a closure action, I had to move the action handler to the
  controller but missed a couple of places in the subsequent chapters.
* The epub version had two missing code snippets due to bad formatting (thanks
  to [@morganick](https://github.com/morganick))

There are a few other minor fixes, the whole list can be found in the [Github issues repo](https://github.com/balinterdi/rarwe-issues/issues?q=is%3Aissue+milestone%3A1.13.9+is%3Aclosed)

I want to thank [Andrew Davison](http://andrew.davison-family.com) who did most
of the error reporting for this update. Thank you, Andrew!

Stay tuned for more goodies early next week, or sign up below so that you don't
miss any in the future.
