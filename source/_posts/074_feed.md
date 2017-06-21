---
title: "Building the Marketplace Feed"
type: blog
category: blog
date: 2014-09-20
slug: feed
tags: [code]

image:
    url: http://i.imgur.com/qS4jHbm.png
    caption: New front page of the Firefox Marketplace.
---

The "Feed", the new feature I spent the last three months grinding out for the
[Firefox Marketplace](http://marketplace.firefox.com). The Feed transforms the
FirefoxOS app store to provide an engaging and customized app discovery
experience by presenting fresh user-tailored content on every visit.  [The
concept was invented by Liu Liu][feed], a Mozilla design intern I briefly hung
out with last year. Well, it quickly gained traction by getting [featured on
Engadget][engadget], presented at the Mozilla Summit, and shown off on
prototypes at Mobile World Congress. With more traction came more pressure to
ship. We built that ship, and it sailed on time.

## Planning Phase

The whole concept had a large scope so we broke it into four versions. For the
first version, we focused on getting initial content pushing into the Feed. We
planned to build a **curation tool** for our editorial team to control the
content of the Feed, with the ability to tailor different content for different
countries. Users would then be able to see fresh and new content on the
homepage every day, thus increasing engagement.

![Curation Tools](http://imgur.com/LGW9nXn.jpg)
<div class="page-caption"><span>
The final product for the Curation Tool, used by the editorial team to feature
content and tailor different content for different countries.
</span></div>

Some time was spent on the feature requirements and specifications as well as
the visual design. We mainly had three engineers: [myself][myself],
[Chuck][chuck], and [Davor][davor]. It was a slow start. Chuck started early on
the technical architecture, building out some APIs and documentation. A few
months later, I started work on the curation tool. My initial work was actually
done off-the-grid [in an RV in the middle of
Alaska](http://imgur.com/LGW9nXn.jpg).

But then the project to [optimize the app for the $25 FirefoxOS
smartphone](/blog/fxos-25-phone/) took over. Once the air cleared, we all
gathered for a work week hosted at Davor's place in Fort Myers, FL (since I was
already in FL for a vacation).

## Building Phase

In early June, we had a solid start during the work week with each of the three
of us on working on separate components: Chuck on the backend API, Davor on the
Feed visuals, me on the curation tools. The face-to-face over remote working
was nice. I could ask any question that came to mind about unclear
requirements, quickly ask for an API endpoint to be whipped up, or check on how
the visuals were looking.

After the foundations were in place, I transitioned to working on all parts of
the feature from ElasticSearch, the API, the JS powering the curation tools and
the Feed, to the CSS for the newer layout of the site. It was a fun grind for a
couple of months just writing and refactoring tons of code, getting dirty with
ElasticSearch, optimizing the backend.

The launch date was set for late August. A couple of weeks out, the feature was
there, but there were some bugs to iron out and tons of polish to be done. The
most sketchy part was having no design mocks for desktop-sized screens so I had
to improvise. The last week and a half was a sprint. I split my day up into 6
hours, a break to play some tournament poker at the poker club, and then 2
hours at night. Throw in a late Friday, and we made it to the finish line.

## Backend Bits

The Feed needed to have an early focus on scalability. We should be able to add
more and more factors (such as where they're from, what device they're using,
apps they previously installed, content they "loved") that tailor the Feed
towards each user. ElasticSearch lets us easily dump a bunch of stuff into it,
and we can do a quick query weighing in all of those factors. We cache the
results behind a CDN, throw in couple of layers of client-side caching, and we
got a stew going.

Figuring out how to relate data between different indices was a difficult
decision. I had [several options in managing relations][esrelation], but chose
to manually denormalize the data and manage the relations myself. This allowed
for flexibility and fine-tuned optimizations without having to wrestle with
ElasticSearch under-the-hood. We had three indices to relate:

- Apps
- Feed Elements - an individual piece of the Feed such as a featured app or a
collection of apps that can contain accompanying descriptions or images.
Many-to-many relationship with Apps.
- Feed Items - a wrapper around Feed Elements containing metadata (region,
category, carrier) that helps determine to whom the Feed Element should be
displayed to. Many-to-many relationship with Feed Elements.

This meant [three ES queries overall][threequery] (and 0 database queries). I
used the new [ElasticSearch Python DSL][pydsl] to help construct queries. Wrote
a query (weighing all of the factors about a user) to fetch Feed Items, a query
to fetch all of the Feed Elements to attach to the Feed Items, and a query to
fetch all of the Apps to attach to the Feed Elements. We throw all of the data
to our [Django Rest Framework][drf] serializers to deserialize the final
response.

A complication was having to filter out apps, such as when an app is not
public, or when an app is banned from the user's region, or when an app is not
supported on the user's device. With time constraints, I wrote the filtering
code in the view. But after the launch, I was able to consolidate our project's
app filtering code into single query factory, use that, and tweak our
serializers to handle filtered apps.

## Frontend Bits

With the Feed being made of visual blocks and components, [encapsulated
template macros][macros] kept things clean. These reusable macros could be
reused by our curation tools to display previews of the Feed on-the-fly for
content curators.  We used Isotope.js to arrange the layout of these visual
blocks.

Our CSS eventually turned messy, having everything being namespaced by the CSS
class *.feed*, and falling under the trap of OOP-style CSS. A good style guide
to follow in the future is [@fat's CSS style guide for Medium][medium].

And since a lot of the code is shared between the frontend of the Firefox
Marketplace and the curation tools, I'm currently trying to get our reusable
frontend assets managed under Bower.

## Conclusion

The Feed is only going to grow in features. It's a breath of fresh air in
comparison to what used to be a never-changing front page on the app store.
I've seen new apps I've never even knew we had and some are actually fun like
[Astro Alpaca](https://marketplace.firefox.com/app/astroalpaca). Hope everyone
likes it!

[feed]:https://blog.mozilla.org/ux/2013/08/firefox-marketplace-in-the-future-customized-app-store-experience/
[engadget]: http://www.engadget.com/2013/08/29/mozilla-marketplace-prototype/
[myself]: https://github.com/ngokevin
[chuck]: https://github.com/chuckharmston
[davor]: https://github.com/spasovski
[esrelation]: http://www.elasticsearch.org/blog/managing-relations-inside-elasticsearch/
[drf]: http://django-rest-framework.org/
[pydsl]: https://github.com/elasticsearch/elasticsearch-dsl-py/blob/master/docs/index.rst
[medium]: https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06
[threequery]: https://github.com/mozilla/zamboni/blob/02362de3e7b5d2d5e00e40deaeff8a959be0b42e/mkt/feed/views.py#L559
[macros]: https://github.com/mozilla/fireplace/blob/05f39d1df726e46d9cb052d13502025758b2db30/src/templates/_macros/feed_item.html#L113
