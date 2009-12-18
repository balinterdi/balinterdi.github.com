--- 
wordpress_id: 12
title: Navigator for the Google Chrome comicbook
wordpress_url: http://bucionrails.com/?p=12
layout: post
---
The first beta version (for now only for Windows) of <a href="http://googleblog.blogspot.com/2008/09/fresh-take-on-browser.html">Google's browser is out, </a>but I don't think Google needs the marketing power of my post so that's not what I want to talk about. The browser is introduced by a <a href="http://www.google.com/googlebooks/chrome/">ingenious comics</a> of 39 pages. However, the navigator is too simple, in my opinion in that you cannot skip a page so if you read until say page 19 and you have to start over (e.g you closed the browser), you have to click on the "Next" link 18 times. There is no unique URL for each page, the whole navigation is done with a javascript snippet changing the image (the cartoon strip) when the user clicks "Prev" or "Next".

So I took a peep at the source of the page and reverse-engineered the navigation which is simply a javascript call to goPage('next') when the user clicks the Next link. So now I can simply write

<pre lang="javascript">
javascript:for (var i=0; i < 10; i++) goPage('next');</pre>

to the location bar to skip 10 pages ahead and do the same with 'prev' to rewind 10 pages.

I know "reverse-engineering" is way too conceited a term for this but this kind of hacking tickles my brain in a very joyful way and feels a bit like outsmarting Google. And that's not bad at all.

<strong>UPDATE:</strong> I now realize the comics's navigation has been redesigned so my above fix became obsolete. At least I cherish the knowledge my hack addressed a real UI problem (and did that faster than Google :) ).
