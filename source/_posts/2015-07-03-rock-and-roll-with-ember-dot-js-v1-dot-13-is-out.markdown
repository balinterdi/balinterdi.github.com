---
layout: post
title: "Rock and Roll with Ember.js v1.13 is out"
date: 2015-07-03 15:25
comments: true
categories: ember.js
perk: sample-chapter-download
---

Today marks the sixth release of my book, [Rock and Roll with Ember.js][1], and
brings it in sync with Ember 1.13. The book follows along the development from
scratch of an Ember application, and chapter by chapter and explains concepts in
the process.

As I have promised, the book is kept up-to-date with the latest stable Ember
version. That implies both using idiomatic Ember and not using deprecated
syntaxes or APIs.

Now that the versioning of Ember Data is in lockstep with that of Ember, I
considered it important to update to the latest Ember Data, too, and will
strive to do so in future releases, too.

Here are the major things I updated for the 1.13 release:

* Use `this.route` instead of `this.resource` in the router map as the latter is now deprecated.
* Use `Ember.computed` and `Ember.on` instead of the Function prototype
  extensions, `property` and `on` as extending the Function prototype is
  consired a poor practice.
* Update the "Getting ready for Ember 2.0" chapter as most things are clear now
  for the 2.0 release. As I give particular examples for each deprecation, this
  chapter can also serve as an update guide for 1.x Ember applications.
* Use the new Ember Data find methods, namely `store.findAll` and
  `store.findRecord`. Before, both fetching a collection and a single record
  used `store.find`.

As usual, there are also smaller improvements and fixes and you can find the
whole list in the errata/issues repository for the book, assigned to [the release milestone.][2]

[1]: http://rockandrollwithemberjs.com
[2]: https://github.com/balinterdi/rarwe-issues/issues?q=milestone%3A1.13+is%3Aclosed
[3]: http://rockandrollwithemberjs.com/#signup
