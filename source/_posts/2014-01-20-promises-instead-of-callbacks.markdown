---
layout: post
title: "Promises instead of callbacks"
date: 2014-01-21 23:30
comments: true
categories: ember.js
---

A few weeks ago [I built up a very simple identity map][identity-map-post] to
get rid of a bug in highlighting active links. I introduced promises in order to
leverage the fact that Ember.js blocks in model hooks until the model is
resolved (or rejected).

In this post, I am taking a step back, and converting all the ajax calls that
fetch data from and store data to the backend to use promises. I am also going
to extract the most basic adapter that exists, just to do away with the
repetition in the XHR calls. Once I have these in place, I will able able to
build nice features on top of that.

### App.TheMostBasicAdapterThereIs

All calls go to the same backend and talk in json so these can be trivially
extracted:

``` js
App.Adapter = {
  ajax: function(path, options) {
    var options = options || {};
    options.dataType = 'json';
    return Ember.$.ajax('http://rock-and-roll-api.herokuapp.com' + path, options)
  }
}
```

With that out of the way, we can see where these were used, and replace
`Ember.$.ajax` with `App.Adapter.ajax`. In the process we are also going to
convert the callback-style code to use promises, a worthwhile
transformation.

### Don't call me back, promise me you'll be there

Here is what the code for fetching all the artists from the API looks like after
applying the adapter change:

``` js
App.ArtistsRoute = Ember.Route.extend({
  model: function() {
    var artistObjects = [];
    App.Adapter.ajax('/artists', {
      success: function(artists) {
        artists.forEach(function(data) {
          artistObjects.pushObject(App.Artist.createRecord(data));
        });
      }
    });
    return artistObjects;
  },
  (...)
});
```

Notice that the model initially is an empty array and only when the ajax call
returns successfully does that array get filled up and the template rerendered.
Not a big deal in itself, but if in a child route we rely on the array
containing all the artists (e.g when looking up the identity map or using
[modelFor][modelFor]), we can be bitten by the async bug. Promises to the
rescue.

As I mentioned in the [identity map post][identity-map-post], if a promise is
returned from a model hook, Ember.js will block until the promise is resolved
(or rejected). Let's follow in Ember.js footsteps and convert the above code to
return a promise:

``` js
App.ArtistsRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.Promise(function(resolve, reject) {
      App.Adapter.ajax('/artists').then(function(artists) {
        var artistObjects = [];
        artists.forEach(function(data) {
          artistObjects.pushObject(App.Artist.createRecord(data));
        });
        resolve(artistObjects);
      }, function(error) {
        reject(error);
      });
    });
  },
  (...)
});
```

We wrap the promise returned from the `App.Adaptar.ajax` call in another promise,
which resolves with artist objects instead of the raw data that is returned by
the API. In the rejection handler, we pass along any potential error responses
by rejecting with the same error that we got.

Next, we do the same thing in the child route. We go from here:

``` js
App.ArtistsSongsRoute = Ember.Route.extend({
  model: function(params) {
    var artist = App.Artist.create();
    App.Adapter.ajax('/artists/' + params.slug, {
      success: function(data) {
        artist.setProperties({
          id: data.id,
          name: data.name,
          songs: App.Artist.extractSongs(data.songs, artist)
        });
      }
    });
    return artist;
  },
  (...)
});
```

To here:

``` js
App.ArtistsSongsRoute = Ember.Route.extend({
  model: function(params) {
    return Ember.RSVP.Promise(function(resolve, reject) {
      App.Adapter.ajax('/artists/' + params.slug).then(function(data) {
        resolve(App.Artist.createRecord(data));
      }, function(error) {
        reject(error);
      });
    });
  },
  (...)
});
```

To get the "100% promisified" seal, we'll transform the create calls, too. I'll
only show the one to create an artist since creating a song is the same.

``` js
createArtist: function() {
  var name = this.get('controller').get('newName');

  App.Adapter.ajax('/artists', {
    type: 'POST',
    data: { name: name },
    context: this
  }).then(function(data) {
      var artist = App.Artist.createRecord(data);
      this.modelFor('artists').pushObject(artist);
      this.get('controller').set('newName', '');
      this.transitionTo('artist.songs', artist);
  }, function(reason) {
    alert('Failed to save artist');
  });
}
```

Here, there is not that much of a difference, the success and error callbacks
are replaced by fulfillment and rejection handlers.

The source code with these changes can be got [here][source-code].

### Further studies & posts

You can acquire a deeper knowledge about promises by reading Domenic Denicola's
["You're missing the point of promises"][dd-promises] post and using that as a
base for further exploration. Steven Kane's excellent [promise-it-wont-hurt package][piwh]
makes you solve increasingly difficult challenges with promises, which is the best way to learn.

Promisifying all backend calls sets the stage for other routing-related
improvements. Stay tuned for more.

[identity-map-post]: http://balinterdi.com/2013/12/03/roll-your-own-ember-dot-js-identity-map.html
[modelFor]: https://github.com/emberjs/ember.js/blob/v1.3.0/packages/ember-routing/lib/system/route.js#L997-1012
[source-code]: https://github.com/balinterdi/rock-and-roll/releases/tag/promisified
[dd-promises]: http://domenic.me/2012/10/14/youre-missing-the-point-of-promises/
[piwh]: https://npmjs.org/package/promise-it-wont-hurt
