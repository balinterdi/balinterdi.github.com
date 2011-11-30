---
layout: post
title: "An Annotated Assortment on Mockist Testing"
date: 2011-11-30 21:30
comments: true
categories:
---

Most of us read blog posts every day. We read them, take an idea out of
them and then, most of the time, forget about them. Some of them are stashed
away in the back of our minds, ready to jump out if we face a related
problem.

A precious few of them, however, we keep thinking back to without a specific
reason.

I've bitten by the "mockist" testing bug when I read [this one][crazy-heretical] a while ago. It expresses a contrarian opinion
about how to test Rails applications which struck me as odd at the time.
That's probably the reason I read it several times.

A few weeks ago I watched Gregory Moeck's [Why You Don't Get Mock Objects][why-you-dont] and I was stung by the same bug only more deeply,
this time.

Using that video as a starting point I then roamed Gregory's blog for
more and felt like I was beginning to grasp it. Now, obviously, I'm at the
beginning of this journey and still have a lot of teeth-cutting to do.
Nevertheless, I want to share with you the gems I've found so far.

Gregory's blog has a very good primer on the difference between stubs
and mocks: ["Stubbing is Not Enough"][stubbing-not-enough]. I'd even go
as far as to claim that it explains its subject better than Martin
Fowler's classic ["Stubs Are Not Mocks"][stubs-not-mocks], although that
latter goes into more detail and is a definite must-read, too.

James Golick has another great piece that drives home the point better
than his first post I mentioned: ["On Mocks and Mockist Testing"][mocks-mockist-testing].

Along comes Avdi Grimm with his strict sounding ["Demeter: It’s not just a good idea. It’s the law."][demeter]
, with a very interesting discussion in the comments. The same gentleman
wrote ["Making a Mockery of TDD"][making-a-mockery] in which he
touches on the concept of using mocks as a design tool.

Nick Kallen's ["Why I love everything you hate about Java"][everything-you-hate] is clearly provocative
and definitely worth to contemplate on. It is also the only one of the bunch that
does not use Ruby (but Scala) for the code examples.

Finally it seems like the fountainhead in the matter is the ["Growing Object-Oriented Software, Guided by Tests"](growing)
book by Steve Freeman and Nat Pryce. I've only gotten until putting it
on my reading list so please chime in if you did read it.

Please, also pipe in if there are any materials in the subject you'd
recommend. It would also be cool to see open source projects that extensively use mocks for testing, the only
one I found so far is [friendly](https://github.com/jamesgolick/friendly).

[crazy-heretical]: http://jamesgolick.com/2010/3/14/crazy-heretical-and-awesome-the-way-i-write-rails-apps.html
[why-you-dont]: http://confreaks.net/videos/659-rubyconf2011-why-you-don-t-get-mock-objects
[stubbing-not-enough]: http://gmoeck.github.com/2011/10/26/stubbing-is-not-enough
[stubs-not-mocks]: http://martinfowler.com/articles/mocksArentStubs.html
[mocks-mockist-testing]: http://jamesgolick.com/2010/3/10/on-mocks-and-mockist-testing.html
[demeter]: http://avdi.org/devblog/2011/07/05/demeter-its-not-just-a-good-idea-its-the-law/
[making-a-mockery]: http://avdi.org/devblog/2011/09/06/making-a-mockery-of-tdd/
[everything-you-hate]: http://magicscalingsprinkles.wordpress.com/2010/02/08/why-i-love-everything-you-hate-about-java/
[growing]: http://www.bookdepository.co.uk/Growing-Object-Oriented-Software-Guided-by-Tests-Steve-Freeman/9780321503626
