--- 
wordpress_id: 45
title: finding missing I18n translations with missing_t
wordpress_url: http://bucionrails.com/?p=45
layout: post
---
A recurring problem in an internationalized Rails project is to see which translations are missing. You could go through all the pages looking for "translation missing: en, user, new" texts. That, however is very tedious and error prone. There may be some texts you don't even see that are missing translation. (like a title of an image).

A better solution is to write a program that finds these. So that's what I did. I gave it a very imaginative name: <a href="http://github.com/balinterdi/missing_t/tree/master">missing_t</a>. It's darn simple. You first have to install the gem:

<pre lang="bash">
gem install balinterdi-missing_t  
</pre>

and then from the root of your Rails app you type:

<pre lang="bash">
missing_t
</pre>

You will see all the I18n strings that do not have translations along with the file they were found in. If you want to restrict your search for a specific language, you provide its language code as the first parameter, like so:

<pre lang="bash">
missing_t fr
</pre>

For a bit more detailed description, <a href="http://github.com/balinterdi/missing_t/tree/master">see the README</a>. 

Go ahead, give it a try, your app has the right to speak all those beautiful languages out there!
