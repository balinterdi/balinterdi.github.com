---
layout: post
title: "A common resource route pattern in Ember.js"
date: 2014-02-26 00:01
comments: true
categories: ember.js
---

## Intro

A very common pattern in web applications, be them server- or client side, is
resource URLs. We might have a list of users that we want to show at `/users` and
then different pages related to the user which is encoded in the URL. These
might be e.g `/users/dave-hopkins/activity` and `/users/dave-hopkins/followers`.

The pattern is a top-level URL to list all the resource instances, and then
separate pages to display pieces of information regarding specific resource
instances.

## Artists and songs

That's exactly what I did for the [the Rock & Roll application][rr-end-of-screencasts],
where the routes were defined as such:

``` js
App.Router.map(function() {
  this.resource('artists', function() {
    this.route('songs', { path: ':slug' });
  });
});
```

The simplest thing that works. However, the above is not ideal especially when
more pages (or views, if you will) are added below the `artists` resource route.
That's because the singular artist instance is encoded in the `songs` route, by
having its identifier (in this case, slug) in the path of that route.

Imagine we need to add additional info about each band. Just blindly extending
the above URL scheme, this would become:

``` js
App.Router.map(function() {
  this.resource('artists', function() {
    this.route('songs', { path: ':slug/songs' });
    this.route('info',  { path: ':slug/info' });
  });
});
```

The cracks start to show. The artist for both the `artists.songs` and the
`artists.info` routes would have to be fetched in both routes, with identical
code. Nested routes -and how it lends itself to a nested UI- is truly
a masterpiece, a shining emerarld on Ember's crown. It would be a pity not to
take advantage of it.

## DRY up those routes

So we established that the problem is having the artist "encoded" in all routes
below the top-level `artists` resource. The solution is consequently pretty
straightforward -this always seems to be the case in retrospective-, let's
extract the path segment that represents the artist:

``` js
App.Router.map(function() {
  this.resource('artists', function() {
    this.resource('artist', { path: ':slug' }, function() {
      this.route('songs');
    });
  });
});
```

With the introduction of the `artist` resource, the duplication is gone, but we
are not done yet. First, we have to define the route and set up its model hook.
Second, since the "routing table" has changed, we'll have to adjust route names
and code that uses them. Since the naming conventions in Ember have the route
names as their basis, we'll probably have to change code in several places.

## Route changes

Resource routes reset the routing namespace, so the route that corresponds to
the `artist` route name in the table is App.ArtistRoute:

``` js
App.ArtistRoute = Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.Promise(function(resolve, reject) {
      App.Adapter.ajax('/artists/' + params.slug).then(function(data) {
        resolve(App.Artist.createRecord(data));
      }, function(error) {
        reject(error);
      });
    });
  }
});
```

That is exactly what we had for `App.ArtistsSongsRoute` in the previous version,
which makes sense. The artist is now fetched one route level higher.

For simple, non-resource routes, the name of the route is the name of the
resource route above (if it exists) plus the name of the route itself. In this
case, the route name is `artist.songs` which gets resolved as
`App.ArtistSongsRoute`):

``` js
App.ArtistSongsRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('artist').get('songs');
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('artist', this.modelFor('artist'));
  },
  (...)
});
```

The first interesting thing is `modelFor`. It gets the model for another,
already resolved route. In Ember route models are resolved stepping down
from the top-level application route. That means that at this point we can be
certain that the `artist` route already has its model, the artist instance
resolved.

The model of this route is simply the songs belonging to that artist.

The other interesting bit is `setupController`. We have already [come across this
hook before][real-time-updates-with-discourse]; it is the place to do additional
setup -above fetching the model and deciding which template to render- for the
controller. Since we'll want to display artist-related data in the template, we
store it in an `artist` property and we make sure to call `_super`, the
implementation of this hook in `Ember.Route`, that sets the controller's model
property to the model argument in this method.

## Templates & controllers

The mechanical part of the routing update is to replace all occurrences of
the `artists.songs` route name to `artist.songs`.

What deserves more attention is that the controller for `artist.songs` now has
the songs of the artist as its model, not the artist itself. That means that we
should adjust the controller type it extends:

```js
App.ArtistSongsController = Ember.ArrayController.extend({
  artist: null,

  newSongPlaceholder: function() {
    return 'New ' + this.get('artist.name') + ' song';
  }.property('artist.name'),

  songCreationStarted: false,
  canCreateSong: function() {
    return this.get('songCreationStarted') || this.get('length');
  }.property('songCreationStarted', 'length'),

  (...)
});
```

All changes are made necessary by the model change. Properties of the artist now
need to be prefixed by `artist` (e.g `name` => `artist.name`) while properties of the
songs no longer need to have the `songs` prefix since it is the model (e.g
`songs.length` => `length`).

This also holds true of the template. To give an example, rendering the
stars for each song can becomes more concise:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artist/songs">
  (...)
  {{#each}}
    <div class="list-group-item">
      {{title}}
      {{star-rating item=this rating=rating maxRating=5 setAction="setRating"}}
    </div>
  {{else}}
  (...)
</script>
{% endraw %}
{% endhighlight %}

The #each helper, without parameters, loops through the items in the model of the
template, in our case, the songs, which is exactly what we want.

That wraps up our route sanitizaion. In the next post, we will take advantage of
the benefit that the `songs` route now has the artist's songs as its model.

[rr-end-of-screencasts]: https://github.com/balinterdi/rock-and-roll/releases/tag/episode-7
[real-time-updates-with-discourse]: http://balinterdi.com/2014/01/14/how-real-time-updates-work-in-discourse.html
