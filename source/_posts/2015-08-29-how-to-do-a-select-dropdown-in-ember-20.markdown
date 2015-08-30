---
layout: post
title: "How to do a select (dropdown) in Ember 2.0?"
date: 2015-08-29 17:43
comments: true
categories: ember.js
---
<iframe
  width="178" height="24" style="border:0px"
  src="https://mixonic.github.io/ember-community-versions/2015-08-29-how-to-do-a-select-dropdown-in-ember-2-0.html">
</iframe>

When the select view was about to be removed from Ember, a lot of people
-myself included- wondered how it was going to be replaced. My bet was on a
'select component', after all, views should be transformed into components, right?

Then I saw [this gist][1] from Edward Faulkner:

{% highlight html %}
{% raw %}
<select onchange={{action (mut vehicle) value="target.value"}}>
  {{#each vehicles as |vehicleChoice|}}
    <option value={{vehicleChoice}} selected={{eq vehicle vehicleChoice}}>{{vehicleChoice}}</option>
  {{/each}}
</select>
{% endraw %}
{% endhighlight %}

I did not understand half of it, so I dug down to see how the pieces come
together. In this short post, I want to explain what I have found out.

### Solve a simpler problem

A great mathematician, George Polya, wrote a book in 1945 called ["How to Solve It"][2],
in which he puts down a framework for solving mathematical problems. One
(probably more) of his recommendations can be applied to software development,
too: Solve a simpler problem.

Heeding this advice, we'll first tackle a more mundane problem and in the
second round, we'll solve the original riddle.

Let's assume Edward had written the following:

{% highlight html %}
{% raw %}
<select onchange={{action "selectVehicle" value="target.value"}}>
  {{#each vehicles as |vehicleChoice|}}
    <option value={{vehicleChoice}} selected={{eq vehicle vehicleChoice}}>{{vehicleChoice}}</option>
  {{/each}}
</select>
{% endraw %}
{% endhighlight %}

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  vehicle: null,
  vehicles: Ember.w('Tesla Chrysler Toyota'),
  actions: {
    selectVehicle(vehicle) {
      this.set('vehicle', vehicle);
    }
  }
});
```

This is easier (as in: more familiar) but there are still a few things that
might need explanation. First, before 1.13.3, event listeners on browser
events could not trigger Ember actions like that:


{% highlight html %}
{% raw %}
<select onchange={{action "selectVehicle" value="target.value"}}>
{% endraw %}
{% endhighlight %}

What this does, is that when the selected value of the dropdown changes, it
fires the onchange listener we added on the `<select>` which results in calling
our action handler, `selectVehicle`. The handler just updates the `vehicle`
property of the controller. This will mark as selected the dropdown option the
user picked due to the {% raw %}`selected={{eq vehicle vehicleChoice}}`{% endraw %} term.

(`eq` comes from a great little Ember addon called [ember-truth-helpers][3]. It
returns true if the two parameters are equal).

Since there is no two-way binding set up between the selected option of the
dropdown and the controller property (`vehicle`), this needs to be done using a
DOM event listener (`onchange`) and updating in the action handler. That's
exactly what happens in the `selectVehicle` action handler.

So far so good, let's move on.

### Solve the original one

Wait a minute. How did `selectVehicle` receive the selected vehicle choice (e.g
Toyota) when the {% raw %}`{{action}}`{% endraw %} helper did not specify any parameters?

When the browser calls an event listener, it passes it an event object which
would become the first parameter of `selectVehicle`. However, `selectVehicle`
does not receive the event but the actual value of the selected option, how does
that come about? The missing link is a lesser-known option of the `action`
helper, `value`. The property passed to it is read off of the first parameter of
the handler and then replaces it. In our example, `target.value` is looked up on
the event object, which is exactly the value of the select option that triggered
the `onchange` event.

Ok, only one thing left.

The original example had this line:

{% highlight html %}
{% raw %}
<select onchange={{action (mut vehicle) value="target.value"}}>
{% endraw %}
{% endhighlight %}

instead of the more familiar:

{% highlight html %}
{% raw %}
<select onchange={{action "selectVehicle" value="target.value"}}>
{% endraw %}
{% endhighlight %}

What mut does here is that it allows updating the passed property, so when the
action is called, `vehicle` is set to the passed value, the value of the
selected option. That is it, we solved the riddle.

The same implementation pattern can be used to update the properties related to
checkboxes, input fields and radio buttons. This new way of doing things takes a
while to get used to, but we'll see more and more of it with one-way bindings
becoming best practice.

(By the way, my PR to add a section about [the actions helper's `value` option][4] to
the guides was merged yesterday, so hopefully more people will know about it.)

[1]: https://gist.github.com/ef4/8367f996eb7b57d1f7a5
[2]: http://smile.amazon.com/How-Solve-It-Mathematical-Princeton/dp/069111966X/ref=smi_www_rco2_go_smi_g2147660602?_encoding=UTF8&*Version*=1&*entries*=0&ie=UTF8
[3]: https://github.com/jmurphyau/ember-truth-helpers
[4]: https://github.com/emberjs/guides/pull/670
