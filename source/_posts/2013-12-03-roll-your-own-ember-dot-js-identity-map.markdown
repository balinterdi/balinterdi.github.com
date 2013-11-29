---
layout: post
title: "Roll your own Ember.js identity map"
date: 2013-12-03 11:41
comments: true
categories: ember.js
---

If you followed along my [Build an Ember app screencast series][screencasts] and maybe
played around [with the app][episode-7-source] on your own, you might have
noticed a subtle bug in the application.

When you load the application on the `/artists/` route and then choose one of
the artists, the artist link gets highlighted correctly:

![Correct active highlight](/images/posts/roll-your-own-store/active-highlight-works.png)

However, when you reload the app on one of these artists routes (e.g
`/artists/pearl-jam`), the artist link does not get the active highlight:

![Incorrect active highlight](/images/posts/roll-your-own-store/active-highlight-does-not-work.png)

### Understanding what is wrong

The first step of any debugging process is to understand where the bug lies. In
order to do that we have to understand how highlighting a link as active works
in Ember.js.

I wrote about this topic in detail in [a guest post][marking-links-post] so let
me just quickly summarize it here.

The artist links are rendered using the `link-to` helper. When active routes
change (that includes the moment when the app is loaded from scratch) the
`isActive` property for each link is recomputed. If it is found to be
active, the activeClass is added to the view's tag and that enables it to be
displayed differently.

When is a link-to active? When its route name matches one of the current route
names. This is pretty straightforward for static links but what about dynamic ones
with context objects? In those cases, all the context objects have to match in
order for the link to be considered active.

Let's see our particular case. We have the following routes:

``` javascript
App.Router.map(function() {
  this.resource('artists', function() {
    this.route('songs', { path: ':slug' });
  });
});
```

And the following template that renders each artist link:

{% gist 7708568 %}

Each link is rendered with an artist object that comes from the model hook of
the `ArtistsRoute`:

``` javascript
App.ArtistsRoute = Ember.Route.extend({
  model: function() {
    var artistObjects = Ember.A();
    Ember.$.getJSON('http://localhost:9393/artists', function(artists) {
      artists.forEach(function(data) {
        artistObjects.pushObject(App.Artist.createRecord(data));
      });
    });
    return artistObjects;
  },
  (...)
});
```

So the artist object that serves as the context for the `artists.songs` link has
to be the exact same object as the one returned from the model hook of the
`ArtistsSongsRoute`:

``` javascript
App.ArtistsSongsRoute = Ember.Route.extend({
  model: function(params) {
    var artist = App.Artist.create();
    var url = 'http://localhost:9393/artists/' + params.slug;
    Ember.$.getJSON(url, function(data) {
      artist.setProperties({
        id: data.id,
        name: data.name,
        songs: App.Artist.extractSongs(data.songs, artist)
      });
    });
    return artist;
  },
  (...)
});
```

Are they identical? Well, intuitively they are but Ember.js does not care about
our intuition and so we should not, either. They are different objects since
both were created by calls to `App.Artist.create` (`App.Artist.createRecord`
calls `App.Artist.create` under the hood) which returns a new object
every time. Bummer.

### Merging intuition with reality

Don't be sad, it's not bad.

What we need is to have the same model object to be returned for the same
identifier. In the matter at hand, given an artist slug (that serves as an
identifier) we want to get back the same `App.Artist` object every time we use it.

If you think about it, that's what identity maps are for.

### Wiring it up with promises

The identity map needs to be able to retrieve objects and also store them. Most
importantly, it has to return the object from its map if it has already created
it with the passed in id.

I will dump the code below and then explain what it does:

``` javascript
App.IdentityMap = {
  map: {},
  findAll: function(type) {
    var identityMap = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.getJSON('http://localhost:9393/artists', function(artists) {
        var artistObjects = Ember.A();
        artists.forEach(function(data) {
          var artist = App.Artist.createRecord(data);
          identityMap.store('artist', artist.get('slug'), artist);
          artistObjects.pushObject(artist);
        });
        resolve(artistObjects);
      });
    });
  },

  find: function(type, id) {
    var identityMap = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var artist = identityMap.map[identityMap._key(type, id)];
      if (artist) {
        resolve(artist);
      } else {
        var url = 'http://localhost:9393/artists/' + id;
        Ember.$.getJSON(url, function(data) {
          var artist = App.Artist.create();
          artist.setProperties({
            id: data.id,
            name: data.name,
            songs: App.Artist.extractSongs(data.songs, artist)
          });
          identityMap.store('artist', id, artist);
          resolve(artist);
        });
      }
    });
  }
  (...)
}
```

As you can see, I used promises for the retrieval methods of the API.

Promises are a huge improvement over callbacks and deserve their own
<del>article</del> book. Promises represent eventual values that are going to be
either resolved (meaning success) or rejected (meaning failure) and can be
passed around freely.

Ember.js relies on promises heavily in its [routing API][routing-api] and uses
[the rsvp promise library][rsvp]. If a promise is returned from any `model` hook,
the route transition does not begin until [the promise is resolved][pause-on-promises].

That explains why I return promises from both the `findAll` and `find` methods.
I expect them to be used from the model hooks of the appropriate routes:

``` javascript
App.ArtistsRoute = Ember.Route.extend({
  model: function() {
    return App.IdentityMap.findAll('artist');
  },
  (...)
});

App.ArtistsSongsRoute = Ember.Route.extend({
  model: function(params) {
    return App.IdentityMap.find('artist', params.slug);
  },
  (...)
});
```

When I call `App.IdentityMap.findAll` from the `ArtistsRoute` the rendering of
the `artists` template is held up until the promise is resolved. That happens
when the AJAX call has returned with the data for all artists and I call
`resolve(artistObjects)`.

Next, the model hook for the `ArtistsSongsRoute` is evaluated. It returns a
promise that has to be resolved in order for the template to be rendered.

The artist is found in the identityMap because it has just been stored there
during the findAll in the previous model hook resolution (see the
`identityMap.store('artist', artist.get('slug'), artist);` line). Since it is
the same object that was used as the context for the artist link, the bug is
squashed.

The link now gets correctly highlighted as active:

![Active highlight fixed](/images/posts/roll-your-own-store/active-highlight-fixed.png)

Notice we achieved something else, too. Instead of firing two AJAX calls, one
to fetch all artists and then one to fetch the one serialized in the URL we now
only have one call. We eliminated the second one by returning the object from
the identity map.

Furthermore, I also think our code has become better organized. The models for
our routes have now become one-liners and can quickly be read and understood at
a casual glance instead of being buried under the minutiae of AJAX calls.

[screencasts]: http://emberjs.balinterdi.com
[episode-7-source]: https://github.com/balinterdi/rock-and-roll/releases/tag/episode-7
[marking-links-post]: http://blog.safaribooksonline.com/2013/10/29/marking-links-as-active-in-ember-js-markdown/
[routing-api]: http://emberjs.com/guides/routing/asynchronous-routing/#toc_a-word-on-promises
[rsvp]: https://github.com/tildeio/rsvp.js
[pause-on-promises]: http://emberjs.com/guides/routing/asynchronous-routing/#toc_the-router-pauses-for-promises
[ember-data]: https://github.com/emberjs/data

