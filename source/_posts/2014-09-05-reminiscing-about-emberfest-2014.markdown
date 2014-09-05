---
layout: post
title: "Reminiscing about EmberFest 2014"
date: 2014-09-05 09:55
comments: true
categories: ember.js
---

[EmberFest 2014][emberfest] ended a week ago and I already feel nostalgic. It
was a great event with great people and you could feel the excitement about
Ember in the air and in all conversations. It was almost single-handedly
organized by [Joachim Haagen-Skeie][joachimhs] for which he deserves huge kudos.

It was really great to associate real people with twitter avatars and have
fascinating conversations about various topics that included the Ember
Inspector, the difficulties in building a build tool and even Firefox OS.

### The functional paradigm making a headway into Emberland

One thing that struck me about Ember initially is that it seems to rely heavily
on (shared) state. Some (most?) of that is inevitable given Ember being a
performant framework that runs in the browser and is written in Javascript.
None of these facilitates ditching (or minimizing) state and go with a
functional, stateless approach.

On the other hand, I really came to cherish the [simplicity][simplicity] of the
functional paradigm and have been gravitating towards languages that allow this
(Clojure was, and still is, [my favorite][one-paradigm]). So I added a mental
note about my two favorite things being at such a great distance from each other
and moved on.

One theme of the conference and the hallway talks, however, is how Ember
embraces the functional, immutable approach where it makes sense to. It might
have something to do with my confirmation bias, but let me cite the examples
nevertheless. [Paul Chavard][tchak13] had a talk on his using immutable data
structures in Ember. [Jo Liss][joliss] revealed how Broccoli uses a
"rebuild-from-scratch" approach instead of trying to find out which assets to
rebuild at each modification. Finally, Alex Matchneer, aka. machty, prolific
Ember and router.js contributor had [a presentation on React vs.  Ember][react-vs-ember]
at EmberNYC which you should go read. His [last slide][last-slide] has a bullet-point
that states: "Don't be surprised if Ember adopts DOM-diffing".

It would be an understatement if I said I'm happy to see the functional world
coming to Ember.

### Promises

I had a talk at the conference called "Don't call me back - How Ember uses
promises and how you can, too". As it usually happens, in doing research for the
talk, I learned a lot not just about promises but about other topics, too. This
time, it was the (in)famous run loop I stumbled across on several
occasions so I am really happy I know a lot more about that beast now. You can
find the slides of my presentation below.

<script async class="speakerdeck-embed" data-slide="10"
data-id="47ee01e011b60132c86e02e2e0c65448" data-ratio="1.33333333333333"
src="//speakerdeck.com/assets/embed.js"></script>

I might even do another talk "How Ember uses the run loop and how you should
probably not", or something to this effect.

### EmberFest 2015

The greatest thing about EmberFest was its vibe. I saw the tweets coming
in from EmberConf this March and [the post-conf blog posts][ember-and-rails]
about the awesome community and how one could feel the excitement that we are
building apps with a tool that is new and hot now but is probably going to be
the framework of choice for many in a few years. It is definitely a fascinating
world to live in.

I'll certainly be there at EmberFest 2015, so hopefully see you there!

[emberfest]: https://emberfest.eu
[joachimhs]: https://haagen-software.no
[simplicity]: http://www.infoq.com/presentations/Simple-Made-Easy
[one-paradigm]: http://balinterdi.com/2013/06/19/the-appeal-of-one-paradigm-languages.html
[tchak13]: https://twitter.com/tchak13
[joliss]: http://www.solitr.com/blog/
[react-vs-ember]: https://docs.google.com/presentation/d/1afMLTCpRxhJpurQ97VBHCZkLbR1TEsRnd3yyxuSQ5YY/edit#slide=id.p
[last-slide]: https://docs.google.com/presentation/d/1afMLTCpRxhJpurQ97VBHCZkLbR1TEsRnd3yyxuSQ5YY/edit#slide=id.g380053cce_1786
[ember-and-rails]: http://reefpoints.dockyard.com/2014/03/17/emberconf-picks-ups-where-the-rails-community-left-off.html
