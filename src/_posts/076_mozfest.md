---
title: "Pushing Hybrid Mobile Apps to the Forefront"
type: blog
category: blog
date: 2014-11-23
id: mozfest
tags: [code, life]

image:
    url: http://i.imgur.com/2IGaM6Pl.jpg
    caption: Mozilla Festival 2014 was held in London in October.
---

At [Mozilla Festival 2014](http://2014.mozillafestival.org), I facilitated a
session on **Pushing Hybrid Mobile Apps to the Forefront**. Before,
I had been building a poker app to keep track of my poker winning statistics,
record notes on opponents, and crunch poker math. I used the web as a platform,
but having an iPhone, wanted this app to be on iOS. Thus, the solution was
**hybrid mobile apps**, apps written in HTML5 technologies that are wrapped to
run "natively" on all platforms (e.g., iOS, Android, FirefoxOS).

I stumbled upon the [Ionic hybrid mobile app
framework](http://ionicframework.com/). This made app development
so easy. IT fulfills the promise of the web: write once, run everywhere. In
being with Mozilla for over two years, I've read so little hype for hybrid
mobile apps. Hybrid mobile apps have potential to convert much more native
developers over to the web platform, but hybrid mobile apps aren't getting the
ad-time they deserve.

---

## What is a Hybrid Mobile App?

Hybrid mobile apps, well explained in
[this article from
Telerik](http://blogs.telerik.com/appbuilder/posts/12-06-14/what-is-a-hybrid-mobile-app-),
are apps written in HTML5 technologies that are enabled to run within a native
container. They use the device's browser engine to render the app. And then
web-to-native polyfill can be injected, prominently
[Cordova](http://cordova.apache.org/), in order to access device APIs.

## The Current Lack of Exposure for Hybrid Mobile Apps

In all of the [Mozilla
Developer Network](https://developer.mozilla.org) (MDN), there are around three
articles on hybrid mobile apps, which aren't really fully fleshed and in need
of technical review. There's been a good amount of work from [James
Longster](http://jlongster.com) in the form of [Cordova Firefox OS
support](http://http://mozilla-cordova.github.io/). There could be more to be
done on the documentation side.

Cross-platform capability on mobile should be flaunted more. In MDN's
[main article on Open Web Apps](https://developer.mozilla.org/Apps/Quickstart/Build/Intro_to_open_web_apps),
there's a list of advantages on open web apps. This article is important since
it is a good entry point to into developing web apps. The advantages listed
shouldn't really be considered advantages relative to native apps:

- *Local installation and offline storage*: to a developer, these should be
inherent to an app, not an explicit advantage. Apps are expected to be
installable and have offline storage.
- *Hardware access*: also should be inherent to an app and not an explicit
advantage. Apps are expected to be able to communicate with its device APIs.
- *Breaking the walled gardens*: there are no "walls" being broken if these
web apps only run in the browser and FirefoxOS. They should be able to live
inside the App Store and Play Store to really have any effect.
- *Open Web App stores*: well, that is prety cool actually. I built a personal
app that I didn't want to be distributed except with me and antoher. So I
simply built a page that had the ability to install the app. However, pure web
apps alone can't be submitted it to App Store or Play Store so that should
be addressed first.

What's missing here is the biggest advantage of all: **being able to run
cross-platform** (e.g., iOS, Android, FirefoxOS, Windows). That's the promise
the web, and that's what attracts most developers to the web in the first
place. Write it once, run anywhere, no need to port between languages or
frameworks, and still be able to submit to the App Store/Play Store duopoly for
to gain the most users. For many developers, the web is an appropriate
platform, saving time and maintenance.

Additionally, most developers also prefer the traditional idea of apps, that they are
[packaged](https://developer.mozilla.org/Marketplace/Options/Packaged_apps) up
and uploaded to the storefront, rather than self-hosted on a server.  On the
[Firefox Marketplace](https://marketplace.firefox.com), the majority of apps
are packaged over hosted (4800 to 4100).

There's plenty of bark touting the cross-platform capability of the web, but
there's little bite on how to actually achieve that on mobile. Hybrid mobile
apps have huge potential to attact more developers to the web platform. But
with its lack of exposure, it's wasted potential.

So what can we do? The presence of hybrid mobile apps on MDN could be buffed.
I've talked to Chris Mills of the MDN team at Mozfest, and he mentioned it was
a goal for 2015. [FirefoxOS Cordova plugins](http://mozilla-cordova.github.io/)
may welcome contributors. And I think the biggest way would be to help **add
official FirefoxOS support to [Ionic](https://github.com/driftyco/ionic)**, a
popular hybrid mobile app framework which currently has over 11k stars. They've
mentioned they have FirefoxOS on the roadmap.

## Building with Ionic

[Ionic Framework](http://ionicframework.com/) is a hybrid mobile app framework
It has a beautifully designed set of native-like icons and CSS components,
pretty UI transitions, web components (through Angular directives for now),
build tools, and an easy-to-use command-line interface.

With Ionic, I built my poker app I initially mentioned. It installs on my
phone, and I can use it at the tables:

![Poker app](http://i.imgur.com/IoI7nyol.png)
<div class="page-caption"><span>
  Poker app built with Ionic.
</span></div>

For the Mozfest session, I generated a sample app with Ionic (that simply just
makes use of the camera), and [put it on
Github](https://github.com/ngokevin/mozfest2014/tree/master/mozfestApp) with
instructions. To get started with a hybrid mobile app:

- ```npm install -g ionic cordova```
- ```ionic start myApp tabs``` - creates a template app
- ```cordova plugin add org.apache.cordova.camera``` - installs the Cordova
  camera plugin (there are [many to choose from](http://plugins.cordova.io/))
- ```ionic platform add <PLATFORM>``` - where <PLATFORM> could be ios, android,
  or firefoxos. This enables the platforms
- ```ionic platform build <PLATFORM>``` - builds the project

To emulate it for iOS or Android:

- ```ionic emulate <PLATFORM>``` - will open the app in XCode for ios or
  adbtools for android

To simulate it for FirefoxOS, open the project with WebIDE inside
```platforms/firefoxos/www```.

## How the Mozfest Session Went

It was difficult to plan since Mozfest is more of a hands-on unconference,
where everything is meant to be hands-on and accessible. Mozfest wasn't a
deeply technical conference so I tried to cater to those who don't have much
development experience and to those who don't bring a laptop.

Thus I set up three laptops: my Macbook, a Thinkpad, and a Vaio. And had
three devices: my iPhone, a Nexus 7, and a FirefoxOS Flame. My Macbook would
help to demonstrate the iOS side. Whereas the other machines had Linux Mint
within a VirtualBox. These VMs had adbtools and Firefox with WebIDE set up.
All the mobile devices had the demo apps pre-installed so people could try it
out.

I was prepared as a boy scout. Well, until my iPhone was pickpocketed in
London, stripping me of the iOS demonstration. Lugging around three laptops
in my bag that probably amounted to 20 pounds back and forth between the hotel,
subway, and venue wasn't fun. I didn't even know what day I was going to
present at Mozfest. Then I didn't even use those meticulously prepared laptops
at the session. Everyone who showed up was pretty knowledgable, had a
laptop, and had an internet connection.

The session went well nonetheless. After a bit of speech about
pushing hybrid mobile apps to the forefront, my Nexus 7 and Flame were passed
around to demo the sample hybrid mobile app running. It just had a simple
camera button. That morning, everyone had received a free Firefox Flame for
attending Mozfest so it turned more into WebIDE session on how to get an app on
the Flame. [My coworker who attended](http://muffinresearch.co.uk/) was
able to get the accelerometer working with a "Shake Me / I was shaken." app,
and I was able to get geolocation working with an app that displays longitude
and latitude coordinates with the GPS.

## What I Thought About Mozfest

There was a lot of energy in the building. Unfortunately, the energy didn't
reach me, especially since I was heavily aircraft-latencied. Maybe conferences
aren't my thing. The place was hectic. Hard to find out what was where. I tried
to go to a session that was labeled as "The 6th Floor Hub", which turned out to
be a small area of a big open room labelled with a hard-to-spot sign that said
"The Hub". When I got there, there was no session being held despite the
schedule saying so as the facilitator was MIA.

The sessions didn't connect with me. Perhaps I wanted something more technical
and concrete that I could takeaway and use, but most sessions were abstract.
There was a big push for Mozilla Webmaker and Appmaker, though those aren't
something I use often. They're great teaching tools, but I usually direct to
Codecademy for those who want to learn to build stuff.

There was a lot of what I call "the web kool-aid". Don't get me wrong, I love
the web, I've drank a lot of the kool-aid, but there was a lot of championing
of the web in the keynotes. I guess "agency" is the new buzzword now. Promoting
the web is great, though I've just heard it all before.

However, I was glad to add value to those who found it more inspiring and
motivating than me. I believe my session went well and attendees took away
something hard and practical. As for me, I was just happy to get back home
after a long day of travel and go replace my phone.
