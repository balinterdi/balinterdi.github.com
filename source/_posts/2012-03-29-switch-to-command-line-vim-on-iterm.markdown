---
layout: post
title: "Switch to Command Line Vim on iTerm"
date: 2012-03-30 12:04
comments: true
categories:
---
Switching between applications is more of a mental context switch than just switching between the panes in the same window. Or at least that's what I told myself when I decided I switch from using macvim to the simple command line version. It also brings me pretty close to using tmux which I would primarily use to send commands between panes. Most of the posts about using tmux only briefly touch on switching to command line vim so I thought I'd fill in the gap somewhat.

I use iTerm2 on a MacBook Pro and run 10.6.8 (Snow Leopard), although I think it should run
fine under Lion, too.

First, you'll have to install a fairly recent vim. Homebrew has a policy of not having packages which the operating system already provides, but fortunately there is a [homebrew-dupes][1] repository that has vim:

{% codeblock %}
$ brew install --HEAD https://raw.github.com/Homebrew/homebrew-dupes/master/vim.rb
{% endcodeblock %}

This will configure, make and install vim.

Next, I looked for a theme that looks good on both a light and a dark background and has iTerm support (a colorscheme for the terminal emulator). I've found [Ethan Schoonover's solarized theme][2] really cool. Just follow the steps in the [README of the repository][3] to download both the vim and the iTerm colorscheme.

To install the iTerm colorscheme, go to Preferences -> Profiles to select your
profile and then click the Colors tab. There is a "Load Presets" dropdown from
which you have to choose Import and find the solarized itermcolors file.

To use the vim colorscheme you have to add the colors file to somewhere where
vim finds it. There are many ways to do this, so check out the [README][3] to
find the method that suits you.

Once, done you have to set the colorscheme in your vimrc:

{% codeblock %}
colorscheme solarized
{% endcodeblock %}

(vim finds out the appropriate background automatically, so you don't have to
explicitly set the background)

I was all set up and most things worked just like in the GUI version. One thing that bugged me was that my cursor keys stopped working. I don't use them for moving and text input but I do for cycling in the command history or flipping between file matches for Command-T. It took me a while to find out that iTerm sends a wrong escape sequence for the arrow keys. I could fix that by selecting another set of key presets for the terminal's profile. In iTerm, go to Preferences -> Profiles and select your profile. Select Keys, then Load Preset and select xTerm with Numeric Keypad.

There is one more trick I find handy. If you set

{% codeblock %}
set clipboard=unnamed
{% endcodeblock %}

in your config, then anything you copy from vim by the usual vim commands (y, d, x, etc.) will be available on your system clipboard and thus pastable.

[1]: https://github.com/Homebrew/homebrew-dupes
[2]: http://ethanschoonover.com/solarized
[3]: https://github.com/altercation/ethanschoonover.com/tree/master/projects/solarized
