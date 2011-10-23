---
layout: post
title: "Event loop primer"
date: 2011-10-19 00:06
comments: true
categories:
---
I recently got into developing a web application with node.js (aka [cancer][1]).
Coming from a synchronous world, it took (and to be honest, still takes)
quite a while to grok how writing asynchronous code differs from my
previous experiences (AJAX calls with jQuery only go that far).

As with many fine technologies or methods (TDD, NoSQL, functional
programming come to mind) it's your whole
thinking that has to change. In this post I want to share an example
from [Trevor Burnham's excellent Coffeescript book][2] that gave me one
of those aha moments.

{% gist 1297011 %}

(If you don't read Coffeescript code, you can go to the [Coffeescript web site][3]
and paste the above example in to get compiled Javascript)

The example above is broken. It gets stuck at the `until countdown is 0`
row. In an event loop system events (callbacks) only get run after the "main line"
of execution (or, in other words, all other code) has completed.
So the until loop blocks out the callback of the setInterval,
countdown never gets decremented and thus an endless loop ensues.

I'm sure that there are many ways to fix this, I came up with the
following (and wonder if there is one closer to the original):

{% gist 1297018 %}

And that's it. I hope this simple example pushes you up on that pesky learning curve.

(The snippet was published by the kind permission of the author.)

[1]: http://teddziuba.com/2011/10/node-js-is-cancer.html
[2]: http://pragprog.com/book/tbcoffee/coffeescript
[3]: http://jashkenas.github.com/coffee-script/

