--- 
wordpress_id: 64
title: "Rubygems under the hood: hooking into require"
wordpress_url: http://bucionrails.com/?p=64
layout: post
---
(See <a href="http://bucionrails.com/2009/10/20/rubygems-under-the-hood-introduction/">the introduction</a> to the series.)

When you want to pull in a Ruby library, you require it. The library you require has to be on Ruby's load path ($LOAD_PATH) in order to succeed. So let's see how Rubygems hooks into this process. 

The secret lies in custom_require.rb. You'll see a nice comment near the top.

<blockquote>
When you call "require 'x'", this is what happens:
  * If the file can be loaded from the existing Ruby loadpath, it is.
  * Otherwise, installed gems are searched for a file that matches.
If it's found in gem 'y', that gem is activated (added to the loadpath).
</blockquote>

In fact, that explanation looks so straightforward to me that I doubt if I can add more words to precise it, so let's look at the code together:

{% highlight bash %}
module Kernel
  alias gem_original_require require
  (...)
  def require(path) # :doc:
    gem_original_require path
  rescue LoadError => load_error
    if load_error.message =~ /#{Regexp.escape path}\z/ and
       spec = Gem.searcher.find(path) then
      Gem.activate(spec.name, "= #{spec.version}")
      gem_original_require path
    else
      raise load_error
    end
  end
(...)
end
{% endhighlight %}

Aliasing a method, redefining it and calling the original version from the redefined method is a very familiar pattern if you have read Rails source code (called method chaining). 

So, just as the above description says, if the file can be loaded "without Rubygems" it is and Rubygems never comes into the picture. If not, we make sure that the load error comes from the file not found on the load path and then find the gemspec for that file and activate it. 

Activating it adds it to the load path, so we can call the original require safe in the knowledge that it will now succeed and we won't get another load error this time around (and go into an infinite loop). Clever, heh?

This is one of the cases when the code is so simple for a moment I think I could have written it myself. With its &lt;10 lines of code Rubygems is empowered to load a myriad of useful Ruby libraries. Isn't this wonderful?
