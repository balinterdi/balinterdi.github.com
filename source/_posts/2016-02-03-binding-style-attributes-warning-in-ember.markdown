---
layout: post
title: "Binding style attributes warning in Ember"
date: 2016-02-03 09:33
comments: true
categories: ember.js
perk: general-signup
---

One warning Ember might print in your console concerns binding a property to
the `style` attribute of a DOM element, like this:

{% highlight html %}
{% raw %}
<div class="progress-bar" style="{{barWidth}}">...</div>
{% endraw %}
{% endhighlight %}

{% highlight javascript %}
{% raw %}
export default Ember.Controller.extend({
  progress: 0,
  barWidth: Ember.computed('progress', {
    return 'width:' + this.get('progress') + '%';
  });
});
{% endraw %}
{% endhighlight %}

Handlebars escapes all html content put in double curlies but it does not do
that with CSS, and thus the above makes possible a cross-site scripting attack.
That is the reason for the warning and the fix for that is to convert the
property (in the above case, `barWidth`) to a `SafeString`, which tells Ember
that the content is safe to display. You should only do that after you have
verified that the content you mark as safe cannot be injected by a malicious
user. [The guide][1] describes how to do that:

{% highlight javascript %}
{% raw %}
export default Ember.Controller.extend({
  progress: 0,
  barWidth: Ember.computed('progress', {
    return new Ember.Handlebars.SafeString('width:' + this.get('progress') + '%');
  });
});
{% endraw %}
{% endhighlight %}

(Alternatively, you can call `Ember.String.htmlSafe` with the string you want to
mark as safe, to the same effect.)

When I did this conversion in a recent project, though, the warning persisted.
After spending a substantial amount of time pouring over the docs and even
stepping through the warning stacktrace, I still could not find out what was
wrong. What helped (as so many times already) was a good night sleep and taking
another look at it in the morning.

Marking the string as safe was done correctly, but when binding it to the
`style` attribute, I used double quotes around it, probably inhibiting Ember
from seeing it as a SafeString:

{% highlight html %}
{% raw %}
<div class="progress-bar" style="{{barWidth}}">...</div>
{% endraw %}
{% endhighlight %}

So all I had to do to make the warning go away was to remove the quotes:

{% highlight html %}
{% raw %}
<div class="progress-bar" style={{barWidth}}>...</div>
{% endraw %}
{% endhighlight %}

I hope this saves you some time if you come across a similar situation in your
work.

[1]: http://emberjs.com/deprecations/v1.x/#toc_binding-style-attributes
