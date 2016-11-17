---
layout: post
title: "Two-way symmetric relationships in Ember with JSON API - Part 1"
date: 2016-11-17 12:52
comments: true
categories: ember.js
perk: general-signup
---

## Definition

In data modelling, a symmetric relationship is a special kind of relationship
where the description of the relationship from the perspective of one end of
the relationship is identical to looking at it from the perspective of the other
end.

Friendship between people is a good example. If Megan is Selma's friend, it
follows that Selma is Megan's friend, too. On the other hand, the "knows"
relationship between two people is not a symmetric one. I might know Danny
Carey (the drummer of Tool), but that does not imply he knows me.

## Historical background

My research into how to model and implement such a relationship in an Ember
application was sparked by [this Stack Overflow question][1] that was posed by
a reader of [my book][2]. It was more difficult than I thought it would be so I
was intrigued to find the (an) answer.

My solution turned out to have a fairly large API component, too, so the
following post will show both the server-side implementation (in Rails) and the
client-side one (in Ember).

If you don't speak Rails, fear not. The code is straightforward and easy to
understand without any substantial Rails knowledge, thanks in most part to the gem that
makes it extremely easy to serialize data models and relationships to json:api
format, [jsonapi-resources][3].

## Data modelling

We'll start with the data modelling part, which is the Rails side.

To be able to model our problem in the data layer, let's say that Friendships
have a `friender` and a `friended` end of the relationship and a strength
attribute that measures how strong their friendship is.

We should create a (data) migration that will create a database table when run:

		$ rails g migration create_friendships

Let's fill in the generated migration with the above attributes:

```ruby
class CreateFriendships < ActiveRecord::Migration
  def change
    create_table :friendships do |t|
      t.integer :friender_id
      t.integer :friended_id
      t.integer :strength
      t.timestamps null: false
    end
  end
end
```

A Friendship, then, is between two people (Persons), so let's define that in the
corresponding model file:

```ruby
# app/models/friendship.rb
class Friendship < ActiveRecord::Base
  belongs_to :friender, class_name: Person
  belongs_to :friended, class_name: Person
end
```

We'll want to list all the friendships a person has so a `friendships` method
needs to be added to the Person class:

```ruby
# app/models/person.rb
class Person < ActiveRecord::Base
  def friendships
    Friendship.where("friender_id = ? OR friended_id = ?", id, id);
  end
end
```

We select the friendships where either the `friender` or the `friended` is the
person we query it for. This is where the symmetric aspect of the relationship
is implemented. We don't care if the person friended somebody or if that
somebody friended him, they are friends.

Note that modelling it this way, we could split up the symmetric relationship
into the two constituent parts. We could return only the friendships where the
person in question "initiated" it (was the friender), or "let himself be
friended" (was the friender).

## Server endpoints, resources, serializing relationships

We could now turn our attention to setting up the endpoints and serializing the
model, and relationship data for the client application to consume. First, let's
install [the jsonapi-resources gem][3]:

		$ gem install jsonapi-resources

This gives us a jsonapi:resource generator that we can use to create both the
endpoints and the serializer for our resources.

		$ rails generate jsonapi:resource person
		$ rails generate jsonapi:resource friendship

The created resources are placed in the `app/resources` folder. Let's add the
attributes we want to serialize for each one:

```ruby
# app/resources/person_resource.rb
class PersonResource < JSONAPI::Resource
  attributes :name
  has_many :friendships, class_name: "Friendship"
end
```

```ruby
# app/resources/friendship_resource.rb
class FriendshipResource < JSONAPI::Resource
  has_one :friender
  has_one :friended
  attributes :strength
end
```

Creating the endpoints is no more work than adding a `jsonapi_resources` call
for each resource in the router configuration:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  jsonapi_resources :people
  jsonapi_resources :friendships
end
```

The gem also provides a controller generator so let's use it to create controllers for our resources:

		$ rails generate jsonapi:controller person
		$ rails generate jsonapi:controller friendship

They can be left empty but they need to be created in a way that they are
descendants of JSONAPI::ResourceController (the generator takes care of that):

```ruby
# app/controllers/people_controller.rb
class PeopleController < JSONAPI::ResourceController
end
```

```ruby
# app/controllers/friendships_controller.rb
class FriendshipsController < JSONAPI::ResourceController
end
```

The back-end is now done, we can switch our focus to the Ember app.

## The front-end

We want a list of people ([rock stars][2], of course) and then have a list of
their friendships on the person details page.

![Mike McCready's frienships - Part 1](/images/posts/symmetric-relationships/friendships-step-1.png)

The first step is to set up the routes:

```javascript
(...)
Router.map(function() {
  this.route('people', { path: '/' }, function() {
    this.route('show', { path: '/people/:person_id' });
  });
});

export default Router;
```

The model hooks for these routes are the classic, "fetch'em all" and "fetch the
one that matches the id" methods of Ember Data's store:

```javascript
// app/routes/people.js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('person');
  }
});
```

```javascript
// app/routes/people/show.js
import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('person', params.person_id);
  }
});
```

Before we move on to writing the templates, let's define the models:

```js
// app/models/person.js
import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({
  name: attr(),
  friendships: hasMany(),
  frienderFriendships: hasMany('friendship', { inverse: 'friender' }),
  friendedFriendships: hasMany('friendship', { inverse: 'friended' }),
});
```

```js
// app/models/friendship.js
import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
  strength: attr('number'),
  friender: belongsTo('person', { inverse: 'frienderFriendships' }),
  friended: belongsTo('person', { inverse: 'friendedFriendships' }),
});
```

This is rather standard Ember Data stuff, possibly with the exception of the
`inverse` definitions. Since we have two relationships between `Person` and
`Friendship` we need to specify the other end of each relationship and that's
what we do with the `inverse` option.

With the models and routes in place, we can now see what the templates should look like.

The top-level `people` route is again fairly straightforward:

{% highlight html %}
{% raw %}
// app/templates/people.hbs
<div class="col-md-4">
  <div class="list-group">
    {{#each model as |person|}}
      {{link-to person.name 'people.show' person.id class="list-group-item"}}
    {{/each}}
  </div>
</div>
<div class="col-md-8">
  {{outlet}}
</div>
{% endraw %}
{% endhighlight %}

The `each` loop iterates through each person and renders a link for each of
those that will take us to the person details page, which will display the
person's friendships.

![List of people](/images/posts/symmetric-relationships/people-list-step-1.png)

### Listing a person's friendships

{% highlight html %}
{% raw %}
// app/templates/people/show.hbs
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">Friends of {{model.name}}</h3>
  </div>
  <div class="panel-body">
    <ul class="friend-list">
      {{#each model.friendships as |friendship|}}
        <li class="friend-list-item">
          <span class="name">{{friendship.friender.name}}</span>
          <span class="name">{{friendship.friended.name}}</span>
          <span class="badge">{{friendship.strength}}</span>
        </li>
      {{/each}}
    </ul>
  </div>
</div>
{% endraw %}
{% endhighlight %}

There is nothing fancy going on here, either. The `model` is the person
retrieved in the route.  For each friendship that he has, the friender's and
the friended's name are rendered along with the strength of the relationship.
(Either `friender` or `friended` will be the person itself, but we can ignore that
in the first version.)

This naive approach works, the friendships for the selected person are listed correctly:

![Mike McCready's frienships - Part 1](/images/posts/symmetric-relationships/friendships-step-1.png)

## A 2N+1 problem

However, looking at the requests to the backend for just one page, one gets the
impression that we're not done yet:

![Too many XHRs](/images/posts/symmetric-relationships/too-many-xhrs.png)

For each friendship the person has, two requests are sent to the backend. One to
fetch the `friender` and another one to fetch the `friended` person. This is not
an [N+1 query problem][4], this is worse, a 2N+1 query problem!

On top of that, those requests are sent for no good reason as we'd previously
loaded the people referred by those `friended` and `friended` relationships.

In the next part, we'll see how these wasteful requests can be eliminated and
we'll also make the person details page less perplexing by not displaying the
person whose page we're looking at in the relationships. Stay tuned!

[1]: http://stackoverflow.com/questions/34186435/modelling-two-way-symmetric-relationships-in-ember
[2]: http://rockandrollwithemberjs.com
[3]: https://github.com/cerebris/jsonapi-resources
[4]: https://www.sitepoint.com/silver-bullet-n1-problem/
