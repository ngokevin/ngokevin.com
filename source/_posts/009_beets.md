---
title: "Beets - CLI Media Library Management for OCD Geeks"
type: blog
category: blog
date: 2011-12-20
slug: beets
tags: code

image:
    url: http://beets.radbox.org/beets.png
    where: right
---

Ever since my very first iPod back in high school, I had been glued to heavy
media library manangement systems such as iTunes or Banshee. They let me import
music to a consolidated library folder, edit ID3 tags and update the file, and
fetch album art. However, managing it through a GUI very quickly became
tedious.

My [bot](http://github.com/ngokevin/mp3-Suite) that fetched music from
[/r/listentothis](reddit.com/r/listentothis) was grabbing anywhere from 20 to
30 songs a day on a cron. Since they were being fetched from YouTube via
youtube-dl, the songs were untagged. After a while, the songs build up, and I
get hundreds or even thousands of songs that are left sitting in my library
untagged. I only wanted to tag songs that I liked which entailed sifting
through them. Ideally, I would want to be able to listen to my music
library from anywhere (e.g. work) and slowly tag or delete songs remotely.

---

Depending on managing my music on my desktop with Banshee was difficult:

- My desktop is usually off so I can't remote into it to actually manage my library.
- Banshee is difficult to use remotely because it is very resource-intensive
- It being a GUI made it not very efficient actions-per-minute wise

I depended too much on Banshee, and needed a command-line alternative.  Then it
happened. I visited a wise elder during my travels along the roads of the
Internet, and he showed me the ancient ways of manging my music from afar.
Behold, [beets](http://beets.radbox.org), *"the media library management system
for obsessive-compulsive music geeks.  The purpose of beets is to get your
music collection right once and for all. It catalogs your collection,
automatically improving its metadata as it goes using the MusicBrainz database.
(It also downloads cover art for albums it imports.) Then it provides a bouquet
of tools for manipulating and accessing your music."*
<br/>
<br/>

**Setup**

You can install beets through pip

    sudo pip install beets

Create a beets config file in your home directory

    vim ~/.beetsconfig

This contains all the configurations you will need for deciding how you want
your library to be managed. Here is mine:

    [beets]
    directory: ~/Music
    library: ~/Music/musiclibrary.blb
    import_copy: yes
    import_write: yes
    import_resume: yes
    import_art: yes
    import_log: ~/.beets.log
    colors: yes
    plugins: bpd lastid

    [paths]
    default: $albumartist/$albumartist - $title
    compilation: $albumartist/$albumartist - $title

    [bpd]
    host: 127.0.0.1
    port: 8080
    password: a

This is just a basic configuration file, and the beets site has pretty good
[documentation](http://readthedocs.org/docs/beets/en/1.0b11/reference/config.html)
on setting it up. Note that there is a difference between your music directory
and your music database/library. Throwing a file into the directory does not
throw it into your music database/library. You must import files (more on that
later) for it to actually be registered in the blob file. Otherwise, it won't show
up in queries and such.

*import_copy* means to physically copy imported media into the library
directory (it is enabled by default). The BPD plugin allows playing the media
and the *lastid* allows tagging via acoustic fingerprinting which means it
actually analyzes songs themeselves to try to determine correct metadata (more
on the autotagger later).
<br/>
<br/>

**Importing Library**

You can import your library with your library's existing metadata, or try out
the autotagger.  The autotagger pits the current metadata (or even uses
acoustic fingerprinting if the plugin is enabled) against an online music
database to try to determine canonical metadata. Using the autotagger is a long,
tedious, and interactive process that will make you quite acquainted with your
library.

To import using existing tags, use the -A option. This is the option I used, and
worked very well. Consider setting import-write to no for the initial import
since there is no need to re-copy the files onto themselves.

    $ beet import -A /my/huge/mp3/library

To import using the autotagger, simply use import.

    $ beet import /path/to/my/music

You can interrupt an import process and resume it later. If you want to cancel
a session, just throw the -P option. If you get a weird database lock, just try again.
It was most likely due to threads colliding.
<br/>
<br/>

**Importing Songs**

If you grab more songs, the process is similar. You can run import and it will copy
it into your music directory if import-write is enabled. What's nice is it will try
to fetch album art for you.

    $ beet import ~/some_great_album

If you want to copy from a folder that contains already-imported music, you can
import incrementally with the -i option to only import new songs.

    beet import -i
<br/>

**Querying Music**

You can run [queries](http://readthedocs.org/docs/beets/en/1.0b11/reference/query.html)
on your database. You can run flat queries or field-specific queries. Beets has special syntax
for queries (field:value for querying, field=value for setting).

    $ beet ls the magnetic fields
    $ beet list artist:dream

You can also get overall library statistics.

    $ beet stats
<br/>
**Modifying Tags**

You can again use queries to modify metadata.

    beet modify [-MWay] QUERY FIELD=VALUE

This will change the field to value for every song that matches the query.

If you change metadata of songs using another method or delete songs without deleting it from the database, you can update the database to reflect these changes with update.

    beet update

-a lot more where that came from-
Official Documentation:
http://readthedocs.org/docs/beets/en/1.0b11/index.html
<br/>
<br/>

**Subsonic**

A very nice complement to a library management system is a streaming player via
web frontend. I used to use [GNUmp3d](http://www.gnu.org/software/gnump3d/)
which allowed me to stream music and video, but
[Subsonic](http://subsonic.org), a free web-based media streamer has many
really cool features including editing tags, multiple users that can see what
each other is listening to, permissions for different users, and ability to
download and upload music all via the frontend. I am currently hosting on on my
webserver.

With the one-two punch of Beets and Subsonic, managing music has never been easier.
