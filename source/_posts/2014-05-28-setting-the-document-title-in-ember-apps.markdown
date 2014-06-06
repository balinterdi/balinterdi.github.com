---
layout: post
title: "Setting the document title in Ember apps"
date: 2014-05-28 07:27
comments: true
categories: ember.js
---

The document title serves as a quick and concise way to identify web pages. It
gets displayed in search results and bookmarks and allows the user to see at a
glance what content she has open in each tab.

Therefore it is important to have descriptive document titles in our web
applications, whether they get rendered on the backend or set in the client app.

In the following short post, I'll focus on showing how to do that with Ember.

### Setting the title property

The way to set the document title from the browser is to just assign a
value to the `title` property of the document:

```js
document.title = "1 mind-blowing way to set the title for your html document";
```

Or, from jQuery:

```js
$(document).attr('title',"1 mind-blowing way to set the title for your html document");
```

### Having context-aware titles

For our document titles to be really useful, it would be great to have some
kind of information from the page's content be reflected in them.

To use [my favorite example app, Rock & Roll][1], I expect the page that
displays songs from a certain artist to have a segment that is common across all
pages in the app and another segment that uniquely identifies that page. For
songs of Led Zeppelin, this could be `Led Zeppelin songs - Rock & Roll with
Ember.js`.

I choose to put the unique part first so it can be clearly seen in a tab even if
its width is limited.

### Finding the best place for setting the title

When considering where to implement setting the title, we have to keep in mind
that the code has to run at each route transition so that the title for the new
page is correctly set. Also, the context of the page (in the above example, the
artist Led Zeppelin) already has to be known.

Considering these constraints, the title could be set either in the
`afterModel` or in the `setupController` hook. The controller instance is not
needed for setting the title so I'll go with the `afterModel` hook.

For the `artists` route, we content ourselves with setting a static title and we
can thus focus on the `artist.songs` route:

```js
App.ArtistSongsRoute = Ember.Route.extend({
  (...)
  afterModel: function(model) {
    var artistName = this.modelFor('artist').get('name');
    $(document).attr('title', artistName + ' songs - Rock & Roll');
  }
});
```

If we now navigate to the songs page for any artist, we can see the name of the
artist reflected in the tab title:

![Artist name in tab title](/images/posts/set-document-title-in-ember/see-artist-in-tab-title.png)

*NOTE: Jonathan Evans has [a great post][2] in which he uses the `didTransition`
action in routes to set the document title. I recommend you to read it.*

[1]: https://github.com/balinterdi/rock-and-rol://github.com/balinterdi/rock-and-roll
[2]: http://www.jrhe.co.uk/setting-the-document-title-in-ember-js-apps/

