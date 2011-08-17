--- 
wordpress_id: 60
title: The hashtag (HRT) retweet bot gemified
wordpress_url: http://bucionrails.com/?p=60
layout: post
---
A very simple twitter bot that retweeted everything that was tagged by a certain tag was put together for Scotland on Rails '09. Then, [Jaime Iniesta][jaime] adapted it for Euruko '09. I then forked from his repository, made a few simplifications and minor improvements and DRY-d its configuration.

Maybe most importantly I then turned it into [a gem][hashtag_retweet_home] so that configuration files (including the bot's which has the credentials for the twitter account) do not have to be included in the repository.

I also set up [a twitter account for the budapest.rb][budapestrb_twitter] group where an instance of the HRT bot will post any tweets that have been tagged with #budapestrb. So, my fellow budapest.rb programmers, if you have anything to say about the budapest.rb, just make sure you include the #budapestrb tag in your tweet and watch the HRT bot repeat it.

To launch your own hashtag retweet bot, just follow the instructions in [the README][hashtag_retweet_bot_home].

[jaime]: http://www.jaimeiniesta.com/
[hashtag_retweet_bot_home]: http://github.com/balinterdi/hashtag_retweet_bot
[budapestrb_twitter]: http://twitter.com/budapestrb