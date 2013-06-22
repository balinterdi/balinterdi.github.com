---
layout: post
title: "The appeal of one paradigm languages"
date: 2013-06-19 23:19
comments: true
categories:
---
As I was preparing for [my presentation on Clojure data structures][1] I flashed
back to a recent programming task I had to overcome. I don't remember exactly
what it was but it involved grouping data by particular keys and having an array
of values for each key. When such a task rears its head I always have to play
around in the REPL (err, the browser console) to see the exact working of each
function I am about to rely on.

Which one changes the array I call it on? Which one returns the new value and
leaves the original intact? What about taking two arrays to make a third one?
Javascript being slightly OOish, may I possibly use the + operator to join them
together?

``` javascript
x = [1,2]; y = x.push(3);      // x = [1,2,3]; y = 3;
x = [1,2]; y = x.concat([3]);  // x = [1,2]; y = [1,2,3]
x = [1,2]; y = x.concat(3);    // x = [1,2]; y = [1,2,3]
x = [1,2]; y = [3]; z = x + y; // z = "1,23" WAT?
```

I spend a considerable amount of time trying these out and since I discover no
overarching design behind how they operate I come away none-the-wiser and so
repeat the same process on a slighly different problem some time later. (slice
vs. splice, anyone?)

Before I bash on javascript some more, I find it important to state that
it's an enormous feat [to design and implement a language in ten days][2],
hat tip to Brendan Eich.

The point I want to get across is that not having a solid design principle
behind a language is actually a hindrance. It slows you down by having to try
the pieces (functions, in this case) individually unless you have memorized
them.

On the other hand, when you work with a language that has a design philosophy
you gain the benefit of faster development. In Clojure, in the case of
collection types, that principle is immutability. You don't have to read the
docs or fiddle around in the REPL. The original never changes, you get the
"modified" version in the returned value:

``` clojure
(def x [1 2]) (def y (conj x 3)) ; x = [1,2]; y=[1,2,3]
(def x [1 2]) (def y (concat x [3]); x [1,2]; y=[1,2,3]
```

Let's look at another language, Ruby.

Called on an array, `push`, `concat`, `shift`, `pop` and `unshift` all modify
their caller. `Push`, `concat` and `unshift` return the modified array, while
`shift` and `pop` return the removed element.  So the rule seems to be that
methods that expand the array return the new array, methods that take away an
element return that element. So far so good.

What about `take` and `drop`? They both take away a number of elements, from the
beginning or from the end, and the number of elements being passed in as a
parameter. I'd totally expect these methods to change the original in place.
After all, few names sound more destructive than `drop`.  We're in for a
surprise. Both of them leave the original intact and return the taken (or
dropped elements). In fact, you can pass in a number to both `shift` and `pop`
which makes them identical to `take` and `drop` with the important distinction
of whether they mutate or not the array they are called on.

To add to the confusion, there is `delete` which deletes all occurrences of the
element that is given as the parameter and there is `compact` which does exactly
the same for a special case, nil. (So `compact` takes no parameter). However,
it turns out that `delete` is mutating, but `compact` is not, preferring to return
the array with no nils. `compact!` comes to the rescue which does mutation and so
`x.compact!` is the same `x.delete(nil)`.

To give an analogy from natural languages, learning operations on collections in
Ruby and Javascript is like learning the article for each noun in German (der,
die or das). There are rules but they are hard to remember in the first place
and are often violated.

Learning the same thing in Clojure is like learning articles in English: there
is one true way to do it.

[1]: https://speakerdeck.com/balint/clojure-data-structures-part-one
[2]: http://www.w3.org/community/webed/wiki/A_Short_History_of_JavaScript
