---
layout: post
title: "Dependency injection in Ember.js - First steps"
date: 2014-05-01 08:38
comments: true
categories: ember.js
---

Dependency injection (DI) is a less-known, yet powerful feature of the framework
we know and love called Ember.js. It works through the container and is
comprised of two parts: _registration_ and _injection_.

The framework itself uses it so that the objects instantiated through the
container have the dependencies correctly initialized on them (for the
theoretical programmers out there, the Ember DI system is thus probably
considered a construction-time DI). The API methods are exposed to application
developers for them to register and inject their own objects.

In this first blog post, I'll introduce the main concepts. In a couple of
further blog posts I intend to dig deeper, give examples of what it can be used
for and show a few gotchas.

### Step 1 - Registration

To be able to inject an entity onto others it first has to be registered on the
container. Think of the container as the birthplace of objects in Ember. It
knows how to instantiate objects and look up factories by their name.

Throughout the post, I'll use the example of a store. If you have worked with
ember-data, the store is the principal piece. It creates model objects and
finds them by their type, id or other criteria so you probably want it to be
accessible from routes and controllers alike.

If you have not come through such a store, don't despair. It is but a handy example to
illustrate dependency injection and how it works for a singleton object.

Let's assume we have a reference to the store "class" in a variable called
`store`. To register said store, we write the following:

```js
Ember.Application.initializer({
  name: "store",

  initialize: function(container, application) {
    container.register('store:main', store, { singleton: true });
  }
});
```

The container now knows the store by the name `store:main`. That is the name it
has to be referred by subsequently. The `singleton: true` option
instructs the container not to instantiate a new object each time but use a
singleton instead.

### Step 2 - Injection

Once the object/factory is registered, it can be used on other objects in the
application. As mentioned above, a store is best used from controllers and
routes. So let's inject them there:

```js
Ember.Application.initializer({
  name: "injectStore",
  before: "store",

  initialize: function(container, application) {
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
});
```

The main method, `application.inject` takes as its first argument the object(s)
where we want the injection to happen, then the injected name and then the name
of what should be injected. The "what should be injected" has to be the same
name we had registered the object previously with.

The first parameter, `controller` and `route` define what is called a type
injection. This means the injected name will be available on all instances of
the type, all controllers and routes in this case. The injected name is `store`
and it refers to a single instance of the store class since that's how we
defined it at registration time.

We could also just define a simple injection. In a somewhat hypotethical
example, let's assume we only need the store on the artists route.  We write the
following to achieve that:

```js
Ember.Application.initializer({
  name: "injectStore",
  before: "store",

  initialize: function(container, application) {
    application.inject('route:artists', 'store', 'store:main');
  }
});
```

### Step 3 - Putting the two pieces together

Let's say we want to create an artist object in a route and that creating
objects happens through the store (as it does in ember-data, e.g). The following
snippets set up the injection:

```js
Ember.Application.initializer({
  name: "store",

  initialize: function(container, application) {
    container.register('store:main', App.Store, { singleton: true });
  }
});

Ember.Application.initializer({
  name: "injectStore",
  before: "store",

  initialize: function(container, application) {
    application.inject('route', 'store', 'store:main');
  }
});
```

This makes the singleton instance of the store available on all routes of the
application so we could, for example, write this:

```js
App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('artist');
  }
});
```

I also [created a jsbin][1] to show this in action, although admittedly there is
little action at this point.

### Why DI?

This is all fine and dandy, but what problems does dependency injection solve?
First and foremost, it decouples the pieces of your application. Dependencies
are not hardcoded but injected at construction time. This makes your components
easier to use together since pieces can be swapped in and out as needed.

It is also the de facto way of adding the objects that are not provided by
Ember.js to your application. The store is an example of such an object but you
can also add analytics integration, a pool of workers and other fancy things
easily.

An added benefit is improved unit testing since you can inject mocks as
cooperators and verify calls made on those.

We are going to look at other aspects of DI in Ember.js in more detail in a next
post. Stay tuned and prepare your mojitos.

[1]: http://emberjs.jsbin.com/tufoy/2/edit?html,js,output
