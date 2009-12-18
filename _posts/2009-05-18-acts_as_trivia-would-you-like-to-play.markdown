--- 
wordpress_id: 52
title: "acts_as_trivia: would you like to play?"
wordpress_url: http://bucionrails.com/?p=52
layout: post
---
<p>We all love playing games, from poker to soccer, from hide'n seek to ... trivia! I am a great fan of this latter and also of Rails apps so it was kind of natural for me to come up with the idea of using all the data in your Rails app to serve as the basis of trivia questions.</p>

<p>The ingredients are few and basic. You have a class with an attribute that is comparable and makes sense to compare (the population of states is a good example, the zip code of addresses is a counter-example).</p>

<h3>Installation</h3>

<h4>Install the gem</h4>
<ol>
<li>Install the gem through Rails's config.gem</li>

<p>Put this: </p>
<pre code="bash">
    config.gem "balinterdi-acts_as_trivia", :source => "http://gems.github.com", 
:lib => "acts_as_trivia"
</pre>
<br />

<p>in your environment.rb and then run <em>rake gems:install</em> or <em>rake gems:unpack</em>.</p>

<li>Install it system-wide with the gem command</li>
<pre code="bash">
  gem install acts_as_trivia --source http://gems.github.com
</pre>
</ol>

<h4>Make your app act as a trivia</h4>
<br />
<p>You just have to run the provided trivia from the root of your Rails application:</p>

<pre code="bash">
  ./script/generate acts_as_trivia
</pre>

<h4>Create trivia questions easily from the command line</h4>
<br />
<pre code="bash">
    ./script.generate acts_as_trivia_record country population name</pre>
</pre>

<p style="margin-top:20px">This trivia question will be about the <i>population</i> of <i>countries</i> and the  <em>name</em> of each will be used by the provided helpers for the sake of displaying something unique of each country.</p>

<h4>Create the pages to answer and assess trivia</h4>

<br />
<p>The acts_as_trivia gem only aims to provide a clean interface and the logic, so you will have to create the <em>new</em> controller action of the <em>TriviaAnswersController</em> and the corresponding view: </p>

<pre code="bash">
  /users/:user_id/trivias/:trivia_id/trivia_answers/new
</pre>

<p  style="margin-top:20px">However, you can take a look at these files in the <a href="=http://gist.github.com/raw/107361/f31caad451f0cca699288700aa3d98291a259fd1/gistfile1.rb">rails app generator</a> or just directly copy them.</p>

<h3>Get right in the game</h3>

<p>Instead of going through the above steps, you can use a rails app generator to set up a trivia app quickly: </p>

<pre code="bash">
rails my_shiny_app -m 
http://gist.github.com/raw/107361/f31caad451f0cca699288700aa3d98291a259fd1/gistfile1.rb
</pre>

<p style="margin-top:20px">Once you go through the setup steps of the app generator, you have everything you need to have a functioning trivia app, so you can go to: </p>

<pre code="bash">
  /users/1/trivias/1/trivia_answers/new
</pre>

<p style="margin-top:20px">And if you created model instances you can already answer your first trivia question. For a more technical (and more complete) description, please see <a href="http://github.com/balinterdi/acts_as_trivia/tree/master">the README</a>. Also, since this is a beta version, please make sure to report any bugs you might come across.</p>
