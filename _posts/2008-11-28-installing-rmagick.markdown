--- 
wordpress_id: 26
title: Installing rmagick
wordpress_url: http://bucionrails.com/?p=26
layout: post
---
I needed to install rmagick for a Rails project. I had some amount of trouble along the way but finally succeeded so I am sharing my experience in case you bump into the same problems.

I first installed the <a href="http://imagemagick.linux-mirror.org/download/www/binary-releases.html#macosx">binary OS-X distribution of imagemagick</a> (no problems here) and then attempted to install rmagick, the ruby interface to the ImageMagick libraries:

<pre lang="shell">
sudo gem install rmagick
</pre>

However, I received the following unpleasant error:

<pre lang="shell">
Can't install RMagick 2.7.2. Can't find MagickCore.h.
</pre>

I checked that the header file is there (on the path the install script was looking for it), and decided not to go the hard way. After some googling I found there is a <a href="http://rubyforge.org/projects/rmagick/">rmagick-osx-installer</a> which downloads, compiles and installs ImageMagick and rmagick. Just what I needed.

However, the script failed to accomplish its mission, it hung when installing rmagick. Taking a peak in its log I saw several other errors so I had to look for another way. And that way was compiling the ImageMagick library myself. So I downloaded <a href="http://imagemagick.linux-mirror.org/download/www/install-source.html#unix">the source</a>, made the configuration-make-make install cycle and fortunately everything went smoothly. The good news is I could install rmagick without any problem after that:

<pre lang="shell">
balint$ sudo gem install rmagick
Building native extensions.  This could take a while...
Successfully installed rmagick-2.7.2
1 gem installed
</pre>
