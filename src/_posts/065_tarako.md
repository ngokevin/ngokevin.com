---
title: "Building a Faster App Store for the FirefoxOS $25 Smartphone"
type: blog
category: blog
date: 2014-06-07
id: fxos-25-phone
tags: [code]

image:
    url: http://i.imgur.com/VfiQKPr.jpg
    caption: Would you rather have this $25 ice cream cake? Or this $25 phone?
---

For the last month and a half, I worked in a small team of about three other
developers and two engineering managers to make our FirefoxOS app store, the
[Firefox Marketplace](http://marketplace.firefox.com), fast and performant
enough to run on our upcoming [$25
smartphone](http://www.cnet.com/news/with-firefox-os-mozilla-begins-the-25-smartphone-push/).
We were targetting a phone that would run on slower 2G connections, on lower
memory, and with lower CPU. After an initial lessons-learned prototype that we
did not end up shipping due to deadline pushes, we ended up forking our current
app store into a separate project,
[Yogafire](http://github.com/mozilla/yogafire). This is how we made it fast.

---

## Make It a Packaged App

Our current Marketplace that is running on phones around the world simply runs
in an iframe within a packaged app. The decision around using an iframe was to:

- Have working Persona login due to CSP restrictions
- Have working Google Analytics due to CSP restrictions
- Keep the ``marketplace.firefox.com`` domain for apps that specify they can only
  be installed on that domain
- Instant updates

However, the iframe method can be slow. Users at least on first launch of the
app, have to download assets (our JS, CSS, templates, and data) over the air.

Since then, we have worked around all of the issues blocking us from
"packaging" the Marketplace. In a packaged app, assets are pre-loaded into the
app to be shipped with phones; users then do not have to go out to the Content
Delivery Network (CDN) to download assets.

## Pre-loading API Responses

Normally the Marketplace would have to talk to our servers to get data such as
apps to display on the storefront (actually, we cache API responses on the CDN
too). But nevertheless, users still have to go out to the network to download
necessary data.

In the optimized app store, we have a [suite of
programs](https://github.com/mozilla/yogafire/tree/master/lib) that download
the API responses into JSON files that we package with the app to ship with the
phones.  Upon launch, the data from the JSON files are requested and pulled
into our cache in the background.

## Multi-Layer Cache with Asynchronous Updating

We implemented a [multi-layer caching
system](https://github.com/mozilla/yogafire/blob/master/hearth/media/js/db.js):

- Data from pre-loaded JSON files are pulled into the localStorage cache
- All data is then subsequently requested from the cache
- Data requested from the cache is pulled into memory for subsequent requests
- The cache is asynchronously updated with the API

Initially, we looked at using IndexedDB due to the lack of a 5MB storage cap
that localStorage otherwise would have. However for our smaller data set,
localStorage was marginally faster, and 5MB would be more than enough. In case
the 5MB cap is ever hit, we simply wipe the cache.

Still, on the lower-performance phone, localStorage still was not fast enough.
So data that is pulled from localStorage is also stored into memory (RAM) in
case the data is asked for again. This way, we get to keep the persistence of
localStorage alongside the faster speed of memory.

With asynchronous updating from the API, we never have to block on API
requests, which would otherwise a dealbreaker on EDGE networks.

## Image Deferring

Images, however, are by far the largest assets, which are mainly app icons and
app screenshots. An average icon is about 4KB and an screenshot is about 20KB.
These kilobytes add up.

So we defer images. We have an [image
deferrer](https://github.com/mozilla/yogafire/blob/master/hearth/media/js/image-deferrer.js)
that constantly checks for images that scroll in the viewport, and if they do,
only then do they load.  Images outside the viewport are not loaded, saving
bandwidth. Until then, we display a nice little Rocketship that waits for its
queen image to be faded in.

Note, we tried out pre-loading app icons and app screenshots into the package,
but that bloated up the package too much. It would mean on every update we
wanted to push out, users would have to download nearly a whole megabyte. No
can do. We keep the package down to 200KB.

## Conclusion

There were loads of other things we had to do such as implement a new design,
optimize for languages such as Hindi and regions such as India, or improve
offline usability. I entered the project about a fifth of the way through but
quickly picked it up for a three-week sprint, Starting from Corvallis, Oregon
and ending in Fort Myers, Florida.

Since Mozilla is open and all, you can even check out our bug trackers:

- [Version 0](https://bugzilla.mozilla.org/show_bug.cgi?id=998811)
- [Version 1](https://bugzilla.mozilla.org/show_bug.cgi?id=1000301)
- [Version 1.1](https://bugzilla.mozilla.org/show_bug.cgi?id=1011012)

In the end, we enjoyed some ice cream cake, and waited for the millions to
pick up the phone. Funny thing is, I didn't even have the phone to develop
on until I was done with the project!

![](http://i.imgur.com/3NNTjGK.png)
