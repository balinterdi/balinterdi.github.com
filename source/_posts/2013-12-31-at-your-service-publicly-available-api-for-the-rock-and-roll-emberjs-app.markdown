---
layout: post
title: "At Your Service: Publicly Available API for the Rock and Roll Ember.js App"
date: 2013-12-31 09:38
comments: true
categories: emberjs
---

So far, if you wanted to code along [my developing an example Ember.js
application][mailing-list], Rock & Roll, you had to run the server side
component. That required ruby to be installed on your machine, and you had to
[clone the repository][api-repo], and start the server each time you wanted to
make some progress with the application.

I realized that might be cumbersome and thus I made the server publicly
available at [http://rock-and-roll-api.herokuapp.com][api-root].

I have also updated [the client-side component to connect to that remote
api.][client-commit]. All backend requests now go through App.Adapter.ajax which
basically just delegates to `Ember.$.ajax` prefixing urls with the backend host:

``` javascript
App.Adapter = {
  ajax: function(path, options) {
    return Ember.$.ajax('http://rock-and-roll-api.herokuapp.com' + path, options)
  }
}
```

If you work with an earlier version of the client app, you might have to
rewrite urls in multiple places but I figured it is still less work than running
the server yourself.

I hope that facilitates your working along with the Rock & Roll app and makes
your journey to Ember.js proficiency smoother. If you want to see the
screencast series in which I develop said application, you can [sign up to my
mailing list][mailing-list] and have each episode auto-delivered to your inbox.

[mailing-list]: http://emberjs.balinterdi.com
[api-repo]: https://github.com/balinterdi/rock-and-roll-api
[api-root]: http://rock-and-roll-api.herokuapp.com/
[client-commit]: https://github.com/balinterdi/rock-and-roll/commit/remote-api
