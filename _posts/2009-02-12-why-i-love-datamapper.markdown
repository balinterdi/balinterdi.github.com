--- 
wordpress_id: 40
title: Why I love Datamapper
wordpress_url: http://bucionrails.com/?p=40
layout: post
---
I wanted to find the last user in alphabetic order of their names in a Merb project that uses <a href="http://datamapper.org">Datamapper</a> (the default ORM in Merb). So I did [<a href="#love-datamapper-first">*</a>]:

<pre lang="bash">
irb(main):020:0> User.all(:order => [:name]).first.name
 ~ (0.032946) SELECT <column_names> FROM `users` ORDER BY `name` LIMIT 1
=> "Admin User"
</pre>

Ok, so the default sorting order is ascending but I need the last one. There are two ways to do this. Write an SQL snippet and sneak in "DESC" somewhere or reverse the collection before taking the first element. Since I was not sure how to sneak in "DESC" plus I prefer writing Ruby to writing SQL hands down, I went with the second approach:

<pre lang="bash">
irb(main):021:0> User.all(:order => [:name]).reverse.first.name
 ~ (1.033271) SELECT <column_names> FROM `users` ORDER BY `name` DESC LIMIT 1
=> "XX XX"
</pre>

See what happened? Instead of reverting the collection (which is extra time even if it is done very fast) Datamapper sneaked in that DESC for me! Isn't this just brilliant? Datamapper takes the burden to write SQL off of your shoulders. You can keep writing Ruby statements you presumably love and let Datamapper take care of the SQL reaping both the comfort and the performance gain. [<a href="#love-datamapper-second">**</a>]. Also, likewise your app stays database type agnostic. Note how it is not supposed there is a RDBMS under the ORM layer. It could work with CouchDB, for example (I think there is actually work in progress for a CouchDB adapter). This is not the only reason I like Datamapper so much, so if you are still not convinced, go check out <a href="http://datamapper.org/doku.php?id=why_datamapper">some other reasons to use it</a>.

<hr>
<h3>Notes</h3>
<p id="love-datamapper-first">* I could have written this one in a simpler way:
<pre lang="bash">
irb(main):018:0> User.first(:order => [:name]).name
 ~ (0.032345) SELECT <column_names> FROM `users` ORDER BY `name` LIMIT 1
=> "Admin User"
</pre>

But you -or at least I- could not do it for the last element (there is no User.last)

<p id="love-datamapper-second">** I am not suggesting not to learn SQL at all. I am all for a know-thy-tools approach (especially it it means not cluttering your markup with javascript :) ). However, having the ORM do obviously good things for you is worth it most of the time.
</p>
