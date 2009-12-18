--- 
wordpress_id: 39
title: deep_test to become TDD more easily
wordpress_url: http://bucionrails.com/?p=39
layout: post
---
I am all for <acronym title="Test Driven Development">TDD</acronym>, really. I did not even waver when recently I have been working on a medium-sized Rails project and running the tests after each change took about 60-80 seconds. 60 seconds is still a lot, though, especially if you go through these cycles ~50 times a day (a wild guess). I also believe in very short test-implementation cycles to stay focused so I was starting to think about ways to keep that time down.

Autotest, part of the <a href="http://rubyforge.org/projects/zentest/">Zentest</a> toolbox is a very good choice. It basically runs all the tests automatically after something has changed in the code and more importantly it only runs the tests it deems affected by the latest change. This helped to reduce the amount of time by reducing the number of tests that were run in each loop.

Another I think less well-known option is <a href="http://www.somethingnimble.com/bliki/deep-test">deep_test</a> which helps to reduce testing time by increasing computational power. More precisely, it runs the tests through worker threads so you can either benefit from using deep_test if you set it up for a computer network (individual computers take from a pool of tests and then send in the results) or if you have a multi-core computer. Since many of us do nowadays, that stepped up as a viable option.

It was quite easy to set up and the results it brought were quite remarkable. It reduced the running time of my tests by ~40% (based on a completely unscientific benchmark). One thing I experienced is that it did not really play out well with sqlite although I have not spent a lot of time trying to make it work there. I just switched to mysql and it worked seamlessly. So yeah, the next logical step was to get the better of both worlds: run only the tests that need to be run and run them on as many cores as possible. I will talk about that in a later post. 

I would very much like to hear your experiences and solutions to make TDD a breeze or just plain bearable. I cannot imagine doing real TDD if running tests takes more than a certain time limit, around maybe 90 seconds. Not only you lose a lot of time waiting for the tests to finish, more importantly you fall out of the falling test-implementation cycle, you lose focus, your mind drifts away and then the whole thing probably just does not work.
