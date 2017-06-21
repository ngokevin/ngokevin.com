---
title: "Web Design Heuristics"
type: blog
category: blog
date: 2012-11-13
slug: webdesignhacks
tags: code

image:
    url: http://i.imgur.com/MIVvm.jpg
    where: right
---

Last weekend, I built a site for a new club on campus as my first freelance gig
(though I also handled the domain name and hosting). For the past couple
months, I have been a little interested in visual design and user
experience. This design exhibits some tricks I picked up and often use make
things look pretty. I dub this plastic surgery, as it is a quick and simple
path to beautification.

---

## Typography

The easiest way to give your website an entire makeover, change the fonts. The most popular resource is [Google Web Fonts](http://www.google.com/webfonts). They have a wide selection and you can sort by popularity as well as
serif/sans-serif. Try out different fonts and see the changes in character
they make for your site and try to choose a font that matches your site's
purpose.

A good rule of thumb is to choose two fonts, one serif and one sans-serif.
Use the serif for your headers as it looks more elegant and use sans-serif
for your content as it is more readable.

Currently, even this magnificent blog needs a bit of work on the typography
(font-sizing). Typography takes a lot of toying with!

- [Google Web Fonts](http://www.google.com/webfonts)
- A serif font for headers, a sans-serif font for content
- Use a good-sized line height (space between lines of text) for readability
- Have contrast between text and background

## Building a Color Palette

The color palette defines the "mood" of the site. However, it is more important
that your selected colors don't clash. Just like in music, dissonance is not
pleasant to the senses. You can use
[colorschemedesigner](http://colorschemedesigner.com) to get ideas on what
colors work well together and simply browse for colors.

In the example above, I simply opt to use browned-orange as a primary color to
match the header logo and with rare bits of turquoise blue as a complement.
Since the site is dark-themed, I only used a two-color palette since
dark-themed designs already have depth and busy-ness.

Lastly, don't use pure black and pure white without good reason. Black and
white stand out very strongly and obnoxiously demand attention. Instead use
off-blacks and off-whites. You can even add some saturation to give your black
and white colors the most slightest hint of color.

If using a CSS preprocessor, pre-define your colors as global constants and
always use those constants in your CSS color rules (e.g. color: $blue). And as
mentioned earlier, also define your off-blacks and off-whites as constants
(e.g. $black: rgb(10, 10, 10), $white: rgb(245, 245, 245))

- [colorschemedesigner](http://colorschemedesigner.com)
- Keep a simple palette.
- Use off-blacks and off-whites over pure black and pure white.
- Saturate your blacks and whites for subtle color.

## Textures

Using texture patterns in your site gives it nice and subtle detail. A
texture pattern over a plain color background really adds some polish and
makes a difference. [Subtle Patterns](http://subtlepatterns.com), like
Google Web Fonts, is a free collection...but this time for texture patterns
to use as backgrounds.

Just don't go overboard and use ten different textures. It's the modern era
of minimalism. Try using one for your header background, one for your
content background, and one for your footer background.

- [Subtle Patterns](http://subtlepatterns.com)
- Try a texture pattern background over a plain color background.
- Keep it simple and clean and use only two or three textures

## Icon Fonts

Websites with plain headers and links are boring, but images are bulky.
Icon fonts can be mixed in to add some fun and detail. [Font
Awesome](http://fortawesome.github.com/Font-Awesome/) is a growing
collection of free icon fonts. These are especially useful on front pages
where you have headers describing your next cool social network you are
building.

There are many of them, and they can be used in whatever size or color your
specify in the CSS. Just hook up the files in your HTML, and use the "i"
tag with the class name of an icon to drop in an icon. The size can be
changed with font-size.

- [Font Awesome](http://fortawesome.github.com/Font-Awesome/)
