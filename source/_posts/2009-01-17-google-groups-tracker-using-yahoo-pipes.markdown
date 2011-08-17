--- 
wordpress_id: 34
title: Google Groups tracker using Yahoo Pipes
wordpress_url: http://bucionrails.com/?p=34
layout: post
---
I -and I suppose most of my developer mates- am subscribed to many Google Groups. When there is a topic I am interested in or a problem I posted or replied to it would be cool to get notified of changes to it. Instead of checking it five times a day to see if someone has commented on it which also slices up the big, continuous chunks of time we programmers need. Also, some groups are littered by spam topics so it would be nice to filter out all the things you are not particularly fascinated about and be left with the things you are.

Unfortunately, Google Groups does not offer us the possibility of following certain topics (e.g by sending you an email whenever someone added his comment, a la Lighthouse). But there is a solution although I'll admit the one I am describing below is not a particularly cunning or elegant one. If you felt the same pain and found a remedy, I am curious to know what it is, so please leave a comment.

So, as we all know, the Internet is just a <a href="http://en.wikipedia.org/wiki/Series_of_tubes">series of tubes</a>, so the idea to use Yahoo Pipes to cobble together something came quite naturally. Ladies and gentlement, I created the <a href="http://pipes.yahoo.com/balinterdi/google_groups_issue_tracker">Googe Groups issue tracker</a>. It is capable of tracking two Google groups. You can pass three strings for each one and it generates an RSS of the items whose title have any of the strings you provide.

I know it has many shortcomings (to say the least). What if you want to track issues for 3 groups or more? More than 3 issues per group? My puny tracker can't do that right now since its "legoed" together from <a href="http://pipes.yahoo.com/pipes/">Yahoo Pipes</a> building blocks and so it's not programmable. You can, however, clone my pipe, expand it to handle more groups or more expressions, enter the groups you want to track and subscribe to the resulting RSS with your reader of choice.

It may still feel clumsy, since you have to regularly update your strings based on the issues you are interested in. I know a more general solution would be to hack together something that is more manageable and expandable which I might do soon. But it still feels so good from time to time to leave the serious, hard-thinking adult world and build Lego castles. So go ahead, don't be shy, build your own castle and let me know about it! :)

<strong>UPDATE:</strong> Thanks to Bob, I realized Google has the very option I missed and constructed the pipe for :) However, there can still be some valid scenarios where it can be of service. As per <a href="http://jaimeiniesta.com">Jaime's</a> comment I realized I did not really explain how to run the pipe, so let me do it through an example that is not too contrived:

Let's suppose you are a <a href="http://datamapper.org">DataMapper</a> expert and you want to help those newbies/impatient people who put 'help' in the title of their post. In that case, you would input http://groups.google.com/group/datamapper in the "Group1 URL" box and "help" in the "Group1 - Title 1" field. At the pipe output you'd only see those posts which have help in their title, then.

If you want to also see announcements and the convention would be to have [DM] in the title of those posts, you would then enter "[DM]" in the "Group1 - Title 2" field.

To construct a filter which only lists ruby-quiz related posts on <a href="http://groups.google.com/group/ruby-talk-google">http://groups.google.com/group/ruby-talk-google</a> is left as an exercise to the reader :).
