---
title: "ng-okevin's Angular ch.1 - AngularJS"
type: blog
layout: blog
date: 2014-04-07
id: angular-1
tags: [code, angularjs]

image:
    url: http://i.imgur.com/pg5I3l8.jpg
    caption: Unleash the floodgates! (taken at a dairy farm in Monroe, OR. Pictured is actually a torrent of cow manure.)

weight: 1
---

Welcome to my five-part introduction to AngularJS! Because I was dissatisfied
with the incoherency of the official AngularJS docs. I started writing this
AngularJS guide on weekends during my senior year in college. But since
starting full-time at Mozilla, my motivation and energy waned. So I am
publishing it on my blog for the good of The Web!

This introduction comes complete with live demos and [open-sourced
examples](http://github.com/ngokevin/angularbook).

---

## Table of Contents

- [ch.1 - AngularJS](/blog/angular-1)
- [ch.2 - Scopes](/blog/angular-2)
- [ch.3 - Controllers](/blog/angular-3)
- [ch.4 - Templates](/blog/angular-4)
- [ch.5 - Forms](/blog/angular-5)
- [Directives](/blog/angularslider)
- [Unit Testing](/blog/angular-unit-testing)

## AngularJS

AngularJS, or Angular, is a **model-view-controller** (MVC) client-side
Javascript (JS) application framework that features two-way data binding and
enhances HTML to be more declarative, expressive, and dynamic-friendly. Let us
get some prerequisite concepts out of the way before we dive into hello-
worldish code.

---

## MVC

MVC is a development pattern (or paradigm, if you will) that revolves around a
separation of concerns. I will describe MVC and then apply its concepts to
Angular.

- The **model** holds the data and state.
- The **view** is what the user sees.
- The **controller** is the glue between the model and view.

They connect together. The model powers everything in the background with its
data, though is aware of only itself. The view polls the model for its current
state. Interactions in the view are recognized by the controller to update the
model. An analogy might be a photographer holding a photoshoot with a
supermodel.

- The supermodel's pose is the current state.
- The photographer views the supermodel through the camera lens.
- The photographer directs the supermodel to change poses.

Angular's development pattern is MVC, and Angular strictly adheres to this
separation of concerns. Though in Angular jargon, it is employed more like
scope-template-controller. Worry not, these concepts will be explained once you
are ready, young padawan. Until these concepts are presented properly, we will
still refer to MVC components as model-view-controller.

## Two-Way Data Binding

Remember when I mentioned that the model's state is pushed to the view. Well,
Angular features **two-way data binding**. Not only does the view update
whenever the model changes, but changes to the view automatically updates
back to the model.

This is powerful. It permits us to write less middleman code between the model
and view. Instead we let the model and view go outside and play with each
other, no supervision needed. Referring to our earlier analogy, it would be as
if the photographer struck the same poses in sync with the supermodel.

This saves a lot of trouble by eliminating manual DOM manipulation. I was once
writing an non-Angular web app. It had an ugly function that synced my model
with my view via large block of jQuery code. Every time the user interacted
with the page, I had to call that expensive block of jQuery code to update the
page. I was displeased by this. Thus, I turned to Angular for its two-way
data binding.

## Client-Side Templating

Though, the two-way data binding does not happen without a little push. We need
to hook things together from the client-side **template**. Client-side
templates are usually HTML files that are augmented to be more dynamic. They
are often sprinkled with traditional control structures such as loops and
conditionals. And they contain placeholders that represent specified variables.

If you are familiar with server-side web framework templating, it is just that
but on the client and, in our case, manipulated via JS.

Angular templates are a special flavor of templates. Along with control
structures and variable placeholders, they are also capable of declaring two-
way data bindings and event handlers. In our next example
*Invitation to Angular*, we will get a first glimpse at some Angular.

### Example

In *Invitation to Angular*, we will sync an HTML text input element with a
```p``` element to demonstrate two-way data binding.

```html
<!doctype html>
<html ng-app>
  <head>
    <script src="../lib/js/angular.min.js"></script>
  </head>
  <body>
    <h1>Invitation to Angular</h1>
    <input type="text" ng-model="mySpecies" placeholder="What is your species?">
    <p>
      It is a great honor to bask
      in the presence of a {{ mySpecies || 'human' }}.
    </p>
    <p>Angular humbly welcomes you.</p>
  </body>
</html>
```

```ngApp``` bootstraps the our document to Angular, and we have the input
binded to a model variable species via the ```ngModel``` **directive**.
All we need to know about directives, for now, is that they allow us to
register behavior to the document object model (DOM), the browser's
representation of HTML.

Note when a directive's name is used as an HTML attribute such as in *Baby
Example*, it is spelled with a hyphen (e.g. ```ng-app```). However, the
canonical name for directives in Angular is spelled with camel case (e.g.
```ngApp```).

Now back to the example, the input will read *human* by default if
```mySpecies``` is not set. We accomplish this with an Angular **expression**
in the variable placeholder, {% raw %}{{ mySpecies || 'human' }}{% endraw %}An expression is
like inline code in the template that Angular evaluates.

Say we type "cyberman" into the input box. ```species```'s value in the
backend will automatically update to "cyberman" as we type. Since we have
```species``` under two-way data binding, no ```onchange``` event handlers are
required.

<iframe src="/files/ng-book/examples/invitationtoangular/index.html"></iframe>

## Up Next

With some concepts on our belt and a sneak peek at Angular in action, we will
take a deeper gander at the model side of Angular, the scope, in
[ch.2 Scopes](/blog/angular-2).
