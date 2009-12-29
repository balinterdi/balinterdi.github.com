--- 
wordpress_id: 53
title: twuckoo - my twitter mini framework
wordpress_url: http://bucionrails.com/?p=53
layout: post
---
I am reading Andy Hunt's excellent Pragmatic Thinking and Learning book. There is a section about so called "oblique strategies", short, mysterious phrases that exercise your mind and make you look at problems from another perspective (e.g "repetition is a form of change").

The suggested intake was once a day and there was a free application that did just this for Apple computers. However, the application was so outdated that I could no longer run it on my laptop. So, I set out to write that application and after a bit of thinking decided to make a twitter account where I ("I" meaning a script that I wrote :) ) would post an oblique strategy each day and then just follow that account. This way, I can also spread the knowledge around.

Thus <a title="Twuckoo" href="http://github.com/balinterdi/twuckoo/tree/master">Twuckoo</a> was born. Twuckoo is a simple program (relying on <a href="http://github.com/cjohansen/twibot/tree/master">twibot</a> for communication with twitter) that lets you periodically post a message on a twitter account. It can fetch the messages from a file, from a database, from the web or whereever you want it to retrieve them from. Its very modular in nature so it delegates the task of getting the next message to twitter and storing the posts to the module. here is currently one generic module, the one that fetches them from a file, and one that fetches them from wikipedia's main page. I strongly hope that it is very easy for you to write your own module for your own purpose. Twuckoo aims to follow the "provide-what's-needed-and-then-just-get-out-of-the-way" principle. Go check out <a href="http://github.com/balinterdi/twuckoo/tree/master">the README</a> for further details.

It's quite easy to install and run. You can find an example for the file-fetcher module at <a href="http://twitter.com/daily_oblique">http://twitter.com/daily_oblique</a> and <a href="http://twitter.com/wikipedia_tfa">http://twitter.com/wikipedia_tfa</a> grabs "Today's Featured Article" from wikipedia and posts the title and the link so you can grow a little wiser each day :)

Since it is modular it's very extensible. I kept the API very simple so writing modules should be a piece of cake. Each module has to define the following methods:

1. **load_tweets** Loads the messages that can be twittered.
1. **next** Gets the next message that will be posted.
1. **store** Store the tweet after it had been posted.

Once more, I encourage you to scan through [the README][twuckoo_home], devise your own module and let me know about it. Any feedback is very welcome.

*Note:* For my Hungarian-speaking readers, I gave a <a href="http://docs.google.com/Presentation?id=dccxt9fm_3g8nf5fm5">lightning talk about twuckoo</a> at the latest budapest.rb meetup.

[twuckoo_home]: http://github.com/balinterdi/twuckoo/