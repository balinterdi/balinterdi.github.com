--- 
wordpress_id: 36
title: "Shoulda: setup and should blocks and don't wander off the map"
wordpress_url: http://bucionrails.com/?p=36
layout: post
---
I'm using <a href="http://www.thoughtbot.com/projects/shoulda/">shoulda</a> for testing in a rails project and I wrote this simple test to see if my update action really updated the object and redirected to the appropriate place:

<pre lang="ruby">
context "the update" do
  setup do     # 1
    @project = Factory(:project, :director => @user)
    put :update, :id => @project, :project => { :name => "updated name" }
  end
  # 2    
  updated_project = Project.first(:order => "created_at DESC")
  # 3
  should_redirect_to "project_url(updated_project)" # 4
  should "update the attributes" do
    assert_equal("updated name", updated_project.name) # 5
  end  
end
</pre>

To my surprise, I received an "undefined local variable or method 'updated_project' on both tests (#4 and #5). I figured out why and I want to share it with you. In case you are a shoulda expert, you must know the answer already and sorry for wasting your time. On the other hand, if you are new to shoulda like I am, you may find this useful.

What shoulda does when running a 'should' block is that it runs all the 'setup' blocks of the contexts in which it is nested, from the outside to the inside, so this:

<pre lang="ruby">
context "alpha" do
  setup do
    puts "A"
  end
  context "beta" do
    setup do
      puts "B"
    end
    context "gamma" do
      setup do
        puts "C"
      end
      should "work" do
         puts "the only test"
      end
    end
  end
end
</pre>

Will print
<pre lang="bash">
A
B
C
the only test
</pre>

Also the area between #2 and #3 in the above test is sort of a no man's land, since it is not in a setup block, so assignments that are executed here are completely useless. You can not use it either for side-effects since it will run before the setup block (#1 above). My advice is to simply put everything in a block, be it a 'setup' or a 'should' one. (the 'should_redirect_to' is a macro that's part of shoulda, it gets expanded into a block, too).

So here is the same test correctly:

<pre lang="ruby">
context "the update" do
  setup do
    @project = Factory(:project, :director => @user)
    put :update, :id => @project, :project => { :name => "updated name" }
  end
  
  should_redirect_to "project_url(@project)" 
  should "update the attributes" do
    # reload is needed to see the new state
    @project.reload
    assert_equal("updated name", @project.name)
  end
  
end
</pre>

Shoulda is a nice tool. There is only one I know and I like a tad better which is quite similar in structure, <a href="http://rspec.info/documentation/">rspec</a>.
