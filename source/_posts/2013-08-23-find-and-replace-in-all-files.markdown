---
layout: post
title: "Find and Replace in all files"
date: 2013-08-23 22:01
comments: true
categories: shell
---

You want to change a string with another one in some directory in your project.

Here is a one liner to do that:

```
for spec_file in $(ag -g _spec.rb spec/); do sed -i.bak 's/john/jane/g' $spec_file; done
```

A few caveats:

* The match should be case-insensitive. Unfortunately, `s/john/jane/gI` does not
  work under OSX.
* The -i tells sed to do an in-place replacement. Again, under OSX, however, you
  must give an extension for the backup files. A `git clean -f` can get rid of
  these in one fell swoop.
* You can use `find spec/ -name '_spec.rb'` instead of the ag command. [But why
  would you?][1]

(If you know how to do the replacement with awk, or something similar, please
tell me in the comments.)

Your text editor might already have a `Find & Replace in project` functionality.
But maybe it does not. And surely, the command line version is most flexible.

[1]: http://geoff.greer.fm/2011/12/27/the-silver-searcher-better-than-ack/
