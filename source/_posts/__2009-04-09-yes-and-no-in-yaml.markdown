--- 
wordpress_id: 47
title: yes and no in YAML
wordpress_url: http://bucionrails.com/?p=47
layout: post
---
I recently needed to display 'yes' and 'no' "internationally" depending on whether the value of a certain attribute is true or false. So I came up with this simple helper method:

<pre code="ruby">
  def to_yes_no(expr)
    expr ? I18n.t('yes') : I18n.t('no')
  end
</pre>

and the corresponding translations in the yaml file:

<pre code="ruby">
  yes: sí
  no: no
</pre>

It was so obviously correct and yet it did not work. It kept displaying "true" or "false". After about an hour spent scratching my head and juggling with yaml files <a href="http://en.wikipedia.org/wiki/YAML">I finally realized that YAML recognizes the strings Yes and No (or their lowercase versions)</a> and handles them as true and false. 

Strictly speaking, one should always put quotes around the strings in the locale yaml files to make sure they are recognized as strings, but it's so much uglier that way. Anyhow, the solution was precisely that:

<pre code="ruby">
  "yes": "sí"
  "no": "no"
</pre>

Now I wonder if this is a case where the grammar designers (or whatever we call YAML) want to be smarter than the programmer. In any case, they were this time :)
