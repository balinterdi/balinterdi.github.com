--- 
wordpress_id: 62
title: Cucumber meets Selenium meets Integrity
wordpress_url: http://bucionrails.com/?p=62
layout: post
---
[Continuous Integration][ci] (CI) is a basic building block of any project done in TDD style. In brief, having a CI server properly set up guarantees that developers can rest assured that the application passes all its tests and can thus be deployed at any moment. It does this by sending some kind of a warning if something is broken so it can be fixed immediately.

Now I noticed that if a CI server is not in the mix right from the beginning of project, chances are it will never be, that was one of the first things I installed on a new Rails project. My server of choice is [Integrity][integrity] mostly because it is so easy to set up and quite straightforward to use.

Ok, so next we need some tests that Integrity will run at each commit and make sure the app can still be built. As a high-level acceptance test framework, I use [Cucumber][cucumber], which plays very nicely with [Selenium][seleniumhq] for automated in-browser testing. Since nowadays even the most basic web application will have some amount of client-side scripting code (that is, javascript) if you really want to test the features of your application you'll need Selenium tests.

That's when matters get a bit more complicated when it comes to integrating these with the Integrity server. Why? Because on the server you usually don't have the "desktop environment" which is available on the machine you do the development on. By default, you don't run a desktop manager and have a graphic display on a server. A tool called [xvfb][xvfb] comes into a picture that emulate a dumb framebuffer so you can still programs that need a graphic display.

To have some practical guidance, here's what I did on an Ubuntu server to enable all of the above:

Install java since Selenium runs in the JVM:

{% highlight bash %}
apt-get install java-common sun-java6-jre
{% endhighlight %}

Install firefox since that's what Selenium runs by default and that's a very good choice.

{% highlight bash %}
apt-get install apt-get install firefox
{% endhighlight %}

Install X since that's what the xvfb launches and Xvfb itself.

{% highlight bash %}
apt-get install xorg xserver-xorg
apt-get install xvfb
{% endhighlight %}

Next I found a [wiki][selenium_wiki] that describes how to launch the Xvfb correctly. Log into the server and do:

{% highlight bash %}
startx -- `which Xvfb` :1 -screen 0 1024x768x24 2>&1 >/dev/null &
{% endhighlight %}

So Xvfb will run on the DISPLAY :1. So far so good. But something was still not quite right. When integrity launched the test suite that included some Cucumber-Selenium tests I received an error message basically saying that no browser sessions could be started. And the solution to that, in fact, is where this post wants to get at.

After a decent amount of head-scratching and code mining I realized that the Selenium server starts the browser on the same display where the server itself (the jar file) runs. I have found the relevant code that assembles the command that starts the Selenium server in the selenium-client gem and figured it was not meant to be run in graphic hardware-less environment since I saw no options to define which display it should run on. So as an [easy hack I added the hardcoded "DISPLAY=:1" before it][my_selenium_hack] and crossed my fingers.

Bingo, it worked and I had a green build again! What's more surprising is that it still runs perfectly on my Macbook so it seems to run in (some) graphical environments, too. It seems a bit strange to me to have found so little information on this subject since Rails, Cucumber, Selenium and CI are all en vogue so it is possible that I missed something obvious and there is an easier way to do all this. I am very eager to hear how others set up their CI to run automated-browser features. Do you use another tool, not Selenium? Do you use a CI server with a monitor?

Anyway, I certainly hope my hackish solution will prove to be useful for some of you TDD-minded developers out there who run their CI on a simple &lt;name of your favorite provider here&gt; slice.

**UPDATE:** As [a fellow developer][lackac] and [the author of the selenium-client gem himself][ph7] pointed out library code is not the place for enviroment specific settings. Rather, it should go into the application's code. I guess that leaves the choice of putting it into the code of the application you are building or the configuration of the CI server. This latter seemed more clean to me so I put the following line into config.ru in Integrity's directory:

{% highlight bash %}
env["DISPLAY"] = ":1"
{% endhighlight %}

There is still something left, though. When integrity -or, to be precise, the selenium process that was launched from integrity- wants to access display :1, it will be denied. You need to explicitly enable local connections by putting "localhost" in a file:

{% highlight bash %}
echo 'localhost' >/etc/X99.cfg
{% endhighlight %}

, and then using that file as the access records list when you launch the server:

{% highlight bash %}
xinit -- `which Xvfb` :1 -screen 0 1024x768x24 -auth /etc/X99.cfg 2>&1 >/dev/null &
{% endhighlight %}

(Note that I launch xinit and not startx as before. startx somehow adds another -auth option which messes things up)

There, that should do it. It works and there is no code where it does not belong.

[ci]: http://martinfowler.com/articles/continuousIntegration.html "Continuous Integration"
[integrity]: http://integrityapp.com
[cucumber]: http://cukes.info
[seleniumhq]: http://seleniumhq.org
[xvfb]: http://linux.about.com/cs/linux101/g/xvfb.htm
[selenium_wiki]: http://wiki.openqa.org/display/SRC/Selenium-RC+and+Continuous+Integration
[my_selenium_hack]: http://github.com/balinterdi/selenium-client/commit/37094df174b5c52cb68d041f7dc940e501b3e438
[lackac]: http://lackac.hu
[ph7]: http://github.com/ph7