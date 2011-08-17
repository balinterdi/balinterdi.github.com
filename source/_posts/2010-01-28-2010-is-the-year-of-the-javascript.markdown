---
title: 2010 is the year of the Javascript
layout: post
---
If you've read the [The Pragmatic Progammer - From Journeyman to Master][the_pragprog] (and if you have not, believe me, you should) you might remember one precious advice: learn a new programming language every year. So when the year draws close to its end (around April, that is) I really start thinking about which language should be the one for me next year. 

This reflection is very pleasant; it is such a joy to immerse oneself into a new language, to slowly discover its structure, its subtleties and learn new ways of thinking, of approaching a problem (because that's probably the biggest gain of it, even surpassing adding another language to your arsenal) that its prospect is already rewarding in itself.

My choice in 2009 fell on [Clojure][clojure]. I love functional programming, its elegance, its cleanness, its statelessness and after getting my feet wet with [ANSI Common LISP][ansi_common_lisp] a while ago I felt like Clojure would propel me on my way of becoming an FP guru. Guided by [a great book][programming_clojure] I wrote a couple of, admittedly [not too difficult][compressor] [exercises][sudoku_solver]  (hey, a [sudoku solver][sudoku_solver] is already something, isn't it?) and I would certainly like to continue to do more with it in 2010.

Now, on to 2010.

[Thomas Fuchs][miraculous] is certainly right when he predicts that [Javascript will play an increasingly significant role in web development][web_dev_next_decade]. I was definitely wrong when I had thought of JS as an undebuggable, structure- and featureless, incoherent language. Of course, you can write Javascript code that is like this but I now think that -at least in the case of Javascript- this tells more about the craftsman than about the language.

Make no mistakes, I can already do Javascript! I can miraculously make a check box appear if you click on a link, or update a database record without reloading the page when you press a button and a ton more such wizardry, really. However, I always felt like there was a whole lot more to Javascript than putting some dumb-looking functions in a file and then include it from my html (no, I don't think inlining it makes a difference) and I felt uneasy about my javascript functions just standing there on their own without any apparent belonging to a group or some kind of cohesive force or idea that holds them together.

My recent enthusiasm comes from the fact that I had to browse through some of the source code of [scriptaculous][scriptaculous] and I really liked what I saw. The enthusiasm [is not totally new][js_method_chain] but looking at that source code demolished the last shreds of my Javascript skepticism, so to speak. So a year later than [Peter Szinek][peter_learn_js] I am hopping on the same train: Javascript, here I come! If you have read a good book that enhanced your Javascript foo, please tell me about it in the comments.

And you? Have you already chosen your language for 2010?

[the_pragprog]: http://pragprog.com/titles/tpp/the-pragmatic-programmer
[miraculous]: http://mir.aculo.us
[web_dev_next_decade]: http://mir.aculo.us/2010/01/07/web-developments-next-decade/
[peter_learn_js]: http://www.rubyrailways.com/learn-at-least-one-new-language-every-year/
[clojure]: http://clojure.org
[ansi_common_lisp]: http://www.paulgraham.com/acl.html
[programming_clojure]: http://pragprog.com/titles/shcloj
[sudoku_solver]: http://github.com/balinterdi/clojure_exercises/tree/master/sudoku/game.clj
[compressor]: http://github.com/balinterdi/clojure_exercises/blob/master/lzw/compressor.clj
[scriptaculous]: http://script.aculo.us/
[js_method_chain]: http://www.codigoergosum.com/2008/10/09/javascript-method-chain.html