---
layout: post
title: "How to make an Ember module resolve as another one"
date: 2016-02-12 11:12
comments: true
categories: ember.js
perk: general-signup
---

I wanted to write another short, and hopefully useful, post just as I did
recently for [binding the style attribute][1].

## No configuration is simpler than no configuration

About a month ago I was working to add authorization to the [Rock and Roll with
Ember][2] application. I used my favorite addon, [Torii][3], to help with that
and opted to do the authorization via the `google-oauth2-bearer` provider.  To
restore the session, Torii looks up the application (Torii) adapter, but the
session initialization and closing code used the `google-oauth2-bearer`
adapter. So I had two separate files, which I was not happy about and I did not
want to merge everything into the `application` adapter, as it does not give a
hint about its contents then.

My idea was to make it possible to use another adapter [to restore the session
from, via a configuration option][4]. Matthew Beale hinted at a solution that
removes the need for a configuration option and since I haven't seen this
before, I want to share it with you.

## Import from target module, then reexport

The Ember resolver is the piece that maps qualified full names (like
`route:blog` or `controller:bands`) to module names.

In my case, Torii makes the resolver look up `torii-adapter:application` to
fetch the session from and I wanted this to be resolved to
`torii-adapter:google-oauth2-bearer`. In the Ember CLI project, that is
equivalent of having the `app/torii-adapters/application.js` file export
what is exported by `app/torii-adapters/google-oauth2-bearer.js`.

When phrased like this, the solution is near and I am somewhat embarrassed it
took me a few attempts to arrive at this.

So the solution is to import in `app/torii-adapters/application.js` what
`app/torii-adapters/google-oauth2-bearer.js` exports and then reexport it:

```js
// app/torii-adapters/application.js
import GoogleOAuth2BearerAdapter from './google-oauth2-bearer';

export default GoogleOAuth2BearerAdapter;
```

```js
// app/torii-adapters/google-oauth2-bearer.js
export default Ember.Object.extend({
  (...)
});
```

Voila, we have "tricked" the resolver without adding any configuration
(and thus complexity) to the addon.

[1]: /2016/02/03/binding-style-attributes-warning-in-ember.html
[2]: http://rockandrollwithemberjs.com
[3]: https://github.com/Vestorly/torii
[4]: https://github.com/Vestorly/torii/issues/268

