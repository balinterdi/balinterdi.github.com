--- 
wordpress_id: 13
title: PostgreSQL pg_hba.conf authentication
wordpress_url: http://bucionrails.com/?p=13
layout: post
---
I recently spent some time debugging while I can't connect to a local postgreSQL database. I wanted the nice_db database to be accessible to all local users (not real names) without any authentication. The "trust" authentication method was what I needed for this scenario, I was sure of this much. So I set up an authentication record in the configuration file below the one that existed by default:
<pre lang="sql"># TYPE  DATABASE    USER    CIDR-ADDRESS    METHOD
local    all          all                   ident sameuser
local    nice_db      all                   trust</pre>
But this gave me the following error and denied access:

psql: FATAL:  Ident authentication failed for user "balint"

I tried several things making the second record more allowing each time (in fact, what you see above is the final, most liberal version) to no avail. I then swapped the order of the two records and finally was granted access.

Of course, I should have been wiser and apply the grand old <acronym title="Read The Fucking Manual">RTFM</acronym> principle. The <a title="PostgreSQL documentation" href="http://www.postgresql.org/docs/7.4/static/client-authentication.html" target="_blank">PostgreSQL documentation</a> states in very clear terms how each line in the pg_hba.conf is accessed:
<blockquote>The first record with a matching connection type, client address, requested database, and user name is used to perform authentication. There is no <span class="QUOTE">"fall-through"</span> or    <span class="QUOTE">"backup"</span>: if one record is chosen and the authentication fails, subsequent records are not considered. If no record matches, access is denied.</blockquote>
For my particular case, the "local all all ident sameuser" record blocked access to all databases but to those whose name matched that of the operating system's user (that's what the ident sameuser does) since that matches all user and database names.

Beyond the mechanics of PostgreSQL authentication (put the authentication records that match more users/databases below the ones that are more specific), I have learned something which is more precious and that I can put into good use in the future: RTFM!
