--- 
wordpress_id: 48
title: have your to_param begin with the record's id
wordpress_url: http://bucionrails.com/?p=48
layout: post
---
<p>If you overwrite the to_param method in your model class such that it does not begin with its id, you can be in for a nasty surprise. Let's say you have a User class and you want URLs to contain the user's login instead of its id.</p>

<pre code="ruby">
  class User
    def to_param
      self.login
    end
    ...
  end
</pre>

<p>And let’s assume you have a user called "bob". One might think the following works:</p>

<pre code="ruby">
  >> bob = User.find(3)
  => #&lt;User id: 3, login: "bob", ...&gt;
  >> User.find(bob.to_param)
  ActiveRecord::RecordNotFound: Couldn't find User with ID=bob
</pre>

<p>But it does not. That's a problem since URLs are created by calling the to_param method of the model instances composing the path and a standard, nice way of finding the model instance (user in our example) in a controller action is to fetch the id (now: user_id) from the controller. That will quickly lead to error messages of the above form.</p>

<p>The reason that it does not work is that ActiveRecord's find method will look for a numerical id at the beginning of the argument. It extracts this id and discards anything that comes after it. It then looks up that id in the database and returns the instantiated record. No numerical id results in an error message. The solution from here on is straightforward, have your to_param return a string where the id comes first: </p>

<pre code="ruby">
  class User
    def to_param
      "#{self.id}-#{self.login}"
    end
    ...
  end
</pre>

<pre code="ruby">
>> bob = User.find(3)
=> #&lt;User id: 3, login: "bob", ...&gt;
>> User.find(bob.to_param)
=> #&lt;User id: 3, login: "bob", …&gt;
</pre>

<p>As a splendid way to prove my point but a totally useless piece of information is that you can put any non-numeric value after the id, and find will still find the record:</p>

<pre code="ruby">
>> User.find("3-be-aware-of-what-you-overwrite-to-param-with")
=> #&lt;User id: 3, login: "bob", …&gt;
</pre>

So I hope you have found this useful, see you in the next episode :)
