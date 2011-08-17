---
title: i15r handles non-english source
layout: post
---

The other day thinking about how [i15r][i15r_repo] could be improved I realized that there are times when the language of the non-internationalized site is not English (surprise, surprise). Add to this that lots of languages have "special" characters, characters that may not be properly found and replaced by the matchers. So I first learned the basics of [how Ruby handles encodings][ruby_encoding_series] (from [James Edward Gray's][james_edward_grays_blog] excellent series) and then adjusted a few matchers to catch those special characters, too. (Note: one can't underestimate the utility of a spec suite that covers most of the code)

The specs pass but I am pretty certain there are some cases where the matchers might not be up to the task. If you come through such a case, please [submit a bug report][i15r_issues]. Since there has been a huge improvement in [string encoding in Ruby 1.9][strings_ruby19] (basically, strings now have an encoding as opposed to in [Ruby 1.8][strings_ruby18]), there might be some cases where strings are properly internationalized using Ruby 1.9 but not with 1.8.

So if you think this is a valuable addition or just have not tried i15r yet, go get it:

{% highlight bash %}
gem install i15r --source http://gemcutter.org
{% endhighlight %}

[i15r_repo]: http://github.com/balinterdi/i15r
[ruby_encoding_series]: http://blog.grayproductions.net/articles/understanding_m17n
[james_edward_grays_blog]: http://blog.grayproductions.net/
[i15r_issues]: http://github.com/balinterdi/i15r/issues
[strings_ruby18]: http://blog.grayproductions.net/articles/bytes_and_characters_in_ruby_18
[strings_ruby19]: http://blog.grayproductions.net/articles/ruby_19s_string