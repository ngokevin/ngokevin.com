---
title: "Extracting Sound from Youtube Videos with youtube-dl"
type: blog
category: blog
date: 2011-12-22
id: youtube-audio
tags: code

image:
    url: http://writingdegreezero.com/wp-content/uploads/2011/05/youtube.png
    where: right
---

One of my first programming pet projects was a set of [wrapper
scripts](http://github.com/ngokevin/mp3-Suite) for youtube-dl with interfaces
to Rapidshare and Reddit. Then, I didn't recall youtube-dl having an option to
extract audio out of videos though previously I did contact the maintainer and
requested it. Eventually, I ended up getting a [pull
request](/blog/20111116-youtube-dl/) into youtube-dl for Soundcloud
functionality. Looking at youtube-dl now, it has very many useful options
including the previously mentioned audio extraction as well as some of what I
implemented (batch processing).

To extract audio from a YouTube:

**youtube-dl --extract-audio --audio-format mp3 -o %\(title\)s [youtube-link]**

---

The -o option lets you specify how you want the output file to be named. I
prefer it as the literal title. It also supports simplified title with no
spaces %\(stitle\)s.

There you go, a clean one-liner for some Youtube harvesting goodness.
