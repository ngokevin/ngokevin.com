---
title: "I Think I Just Mobilefied Myself"
type: blog
category: blog
date: 2013-03-10
slug: mobilefy
tags: code

image:
    url: http://imgur.com/AS71KVP.jpg
    where: top
---

Shrink your browser window, I dare you. I spent my last night plastering on some
good old **responsive web design (RWD)** on top of my big bad blog, ngokevin. It
was well-timed since I have been recently working on RWD for [Firefox
Marketplace's](http://marketplace.firefox.com) app reviewing tools. Initially,
I was not sure where to start on converting my px-based blog to be more fluid.
Really, I was panicking in my seat just simply imagining having to migrate my
whole site from px to em. But then I went into my programming [Avatar
State](http://i.imgur.com/405shFa.jpg), bending my arsenal of media queries at
will.

---

In my Web Developer State, I yielded RWD. **My RWD process**.

- Take a desktop site that looks like complete bollocks when not 1920x1080.
- Using the browser's RWD tools, slowly shrink my browser until everything
  goes to aforementioned bollocks.
- Set a breakpoint with the current width of the page as a media query.

Start off with a shiny new media query with the max-width set to our measured
breakpoint. Note a couple things. We do not use common device widths as our
media query breakpoints; we observe and let the design dictate where our mobile
css is needed. And we do not use px's in our media queries, rather we convert
and use em's since they are smart enough to handle browser zooming.

First things first. Make sure to have a meta tag telling mobile browsers to
not lie about their width as do people lie about their age. Otherwise, our
media queries will be sorrowfully rejected.

    ::html
    <meta name="viewport" content="width=device-width">

Now we start slapping on some width-wary CSS.

    ::scss
    @media all and (max-width: 61.25em) {
        /* CSS when the window width < 980px. */
        #wrap {
            width: 90%;
        }
    }

Following my process earlier, I noticed I had a fixed width page at 940px. When
shrinking the browser below that, the content did not reflow. Thus when past
that 940px point, I tell my container to shrink as the screen shrinks.

After applying some more fixes until satisfaction, I **iterate and repeat my
RWD process**. I shrink my browser some more until the content starts
imploding. The breakpoint this time was 768px, or for my blog, 48em. Time for
another media query.

    ::scss
    @media all and (max-width: 48em) {
        #header {
            margin-bottom: 78px;
            .logos {
                position: static;
                text-align: center;
            }
            #navigation {
                position: static;
                padding-top: 26px;
                text-align: center;
            }
        }
    }

The navigation was now having a spat with my blog header. Here is another
snippet that de-inlines my header elements and puts my navigation block on
another line. The actual CSS does not really matter here, but I am outlining
the iterative process of finding the doom spot, making an encapsulated media
query, and then fixing it.

The fun part about working with responsive web design is that **we do not have
to worry about breaking anything!** It was already initially unusable like fork
in soup, and applying CSS that is enclosed within media queries does not affect
the desktop version. We are free to hack away without worries. Until we reach
our desired effect, it is just us and the CSS.
