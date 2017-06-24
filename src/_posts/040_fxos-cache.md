---
title: "Cache Manifest 'Download Failed' on Firefox Marketplace"
type: blog
layout: blog
date: 2014-01-20
id: "fxos-cache"
tags: code

image:
    url: http://i.imgur.com/KqMbAV4.png
---

If you are developing a
[FirefoxOS](https://developer.mozilla.org/Firefox_OS/Application_development)
app but running into a **Download Failed** error when others try to install
your app on the [Firefox Marketplace](http://marketplace.firefox.com), it may
be due to a problem with your [cache
manifest](https://developer.mozilla.org//docs/HTML/Using_the_application_cache)
if you have implemented offline caching.

This issue, which I have run into before, can be due to the device **not being
able to download an asset listed on the cache manifest**, resulting in a failed
installation. To fix this, go through every item in the cache manifest and make
sure that:

- the paths are correct
- the files exist
- the files are reachable

It should work once these issues are resolved. When releasing an update for an
app, make sure that any deleted files are removed from the manifest and that
newly added files have the correct path. There is currently a [bug
ticket](https://bugzilla.mozilla.org/show_bug.cgi?id=834521) open for the
Firefox Marketplace about caching these errors upon app submission.

PS: a useful tool I sometimes use when I work with cache manifests is this
[AppCache generator](http://appcache.rawkes.com/).
