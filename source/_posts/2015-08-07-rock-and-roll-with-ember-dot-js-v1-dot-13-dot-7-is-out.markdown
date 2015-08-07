---
layout: post
title: "Rock and Roll With Ember.js v1.13.7 Is Out"
date: 2015-08-07 11:38
comments: true
categories: ember.js
perk: sample-chapter-download
---

I am happy to announce another update to the Rock and Roll with Ember.js book,
in line with the latest Ember CLI, 1.13.7. Book customers have already received
the updated version, here is how it got better:

* __Update to Ember CLI 1.13.7__
* __Upgrade to Ember version 1.13.6__
* Explain better the difference between sync and async test helpers and how
  these latter work in Ember
* Make the stubs for creating bands and songs not take an id, to be similar to
  how the actual API works
* Update section about Ember Data being in beta
* Show what the custom `submit` async helper does when it first appears
* Remove unit tests for components as `ember generate component-test` now
  generates integration-style tests
* Extract the `wait` helper used across two examples (for showing loading
  routes/templates)
* Update jsbin in the Templates chapter to use the latest Ember version
* Fix importing the capitalizeHelper in the code snippet in the book
* Last but not least, the pdf version of the book now has page numbers and a
  nice, expandable table of contents so you can jump to any chapter or section
  from anywhere:

  ![Collapsable TOC and page numbers](/images/posts/rarwe-1-13-7/preview-toc.png)

  I know, it seems extremely simple to have them from the start but the way the
  pdf was generated did not allow for this so we had to find another way. I
  again worked with [Almudena Garcia](http://murtra.net/) on these design
  changes and I whole-heartedly recommend her if you have some front-end (HTML &
  CSS) tasks to get done.

There are a couple of other, smaller changes and you can see the whole list in
[the issues repo][1]. Or you can buy the book [here][2].

[1]: https://github.com/balinterdi/rarwe-issues/issues?q=is%3Aissue+milestone%3A1.13.7+is%3Aclosed
[2]: http://rockandrollwithemberjs.com

