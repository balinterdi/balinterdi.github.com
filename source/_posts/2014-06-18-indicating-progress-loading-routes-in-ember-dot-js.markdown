---
layout: post
title: "Indicating Progress - Loading Routes in Ember.js"
date: 2014-06-18 21:38
comments: true
categories: ember.js
---

When an Ember app is being loaded at first, the user sees a blank screen. When
transitioning between two routes and loading data to render for the destination
template, there is no indication that something is happening and thus the user can
be perplexed. Ideally, loading data happens fast enough so that users barely
notice the blank screen or freeze, but web apps do not always behave ideally.

If you have read some of my other articles on Ember, you will not be surprised
to hear that there is a splendid solution for this problem and that it is based
on a convention.

### Unresolved promises

The `model` hook of routes is the canonical place to fetch data needed
to render the corresponding template. When a promise is returned, execution is
blocked until that promise is resolved (or rejected). That is the period during
which the application seems unresponsive. When starting up the application,
this can even mean that the user only sees a blank screen. Since data is fetched
asyncronously, not even the spinner in the tab title is going to spin.

The user may just close the tab and go on with her life. We can't let that
happen and unsurprisingly Ember has a convention-based solution that is easy to
work with and customize.

### Beautiful, reusable conventions

[We saw][1] how each resource route (and thus each route level) creates an
outlet for the level below to render content in. Let's take a look at the routes
of the application to see how that plays out:

``` javascript
App.Router.map(function() {
  this.resource('artists', function() {
    this.resource('artist', { path: ':slug' }, function() {
      this.route('songs');
    });
  });
});
```

The outlet defined in the (top-level) application template is going to be filled
in by the content rendered by the first-level templates (in this case, `artists`).

{% highlight html %}
{% raw %}
<script type="text/x-handlebars">
  <div class="container">
    <div class="page-header">
      {{#link-to "index"}}
        <h1>Rock & Roll<small> with Ember.js</small></h1>
      {{/link-to}}
    </div>
    <div class="row">
      {{outlet}}
    </div>
  </div>
</script>
{% endraw %}
{% endhighlight %}

Next, the outlet in the `artists` template is populated by the routes below the
artists resource route:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artists">
  <div class="col-md-4">
    (list of artists)
  </div>
  <div class="col-md-8">
    <div class="list-group">
      {{outlet}}
    </div>
  </div>
</script>
{% endraw %}
{% endhighlight %}

The artist template also defines an outlet into which content is rendered by
the routes below the artist resource. In this case, there is no common markup
for a single artist so the template only defines the outlet:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artist">
  {{outlet}}
</script>
{% endraw %}
{% endhighlight %}

Finally, there is a single route defined below the `artist` resource, `artist.songs`:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artist/songs">
  (...)
  {{#each sortedSongs}}
    <div class="list-group-item">
      {{title}}
      {{star-rating ...}}
    </div>
  {{/each}}
  (...)
</script>
{% endraw %}
{% endhighlight %}

### Loading routes build on the nested routes pattern

The ingenious thing about indicating that loading data from the backend is
happening is that it leverages the "nested routes, nested templates"
architecture explained above.

When the model hook of a certain route returns a promise that is not resolved, a
so-called loading template **at the same level as the route** is going to be
rendered.

When loading the list of artists in the `artists` route, a loading route at the
same level is going to be activated. That, by default, means a top-level loading
template is rendered.

Consequently, all we need to do is to put into that template what we want the user to see
while data is being fetched. Currently that is what she sees in that scenario:

![Loading indication before](/images/posts/loading-routes/top-level-loading-indication-before.png)

You think we can beat that?

### Top-level loading template

The convention says that the loading route (and thus template) should be the
sibling of the route we define it for and should be called `loading`.

The loading template for the `artists` route should consequently be called
`loading`:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="loading">
  <div class="loading-pane">
    <div class="loading-message">
      Loading stuff, please have a cold beer.
      <div class="spinner"></div>
    </div>
  </div>
</script>
{% endraw %}
{% endhighlight %}

Let's inspect what our app looks like while loading data from the backend:

![Loading indication before](/images/posts/loading-routes/top-level-loading-indication-after.png)

Nice, but it gets nicer still.

### Loading route for the songs

We can now descend a couple of levels and make a loading template for when the
songs of a certain artist are being fetched.

Let's take a look at the "routing table" to see what that template should be
named:

```js
App.Router.map(function() {
  this.resource('artists', function() {
    this.resource('artist', { path: ':slug' }, function() {
      this.route('songs');
    });
  });
});
```

The loading route should be the sibling of the route under consideration.

In this particular case, this latter is `artist.songs` and thus the loading
template should be named `artist.loading`:

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="artist/loading">
  <div class="loading-pane">
    <div class="loading-message">
      Loading the artist, please have an organic orange juice.
    </div>
    <div class="spinner"></div>
  </div>
</script>
{% endraw %}
{% endhighlight %}

![Indicating loading artist](/images/posts/loading-routes/artist-loading-indication.png)

### Customizing loading route behavior

More precisely, what happens when entering a route where one of the model hooks
returns an unresolved promise is that a `loading` event is fired on the
route.

We saw above that the default implementation is to look up a route at the same
level as the route itself and render the corresponding template.

However, this behavior is customizable. For example, we can pop up an alert box
in 1993-style, telling the user she needs to wait.

Below, I do that for the top-level `artists` route:

```js
App.ArtistsRoute = Ember.Route.extend({
  model: function() {
    return someDataThatTakesTooLongToFetch();
  },

  (...)
  actions: {
    loading: function() {
      alert("Loading data, go make some coffee.");
    }
  }
});
```

It works:

![1993-style loading indication](/images/posts/loading-routes/top-level-loading-with-alert.png)

Another thing we can do is to render another loading template:

```js
App.LoadingRoute = Ember.Route.extend({
  renderTemplate: function() {
    this.render('working');
  }
});
```

{% highlight html %}
{% raw %}
<script type="text/x-handlebars" data-template-name="working">
  <div class="loading-pane">
    <div class="loading-message">
      I work hard while you play hard.
      <div class="spinner"></div>
    </div>
  </div>
</script>
{% endraw %}
{% endhighlight %}

Which also just works:

![Rendering a different template](/images/posts/loading-routes/top-level-different-template.png)

Since handling the loading state happens in the route, the most powerful piece
of Ember architecture, the possibilities are many.

### Why I love this solution and why you should, too

In summary, let's see what Ember's solution of indicating the loading of data
brings to the table:

1. It uses a convention to eliminate boilerplate and spare you from having to
   come up with your own solution.
1. It allows different markup and text for the different "slow" parts. By
   default, each loading template will be rendered exactly where the data would
   be rendered.
1. If this default behavior does not suit your taste or needs, there are several
   ways to tweak it, in well-defined ways.

*Note: The latest version of the code that contains these changes is [available on Github][2].*

[1]: /2014/02/26/a-common-resource-route-pattern-in-ember-dot-js.html
[2]: https://github.com/balinterdi/rock-and-roll/releases/tag/loading-routes
