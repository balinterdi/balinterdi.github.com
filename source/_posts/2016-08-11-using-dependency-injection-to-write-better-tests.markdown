---
layout: post
title: "Using Dependency Injection to Write Better Tests"
date: 2016-08-11 09:13
comments: true
categories: ember.js testing
perk: general-signup
---

Testing is given much emphasis in the Ember.js community, and testing tools have
showed steady progress to reduce the cost of writing tests of all types.

Lauren Tan wrote [a great post](https://emberway.io/component-dependency-injection-in-ember-js-a46a39a5d30a#.45qfbv52x)
about how Dependency Injection (DI) can be used to decouple a parent component
from the internals of its child components. One of the gains of doing so is that
the parent component becomes more focused and thus easier to test.

In this post, I'm doing something similar, although much simpler. I want to show
you how to use DI in a simple helper function to make it easier to test.

### Just your ordinary, run-of-the-mill function

Although the helper is an Ember (template) helper, the concepts could be very
easily transferred to other frameworks, libraries and even languages.

I recently had to modify a `normalizeText` helper function that looked
like this:

```js
// tests/unit/helpers/normalize-text-test.js
import Ember from 'ember';

export function normalizeText([text]) {
  let normalizedEOLs = text.trim().replace(/(?:\r\n|\r|\n)/g, '</p><p>');
  let noEmptyParagraphs = normalizedEOLs.replace(/(<p><\/p>)/g, '');
  return Ember.String.htmlSafe("<p>" + noEmptyParagraphs + "</p>");
}
```

(I realize the above code does not handle a text value of `undefined` or `null`.
The real code does but I want to keep the code examples to the minimum necessary
to get my point across.)

### Comparing objects to objects

Its test was quite simple and straightforward:

```js
// tests/unit/helpers/normalize-text-test.js
import { normalizeText } from '../../../helpers/normalize-text';
import { module, test } from 'qunit';

module('Unit | Helper | normalize-text');

test('it works', function(assert) {
  let normalizedText = normalizeText(["The brown fox\r\njumped over the quick rabbit.\n"]);
  assert.equal(normalizedText, "<p>The brown fox</p><p>jumped over the quick rabbit.</p>");
});
```

The problem with that test is that we compare two `Handlebars.SafeString`
instances (returned by `Ember.String.htmlSafe`) which are different even if
the strings they wrap, their value, is the same:

```
let s1 = Ember.String.htmlSafe("sid transit gloria mundi");
let s2 = Ember.String.htmlSafe("sid transit gloria mundi");
s1 === s2 // => false
```

We're, however, interested in the equality of the strings. If only there was a
way to replace that pesky `Ember.String.htmlSafe` call from the call site...

### DI to the rescue

This is exactly what Dependency Injection can help us do. Instead of hard-coding
that "sanitizer" function dependency, the function could take it as a parameter
so that callers could inject it. Usually DI examples use (and thus inject) class
names or object instances but it is important to realize that the injected param
could be very "primitive", like a simple function.

So here is how I rewrote the function:

```js
// app/helpers/normalize-text.js
import Ember from 'ember';

export function normalizeText([text], params={}) {
  let { sanitizer=Ember.String.htmlSafe } = params;
  let normalizedEOLs = text.trim().replace(/(?:\r\n|\r|\n)/g, '</p><p>');
  let noEmptyParagraphs = normalizedEOLs.replace(/(<p><\/p>)/g, '');
  return sanitizer("<p>" + noEmptyParagraphs + "</p>");
}

export default Ember.Helper.helper(normalizeText);
```

Notice how easy ES2015 destructuring makes the assignment of the sanitizer
function:

```js
let { sanitizer=Ember.String.htmlSafe } = params;
```

If no `sanitizer` key was present in `params`, then it will have a value of
`Ember.String.htmlSafe`, the default behavior.

The call from the test can now override the default behavior of sending the
normalized text through `Ember.String.htmlSafe` by passing in a "no-op"
sanitizer function:

```js
// tests/unit/helpers/normalize-text-test.js
import { normalizeText } from '../../../helpers/normalize-text';
import { module, test } from 'qunit';

function leaveAsIs(text) {
  return text;
}

module('Unit | Helper | normalize-text');

test('it works', function(assert) {
  let normalizedText = normalizeText(["The brown fox\r\njumped over the quick rabbit.\n"], { sanitizer: leaveAsIs });
  assert.equal(normalizedText, "<p>The brown fox</p><p>jumped over the quick rabbit.</p>");
});
```

We're now comparing simple strings which place nicely with `assert.equal` (with
`===`), and our test now passes.

### Non-testing benefits

Code modifications introduced for the sake of testing usually also improve the
non-testing aspect. Here, we made it possible to pass any function before we
return the normalized text. We could, for example, use this to replace the `<p>`
tags with `<span>`s, if we so wish.

