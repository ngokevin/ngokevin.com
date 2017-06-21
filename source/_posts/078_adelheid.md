---
title: "Adelheid, an Interactive Photocentric Storybook"
type: blog
category: blog
date: 2014-11-28
slug: adelheid
tags: [code, life, shoot]

image:
    url: http://imgur.com/gyD3V4n.jpg
    caption: Photos scroll along the bottom, pages slide left and right.
---

Half a year ago, I built an interactive photocentric storybook as a gift to my
girlfriend for our anniversary. It binds photos, writing, music, and animation
together into an experential walk down memory lane. I named it
[Adelheid](http://github.com/ngokevin/adelheid), a long-form version of my
girlfriend's name. And it took me about a month of my after-work free time
whenever she wasn't around. Adelheid is an amalgamation of my thoughts as it
molds my joy of photography, writing, and web development
into an elegantly-bound package.

---

![storybook](http://i.imgur.com/dHUr9nR.gif)
<div class="page-caption"><span>
  A preview of the personal storybook I put together.
</span></div>

## Design Process

As before, I wanted it to a representation of myself: photography, writing, web
development. I spent time sketching it out on a notebook and came up with this.
The storybook is divided into chapters. Chapters consist of a song, summary
text, a key photo, other photos, and moments. Moments are like subchapters;
they consist of text and a key photo. Chapters slide left and right like pages
in a book, photos roll through the bottom like an image reel, moments lie
behind the chapters like the back of a notecard, all while music plays in the
background. Then I put in a title page at the beginning that lifts like a stage
curtain.

It took a month of work to bring it to fruition, and it was at last unveiled as
a surprise on a quiet night at Picnic Island Park in Tampa, Florida.

## Technical Bits

With all of the large image and audio files, it becomes quite a large app. My
private storybook contains about **110MB**, as a single-page app! Well, that's
quite ludicrous. However, I made it easy for myself and had it intended to only
be used as a [packaged app](https://developer.mozilla.org/Marketplace/Options/Packaged_apps).
This means I don't have to worry about load times over a web server since all
assets can be downloaded and installed as a desktop app.

Unfortunately, it currently only works well in Firefox. Chrome was targeted
initially but was soon dropped to decrease maintenance time and hit my
deadline. There's a lot of fancy animation going on, and it was difficult to
get it working properly in both browsers. Not only for CSS compatability, but
it currently only works as a packaged app for Firefox. Packaged apps have not
been standardized, and I only configured packaged app manifests for Firefox's
specifications.

After the whole thing, I became a bit more adept at CSS3 animations. This
included the chapter turns, image reels, and moment flips.  Some nice touches
were parallaxed images so the key images transitioned a bit slower to give off
a three-dimensional effect. Also the audio faded in and out between chapter
turns using a web audio library.

You can install the demo app at
[adelheid.ngokevin.com](http://adelheid.ngokevin.com).
