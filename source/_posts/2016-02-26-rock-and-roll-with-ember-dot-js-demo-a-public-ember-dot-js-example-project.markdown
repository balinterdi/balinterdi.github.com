---
layout: post
title: "Rock and Roll with Ember.js demo - A public Ember.js example project"
date: 2016-02-26 11:04
comments: true
categories: ember.js
perk: sample-chapter-download
---

I have a book called Rock and Roll with Ember.js that has an accompanying
application we develop throughout the book. I also maintain a demo version of
the same app which has been open-source since its inception. However, that demo app
has not received updates for a while now so I decided to do something about
this and spent some time this week on making it a state-of-the-art Ember 2 application.

Here are the main developments I have made:

* **Upgraded it to use the latest Ember, Ember Data and Ember CLI versions, 2.3.0.**
* **Used [ember-cli-mirage][1] to seed the app with data and handle "backend" requests.**
  (Look, ma', no backend!)
  [ember-cli-mirage][1] is fantastic addon that lets you set up route handlers,
  fixtures, factories and many more to manage your seed data and mock your server
  responses, both in development and tests. This was the first time I seriously
  used it and I have grown to like it a ton! The author, [Sam Selikoff][2], helped
  out tremendously and had an amazing turnaround on a few questions/issues.
  I used the latest beta version, 0.2.0-beta.7, which you should definitely
  check out and give feedback to Sam.
* **Made it a modern, idiomatic Ember app.**
  It's not just Ember, but also Javascript that evolves at a neck-breaking space
  (although to a lesser extent). I used the not-at-all elementary
  [ember-watson][3] to modernize the Ember app and applied a few manual tweaks
  for some of the Javascript parts, like using destructuring and `let` and `const`
  instead of `var`.
* **Deployed it to be publicly accessible.**
  Leveraging the most excellent [PageFront][4], the app is now deployed to their
  platform. You can see it in action at [https://rarwe-demo.pagefrontapp.com][5].
  This was not even a task, I only needed to issue two commands, one to install
  the add-on and one to deploy it.

The source lives on Github, at [balinterdi/rarwe-demo][6].

As Mirage can also be used in production (although it's probably not common to
do that), you can check out [the "production" app][5], with the same seed data I
used in development, and play around with it.

As I mentioned in the introduction, the full version of the app is developed
chapter by chapter in [the Rock and Roll with Ember book][7]. You can download a
sample chapter below:


[1]: http://www.ember-cli-mirage.com/
[2]: https://twitter.com/samselikoff
[3]: https://github.com/abuiles/ember-watson
[4]: https://www.pagefronthq.com/
[5]: https://rarwe-demo.pagefrontapp.com/
[6]: https://github.com/balinterdi/rarwe-demo
[7]: http://rockandrollwithemberjs.com
