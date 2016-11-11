---
layout: post
title: "Enable Fastboot for your Ember app"
date: 2016-11-11 11:20
comments: true
categories: ember.js
perk: general-signup
---

## What is FastBoot and why should you use it?

[FastBoot](https://ember-fastboot.com/) is the awesome add-on that adds
server-side rendering to your Ember app. That will make users of your
application see the content of your page before any of the javascript is
downloaded. In other words, the ["time to first tweet"][1]
of your app is greatly reduced, which is great where and when people have slow
or unstable network connections.

Another advantage is that crawlers will have an easier job indexing your site,
which brings SEO benefits.

Furthermore, your site will be readable with Javascript disabled which is
convenient for screen readers.

I recently went through the process of enabling the demo version of the
[Rock and Roll application](http://rockandrollwithemberjs.com) to run in Fastboot.
Below, I'm going to tell you about the challenges I encountered and how I
overcame them in the hope that it will prove valuable when you do the same for
your app.

## Installing the add-on

As FastBoot is a regular Ember add-on, that one was a piece of cake:

    $ ember install ember-cli-fastboot

I could then run

    $ ember fastboot

from the project's directory and had the node server serving my application at
port 3000. It's important to note that you should refresh your browser tab each time you
make changes as FastBoot doesn't (yet) auto-refresh as `ember server` does.

I then disabled JavaScript in my browser and then directed my browser
to `http://localhost:3000`.

Disabling JavaScript in Chrome is most easily done by expanding the context menu
of Developer Tools and then clicking on Settings:

![Disable JavaScript](/images/posts/fastboot/disable-javascript-in-chrome.png)

## Mirage is disabled in FastBoot mode

My first obstacle turned out to be Mirage.

Mirage is a great tool for mocking server responses and even [prototyping your Ember app][2].
I used it in development, too, and it turned out that since [it turns itself off][3]
when your app is running in FastBoot mode, the requests hitherto handled by
Mirage now went out and were thus unhandled.

The fix here was to disable Mirage in development (and, in my case, production,
too) and to make the requests against an actual API.

You also have to add the hosts that will serve your Ember app in FastBoot mode
to a list called hostWhitelist in your app's configuration.

In my case, it contains the host I wanted to deploy it to and any localhost
port:

```js
// config/environment.js
module.exports = function(environment) {
  var ENV = {
    (...)
    fastboot: {
      hostWhitelist: ['demo.rockandrollwithemberjs.com', /^localhost:\d+$/]
    }
  };
```

## Serving assets

When I restarted the `ember fastboot` and looked at the server-rendered version
of my app, I saw that the data is now correctly rendered on the page but that
all styles missing from it.

A quick glance at [the documentation][4] made me realize I need to pass the
`serve-assets` option to the command so that it serves the css (and other asset)
files:

    $ ember fastboot --serve-assets

## document is not defined

So now the main page, with the list of bands rendered fine but when I selected
one of the bands to have their songs displayed, I got the following error:

    Error while processing route: bands.band.songs document is not defined

Since Fastboot runs your Ember app in a node environment, not in the browser,
`document` is not present. In my case, I accessed `document` (through jQuery)
to set the document title, but that will not work in FastBoot mode.

The user guide again pointed me to the right direction, to use
[ember-cli-document-title][5], a FastBoot compatible way to set document titles.

Armed with ember-cli-document-title, it was a piece of cake:

```js
// app/routes/bands/band/songs.js
import Ember from 'ember';

export default Ember.Route.extend({
  (...)
  title() {
    let bandName = this.modelFor('bands.band').get('name');
    return `${bandName} songs - Rock and Roll`;
  },
});
```

## Missing dynamic content

The next thing that did not work was that the songs for a specific band did not
load in FastBoot mode, the list of songs was empty each time.

Adolfo Builes and Jonathan Jackson helped me out by pointing out that songs are
loaded asynchronously. The request to fetch the songs was only fired when the
template rendered the `#each model.songs as |song|` piece. FastBoot does not
know when the page is fully rendered and thus relies on the `beforeModel`,
`model` and `afterModel` route hooks having finished their work. When that
happened, the songs were not fetched and rendered on the screen yet:

![Songs missing](/images/posts/fastboot/songs-missing.png)

The way to fix this was to block rendering in the `afterModel` hook, by
returning a promise that fetched the songs:

```js
// app/routes/bands/band/songs.js
import Ember from 'ember';

export default Ember.Route.extend({
  fastboot: Ember.inject.service(),

  afterModel() {
    if (this.get('fastboot.isFastBoot')) {
      let band = this.modelFor('bands.band');
      return band.get('songs');
    }
  },
  (...)
});
```

As you can see, we only pre-fetch the songs in FastBoot mode. In the browser, we
let rendering start earlier, with a "pop-in" effect (which can be remedied in
several ways in the browser, too).

The songs now appear in the FastBoot "view" of the app, too:

![Songs present](/images/posts/fastboot/songs-present.png)

You can read more about this in the "Use Model Hooks to Defer Rendering" section
of [the guide][4].

## Fastboot-enabled hosting

It's fine to have FastBoot working in development but nobody actually needs
it to work in that environment. It has to work when deployed to a server, where
people see the app rendered faster (among other benefits, see intro).

I chose Heroku which seemed like the easiest option. And it really was.

All I had to do was to set the buildpack URL:

    $ heroku buildpacks:set https://codon-buildpacks.s3.amazonaws.com/buildpacks/heroku/emberjs.tgz

And then add a `static.json` file to the root of my project, to disable forcing
https requests, as the domain is not (yet) SSL-supported:

```js
// static.json
{
  "root": "dist/",
  "https_only": false,
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  },
  "headers": {
    "/**": {
      "Cache-Control": "private, no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "Sat, 05 Nov 1955 00:00:00 PST",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains;",
      "X-Download-Options": "noopen",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-XSS-Protection": "1; mode=block"
    },
    "/assets/**": { "Cache-Control": "public, max-age=512000" },
    "/robots.txt": { "Cache-Control": "public, max-age=512000" },
    "/crossdomain.xml": { "Cache-Control": "public, max-age=512000" }
  }
}
```

This step is really only needed to change the default `https_only` setting. If
you have SSL set up for your domain, you don't need the `static.json` file.

The next time I pushed to the remote set up by Heroku, it just worked, and my
app was now FastBoot enabled.

## Further resources

I would like to thank [Adolfo][7] and [Jonathan][8] for their help in pointing
me at Ember Weekend, an Ember app that runs in FastBoot and [whose source code is publicly available][9],
and also for overcoming the above mentioned "missing dynamic content" problem.

My app does not use many of Fastboot's features. If you're looking to see a more
complex use case, check out the [Ember Weekend source code][9].

If you want to learn more about FastBoot's architecture and rationale, I
recommend checking out [Tom Dale's great presentation][10] he gave at Global
Ember Meetup.

Finally, the Rock and Roll demo app that this post describes is available on
Github at [balinterdi/rarwe-demo][11] and deployed to [http://demo.rockandrollwithemberjs.com][12].

[1]: https://blog.alexmaccaw.com/time-to-first-tweet
[2]: https://www.codeschool.com/blog/2016/07/07/building-an-ember-app-without-a-back-end/
[3]: https://github.com/samselikoff/ember-cli-mirage/blob/24f994f4419f1b175c82331b00c3089e3f65c038/index.js#L106
[4]: https://ember-fastboot.com/docs/user-guide
[5]: https://github.com/kimroen/ember-cli-document-title
[6]: https://ember-fastboot.com/docs/deploying
[7]: https://twitter.com/abuiles
[8]: https://twitter.com/rondale_sc
[9]: https://github.com/ember-weekend/ember-weekend
[10]: https://vimeo.com/157688134
[11]: https://github.com/balinterdi/rarwe-demo
[12]: http://demo.rockandrollwithemberjs.com
