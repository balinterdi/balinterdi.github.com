--- 
wordpress_id: 42
title: plans for 2009 - contribute (more) to open source projects
wordpress_url: http://bucionrails.com/?p=42
layout: post
---
At the start of 2009 my friend Jaime <a href="http://www.jaimeiniesta.com/2009/01/07/mi-resumen-del-2008">resumed his previous year</a> and proposed me to do the same. It seemed a really good idea but somehow it still died down.

I know it's March now but I reckon it's still ok to do this until December :) I'll attempt to write a mini-series of posts about not so much what I did in 2008 but rather what I would like to achieve in 2009.

When I started to work full-time with Ruby I also realized the vast possibilities and magnetism of open source projects. I could -and still can- spend hours browsing among different projects on github, peeping into their code, reading related articles, etc. 

So when I set out for this journey one of my tasks naturally became to regularly contribute to a "serious" open source project. When I got acquainted with Merb I also got to know <a href="http://datamapper.org/doku.php">DataMapper</a>, its default ORM. I admired its elegance and coherence and the more I knew of it the more I liked it. So when the maintainer position of a dm-more gem, <a href="#dm-constraints">dm-constraints*</a> seemed to be up for grabs I took the opportunity. 

That was in December and since then I sent in a few patches and merged changes implemented by others. (which I realized could sometimes be a lot more difficult than writing code :) ). I like to do this and have learned -and probably will learn- a lot so one of my plans for 2009 is to continue with dm-constraints and maybe find other open source projects I could contribute to on a regular basis.

So, if you happen to use DataMapper, which <a href="http://bucionrails.com/2009/02/12/why-i-love-datamapper/">I strongly encourage you to do</a>, and find a bug related to foreign-key constraints, <a href="http://datamapper.lighthouseapp.com/projects/20609-datamapper">file a ticket</a> and assign it directly to me (Balint Erdi). And/or start contributing!

<h3>Notes</h3>

<p id="dm-constraints">* Dm-more is the meta package that contains everything outside the core functions of DataMapper. Dm-constraints deals with foreign key constraints. If you are familiar with ActiveRecord, it is basically the options you specify with :dependent on an association.</p>
