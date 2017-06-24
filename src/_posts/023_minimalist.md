---
title: "Open, HTML 5, Minimalist"
type: blog
layout: blog
date: 2012-07-08
id: minimalist
tags: code

image:
    url: http://i.imgur.com/FPcGZ.jpg
    where: top
---

And the hacking goes on. The main event for today, Mozilla HTML 5 Webapps
hackathon. The prize, glory and fame...and smartphones. I teamed up with [Sawyer
Hollenshead](http://sawyerhollenshead.com), another Mozilla intern, to create
[Minimalist](http://minimalist.ngokevin.com), a list-building app for noting
down categorized thoughts such as 'places I want to visit' or 'things I want to
accomplish this year'. Spoilers, we took home smartphones. In this edition of
the ngokevin Bi-weekly, I'll describe how the hack day was, what it means for
an app to be **open**, and some cool HTML 5 features we used.

---

## Hack Day
Got up at early 8am. That was the second earliest time I've woken up thus far
this summer. We got to the office for some bagels/cream cheese and orange
juice. No time to lose, we started hacking. We basically split up with him
taking mostly the frontend and me the backend. I got off to a quick start, but
as expected I ran into a pitfall (trying to return from a jQuery .each loop).
After spending half an hour on that, I began to rush myself. I wasn't really
thinking about my code, I was kinda just banging on my keyboard.

Lunch time. Burritos and coffee.

Now my mind was really mush. I couldn't make out my rushed code and kept
hacking on it to make it even more disgusting. It got bad enough that I wasn't
making too much progress in the last two hours. As time ticked down, I rushed
even faster, but that didn't do too much good. Before I knew it, time's up.
Damn, wish I had another hour.

Demo the apps. We rolled the dice on demoing app cache, expecting it to fail,
which it did. Ah, maybe we should've rehearsed this. Oh well, presentation went
fairly well. Other apps featured an IRC bouncer/web client, a
remake of Bugzilla, and an Instagram clone using shaders and a custom-patched
Firefox. Up to the judges.

Minimalist was good for 2nd behind Snappy, an Instagram clone. Ah, if I only I
hadn't cracked under the time. Oh well, **constellation prize** (which was also the
grand prize), Samsung Galaxy S2s with Firefox OS installed. Later on I went
home and regutted out my ugly code and made Minimalist a thing of beauty. After
a long day, I'm proud of the results. See it in the Mozilla Marketplace in the
future. Check it out!

## Open Web Apps

The open web is a beautiful mission, and it's difficult to describe. How I
envision an open web is a web that is owned by nobody, but innovated by
everybody. An open web is built upon web standards (HTML 5, CSS3, Javascript)
and not proprietary locked-down drivel. It's created with common languages that
every developer can understand. There are no coporations imposing their
proprietary 'you are mine' platforms in an attempt to lock in developers into
their markets. If developers are slowed down and locked away, then less cool
stuff gets to the users, and thus the web would begin to suck.

Current app markets (iOS Store, Google Play) kinda suck. They house a lot of
great apps, and they seem alright, but we've gotten complacent.

- Objective-C and Java are the power languages in the app market. It's a cup of
  tea to some people, but they're clunky by today's standards. Web standard
  languages are a much lower barrier of entry to development.
- You need to grab their respective SDKs to develop on them, or even *pay* for
  them in Apple's case.
- Developers are locked into either Apple or Google. It's one or the other, you
  only get to develop for a subset of users. With the web though, it's
  something most everyone can access. Develop on the web, have it run on
  everything.

But wait, weren't Apple's first iPhone apps built on top of the web? Yes, but
that was back when Javascript was very slow. The web was not ready then, but
the web is ready now. People are starting to get bored of native applications.
It's a pretty mundane thing. Open web apps are the future, and it's a bit of a
self-pat, but Mozilla is paving this road to move the web forward. There is
only one mission, make the Internet better for everyone.

## HTML 5 Features

Part of the limelight of the open web is the browser-adoption of HTML 5
standards. With it being "open web app hack day", we employed several cool HTML
5 features to Minimalist. A requirement for Minimalist was that it had to work
completely offline. It should be able to add items to a list and have it still
be there upon refresh. It should also remember which list it was looking at
last. Refreshing the page should not lose state. To do so, we employed
HTML5's local storage and app cache features.

### Local Storage

It's like your browser has its own cute little database. Local storage is a
client-side key-value store that web apps can access. We can store items into
local storage and pull them back out later without the need for fetching data
from some server on the Internet. It's ridiculously easy to access, with
Javascript through the **window.localStorage** object. It mostly acts like a
key-value store, except it stores everything as a string so remember to
type-cast your values correctly. JSON.parse and JSON.stringify really comes in
handy here.

### App Cache

Configuring the app cache tells the client to download everything (usually) and
cache it. When the client opens the app again, instead of fetching it from your
server, it'll just load the pages and elements from its cache. The user can
visit the app's URL in the browser offline, and it will still load off its
cache. To set up the app cache, first create a cache.manifest file in your
apps's root.

    CACHE
    # v1
    index.html

    NETWORK
    jquery.js http://ajax.jquery/jquery.js

This will tell the browser to cache index.html and to get jquery from the
Internet if possible. The browser will check for every time the cache manifest
file is changed (e.g. bump up v1 to v2), and re-pull resources if necessary.
Now we don't want to cache the manifest file itself since the browser will be
stuck with an old version of the app for a while, so we can drop an .htaccess
file to specify the correct content type and tell apache not to cache it.

    AddType text/cache-manifest .manifest

    <Files .cache.manifest>
        ExpiresActive On
        ExpiresDefault "access"
    </Files>

Hm, that should be good. If done correctly, most browsers will display a prompt
whether it should store local data from the app.

## What's Next

- It's 5am now, that coffee from noon had its way with me.
- Standard Marketplace hacking (proud of where it's gotten).
- Some polishing of DrawNothing and Minimalist.
- **24h Yahoo Hackathon** next week! Let's go for a third hackathon finish, yeah?
- Mozilla kayaking day in the bay right afterwards.
