---
title: Git rebase to fix your local commits
layout: post
---

Let's say you have the following three commits in your local repository:

{% codeblock %}
% git log -3 --oneline
b648f1a Fix propagating errors in findOrInitialize. (28 seconds ago)
8789cd1 Non-destructive filtering for bumblebees. (12 hours ago)
1a35285 Propagate errors the node.js way. (14 hours ago)
{% endcodeblock %}

The last commit, b648f1a conceptually belongs to the first one, 1a35285.
It only came later because say you haven't run the tests before
committing it and only realized later you introduced a bug. Or some
other misdemeanor. Whatever the background is, it would be great if
there was a way to squash the two related commits together. Turns out
there is: interactive rebase.

The syntax of the git-rebase is the following:

{% codeblock %}
git rebase [-i | --interactive] [options] [--onto <newbase>]
             <upstream> [<branch>]
{% endcodeblock %}

What happens when you do git rebase is that the commits that are on the current
branch but are not in upstream are saved. The current branch is reset to
upstream and then the saved commits are replayed on top of this.

It's worth to mention that you should only do this if you have not
pushed out these changesets to a remote where others might have pulled
from it. Rebase creates new commits and if your collaborators pull the
new commits, chaos can ensue. (See "Perils of Rebase" in the [ProGit
book](http://progit.org/book/ch3-6.html))

This can be used to achieve what we want:

{% codeblock %}
% git rebase -i HEAD~3
{% endcodeblock %}

Since the commits that are on the current branch but not on the commit
three commits from here are the last three commits, here is what we get:

{% codeblock %}
pick 1a35285 Propagate errors the node.js way.
pick 8789cd1 Non-destructive filtering for bumblebees.
pick b648f1a Fix propagating errors in findOrInitialize.
{% endcodeblock %}

We want to meld the "fix" commit into the "propagate" commit since
that's how it should have been in the first place. So we move b648f1a up and
squash it into the previous commit:

{% codeblock %}
pick 1a35285 Propagate errors the node.js way.
squash b648f1a Fix propagating errors in findOrInitialize.
pick 8789cd1 Non-destructive filtering for scales.
{% endcodeblock %}

After a successful rebase this is how the new log looks like:

{% codeblock %}
% git log -3 --oneline
73eed18 Non-destructive filtering for bumblebees. (9 seconds ago)
1e63d17 Propagate errors the node.js way. (39 seconds ago)
1b24891 Minor fixes in Bumblebee buzzing. (16 hours ago)
{% endcodeblock %}

Note that the three commits we had before have now been nicely compacted
into two, and the propagation commit is now consistent and fixed. It can
now be pushed.

ps. You might wonder what we use bumblebees for in our project. Actually
they are faux. They serve to obfuscate real names in propietary code.
I hope I can one day write code where bumblebees will be first-class
citizens, though.
