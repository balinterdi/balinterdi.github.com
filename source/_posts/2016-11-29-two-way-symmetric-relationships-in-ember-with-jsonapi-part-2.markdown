---
layout: post
title: "Two-way symmetric relationships in Ember with JSON API - Part 2"
date: 2016-11-29 13:55
comments: true
categories: ember.js
perk: symmetric-relationships
---

In [Part 1][1] of this series, we saw what symmetric relationships are, how to
model them on the back-end (using Rails) and how to implement a simple app that
displays such relationships in Ember.js, adhering to the JSON API specification
for serializing data.

The solution we came up with worked but was a very naive one. For N relationships
a resource had, it made 2N+1 queries to the back-end to display them. We should
do better and in this post we'll see how.

(If you haven't read [the previous post][1], this one will not make much sense,
so I recommend to at least skim it before you delve into this one.)

## One request to rule them all

We'd observed that for each person whose friendships we wanted to observe, our
application made 2N+1 requests. One to grab the friendships themselves, and then
two requests for each friendship in that collection, one to fetch the
friender, one to fetch the friended person.

![Too many XHRs](/images/posts/symmetric-relationships/too-many-xhrs.png)

We also noticed that those people (instances of the Person model) had already
been fetched at that point so the extra requests were for nothing. Our mission
is thus to reduce the 2N+1 requests to a single one, the one that fetches the
friendships.

## How would Ember (Data) know?

If we take a look at the data returned by the request for friendships, you can
see that both the `friended` and `friender` end of each are just links with no
type or identity information (like `/friendships/1/friended`). This is all
that's needed for an asynchronous relationship, since the client (Ember Data, in
this case) can just fetch the relationship data when/if it needs it.

![No linkage data](/images/posts/symmetric-relationships/relationship-without-resource-linkage-data.png)

The solution, then, might be to include some data about the resource that the
relationship refers to. In the JSON API vocabulary this is called [resource
linkage][2]:

<blockquote>
Resource linkage in a compound document allows a client to link together all
of the included resource objects without having to GET any URLs via links.
</blockquote>

Digging around in the [jsonapi-resources source][3], we find a relationship
option called `always_include_linkage_data` that seems to do what we need. Let's
add that to the relationships of the friendship resource and see:

```ruby
# app/resources/friendship_resource.rb
class FriendshipResource < JSONAPI::Resource
  has_one :friender, always_include_linkage_data: true
  has_one :friended, always_include_linkage_data: true
  attributes :strength
end
```

If we now reload our Ember app, we see how a `data` key was added to each
relationship in the response, uniquely identifying the person resource that is
the friender (or friended) in the friendship relationship:

![Relationship with linkage data](/images/posts/symmetric-relationships/relationship-with-resource-linkage-data.png)

Furthermore, the extra XHRs we wanted to eliminate are now indeed gone as Ember
Data is smart enough to just use the referred resources that are already in the
store:

![Just the XHRs we need](/images/posts/symmetric-relationships/no-useless-xhrs.png)

## Let's just be friends (not friendeds or frienders)

We have now achieved what we'd wanted and only have to make one request per
person to fetch and display their friendships.

It looks a bit weird, though, that when a person's friendships are displayed, we
also display the person's name, too:

![Mike McCready's friendships - Part 1](/images/posts/symmetric-relationships/friendships-step-1.png)

Let's fix that by transforming the `friendships` of the person to an array where
each item only contains the friend's name (and the strength of the friendship):

```js
// app/controllers/people/show.js
import Ember from 'ember';

const { Controller, computed } = Ember;

export default Controller.extend({
  friendships: computed('model.friendships.[]', function() {
    let person = this.get('model');
    let friendships = this.get('model.friendships');
    return friendships.map((friendship) => {
      let friend;
      if (friendship.get('friended.id') === person.get('id')) {
        friend = friendship.get('friender');
      } else {
        friend = friendship.get('friended');
      }
      return {
        friend,
        strength: friendship.get('strength')
      };
    });
  })
});
```

Nothing fancy going on, we check which end of the relationship the person in
question (the `model`) is, and then only return the other end.

We should now use `friendships` in the template instead of `model.friendships`:

{% highlight html %}
{% raw %}
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">Friends of {{model.name}}</h3>
  </div>
  <div class="panel-body">
    {{#if friendships.length}}
      <ul class="friend-list">
        {{#each friendships as |friendship|}}
          <li class="friend-list-item">
            <span class="name">{{friendship.friend.name}}</span>
            <span class="badge">{{friendship.strength}}</span>
          </li>
        {{/each}}
      </ul>
    {{else}}
      <div class="empty-list">
        <p class="empty-message">{{model.name}} has no friends :(</p>
      </div>
    {{/if}}
  </div>
</div>
{% endraw %}
{% endhighlight %}

It works, we indeed only see the friend's name, not the person's:

![Relationship with linkage data](/images/posts/symmetric-relationships/only-friend-name.png)

## Resources

Hopefully you can now implement a symmetric relationship with relative
ease, the next time you encounter it.

I made the source code of both [the Ember app][4] and the [Rails API][5]
available on Github. If you want to learn more about the JSON API standard,
I suggest you visit [the official site][6].

Finally, if you'd like to receive the series as a pdf, fill out the form below
and I'll send it to you right away!

[1]: /2016/11/17/two-way-symmetric-relationships-in-ember-with-jsonapi-part-1.html
[2]: http://jsonapi.org/format/#document-resource-object-linkage
[3]: https://github.com/cerebris/jsonapi-resources
[4]: https://github.com/balinterdi/ember-two-way-symmetric-relationships
[5]: https://github.com/balinterdi/two-way-symmetric-relationships-api
[6]: http://jsonapi.org/
