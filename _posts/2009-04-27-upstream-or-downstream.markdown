--- 
wordpress_id: 49
title: upstream or downstream?
wordpress_url: http://bucionrails.com/?p=49
layout: post
---
With the proliferation of <a href="http://chneukirchen.org/blog/archive/2007/02/introducing-rack.html">middleware applications</a> the mentions of upstream and downstream servers has intensified so I decided to get to the end of this and find out what exactly an upstream server is. I first looked up <a href="http://en.wikipedia.org/wiki/Upstream_server">wikipedia</a>:

<blockquote>
In <a title="Computer networking" href="http://en.wikipedia.org/wiki/Computer_networking">computer networking</a>, <strong>upstream server</strong> refers to a <a title="Server (computing)" href="http://en.wikipedia.org/wiki/Server_(computing)">server</a> that provides service to another server. In other words, upstream server is a server that is located higher in the <a title="Hierarchy" href="http://en.wikipedia.org/wiki/Hierarchy">hierarchy</a> of servers.
</blockquote>

Ok, so based on this simplistic definition, a sketch of a request's route to the application server and the response back can be illustrated like this:

<img src="http://bucionrails.com/wp-content/uploads/2009/04/request-stack.jpg" border="0" />

In this drawing, the middleware is an upstream server to the underlying application since it provides a service to it (be it caching, url mapping, exception handling and <a href="http://github.com/rack/rack-contrib/tree/master">plenty of others</a>).

So now with my definition established, I was looking for examples in the wild that support it. <a href="http://mwrc2009.confreaks.com/13-mar-2009-11-05-in-a-world-of-middleware-who-needs-monolithic-applications-jon-crosby.html">Jon Crosby's excellent presentation</a> at the MountainWest Ruby Conference used upstream in this context as far as I remember. Check one.

Browsing the source code of <a href="http://github.com/rtomayko/rack-cache/tree/master">rack-cache</a> -which, by the way, I strongly encourage you to do if you want to understand caching (better) or just like the look of clean Ruby code- I realized Ryan Tomayko's definition of upstream coincides with the above one since he uses downstream in the code to refer to the component/application below the rack-cache component. Check two.

I recently set up an nginx web server as a front end server to a mongrel cluster that runs a Rails application. Ok, so in this case, the nginx server must be the upstream server since requests hit there first and then are passed to the mongrels. One must hear the sound of collapse of cards in my head when I saw the following <a href="http://wiki.nginx.org/NginxHttpUpstreamModule">nginx directive</a>:

{% highlight bash %}
upstream production_mongrels {
  server 127.0.0.1:8000;
  server 127.0.0.1:8001;
  server 127.0.0.1:8002;
}
{% endhighlight %}

Hmm, what? Nginx is above the component it provides a load-balancing service to so by any -ok, by my- definition the directive should say "downstream" and not "upstream".

I realize that the request arrow on the diagram moving from top to bottom is a matter of convention and that it probably correlates with the fact that most languages write from the top to the bottom. Nevertheless, as far as I know Nginx is made by a Russian guy and Russians write top to bottom, too, so he should still use "downstream" for the directive, now shouldn't he? Or did he simply start to sketch up boxes and arrows from bottom to top for the sake of it when designing his web server?

Summing up, I think the above described convention is the common one but since it is not standardized there will always be people and software that uses it the other way around. I am not overly confident though, so please tell me about your definition or just point to examples which support or contradict mine.
