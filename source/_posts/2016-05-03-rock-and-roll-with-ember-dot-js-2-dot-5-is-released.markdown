---
layout: post
title: "Rock and Roll with Ember.js 2.5 is released"
date: 2016-05-03 10:22
comments: true
categories: ember.js
perk: sample-chapter-download
---

I published a new version of [the Rock and Roll Ember.js book][1], and the
related application. It now runs on Ember, Ember Data and Ember CLI ~2.5.0.

More importantly, I made other improvements that serve to improve clarity and
reduce the number of new things the reader has to absorb at each step, which I
think is hugely important for an efficient, non-frustrating learning process.

1. The biggest change (and simplification) is that I no longer sort the songs
   from the get-go. To do so, I needed to use the `SortableMixin` and later, when
   that was gone, an `ArrayProxy`. This resulted in other simplifications, like
   not having to use (and maintain) a jsbin for that code snippet that used the
   "global" Ember application building style and iterated on the magical
   `sortedContent` property.

2. I also improved the flow of the Components chapter, rearranged some sections,
   explained a few things that help comprehension and moved a few things that
   only add to the learning burden.

3. I created an Appendix, called "Encore" to further the rock analogy. I felt
   (and got matching feedback) that on some occasions there were too many
   "sidebar" explanations (called "Backstage" sections in the book), that either
   weren't important enough to warrant holding up the flow of explanation or
   lacked context. I moved these sections into the Encore where interested
   readers can learn about these topics when they see fit.

4. Last, but not least, I went through the book and built the application from
   scratch to see that everything still works. I also applied git tags at the
   end of each chapter so that readers of [the middle-][2] and [high-tier packages][3]
   can skip to each chapter in the code in a very simple way, using `git checkout`.

(There were some other changes, the whole list of which you can see [here.][4])

This is the most significant update since I published the Ember 2 version of the
book last October and I believe following the book (and the building of the app)
became even easier.

If this piqued your interest, you can download a sample chapter below.

[1]: http://rockandrollwithemberjs.com
[2]: http://rockandrollwithemberjs.com/#light-my-fire
[3]: http://rockandrollwithemberjs.com/#stairway-to-heaven
[4]: https://github.com/balinterdi/rarwe-issues/issues?q=is%3Aissue+milestone%3A2.5
