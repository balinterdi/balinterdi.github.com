---
layout: post
title: "Refactoring Promise Patterns"
date: 2016-10-05 09:22
comments: true
categories: ember.js, javascript
perk: general-signup
---

I'm sure you have written a lot of code that looks something like this:

```js
// app/controllers/band.js
actions: {
  save() {
    let band = this.get('model');
    this.set('isLoading', true);
    return band.save()
      .then((result) => {
        this.set('successMessage', 'Band has been saved.');
      })
      .catch(() => {
        this.set('error', 'Band is too unruly to be saved.');
      })
      .finally(() => {
        this.set('isLoading', false);
      });
  }
}
```

Setting back `isLoading` to false is conveniently placed in a `finally` handler
so that it happens both if the promise resolves successfully (the band is
saved) and if it is rejected (there is an error during the save).

The `isLoading` is then used in the corresponding template to show a spinner
and/or disable the save button while the save is in flight:

{% highlight html %}
{% raw %}
// app/templates/band.hbs
<button type="button" onclick=(action "save") disabled={{isLoading}}>Save band</button>
{% endraw %}
{% endhighlight %}

I know I have written this hundreds of times by now and it has increasingly
disturbed me that setting and unsetting the loading flag is boilerplate code,
something that could be refactored.

One nice thing about promises is that they are easy to compose. Here is how
we could define a function that adds the boilerplatey parts:

```
// app/controllers/band.js

function doWithLoadingFlag(operation, loadingProperty) {
  this.set(loadingProperty, true);
  return operation.finally(() => {
    this.set(loadingProperty, false);
  });
}

actions: {
  save() {
    let band = this.get('model');
    return saveWithLoadingFlag.call(this, band.save(), 'isLoading')
      .then((result) => {
        this.set('successMessage', 'Band has been saved.');
      })
      .catch(() => {
        this.set('error', 'Band is too unruly to be saved.');
      });
  }
}
```

You might go a tiny step further and use a default value for the loading flag:

```js
// app/controllers/band.js

function doWithLoadingFlag(operation, loadingProperty='isLoading') {
  this.set(loadingProperty, true);
  return operation.finally(() => {
    this.set(loadingProperty, false);
  });
}

actions: {
  save() {
    let band = this.get('model');
    return saveWithLoadingFlag.call(this, band.save())
      .then((result) => {
        this.set('successMessage', 'Band has been saved.');
      })
      .catch(() => {
        this.set('error', 'Band is too unruly to be saved.');
      });
  }
}
```

Since `doWithLoadingFlag` returns a promise, we can add our own handlers to it,
including other `finally` handlers.

You can find a working example [here](https://ember-twiddle.com/54db7a0a708afe3cf59bfa634f1c3a06?numColumns=2&openFiles=controllers.application.js%2Ctemplates.application.hbs),
where you can play around with it.
