--- 
wordpress_id: 50
title: protecting actions of owner-type associations
wordpress_url: http://bucionrails.com/?p=50
layout: post
---
<p>The actions of a web application basically fall into three categories based on their access rights:
<ol>
	<li>Actions with anonymous access</li>
	<li>Actions the user has to be logged in to access. (authenticated actions)</li>
	<li>Actions the user needs a certain privilege for to access (authorized actions)</li>
</ol>
</p>

<p>At the implementation level, the first category is obvious, since the actions in this category do not have to be protected. So let's shift our attention to the second and third category and consider how access protection for these can be achieved in Rails applications.</p>

<p>Both of these are best done with <a href="http://api.rubyonrails.org/classes/ActionController/Filters/ClassMethods.html">before filters</a> since they run before the control is passed to the action's code and provide a DRY way to protect several actions.</p>

<h3>Authenticated actions</h3>

<p>Access restriction is quite straightforward once you have a basic library that provides a method to see if a user is logged in (see <a href="http://github.com/technoweenie/restful-authentication/tree/master">restful-authentication</a> for a full-scale solution):</p>

<br/>
<pre code="ruby">
class ProfilesController < ApplicationController
  before_filter :login_required 
  (...)
  def login_required
    redirect_to login_path unless logged_in?
  end
end
</pre>
<br/>
<h3>Authorized actions</h3>

<p>This can be more tricky since there is a great deal of possibilities of what privilege is needed to access a certain action (e.g only admins can see the full user list, only managers can edit the employees' records, etc.).</p>
<p>I realized there is one very prevalent type, though, the owner-type access. Only the owner of a blog can modify its data, only the user of a profile can edit its attributes, only the leader of a project can set its deadline, etc. The number of these is endless and I bet there are basically no sites where this does not come up.</p>

<p>Also, the pattern of this access restriction is pretty much the same in all cases. There is the resource to be protected, its owner and the user currently logged in. For access to be granted, the owner of the resource needs to match the current user. So why not extract the pattern to be reused?</p>

<h3>Only owner</h3>

<p>Hence the <a href="http://github.com/balinterdi/only_owner/tree/master">only-owner plugin</a> (I know I suck at naming projects) was born. By default, it will create a before filter in the controller which checks if it is the owner that wants to access the resource. If it is, access is granted. Otherwise, the user is redirected to the login path. Convention over configuration makes a lot of sense so to get up and running you only need to do these two things:</p>

<p>Install the plugin: </p>
<pre code="bash">
./script/plugin install git://github.com/balinterdi/only_owner.git
</pre>
<br/>

<p>"Tag" the controller to be protected:</p>
<pre code="ruby">
  class ProfilesController > ApplicationController
    only_owner
    (...)
  end
</pre>
<br/>
<p>That assumes that the profile can reach its user through the user association and that there is a find_profile method in scope in the controller. If your association or the finder method is named otherwise, you can pass the appropriate parameters to define them (:owner and :finder, respectively). As a -sensible, I reckon- convention, all methods in the controller except the new, create, index and show ones will be protected by default. Once again, this can be overridden with the usual :only and :except parameters.</p>

<p>I encourage you to scan through the <a href="http://github.com/balinterdi/only_owner/tree/master">README</a> for the options and especially, as always, to give me some feedback.</p>
