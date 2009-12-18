--- 
wordpress_id: 38
title: simple to-do list in Sinatra
wordpress_url: http://bucionrails.com/?p=38
layout: post
---
After Bence Golda's presentation at the last <a href="http://www.meetup.com/budapest-rb/">budapest.rb meetup</a> I decided to build something easy in <a href="http://www.sinatrarb.com/">Sinatra</a> since it seemed so cool and easy to do. And I have to tell you, it really is both. 

With zero prior experience with Sinatra and only a bit of fresh <a href="http://haml.hamptoncatlin.com/">HAML</a> knowledge, <a href="http://github.com/balinterdi/todo-list/tree/master">my todolist</a> was ready in a few hours. What can you do with it? Add todos to your list and delete them when you are done. What features does it have? Unobtrusive javascript :) What does it lack? Obtrusive javascript :) User-related funcionalities, the possibility of having more lists, seeing done todos, etc. Lots of things. But with the ease of development Sinatra provides I am sure that for a simple application like this these could be added quite quickly. And then <a href="http://tadalist.com/">tadalist.com</a> would be running for its money :) (I know, it's free).

ps. I use an ORM, datamapper to not to have to deal with SQL directly, so you'll have to "gem install dm-core" beyond the sinatra gems if you want to run the app.
