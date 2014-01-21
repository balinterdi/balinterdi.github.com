---
layout: post
title: "Changing the URL type of your Ember.js app"
date: 2013-12-17 09:32
comments: true
categories: ember.js
---

By default, Ember.js uses the hashchange event in the browser to change URLs.
This is the most widely supported way but it feels like a hack and there is a
better way, introduced in HTML5: [the History API][history-api].

Bear in mind that the [History API has a lower browser support
rate][history-api-browser-support] than [the hashchange
event][hashchange-browser-support] does (~70% vs.  89%), so there is a tradeoff
involved that you should decide to make or not to make.

Ember.js makes it really easy to change the URL type. All you have to do is
add the following lines to your client app:

``` javascript
App.Router.reopen({
 location: 'history'
});
```

Seems too good to be true (that is just the way Ember is), but provided you did
not assemble any routes manually and only used Ember's tools to transition
between routes (e.g link-to, transitionTo, etc.), that is all the client-side
code changes you had to make.

The server side needs to be adjusted, too, though, since the server now gets
sent the client-side routes, too. How to do this can vary depending on the
application server you use.

In the case of the Rock & Roll app, here is what `config.ru` looks like:

``` ruby
run Proc.new { |env|
  # Extract the requested path from the request
  path = Rack::Utils.unescape(env['PATH_INFO'])
  if path.start_with?("/artists")
    path = '/'
  end
  index_file = @root + "#{path}/index.html"

  if File.exists?(index_file)
    # Return the index
    [200, {'Content-Type' => 'text/html'}, [File.read(index_file)]]
  else
    # Pass the request to the directory app
    Rack::Directory.new(@root).call(env)
  end
}
```

I only had to add the `path.start_with?` condition to make sure the server
serves the Ember application on that route. It is not an ideal solution because
anytime you add a top-level route to the Ember app, you would also have to
modify the server config but this is the bare minimum that got the job done.

Hooray for clean URLs:
![History API
URLs](/images/posts/change-the-url-type/rock-and-roll-history-api-urls.png)

[history-api]: http://diveintohtml5.info/history.html
[history-api-browser-support]: http://caniuse.com/history
[hashchange-browser-support]: http://caniuse.com/hashchange
