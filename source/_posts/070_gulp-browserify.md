---
title: "Browserify and Gulp Workflow for React"
type: blog
category: blog
date: 2014-07-30
slug: react-browserify-gulp
tags: [code]
---

The JS world moves quickly. New web tools are adopted faster than new
Spidermans (men?) are produced. One second, people are talking about AngularJS,
RequireJS, and Grunt. The next, it's React, Browserify, and Gulp. Who knows, by
tomorrow we could have some new shiny things called McRib, Modulus, or Chug.
But the new workflows that come along never fail to keep development
interesting and never fail to make our lives easier. Kay, it's time to freshen
up. Let us answer: what is so streets-ahead about these new web technologies?

---

To talk about Browserify and Gulp, we'd need to take a look at their siblings.

- RequireJS is a JS module loader that manages dependencies. Very rough idea
  would be like having Python ```imports``` in JS.
- Grunt is a JS task runner. A common use is the automation of builds of
  frontend codebases (i.e., JS minification, bundling, CSS pre-compilation).
  Very rough idea would be to think of it as a JS Makefile.

Let's explore what the new kids on the block are kicking around.

## Why React?

React is a JS library for building reusuable components.  These components do
not require you to manually set up linking functions or any data binding. Just
call ```render``` and it will refresh in the DOM. React even diffs refreshes to
the DOM to minimize unnecessary re-rendering for very performant view
rendering.

Note that React is not a full MVC framework. As such, It makes a nice wine
pairing with other frameworks. I won't fully dive into React code today, but we
can get a nice workflow set up specifically for it.

## Why Browserify?

To pull in a third-party dependency in RequireJS, one must venture out into the
internet and curl/wget/download/whatever the file into their project. Then they
can ```require```d. Any updates will have to be refetched manually Repeat this
with multiple dependencies for multiple projects, and it becomes a nuisance.
Having to optimize RequireJS projects in another step is a rotten cherry on
top.

Browserify piggybacks ```npm```. Dependencies with Browserify support such as
jQuery, Underscore.js, React, or AngularJS can be hosted on ```npm```,
specified and listed all in ```package.json```, and Browserify will handle the
bundling of these dependencies with your source code into a single file for
you! Browserify even creates a dependency tree to figure out which modules
need and need not to be included in the bundle. Smart lad.

## Why Gulp?

Gulp consist more of code whereas Grunt are structured more towards
configuration. It can be a matter of preference, but Gulp's focus on chained
pipelines and streams make it such that intermediary data or files are not
needed when handling things such as minification and pre-compilation.

Grunt is well-fleshed with its thousands plugins from the community. However,
Gulp is getting there. In the short dip I've taken, Gulp had more than all the
plugins I needed. Either way, you'll be well supported.

Here's my project's gulpfile. It uses ```reactify``` to precompile React JSX
files into normal JS files which is then pipelined to ```browserify``` for
bundling with dependencies. It compiles Stylus files to CSS. And everything's
nicely set up to watch directories and rebuild when needed. I'm pretty giddy.

    ::js
    var gulp = require('gulp');

    var browserify = require('browserify');
    var del = require('del');
    var reactify = require('reactify');
    var source = require('vinyl-source-stream');
    var stylus = require('gulp-stylus');

    var paths = {
        css: ['src/css/**/*.styl'],
        index_js: ['./src/js/index.jsx'],
        js: ['src/js/*.js'],
    };

    gulp.task('clean', function(cb) {
        del(['build'], cb);
    });

    gulp.task('css', ['clean'], function() {
        return gulp.src(paths.css)
            .pipe(stylus())
            .pipe(gulp.dest('./src/css'));
    });

    gulp.task('js', ['clean'], function() {
        // Browserify/bundle the JS.
        browserify(paths.index_js)
            .transform(reactify)
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./src/'));
    });

    // Rerun the task when a file changes
    gulp.task('watch', function() {
        gulp.watch(paths.css, ['css']);
        gulp.watch(paths.js, ['js']);
    });

    // The default task (called when you run `gulp` from cli)
    gulp.task('default', ['watch', 'css', 'js']);

It's finally nice to get outside. Away from the codebase of work. Into the
virtual world. Smell the aromas of fresh technologies. I've grown two years
younger, and with an extra kick in my step.
