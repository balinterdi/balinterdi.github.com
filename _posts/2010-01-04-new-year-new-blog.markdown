--- 
title: New year, new blog
layout: post
---

I guess it all began with [this blog post][blogging-like-a-hacker]. I saw that there is another way for composing a blog post than typing it into a textarea with a WYSIWYG interface (which is, by the way, never really WYSIWYG). It also seemed a lot cooler, something a "real hacker" would prefer hands down. The decision to switch my blog over to a textarea-free motor has been subconsciously made the time I read that post but the implementation needed a year to be realized. I reckon the final push was to see how easy [the migration of the blog's content][lackac-blog-migration] is.

## The tools

I decided to use [Jekyll][jekyll], a static-site generator since it integrates nicely with Github and has all the features I need. Being a static-site generator I needed a client-side solution to handle comments. I chose [Disqus][disqus] because that's the one I knew and liked but there are [alternatives][intense-debate].

## The process

### Content migration

I needed continuity and thus migrating the old posts and comments. Fortunately Jekyll includes [migration scripts for several blog motors][jekyll-migrations], among them Wordpress, so that was a piece of cake, everything worked out of the box.

For the comments, I used [a modified version of Lackac's script][comment-migration-script], that he so kindly directed my attention to (thank you, Lackac). Clearly it was more work than migrating the posts but nothing to shy away from. (If you plan to switch from Wordpress to Disqus I believe you'll be able to use [the script][comment-migration-script] with a few minor modifications.)

### New design

For my Wordpress blog, I used a design template that looked ok but was in PHP and was a PITA to modify or to add some styling to. Since I am looking to improve my capabilities as a designer I thought designing my own blog would be a suitable task to get my hands dirty with. I am not concealing the fact that I borrowed ideas from [several][brian-casel] [blogs][mojombo] I liked but hey, they say it's not a shame to copy good ideas so what's wrong with that?

### Layout, site feed, etc. with Jekyll

Have I said I love open source? There is a Jekyll wiki that lists [Jekyll sites][jekyll-sites] along with a link to their sources so seeing how to set up my blog with Jekyll was quite straightforward. I guess this was still the most time-consuming part of all but I did not really have to think of anything, the steps are well-defined.

### Buying a Github plan to be able to use a non-github domain

If you'd like to host your blog under a custom domain ([http://codigoergosum.com](http://codigoergosum.com) instead of [http://balinterdi.github.com](http://balinterdi.github.com)) you'll need to buy a Github plan. Starting at 7$/month for the Micro plan it's not an insurmountable obstacle, in fact it costs less than the Wordpress hosting I am moving away from.

## Changing the name

Back in the spring of 2008, returning from the [European Ruby conference][euruko2008] (and having finished [The Pragmatic Programmer][the-prag-prog] on the train) my mind was buzzing with new ideas and I could not wait to set myself on a craftsman's journey. 

I felt I needed a blog immediately. The hard part of course was coming up with a name. Since I felt it was more important to get something going than to idle on finding the perfect one (I guess we can call this agile, can't we? :)), I launched [http://bucionrails.com](http://bucionrails.com). During the almost two years that have passed since that day I have grown somewhat uncomfortable with that name so I decided to change it. I hope you like [the new one][descartes] :).

## The end result

It felt appropriate to start the new year with a new blog and -to my surprise- the switch was a lot easier than I had thought. I hope you, the faithful readers of my blog, welcome the change and ameliorate it with your precious comments.

Now I am blogging like a hacker, too!

[blogging-like-a-hacker]: [http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html]
[lackac-blog-migration]: [http://lackac.hu/2009/11/19/blog-migralas.html]
[jekyll]: http://github.com/mojombo/jekyll
[marley]: http://github.com/karmi/marley
[disqus]: http://disqus.com/
[intense-debate]: http://intensedebate.com/
[jekyll-migrations]: http://wiki.github.com/mojombo/jekyll/blog-migrations
[comment-migration-script]: http://gist.github.com/261852
[brian-casel]: http://www.briancasel.com/
[mojombo]: http://tom.preston-werner.com/
[jekyll-sites]: http://wiki.github.com/mojombo/jekyll/sites
[euruko2008]: http://www.euruko2008.org/
[the-prag-prog]: http://pragprog.com/titles/tpp/the-pragmatic-programmer
[descartes]: http://en.wikipedia.org/wiki/Descartes