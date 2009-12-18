--- 
wordpress_id: 17
title: javascript method chain
wordpress_url: http://bucionrails.com/?p=17
layout: post
---
John Resig has an extraordinary advanced javascript tutorial on his <a href="http://ejohn.org/apps/learn/" target="_blank">blog</a> that he presented on <a href="http://en.oreilly.com/webexny2008/public/content/home" target="_blank">a web conference</a>. It is definitely worth a walk-through since it expands one's javascript horizon unless one has not written a javascript framework himself. 

I played around with several of his slides learning a lot. My favorite was probably <a href="http://ejohn.org/apps/learn/#90">the last slide</a> which explains how method overloading works using the fact that <em>methodname</em>.length in javascript gives back the number of expected arguments of that function.

<pre lang="javascript">
function addMethod(object, name, fn){ 
  // Save a reference to the old method 
  var old = object[ name ];
 
  // Overwrite the method with our new one 
  object[ name ] = function(){ 
    // Check the number of incoming arguments, 
    // compared to our overloaded function 
    if ( fn.length == arguments.length ) 
      // If there was a match, run the function 
      return fn.apply( this, arguments ); 
 
    // Otherwise, fallback to the old method 
    else if ( typeof old === "function" ) 
      return old.apply( this, arguments ); 
  }; 
} 
 
function Ninjas(){ 
  var ninjas = [ "Dean Edwards", "Sam Stephenson", "Alex Russell" ]; 
  addMethod(this, "find", function(){ 
    return ninjas; 
  }); 
  addMethod(this, "find", function(name){ 
    var ret = []; 
    for ( var i = 0; i < ninjas.length; i++ ) 
      if ( ninjas[i].indexOf(name) == 0 ) 
        ret.push( ninjas[i] ); 
    return ret; 
  }); 
  addMethod(this, "find", function(first, last){ 
    var ret = []; 
    for ( var i = 0; i < ninjas.length; i++ ) 
      if ( ninjas[i] == (first + " " + last) ) 
        ret.push( ninjas[i] ); 
    return ret; 
  }); 
} 
 
var ninjas = new Ninjas(); 
assert( ninjas.find().length == 3, "Finds all ninjas" ); 
assert( ninjas.find("Sam").length == 1, "Finds ninjas by first name" ); 
assert( ninjas.find("Dean", "Edwards").length == 1, "Finds ninjas by first and last name" ); 
assert( ninjas.find("Alex", "X", "Russell") == null, "Does nothing" );
</pre>

It took me some time to figure out how exactly the method calls are routed but it was an interesting process nevertheless. I guess the one tricky part to interpret is the following bit:
<pre lang="javascript">
if ( fn.length == arguments.length ) 
  // If there was a match, run the function 
  return fn.apply( this, arguments ); 
 
  // Otherwise, fallback to the old method 
  else if ( typeof old === "function" ) 
    return old.apply( this, arguments ); 
  }; 
</pre>

This makes a method chain and allows for method overloading. With the three addMethod calls in the above example a chained method is built up. 

After the call to addMethod with no arguments (the first one), the find method of the Ninjas "class" will return all ninjas if called with no arguments and do nothing if called with any number of arguments. After the call to addMethod with one single name argument the find method will return the ninjas whose first name matches the passed argument if there is only one argument, return all ninjas if it has been called with no arguments and do nothing otherwise. 

I could go on but the pattern is probably clear now. At each call of the find method, the lastly added method is matched for the number of arguments (so in the above example, it will match if the caller passed two arguments) and the method called if the match is successful. Otherwise, it will try to match the number of arguments with the method that was added before the last one, and so on.

I am elaborating this in so much detail because 
<ol>
	<li>it was such a "Eureka!" moment for me when I got it. </li>
	<li>it is an incredibly ingenious way to flex the possibilites of javascript and introduce an OOP concept into an originally non-OOP language.</li>

</ol>

I think John Resig made javascript lovable again which is why he deserves my total gratitude.
