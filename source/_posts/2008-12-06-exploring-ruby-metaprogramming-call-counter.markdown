--- 
wordpress_id: 27
title: "Exploring Ruby metaprogramming: call counter"
wordpress_url: http://bucionrails.com/?p=27
layout: post
---
A few days ago I purchased a <a href="http://www.pragprog.com/screencasts/v-dtrubyom/the-ruby-object-model-and-metaprogramming">screencast by Dave Thomas on Ruby metaprogramming</a>. (I do not receive any affiliation fees :)). The part I bought presents a problem and describes nine different ways of solving it in ascending order of beauty and code clarity.

I was stunned by its beauty so I came up with another -though similar- problem and put together a simple solution for it. I present it for the Rubyists to silently smile in the knowledge of its elegance and power and for non-Ruby programmers to be -hopefully :)- amazed by it.

The task is to count the calls to a certain method of all instances of a class.

call_counter.rb:
{% highlight ruby %}
module CallCounter
  def count_calls_to(method_name)
  	original_method = instance_method(method_name)
	
  	call_counter = 0
  	define_method(method_name) do |*args|
  		call_counter += 1
  		bound_original_method = original_method.bind(self)
  		bound_original_method.call(*args)
  	end

  	define_method "calls_to_#{method_name}" do
  		call_counter
  	end		
  end
end
{% endhighlight %}

call_foo.rb:
{% highlight ruby %}
require "call_counter"

class CallFoo
	
	extend CallCounter

	def foo; end
	count_calls_to :foo

end
{% endhighlight %}

After calling "count_calls_to :foo" in the CallFoo class definition, calls to the "foo" method of CallFoo instances will be counted. A "calls_to_foo" method is available to get this count. 

I first created an UnboundMethod with "instance_method" and then used the bind method to attach it to an instance of ClassFoo. All this is to prevent aliasing method names, not because it is necessarily evil but because I agree with Dave Thomas about "bind" being a nicer solution. The define_method acts as a closure and saves its context so there is no need to use an instance variable for call_counter.

You can use the counter like this:

{% highlight ruby %}
irb(main):003:0> cf = CallFoo.new
=> #<CallFoo:0x608100>
irb(main):004:0> cf.calls_to_foo
=> 0
irb(main):005:0> 4.times { cf.foo }
=> 4
irb(main):006:0> cf.calls_to_foo
=> 4
{% endhighlight %}

Once again, what I love about Ruby is that in ~ 20 lines we have laid the base of a benchmarking tool (adding the possibility of measuring time spent in the method would not be hard). Also, the original class is not sullied by the call counting code intrinsic details. That functionality is stashed in a module, eager to be reused again.

You may note there is something not quite nice about this. The method calls are counted per class, which makes sense since we usually want to know how many times the method in question was called in all instances, not per instance. However, the calls_to_foo is called on the instance which is confusing. It should be called on the class object, like this: 

{% highlight ruby %}
  4.times { cf.foo }
  CallFoo.calls_to_foo
  => 4
{% endhighlight %}

I may get back to this later.
