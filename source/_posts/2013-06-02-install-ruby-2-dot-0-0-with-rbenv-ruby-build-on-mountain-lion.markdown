---
layout: post
title: "Install Ruby 2.0.0 with rbenv (ruby-build) on Mountain Lion"
date: 2013-06-02 22:58
comments: true
categories: ruby
---
1. You need to [download the source][1], or use [ruby-build][2] to install it for you. I will subsequently suppose the latter.
1. You need to configure it, compile it and copy files to the proper location:

{% codeblock %}
RUBY_CONFIGURE_OPTS=--with-openssl-dir=`brew --prefix openssl` CONFIGURE_OPTS=--with-gcc=clang rbenv install 2.0.0-p195
{% endcodeblock %}

You can see I installed openssl through homebrew. The ruby-build recipe downloads an openssl lib for you so only use that if you have it installed as I do.

I got the clang compiler frontend through [Apple's Command Line Tools][3] so I'm not sure that's needed if you have the whole Xcode package.

It really feels faster -maybe due to the improved GC-, rails starts >2 as fast as compared to plain 1.9.3, using [spring][4] in both cases.

[1]: http://www.ruby-lang.org/en/news/2013/05/14/ruby-2-0-0-p195-is-released/
[2]: https://github.com/sstephenson/ruby-build
[3]: https://developer.apple.com
[4]: https://github.com/jonleighton/spring
