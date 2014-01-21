---
layout: post
title: "Ruby Rogues - Discourse with Jeff Atwood"
date: 2013-05-30 21:23
comments: true
categories: ruby, thoughts
---
[Ruby Rogues][1] is one of the handful of podcasts I usually listen to. This week featured Jeff Atwood who talked about
Discourse, a phenomenal forum platform. Jeff's thoughts on several things really struck home so I wanted to jot them down.
You might find these thought-provoking, too. The full transcription is available [here](http://rubyrogues.com/106-rr-discourse-with-jeff-atwood/#more-1341)

* Installing a binary app per device is a huge step backward from the web world where you don't have to download and upgrade anything. You just go to the website and it works.
* Betting on Javascript is a very safe bet. The competition has been the fiercest among browser performances, that is Javascript engines on the client. The engines are guaranteed to improve.
* Desktop computers are -in most cases- more performant than the server the application is hosted on. So it makes sense to push computations to the clients, and spread it out among them.
* [Discourse] using postgres is a way to force hosting providers move out of the "server herpes" (PHP + MySQL). As Discourse becomes more popular, this will give more leverage to remove the herpes from servers.
* Why was it [the server side] built in Ruby/Rails? [Robin Ward][2] made a game about forums and Jeff contacted him to build Discourse. Robin had used Ruby and thus this decided the Ruby or Python question.
* Rule of 3. Kind of a philoshopical belief for Jeff. A component (e.g a datepicker) is proven to be reusable if it was successfully used in three different contexts. Having three major partners for Discourse will really be a tipping point. Etc.
* Since Discourse is mainly a rich, client-side app, [Ember][3] plays a much bigger role in its success (or failure) then Ruby. The question is how will Rubyists adapt to Ember, whether they will like it or not.

Discourse is built on Ember, and [Ember uses Discourse as a forum][4]. For one, I welcome our new rich-client overlords.

[1]: http://itunes.apple.com/us/podcast/ruby-rogues/id436260381
[2]: http://eviltrout.com/
[3]: http://emberjs.com
[4]: http://discuss.emberjs.com/

