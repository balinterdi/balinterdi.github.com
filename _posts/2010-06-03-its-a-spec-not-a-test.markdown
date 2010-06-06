---
title: It's a spec, not a test
layout: post
---
You must have heard the question several times on Rails mailing list and different IRC channels: "Should I test validates_uniqueness_of"? The standard answer to that one is "No, you definitely should not. It's Rails framework code, and it's already thoroughly tested. If you followed this path, you should also test whether objects are properly persisted in the database."

I think, however, that the question is wrong and thus you can not give a correct answer. It is wrong because validates_uniqueness_of is the implementation, not the requirement. If you approach it from this angle, the question turns into whether you should test the specific implementation or whether you should verify that (business) requirements are met.

That, in turn, comes down to tests vs. specs (short for specifications) and this is again an opportunity for specs to shine. If you write specs instead of tests (or, to put it in a more mind-warping way: if your tests are actually specs), then the above question is a no-brainer: it's part of the specification that no two users can have the same email address, so you must have a spec for it:

{% highlight ruby %}
describe User do
  it "has a unique email address" do
    Factory(:user, :email => "jeff@topnotch.com")
    lambda { Factory(:user, :email => "jeff@topnotch.com") }.should raise_error(ActiveRecord::RecordInvalid)
  end
end
{% endhighlight %}

On the other hand, if you stick with calling your tests tests (how orthodox! ;) ) then not only you have to think (which consumes a lot of resources), but you can also come to the wrong conclusion and emit a strong business requirement from your test suite. And then you might not remember to have the implementation for it after modifying the code for whatever reason. And then bad things might happen.

(This thought came to me when coming to work in the subway this morning. I was never quite comfortable with the name "specs" but now it's starting to make a lot of sense to me. You are encouraged to disagree. Dissent is what makes the world progress.)