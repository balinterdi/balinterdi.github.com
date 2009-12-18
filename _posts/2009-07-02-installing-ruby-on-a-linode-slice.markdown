--- 
wordpress_id: 56
title: installing ruby on a linode slice
wordpress_url: http://bucionrails.com/?p=56
layout: post
---
To be able to experiment freely and find a store for my <a href="http://bucionrails.com/2009/06/22/twuckoo/">twuckoos</a> and other goodies I have recently purchased a Linode 360 slice and had Ubuntu 9.04 installed on it. Next thing was setting up ruby (ruby 1.8.6, to be precise).

When deciding about how to install ruby, in part I wanted to have flexibility but mostly I wanted to feel like I am a professional sysadmin for some hours so I balked at pre-built ruby packages and went with the roll-your-own approach. I'll summarize below the process and some pitfalls I encountered so it might help someone.
<h2>Some basic tools</h2>
First, you will need wget (or curl) to download the sources you will need along the way, so:
<pre lang="bash">$ sudo apt-get install wget</pre>
Also, before you stare dumbly at the screen (like I did) wondering why can't the stupid machine run make when the Makefile is clearly there in the directory , don't forget to install make:
<pre lang="bash">$ sudo apt-get install make</pre>
<h2>Updating the package repos</h2>
Plus, since we'll be installing packages that are found in the "universe" namespace (or whatever it is called) you should uncomment the below two lines in /etc/apt/sources.list :
<pre lang="bash">deb http://us.archive.ubuntu.com/ubuntu/ jaunty universe
deb-src http://us.archive.ubuntu.com/ubuntu/ jaunty universe</pre>
... and then update your package index:
<pre lang="bash">$ sudo apt-get update</pre>
<h2>Installing some packages ruby needs</h2>
Before we download and build ruby, however, it is recommendable to have the zlib and openssl libraries so ruby can already bind to them. This is one of the things that is a lot easier to see with hindsight, but here I am, blogging this to you:
<pre lang="bash">$ sudo apt-get install zlib1g zlib1g-dev zlibc
$ sudo apt-get install openssl</pre>
It turns out from <a href="http://www.ruby-forum.com/topic/71774">this thread</a>, that the zlib bindings are part of ruby since 1.8.6 so you will not need the libzlib-ruby package.

Now, on to ruby itself.
<h2>Ruby &amp; Rubygems</h2>
<pre lang="bash">$ wget ftp://ftp.ruby-lang.org/pub/ruby/ruby-1.8.6-p369.tar.bz2
(untar and cd to new directory)
$ ./configure
configure: error: no acceptable C compiler found in $PATH</pre>
Piece of cake:
<pre lang="bash">$ sudo apt-get install gcc
$ ./configure
configure: error: in `/home/balint/ruby-1.8.6-p369':
configure: error: C compiler cannot create executables
See `config.log' for more details.</pre>
A bit harder, but I have quickly found the answer <a href="http://ubuntuforums.org/showthread.php?t=17033">here</a>, and then did:
<pre lang="bash">$ sudo apt-get install libc6-dev g++
$ ./configure
$ make
$ sudo make install
$ ruby -e "p 'hello from linode slice'"
"hello from linode slice"</pre>
Rolling!

However, we all know that a ruby installation without gems is a toothless tiger (lion?) so we'll install rubygems last, first downloading the source, and then installing it:
<pre lang="bash">$ wget http://rubyforge.org/frs/download.php/57643/rubygems-1.3.4.tgz
(untar and cd to new directory)
$ sudo ruby setup.rb</pre>
If you want to use gems stored on github (and you probably do) it is convenient to add the gem github repository to your gem sources:
<pre lang="bash">$ gem source -a http://gems.github.com
$ sudo gem install balinterdi-twuckoo</pre>
Ok, that's all. I hope you have found this useful.

<hr /><em>Note:</em>

If you receive an error message similar to the following when trying to install a gem:
<pre lang="bash">/usr/local/lib/ruby/site_ruby/1.8/rubygems/custom_require.rb:31:in `gem_original_require': no such file to load -- zlib (LoadError)</pre>
Then you need to install the appropriate lib package and recompile ruby. Go to the directory where you unpacked the ruby source to and do:
<pre lang="bash">$ make clean
$ make
$ sudo make install</pre>
