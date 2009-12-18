--- 
wordpress_id: 37
title: strings as haml render parameters in Sinatra do not work
wordpress_url: http://bucionrails.com/?p=37
layout: post
---
I was intrigued by the simplicity and elegance of Sinatra as presented by Bence Golda at <a href="http://files.meetup.com/1271139/09-01-22-golda_bence-sinatra.pdf">the last budapest.rb meetup.</a>, so I decided to build a simple application with it (I am planning to talk just a little bit more about that in a later post).

One quick thing I learned the hard way is when generating haml views in Sinatra, you have to use symbols as the name of the view, strings will just be rendered as strings. That was a tough lesson to learn coming from Rails. So while in Rails you can write:

<pre lang="ruby">
  def index
    render :action => :index
  end
</pre>

or 

<pre lang="ruby">
  def index
    render :action => "index"
  end
</pre>

In Sinatra, you can only use a symbol to designate the view to be rendered:

<pre lang="ruby">
get '/' do
  haml :index
end
</pre>

Which makes sense, I think, since symbols (unlike strings, see <a href="#strings-symbols">below</a>) with the same name refer to the same entity which is a perfect fit for naming views, now ain't they? Plus, I'll admit I am in love with them symbols, with their colon in the front and all. And when they are syntax highlighted, I melt.

<div id="strings-symbols">
<pre lang="bash">
irb(main):002:0> sym1 = :index; sym2 = :index; sym1.object_id == sym2.object_id
=> true
irb(main):003:0> s1 = "index"; s2 = "index"; s1.object_id == s2.object_id
=> false
</pre>
</div>


