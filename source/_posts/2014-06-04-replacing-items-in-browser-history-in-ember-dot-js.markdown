---
layout: post
title: "Replacing items in browser history in Ember.js"
date: 2014-06-04 07:49
comments: true
categories: ember.js
---

One of the outstanding features of Ember.js is that all things related to URLs,
including going back and forth in browser history, just work. This is something
people got used to with "classical", server-side applications and that several
other client-side frameworks lack.

In this post, I am going to focus on a browser history feature, replacing
entries in it as users navigate between routes instead of adding to it.

### Navigating between routes in Ember

If either the `link-to` template helper or the route's `transitionTo` method is
used to move between routes (and thus URLs), a new entry is going to be added to
the browser's history. That is fine most of the time but sometimes the desired
behavior might be replacing the current entry.

Taking the example from the guide, if one is paging through the comments made on
a photo where each one has its own route, we probably do not want these comment
URLs to clutter the history. Similarly, we don't want the user to land on these
URLs when she hits the Back button in the browser.

### Using the link-to helper

All that needs to be done is adding the `replace=true` option to the `link-to` helper.

So if the link that takes you to the next comment is written like this:

{% highlight html %}
{% raw %}
{{link-to 'Next comment' 'photo.comment' nextComment}}
{% endraw %}
{% endhighlight %}

It should now become:

{% highlight html %}
{% raw %}
{{link-to 'Next comment' 'photo.comment' nextComment replace=true}}
{% endraw %}
{% endhighlight %}

### Transitioning from inside routes

The canonical way to go from one route to another is `route.transitionTo`. If
flipping between comments of a photo was implemented as an action in the route,
the action handler would have the following line:

```js
this.transitionTo('photo.comment', nextComment);
```

To make that replace the current history entry, this becomes:

```js
this.replaceWith('photo.comment', nextComment);
```

`replaceWith` takes the exact same parameters as `transitionTo`.

Curtain falls.

