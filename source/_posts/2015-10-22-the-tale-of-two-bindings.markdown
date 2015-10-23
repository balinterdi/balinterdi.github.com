---
layout: post
title: "The tale of two bindings"
date: 2015-10-22 16:41
comments: true
categories: ember.js
perk: general-signup
---

<iframe
  width="178" height="24" style="border:0px"
  src="https://mixonic.github.io/ember-community-versions/2015/10/22/the-tale-of-two-bindings.html">
</iframe>

Two weeks ago I had a presentation called "Complex component design" at the
Global Ember Meetup.

When I had given the title and abstract of this presentation, I had wanted to
speak about how to implement more involved, nested components in Ember 2 (but
actually, more like 1.13+), which is a fascinating and complex (pun intended)
topic. I had something like a highly reusable autocomplete input component in
mind something that [I had decided to explore further][1].

When I sat down to think about it, I had realized there is a related and equally
fascinating topic, that of communication between components that live on the
same page. As everything is [soon becoming a component][2] in Ember, the two are
very similar. A difference is that communicating components in an app do not
need such a high degree of flexibility as a reusable component (like an Ember
addon). In any case, it does not hurt, since making them flexible facilitates
their reuse.

In this post, I'll show an example of simple component communication and focus
on how moving from two-way bindings to one-way bindings changes that. Spending
some time on playing around with this, I was very pleasantly surprised in what
this shift enables.

### The example

If you know me a bit, you'd expect the "app" to be Rock & Roll themed and
you'd be right. I reduced the app [in the book][3] to a very simple interface
where you can pick a band and then edit it on a form:

![Edit band on a form](/images/posts/tale-of-two-bindings/sketch.png)

In the remainder of the post, we'll see different implementations to achieve the
validation and saving of the band. There will be 3 scenarios: the traditional
one, using two-way bindings, the Glimmer version, using one-way bindings, DOM
events and Data Down, Actions up (DDAU) and finally 1WAY Deluxe&#8482;: adding a few
features on top of the second scenario that one-way bindings make easy (or
possible at all).

### Take 1: Traditional, two-way bound

Ignoring the list of bands on the left, the template belonging to the band
route, where the band can be edited, contains the band-form (on the right of the
screenshot), and some minimal markup. We pass in the band object, the `on-save` and the
`on-star-click` closure actions to the band form:

{% highlight html %}
{% raw %}
<div class="panel panel-default band-panel">
  <div class="panel-body">
    {{band-form band=model
                errors=errors
                on-save=(action "saveBand")
                on-star-click=(action "updateRating")}}
  </div>
</div>
{% endraw %}
{% endhighlight %}

The controller has these actions, sets up the errors object and contains the
validation logic. The `hasErrors` property will be true if the band's name is
empty:

{% highlight javascript %}
{% raw %}
import Ember from 'ember';

export default Ember.Controller.extend({
  hasValidName: Ember.computed.notEmpty('model.name'),
  hasErrors: Ember.computed.not('hasValidName'),

  setupErrors: Ember.on('init', function() {
    this.set('errors', Ember.Object.create());
  }),

  validate() {
    this.set('errors.name', this.get('hasValidName') ? null : "Name is required.");
  },

  actions: {
    updateRating(params) {
      const { item: band, rating } = params;
      band.set('rating', rating);
    },

    saveBand() {
      this.validate();
      if (this.get('hasErrors')) {
        return;
      }

      const band = this.get('model');
      return band.save().then(() => {
        console.log("Band is saved");
      });
    }
  }
});
{% endraw %}
{% endhighlight %}

Upon validation, the errors are set but this is only needed to be able to
show the error in the template. `this.get('hasErrors')` is already true if the
band's name is an empty string.

The missing piece is the `band-form` template:

{% highlight html %}
{% raw %}
<div class={{if errors.name "form-group has-error" "form-group"}}>
  <label for="band-name">Name</label>
  {{input type="text" class="form-control" id="band-name" value=band.name}}
</div>
<div class="form-group">
  <label for="band-year">Formed in</label>
  {{input type="text" class="form-control" id="band-year" value=band.year}}
</div>
<div class="form-group">
  <label for="band-rating">Rating</label>
  {{star-rating id="band-rating" item=band rating=band.rating on-click=on-star-click}}
</div>
<button type="submit" class="btn btn-primary pull-right" {{action "saveBand"}}>Submit</button>
{% endraw %}
{% endhighlight %}

It uses the `input` helper which established two-way bindings between the value
of the input and the property that was passed to it. When the user modifies the
input, `band.name` changes in sync. Since band in the component is the model of
the controller, the band name in the list changes as the name is edited:

![Two-way bindings in action](/images/posts/tale-of-two-bindings/two-way-bindings-in-action.gif)

In this scenario, communication between the top-level component (controller, if
you will) and the band form is quite blunt. As data is two-way bound, there is
no simple, "in-framework" way of not changing the name in the list when the name
on the form is modified. There is shared state and the components do not act via
messages: they pull two ends of the same string.

(In cases where you had to prevent that in the pre-Glimmer era, you had to resort
to using a separate property, like `band.newName`, or using [BufferedProxy][4].)

So let's take a step forwards and see how this can be improved.

### Take 2: One-way bound with DDAU

We'll first replace the two-way binding with a one-way one and manually
synchronize the upstream direction using DDAU. It will not seem like a big gain
but it will enable us to go further and attain 1WAY Deluxe&#8482;.

The top-level template only needs a slight change. We no longer pass in an
`on-star-click` action but instead an `on-update` one. This will serve for the
upstream synchronization, setting what changed in the component on the band
object (the model) of the controller.

{% highlight html %}
{% raw %}
<div class="panel panel-default band-panel">
  <div class="panel-body">
    {{band-form band=model
                errors=errors
                on-save=(action "saveBand")
                on-update=(action "updateBandProperty")}}
  </div>
</div>
{% endraw %}
{% endhighlight %}

In accordance, the only thing that has changed in the controller is that
the `updateStarRating` action has been replaced by `updateBandProperty`. This is
the manual syncing:

{% highlight javascript %}
{% raw %}
export default Ember.Controller.extend({
  (...)
  actions: {
    updateBandProperty(property, value) {
      this.get('model').set(property, value);
    },

    (...)
  }
});
{% endraw %}
{% endhighlight %}

In the template, the two-way bound `input` helpers are out, substituted by
regular input tags. We attach event listeners to them which will trigger the
synchronization proces (I wrote [a post][5] about how that works a few months ago):

{% highlight html %}
{% raw %}
<div class={{if errors.name "form-group has-error" "form-group"}}>
  <label for="band-name">Name</label>
  <input type="text" class="form-control" id="band-name" value={{band.name}}
    oninput={{action "nameDidChange" value="target.value"}} />
</div>
<div class="form-group">
  <label for="band-year">Formed in</label>
  <input type="text" class="form-control" id="band-year" value={{band.year}}
    oninput={{action "yearDidChange" value="target.value"}} />
</div>
<div class="form-group">
  <label for="band-rating">Rating</label>
  {{star-rating id="band-rating" item=band rating=band.rating on-click=(action "ratingDidChange")}}
</div>
<button type="submit" class="btn btn-primary pull-right" {{action "saveBand"}}>Submit</button>
{% endraw %}
{% endhighlight %}

`nameDidChange`, `yearDidChange` and `ratingDidChange` all end up calling the
passed in closure action, `on-update`, with the name of the property that has
changed and its new value. This calls `updateBandProperty` in the controller we
already saw:

{% highlight html %}
{% raw %}
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  band: null,
  errors: null,
  "on-update": null,
  "on-save": null,

  actions: {
    saveBand() {
      this.attrs['on-save']();
    },

    nameDidChange(value) {
      this.attrs['on-update']('name', value);
    },
    yearDidChange(value) {
      this.attrs['on-update']('year', value);
    },
    ratingDidChange(params) {
      const { rating } = params;
      this.attrs['on-update']('rating', rating);
    },
  }
});
{% endraw %}
{% endhighlight %}

From the outside, the app works just as before. The band name changes in the
list as we edit it in the text field:

![One-way bindings in action](/images/posts/tale-of-two-bindings/one-way-bindings-in-action.gif)

However, we know that under the hood our code took control of propagating data
changes. We have undone the string that kept the two sides (two components)
tied strongly together. In the third and final iteration, we'll leverage that to
move validation where it belongs and add a micro-feature.

### Take 3: 1WAY Deluxe&#8482;

Now, for the cool part. Now that we're free to change band-related properties on
the component without affecting the properties of the band object (the model of
the controller), we no longer have a shared state.

The first thing we'll do is to move the validation into the `band-form component`.
`band-form` will be also less chatty. It will only send property updates when
the form is submitted. That means we don't need to pass in the `errors` object
or an `on-update` action:

{% highlight html %}
{% raw %}
<div class="panel panel-default band-panel">
  <div class="panel-body">
    {{band-form band=model on-save=(action "saveBand")}}
  </div>
</div>
{% endraw %}
{% endhighlight %}

That implies that the controller can be really slimmed down to the `saveBand`
action:

{% highlight html %}
{% raw %}
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    saveBand(properties) {
      const band = this.get('model');
      band.setProperties(properties);

      return band.save().then(() => {
        console.log("Band is saved");
      });
    }
  }
});
{% endraw %}
{% endhighlight %}

Note how the input field values in the `band-form` template are now bound to
properties on the component as opposed to that of the passed in `band` object:

{% highlight html %}
{% raw %}
<div class={{if errors.name "form-group has-error" "form-group"}}>
  <label for="band-name">Name</label>
  <input type="text" class="form-control" id="band-name" value={{name}}
    oninput={{action "nameDidChange" value="target.value"}} />
</div>
<div class="form-group">
  <label for="band-year">Formed in</label>
  <input type="text" class="form-control" id="band-year" value={{year}}
    oninput={{action "yearDidChange" value="target.value"}} />
</div>
<div class="form-group">
  <label for="band-rating">Rating</label>
  {{star-rating id="band-rating" item=band rating=rating on-click=(action "ratingDidChange")}}
</div>
<div class="form-group button-panel">
  <button type="submit" class="btn btn-primary pull-right" {{action "saveBand"}}>Submit</button>
  <button type="button" class="btn btn-danger pull-right" {{action "reset"}}>Reset</button>
</div>
{% endraw %}
{% endhighlight %}

Little else has changed but a second button, Reset, already gives you a taste of
things to come. Let's see the component definition:

{% highlight javascript %}
{% raw %}
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  band: null,
  "on-save": null,

  name:    null,
  year:    null,
  rating:  null,
  errors:  null,

  // Validation code comes here, copied verbatim from the controller

  resetOnInit: Ember.on('init', function() {
    this.resetFromBand();
  }),

  resetFromBand() {
    ['name', 'year', 'rating'].forEach((field) => {
      const valueInBand = this.get('band').get(field);
      this.set(field, valueInBand);
    });
  },

  actions: {
    saveBand() {
      this.validate();
      if (this.get('hasErrors')) {
        return;
      }

      return this.attrs['on-save'](this.getProperties(['name', 'year', 'rating']));
    },

    nameDidChange(value) {
      this.set('name', value);
    },
    yearDidChange(value) {
      this.set('year', value);
    },
    ratingDidChange(params) {
      const { rating } = params;
      this.set('rating', value);
    },
    reset() {
      this.resetFromBand();
    }
  }
});
{% endraw %}
{% endhighlight %}

I cut out the code responsible for validation since that has just been brought
over from the controller.

The interesting stuff happens in `resetFromBand` which is both called when the
component comes to life and when the Reset button is clicked. It copies the
`name`, `year` and `rating` properties of the band onto those of the component,
effectively resetting them to their original value. That's the only reason we
still need to pass in the band object into the component.

Also notice how the `name` and the `rating` are not updated on the band object
as we interact with the form:

![1WAY Deluxe in action](/images/posts/tale-of-two-bindings/one-way-deluxe-in-action.gif)

Having the data validated by the form acts as a guard. The save action is only
triggered if the data was found to be valid. It is only then that the form's
data will overwrite that of the band object. Data flows both ways but in a very
controlled way.

To take this further, thanks to closure actions, we could even display an error in the `band-form`
component if the save operation fails on the controller:

{% highlight javascript %}
{% raw %}
export default Ember.Component.extend({
  (...)
  actions: {
    saveBand() {
      this.validate();
      if (this.get('hasErrors')) {
        return;
      }
      const properties = this.getProperties(['name', 'year', 'rating']);
      return this.attrs['on-save'](properties)
        .catch((error) => {
          this.set('errors.base', error.get('message'));
        });
    },

    (...)
  }
});
{% endraw %}
{% endhighlight %}

### Conclusion

I'm really excited and curious about how many things this makes possible. As I
said in my presentation, we're (but surely: I am) only figuring out both the
possibilities "managed" one-way bindings open up and the best way to work with
them. So if you have thoughts or insights, please do share them in the comments.

[1]: http://balinterdi.com/2015/09/10/complex-component-design-in-ember-intro.html
[2]: https://github.com/emberjs/rfcs/pull/38
[3]: http://rockandrollwithemberjs.com
[4]: https://github.com/yapplabs/ember-buffered-proxy
[5]: http://balinterdi.com/2015/08/29/how-to-do-a-select-dropdown-in-ember-20.html
