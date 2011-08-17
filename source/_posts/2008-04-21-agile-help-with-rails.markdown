--- 
wordpress_id: 5
title: Agile help with Rails
wordpress_url: http://bucionrails.com/?p=5
layout: post
---
I have recently taken the habit of checking on <a href="http://railsforum.com">Rails forum</a> from time to time whether there are unanswered questions I can help with. The best way to see a problem in its context is to recreate it and I was amazed by how easy it is to set up a rails site and debug e.g <a href="http://railsforum.com/viewtopic.php?id=17529">a routing problem</a>.

<div style="margin-top:20px;margin-bottom:20px">
<code>
> rails railsforum_help_routing
> createdb railsforum_help_routing_development
(edit database.yml to set user and possibly database type)
> script/generate model Trip
> script/generate controller Trip
(edit routes.rb, in this case)
</code>
</div>

Naturally the fact that all this takes about 5 minutes greatly leverages lending a hand to a fellow developer. Now that's what I call agile!
