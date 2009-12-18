--- 
wordpress_id: 30
title: "Ruby metaprogramming: Call counter - Take 2"
wordpress_url: http://bucionrails.com/?p=30
layout: post
---
So <a href="http://bucionrails.com/2008/12/06/exploring-ruby-metaprogramming-call-counter/" target="_blank">last time</a> I left you with the promise that I'd return with a solution so that the number of times a certain method was called is a class method which makes more sense than if it was an instance method. So here is the "improved version":

<strong>call_counter.rb:</strong>

<pre lang="ruby">

module CallCounter
		
    def count_calls_to(method_name)
      original_method = instance_method(method_name)
    		
      unless class_variable_defined?(:@@call_counter):
        class_variable_set(:@@call_counter, {})
      end
    
      call_counter = class_variable_get(:@@call_counter)
    
      define_method(method_name) do |*args|
        call_counter[method_name] ||= 0
        call_counter[method_name] += 1
        bound_original_method = original_method.bind(self)
        bound_original_method.call(*args)
      end

      metaclass = class << self; self; end
      metaclass.instance_eval do

        define_method(:calls_to) do |m|
          call_counter[m].nil? ? 0 : call_counter[m]
        end

        define_method(:reset_counters) do
          call_counter.each_key do |k|
            call_counter[k] = 0
          end
        end
    end
    
  end

end
</pre>

What has changed is the introduction of a class variable that counts the calls on all watched methods and that the number of calls on each method is queried by calls_to(&lt;method name&gt;) instead of calls_to_&lt;method_name&gt;. A bit less magic.

<strong>call_foo.rb:</strong>

<pre lang="ruby">

require "call_counter"

class CallFoo
	
  extend CallCounter

  def foo; "foo"; end
  def bar; "bar"; end

  count_calls_to :foo
  count_calls_to :bar

end
</pre>

<strong>(a snippet of) call_counter_spec.rb:</strong>

<pre lang="ruby">
require "call_foo"
require "spec"
	
describe CallFoo do
	
  before(:each) do
    @call_foo = CallFoo.new
    CallFoo.reset_counters
  end
		
  it "should be able to count several methods' calls" do
    4.times { @call_foo.foo }
    CallFoo.calls_to(:foo).should == 4
    7.times { @call_foo.bar }
    CallFoo.calls_to(:bar).should == 7
  end
	
end
</pre>

I'm still not 100% content with this solution, the programming interface is nice now but it would be cool to get rid of the class variable somehow, possibly replacing it with closures. If you know how to achieve it, please leave a comment.

ps. You can also get <a href="http://pastie.org/338877">the whole code in nice colored format</a> or <a href="http://pastie.org/338877.txt">the raw text version</a>.
