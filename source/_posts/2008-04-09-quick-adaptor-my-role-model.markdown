--- 
wordpress_id: 3
title: Quick adaptor - my role model
wordpress_url: http://bucionrails.com/2008/04/09/quick-adaptor-my-role-model/
layout: post
---
I returned two weeks ago from the fantastic <a href="http://www.euruko2008.org/">Euruko 2008 conference</a> in Prague dazzled by the outstanding presentations and the power of Ruby. It is hard to pick a favorite but I especially liked David Black's "Per-Object Behavior in Ruby" (slides hopefully coming up) mainly because I am a sucker for metaprogramming and the true object-orientedness of Ruby in all its glory.

One fundamental concept was the singleton class which I think I've finally understood from this session. His example was the OpenStruct class whose instances learn to respond to all messages sent to them (this is Smalltalk/Ruby parlance, we could also say they learn to handle method calls) instead of throwing a NoMethodError. So I thought a great way to gain an insight of how this works is to actually code that up myself. Here is what I got:
<pre lang="ruby">
require 'test/unit'
class QuickAdaptor
  def method_missing(method_id, *args)
    method_name = method_id.to_s
    if method_name =~ /=$/
      attr = method_name.to_s.chop
      self.class.class_eval do
        define_method method_id do |x|
          instance_variable_set("@#{attr}", x)
        end
        method_name.chop!
        define_method method_name.to_sym do
          instance_variable_get "@#{attr}"
        end
      end
      instance_variable_set("@#{attr}", args[0])
    end
  end

end

class QuickSingletonAdaptor
  # does the same as QuickAdaptor
  # but only defines methods for singleton
  # class of object, so it is not the class
  # that "learns", but the singleton class
  def method_missing(method_id, *args)
    method_name = method_id.to_s
    if method_name =~ /=$/
      attr = method_name.to_s.chop
      singleton_class = class << self ; self; end
      singleton_class.instance_eval do
        define_method method_id do |x|
          instance_variable_set("@#{attr}", x)
        end
        method_name.chop!
        define_method method_name.to_sym do
          instance_variable_get "@#{attr}"
        end
      end
      instance_variable_set("@#{attr}", args[0])
    end
  end

end

if __FILE__ == $0
  class ModuleTester < Test::Unit::TestCase

    def test_quick_adaptor_creates_methods
      qa = QuickAdaptor.new
      qa.age = 18
      assert_equal(18, qa.age)
      qa.age = 24
      assert_equal(24, qa.age)
      assert_equal(nil, qa.name)
      qa.name = 'joe'
      assert_equal('joe', qa.name)
      assert(!qa.respond_to(:nam))
    end

    def test_quick_adaptor_creates_instance_methods
      qa1 = QuickAdaptor.new
      qa1.age = 18
      qa2 = QuickAdaptor.new
      assert(qa2.respond_to?(:age=))
      assert(qa2.respond_to?(:age))
      assert_equal(nil, qa2.age)
    end

    def test_quick_singleton_adaptor_creates_singleton_methods
      qa1 = QuickSingletonAdaptor.new
      qa1.age = 18
      qa2 = QuickSingletonAdaptor.new
      # qa2 at this point should not know anything!
      assert(!qa2.respond_to?(:age=))
      assert(!qa2.respond_to?(:age))
    end

  end
end

</pre>
As a test enthusiastic I embedded the tests in the same file which also has the advantage of giving a documentation of what the code achieves.

You can see that the real difference between the QuickAdaptor and QuickSingletonAdaptor classes lies in the following lines:
<pre lang="ruby">
class QuickAdaptor
  ...
  self.class.class_eval do
    define_method method_id do |x|
      ...
    end
  end
end
</pre>
<pre lang="ruby">
class QuickSingletonAdaptor
  ...
  singleton_class = class << self ; self; end
  singleton_class.instance_eval do
    define_method method_id do |x|
      ...
    end
  end
end
</pre>
You can see from the tests that the QuickAdaptor shares the knowledge it gained with its peers (other QuickAdaptor instances), whereas QuickSingletonAdaptor is an egoist, it keeps it to itself! That's why I agree with David Black that the best way to call the class that only one instance can access is singleton class because this has more expressive power than other terms (e.g metaclass, eigenclass, etc.)

My goal is to act like the QuickAdaptor, to suck in all ruby knowledge and learn as fast as QuickAdaptor does while having fun at the same time!

ps. I have also taken a look at how Matz's <a href="http://www.ruby-doc.org/stdlib/libdoc/ostruct/rdoc/index.html">OpenStruct class</a> accomplishes the same (well, much more :) ). It uses a table of fields where each new "member method" is defined. Nice.
