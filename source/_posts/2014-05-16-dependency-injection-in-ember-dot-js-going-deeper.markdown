---
layout: post
title: "Dependency injection in Ember.js - Going deeper"
date: 2014-05-16 11:55
comments: true
categories: ember.js
---

In a previous post [I introduced the basic elements of Dependency Injection in
Ember][1] and showed how to set up a dependency on the objects it is needed on.
I also mentioned the framework itself uses this same mechanism to establish its
dependencies.

In this post, I'll expand on this latter. I'll point at where these dependencies are
set up which gives me the possibility to introduce the options of the
basic parts, `register` and `inject`.

I'll also share a couple of tricks to prevent using the abominable
`this.__container__` and finish by showing how these pieces fit together in the
main method of the container, `container.lookup`.

# How does Ember do it?

When an Ember app is created, the first thing it does is creating a container it
uses internally:

```js
var Application = Namespace.extend(DeferredMixin, {
  (...)
  init: function() {
    if (!this.$) { this.$ = jQuery; }
    this.__container__ = this.buildContainer();
    (...)
  },
  (...)
  buildContainer: function() {
    var container = this.__container__ = Application.buildContainer(this);

    return container;
  },
}
```
([link to soure code][2])

(Note: Here is where `App.__container__` gets set and thus you, as an application
developer has access to the underlying container. Notice the double underscores,
though. It tells you that you should not ever use that in "real" apps. There are
officially supported ways, public API methods to achieve whatever you strive to
achieve the forbidden way. It is sometimes enough [to ask on Twitter.][3])

Let's see how the container is built up (as usual, I cut out the parts that are
not relevant to the current subject):

```js
  buildContainer: function(namespace) {
    var container = new Container();

    (...)
    container.optionsForType('component', { singleton: false });
    container.optionsForType('view', { singleton: false });
    container.optionsForType('template', { instantiate: false });
    container.optionsForType('helper', { instantiate: false });

    container.register('application:main', namespace, { instantiate: false });

    container.register('controller:basic', Controller, { instantiate: false });
    container.register('controller:object', ObjectController, { instantiate: false });
    container.register('controller:array', ArrayController, { instantiate: false });
    container.register('route:basic', Route, { instantiate: false });

    container.register('router:main',  Router);
    container.injection('router:main', 'namespace', 'application:main');

    (...)

    container.injection('controller', 'target', 'router:main');
    container.injection('controller', 'namespace', 'application:main');

    container.injection('route', 'router', 'router:main');

    (...)

    return container;
  }
```
([link to source code][8])

The faithful reader knows from the [first part in the DI series][1] that the
above makes it so that e.g `this.namespace` points to the application in all controllers
or that `this.router` refers to the router in all routes.

Let's now turn out attention to the first definition block to learn new things.

### optionsForType

`optionsForType` is a comfortable way to define options that should be used when
looking up any instance of a particular type from the container.

It can be seen above that components and views are defined as non-singletons
which mean that any time a component or view is looked up on the container, a
new instance is created and returned.

I got me some code to prove it:

```js
App = Ember.Application.create();

var Artist = Ember.Object.extend();

Ember.Application.initializer({
  name: "setup",
  initialize: function(container, application) {
    container.optionsForType('model', { singleton: false });
    container.register('model:artist', Artist);
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    var artist1 = this.container.lookup('model:artist');
    var artist2 = this.container.lookup('model:artist');
    return [artist1, artist2];
  }
});

App.IndexController = Ember.ArrayController.extend({
  equal: function() {
    return this.get('firstObject') === this.get('lastObject');
  }.property('model.{firstObject, lastObject}')
});
```

If you then write a template for the index route that just displays the `equal`
property you'll see that its value is false, thus a new object is in fact
instantiated each time.

Here is [a link to the jsbin][4] if you would like to see it.

If you replace `{ singleton: false }` with `{ singleton: true }` the equal
property is going to be true, the model object is going to be a true singleton.

#### Singletons are the default

As Ember core team meber [Stefan Penner points out][5], the `{ singleton: true
}` option is the default, so there is no need to explicitly state it.

As a consequence, `container.register('store:main', Store, { singleton: true })`
is exactly the same as `application.register('store', Store)`.

#### Objects that come from the container can access it

I learned this from [Matthew Beale][7], a prolific Ember contributor and presenter.
It's well worth your time [to watch his presentation][6] on "Containers and
Dependency Injection" he gave at an Ember NYC meetup.

Amongst other useful stuff, he also reveals that all objects that come from the
container have access to it via a `container` property on them.

That allowed me to write `this.container.lookup` in the route above since routes
are created by the container, too.

This also does away with the need to use the private `__container__` in most
cases.

### To instantiate or not to instantiate

Above, in the code for `buildContainer` you can see another option,
`instantiate`, which is false for templates and helpers. To save you from
scrolling all the way up, here are the relevant lines:

```js
  container.optionsForType('template', { instantiate: false });
  container.optionsForType('helper', { instantiate: false });
```

This option permits the registration of entities (yeah, stuff) that do not need
to be instantiated (or cannot be). Templates and helpers fit the bill since
they are functions and thus cannot be instantiated.

### container.lookup

The lookup method in the container is a great summary for all the things discussed here.

``` js
function lookup(container, fullName, options) {
  options = options || {};

  if (container.cache.has(fullName) && options.singleton !== false) { // 1
    return container.cache.get(fullName);
  }

  var value = instantiate(container, fullName); // 2

  if (value === undefined) { return; }

  if (isSingleton(container, fullName) && options.singleton !== false) {
    container.cache.set(fullName, value); // 3
  }

  return value; // 4
}
```

First, if a singleton is needed and the object has already been looked up, we
just return the object saved in the cache. (see 1 above)

Next, we instantiate an object for the fullName (e.g 'controller:artists' or
'route:index'). The instantiate method takes care of just returning the value if
the `instantiate` option is set to false. (see 2 above)

If the instantiation was successful (the factory was found) and a singletion was
demanded, we set this value in the cache so that we can return it the next time
it is looked up. (see 3 above)

Finally, we return what was looked up. (see 4 above)

`container.lookup` just calls the above function after verifying the fullName
has the right syntax, that is it has a type and a name part joined together by
a `:`.

And that's where everything comes together.

[1]: http://balinterdi.com/2014/05/01/dependency-injection-in-ember-dot-js.html
[2]: https://github.com/emberjs/ember.js/blob/v1.6.0-beta.4/packages_es6/ember-application/lib/system/application.js#L263
[3]: https://twitter.com/mixonic/status/461595081607503872
[4]: http://emberjs.jsbin.com/zefuk/2/edit
[5]: http://balinterdi.com/2014/05/01/dependency-injection-in-ember-dot-js.html#comment-1386980817
[6]: https://www.youtube.com/watch?v=6FlWyOoo6hQ
[7]: http://madhatted.com/
[8]: https://github.com/emberjs/ember.js/blob/v1.6.0-beta.4/packages_es6/ember-application/lib/system/application.js#L826
