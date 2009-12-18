--- 
wordpress_id: 63
title: "RubyGems under the hood: Introduction"
wordpress_url: http://bucionrails.com/?p=63
layout: post
---
I am not sure about you, but one thing I keep bumping into while developing ruby applications is rubygem version conflicts. If you have ever come across "can't activate activesupport (= 2.3.4, runtime) for [], already activated activesupport-2.3.3 for []" type of errors, you might be sympathetic to the cause.

Since <a href="http://rubygems.org/">rubygems</a> was and is being written by some <a href="http://chadfowler.com">excellent</a> <a href="http://richkilmer.blogs.com/">Ruby</a> <a href="http://onestepback.org/">minds</a> I knew the fault probably lies with me and not with the tool. Being a <a href="http://manifesto.softwarecraftsmanship.org/">motivated and proud craftsman</a> I felt like I needed to know my tools and rubygems is probably the number one tool most of us Ruby developers use on a daily basis.

I intend to write a mini-series of Rubygems posts. A post will be added to the series when I explore some murky corner of rubygems inner mechanics. Some of the time this will come from a particular problem I come across while coding while on other occasions I might just look into the source code and try to understand what a particular piece of code does.

Now, I realized that when I read on a blog: "I will go into more detail about X in a forthcoming post", it is the surest sign that you will never read about X again. At least not on that very blog. And I am not saying this in a mean way, I think it is very natural for our plans to change ("evolve" may sound better) even on the short term. So I am aiming low and hoping to give you more than you expected. (Notice I wrote "mini-series" which may just mean a couple of posts.)
<h2>Do not set your expectations high</h2>
I am absolutely not a Rubygems expert so please do not be fooled by the "under the hood" title. This will not be commensurate to <a href="http://weblog.jamisbuck.org/2006/10/2/under-the-hood-rails-routing-dsl">Jamis Buck's series on Rails routing</a>. I do not -yet?- have a deep insight and I am not even a contributor to Rubygems.

The forthcoming :) series is just a humble attempt to gain an understanding of a very important part of the Ruby arsenal. I hope to understand it better by explaining to you how it works and I hope you will understand it better by reading my explanation. And last, but not least, I hope we'll both spend less time debugging those tricky issues.

Having said that, I encourage you to participate in the series. Tell me about a particular problem you had with Rubygems. Correct me if I am wrong. Point me to an article where all this is already explained, and much better. Give feedback so this might evolve to be a discussion rather than an academic lecture. Thank you.
