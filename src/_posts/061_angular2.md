---
title: "ng-okevin's Angular ch.2 - Scopes"
type: blog
category: blog
date: 2014-04-06
id: angular-2
tags: [code, angularjs]

image:
    url: http://i.imgur.com/PSGGxhQ.jpg
    caption: Through the eyes of the scope.

weight: 2
---

Angular **scopes** are objects that gives us access to the model. Remember the
model holds the data and state of an MVC application. Besides applying context
against which expressions are evaluated, scopes allow us to:

- access and manipulate the model.
- set event listeners to watch for whenever the model changes.
- enlighten Angular about asynchronous changes to the model.

---

Each Angular application has exactly one **root scope**, which can have child
scopes that inherit from it.

    ::js
    $rootScope.color = 'black';
    childScope = $rootScope.$new();  // Child scope's color is 'black'.
    childScope.color = 'yellow';  // Child scope's color is 'yellow'.

We can assign properties to the scope to update the model, as seen above.
Though, we can implicitly use the scope from the template to manipulate the
model. For now, we will be working with the root scope for simplicity.

### Example

In *Black and Yellow*, we will create two buttons that toggle the color of a
circle between two colors, black and yellow, to demonstrate basic use of the
scope.

    ::html
    <h1>Black and Yellow</h1>
    <div style="background: {{ color }}" ng-init="color = 'white'"></div>
    <button ng-click="color= 'black'">Black</button>
    <button ng-click="color= 'yellow'">Yellow</button>

We instantiate the ```color``` attribute on the root scope with the
```ngInit``` directive. We have the ```div``` watch for changes to ```color```
with the placeholder. Whenever ```color``` changes, the background of the
```div``` changes as well.

To register this behavior with the buttons, we use the ```ngClick``` directive
which attaches an event handler to the DOM element. For the yellow button, we
attach the expression, ```color = 'yellow'```, which will set the attribute of
the scope to be "yellow".

<iframe src="/files/ng-book/examples/blackandyellow/index.html"></iframe>

## *$watch*ing the Model

Sometimes, we want to observe the model for changes. The ```scope``` object
exposes an application programming interface (API), a handful abstracted useful
functions. Among these functions is ```$watch```, which observes an attribute
on the scope and runs a callback function whenever that attribute changes.

Explicitly using ```$watch``` allows us to run additional logic that consists
of more than simply updating the view. Though in the previous example *Black
and Yellow*, a ```$watch``` was still being implicitly set on ```{{ color
}}```. Whenever ```color``` changed, ```$watch``` automatically updated the
DOM.

Aside, it is worth noting that Angular prefixes the names of its objects and
attributes with ```$``` to avoid accidental namespace collisions.

### Example

In *Gentleman*, we will blink an image when both of two checkboxes are checked,
but to stop blinking when either of the two checkboxes are unchecked, to
demonstrate ```$watch```.

    ::html
    <body ng-controller="GentlemanCtrl">
      <h1>Gentleman</h1>
      <img src="gentleman.png">
      <input type="checkbox" ng-model="mother">
      <label>Mother</label>
      <input type="checkbox" ng-model="father">
      <label>Father</label>
    </body>

This example is slightly more complex; we need to be able to conditionally set
intervals and clear stored timeouts. This is difficult to do with Angular
expressions alone in the template.

Thus, we will be making use of a **controller**. Controllers allow us set up
the initial state and add behavior to scope objects, from the Javascript side.
The controller will give us a scope object. We can then use its ```$watch```
function to observe the checkboxes.

A child scope of the root scope is created under the ```ngController```
directive. As we see, this is one way to create child scopes. We have also been
creating the root scope in the template as well. The ```ngApp``` directive we
have been using to bootstrap our Angular applications has been creating the
root scope.

We pass in the name of our controller, ```GentlemanCtrl``` to associate it with
our new scope.

    ::js
    function GentlemanCtrl($scope) {
        var timeout;

        $scope.$watch('mother', function(newVal, oldVal) {
            if (newVal && $scope.father) {
                // 'Mother' and 'Father' checked.
                motherfather();
            } else if (!newVal) {
                // 'Mother' unchecked.
                clearTimeout(timeout);
            }
        });

        $scope.$watch('father', function(newVal, oldVal) {
            if (newVal && $scope.mother) {
                motherfather();
            } else if (!newVal) {
                clearTimeout(timeout);
            }
        });

        function motherfather() {
            timeout = setInterval(function() {
                $('img').toggleClass('show');
            }, 500);
        }
    }

In the controller, we can ask Angular for the ```$scope``` object by asking for
it as a parameter. Angular will then supply the ```$scope``` through
**dependency injection**. Dependency injection is a method of removing hard-
coded dependencies and making it possible to change them at run-time or
compile-time.

There are better ways of creating controllers that uses a better pattern of
dependency injection and does not involve polluting the global namespace, ways
which will be discussed in [ch.3 Controllers](/blog/angular-3),

We set a ```$watch``` on the scope on ```mother``` and ```father```. When
either attribute changes value, the supplied callback function will execute.

<iframe src="/files/ng-book/examples/gentleman/index.html"></iframe>

## *$apply*ing Changes from Non-Angular Runtime

Scopes let us notify Angular about model changes that occur outside of Angular.
Angular splits the browser-event loop into two separate **runtimes**, or
execution contexts, into classical and Angular runtimes. Only operations that
happen within Angular runtime will propagate to, or update, the view.

Instances of non-Angular runtimes include:

- browser DOM events.
- setTimeout or setInterval.
- asynchronous XMLHttpRequests (XHR or AJAX).
- third-party libraries such as Socket.IO.

When the model changes through these events, we need to call ```$apply``` if we
want to refresh the data-binding from the model to the view. Though in most
cases, ```$apply``` is called for you automatically. Calling ```$apply``` does
several things on the backend:

- enters Angular runtime.
- executes a function within that runtime if supplied.
- calls ```$digest``` which processes the scope's ```$watch``` list

When calling ```$digest```, Angular enters the **digest loop**. ```$digest```
iterates over ```$watch``` list, which contain watchers that may then change
the model even further. This would cause ```$digest``` to then be called again.
This digest loop continues until the model stabilizes, when the ```$watch```
list no longer detects any changes.

*Depiction of Angular Runtime (docs.angularjs.org)*

![runtime](/files/ng-book/img/runtime.png)

### Example

In *HL3 Countdown*, we will create a countdown timer with ```setInterval```
alongside Angular to demonstrate ```$apply```.

    ::js
    function HL3CountdownCtrl($rootScope, $scope) {
        $rootScope.countdown = 9999;

        setInterval(function() {
            $rootScope.$apply(function() {
                $rootScope.countdown--;
            });
        }, 1000);
    }

For variety, we are using ```$rootScope``` to demonstrate more of dependency
injection. We ask for ```$rootScope```, Angular will recognize the name and
supply it to us. Since dependencies are not hard-coded, we can ask for
dependencies in any particular order.

Since ```$rootScope.countdown--``` takes place within a setInterval, it runs
outside of Angular runtime. If we were to not use ```$apply```, ```countdown```
would not be updated to the view, and the countdown would not run. Since we do
call ```$apply```, the data-binding is effectively refreshed, and the countdown
runs.

<iframe src="/files/ng-book/examples/hl3countdown/index.html"></iframe>

Note we put counter-decrementing code within the function passed into
```$apply```. We could just as well call ```$apply``` on its own to achieve
the same effect.

    ::js
    $rootScope.countdown--;
    $rootScope.$apply();

## Up Next

Scopes cover the *M* in MVC. We will pass over the *V* for now and head
directly for the *C*, the controllers. We have slowly been getting introduced
to controllers during this chapter. And now we can naturally delve into the
meatier portions of Angular in [ch.3 Controllers](/blog/angular-3).

As a bonus, check out the full-blown example of [Gentleman with
audio](http://gentleman.ngokevin.com).
