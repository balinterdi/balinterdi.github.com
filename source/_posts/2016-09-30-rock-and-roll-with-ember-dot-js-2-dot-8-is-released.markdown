---
layout: post
title: "Rock and Roll with Ember.js 2.8 is released"
date: 2016-09-30 21:22
comments: true
categories: ember.js
perk: sample-chapter-download
---
Yesterday I published an updated version of the [Rock and Roll with Ember.js book][1].
The app now runs on 2.8 (Ember CLI, Ember and Ember Data) and, as usual, there are a few other changes.

The biggest of these was updating the Deployment chapter.
[PageFront](https://www.pagefronthq.com/) seems defunct so I replaced it with
[Surge](https://surge.sh). Above that I also updated the section on deploying
(to S3) with ember-cli-deploy as things have changed quite a bit.

You can check out the full list of changes [here](https://github.com/balinterdi/rarwe-issues/milestone/16?closed=1)
or the book itself [here.](http://rockandrollwithemberjs.com)

- - -

**PSA**: Ember 2.9 will bring the long-awaited new rendering engine, [Glimmer 2](http://emberjs.com/blog/2016/09/08/ember-2-8-and-2-9-beta-released.html)!

I already went ahead and updated the app to 2.9.beta to give it a whirl.

The results were pretty jaw-dropping:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">My app.js size after upgrading the Rock and Roll <a href="https://twitter.com/hashtag/Ember?src=hash">#Ember</a> app to use Glimmer 2 (so from 2.8.1 to 2.9.0-beta.2) went from 233K to 79K 😮</p>&mdash; Balint Erdi (@baaz) <a href="https://twitter.com/baaz/status/776872893577822208">September 16, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I encourage you to [try switching your app to Glimmer 2](http://emberjs.com/builds/#/beta) and see if you encounter any problems.


[1]: http://rockandrollwithemberjs.com
