---
layout: post
title: "Complex Component Design in Ember"
date: 2015-09-03 17:41
comments: true
categories: ember.js
---

The title would probably better be "Somewhat Complex Component Design in Ember"
but it sounds less pompous so decided to drop "Somewhat". I therefore don't
claim that the series of blog posts I intend to start with this intro post will
represent the paramount of Ember's component design. There definitely are and
definitely will be more complex component structures and scenarios.

The component developed in the series is one that autocompletes as the user
starts to write the input and allows selecting from a fixed set of options.
Nothing too out-of-this-world but I chose it because there are still several
best practices when that can be applied to developing this component.

A very important disclaimer is that I got intrigued to component design by Ryan
Florence and his talks and learned most of the basics from him. My choice of
component probably has to do something with Ryan, too. He developed the
ic-autocomplete component from which I took several ideas, sometimes outright
the implementation.

So you probably ask: why reinvent the wheel? Why develop something that is
already done? First of all, I (and science says most of us) learn best by doing.
I wanted to use an example where I already have a sample implementation but also
understand why the original implementation did things as it did and see whether
I can improve on those things. Remember, when Instructure (Ryan) developed their
autocomplete component, there were no block parameters, no closure actions, no
direct attribute bindings
