---
title: "Language Processing for Improving Prose and Diction"
type: blog
category: blog
date: 2012-03-09
slug: nltk
tags: code

image:
    url: http://i.imgur.com/5F6D1.jpg
    where: right
---

This post is about a script I started writing today called
[Engrish](http://github.com/ngokevin/engrish). For the last week, I have been
studying for a compilers class which makes extensive use of formal language
theory. The midterm is tomorrow, and I am sick LL/LR/LALR parsers, sick enough
to almost be vomiting alphabet soup. Though at the same time, the whole idea of
language processing, outside the context of the class, is interesting. It's
taking something that can be very unstructured and turning it into something
that can be analyzed.

---

An idea came to be earlier this week as I flipped through my unused
technical writing book that I had bought for a writing class. Normally, these
kind of books offer nothing but some tips on structuring documents and other
things everyone should have learned in primary school. To my surprise, there
was a useful section called 'Achieving a Readable Style' which gives keys
on building effective sentences and word choice. It laid out very simply
what to keep in mind while writing as well as what to avoid while writing.

Some pointers included how to vary sentence length, create good verb-to-word
ratios, and write concise prose.  Some things to avoid were pompous language
and passive voice. In the last section the book gave an explicit list of words
to avoid such as buzzwords, business jargon, or dead and redundant phrases.
Even better, it gives words to possibly use instead.

What struck me there there was an explicit list of words, something that could
be programmatically fed into a program and be used to analyze an document such
as an essay. The program would look for these words to avoid and prompt the
user if they would want to replace it with a suggested word. This idea is
relatively simple as it only deals with syntax. It would pay off quickly for me
to write since I have a large writing assignment soon to be due.

Today, I started writing a script which I dubbed
[Engrish](http://github.com/ngokevin/engrish). It would do what was described
above. As I was writing it, I got an ambitious idea. What if it could become
something a little bit bigger than simply suggesting improvements for word
choice? It could also analyze sentences for verb-word ratios and length. The
script could point sentences with low verb-word ratios, point sentences with
high word counts (>20) that could be "refactored", and check if sentences
are varying in length (perhaps even with distribution of lengths).

There's a large Python library called the Natural Language Toolkit
([NLTK](http://nltk.org)) which I can use for language processing and analysis.
There's even a whole O'Reilly book on it (sour about the fall library.nu).
Well, We'll see where this goes. For whimsical ideas, I will throw it into my
"idea stash".  If I ever get around to including blog tags, these will become a
bit more readily accessible. Where is the Doctor with his TARDIS to take me
forward two weeks in time so I would have time to knock down my programming
bucket list?
