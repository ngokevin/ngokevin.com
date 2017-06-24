---
title: "ng-okevin's Angular ch.3 - Controllers"
type: blog
category: blog
date: 2014-04-05
id: angular-3
tags: [code, angularjs]

image:
    url: http://i.imgur.com/m3VNrQk.jpg
    caption: The controller is in your hands. Ready, player one?

weight: 3
---

Angular controllers help us initialize the initial state and add behavior to
scope objects. Recall that controllers, in the classic MVC pattern, handle the
business logic. They are the glue between the controller and the view.
Controllers tell the view about changes to the model and manipulate the model
when asked by from the view.

---

In the [ch.2 Scopes](/blog/angular-2), we had briefly introduced
controllers by necessity. Controllers are intertwined with scopes in the sense
that controllers

- use scopes to expose their methods to the template to use in expressions.
- define methods that can modify properties on the scope.
- can register ```$watches``` on the model.

### Example

In *Sup, World*, we will print "Sup, world" to demonstrate a more correct
declaration of controllers that do not reside in the global JS scope.

Rather, it is more correct to create an Angular ```module``` and use its
```controller``` factory function to register a controller to the view, to not
pollute the global namespace.

    ::js
    var app = anglar.module('SupWorldApp', []);

    app.controller('SupWorldCtrl', function($scope) {
        $scope.targetOfSalutation = 'World';
    });

```module``` is a global place used to create and register Angular modules.
Though we have not covered them yet, along with controllers, types of Angular
modules include services, directives, and filters.

We pass in the name of the controller along with the controller function with
its dependencies it wants injected.

To use our module, along with our registered ```SupWorldCtrl``` controller,
we must pass the name of our module into the top-level ```ngApp``` directive.
Again, we use the ```ngController``` directive to create the scope and
associate our controller.

    ::html
    <!doctype html>
    <html ng-app="SupWorldApp">
      <body ng-controller="SupWorldCtrl">
        <h1>Sup, {{ targetOfSalutation }}</h1>
      </body>
    </html>

The rest is just like before, this time with a greener global namespace.

## Dependency Injection

We have already briefly trotted around dependency injection. Dependency
injection a pattern of passing instance variables into an object rather than
hard-coding the instance variables from within the object. Big term for a
rather simple concept.

Dependency injection is beneficial because it provides decoupling of code, thus
improving testability and maintainability.

### Example

The following two examples demonstrate functions getting a hold of their
dependencies without dependency injection. These methods hard-code their
depedencies, making it difficult to stub out or mock the dependency in tests.

*No dependency injection: create the dependency*

    ::js
    function SomeClass() {
        this.someDependency = new SomeDependency();
    }

*No dependency injection: global dependency*

    ::js
    var someDependency = new SomeDependency();
    function SomeClass() {
        this.someDependency = someDependency;
    }

By not hard-coding the dependency, we can change them whenever, such as during
testing.

*Dependency injection*

    ::js
    function SomeClass(someDependency) {
        this.someDependency = someDependency;
    }

### Dependency Injection in Controllers

Earlier in *Sup, World*, we properly registered a controller to the view using
an Angular ```module``` and its factory function, ```controller```. There is
yet a more correct method, involving dependency injection.

Javascript minifiers and obfuscators renames parameters of functions. This
would disable Angular's ability to infer a controller's dependencies by its
parameter names. To get around this, we could either use the ```$inject```
method of controllers, or we can inject dependencies using an inline
annotation.

### Example

In *Sup, World*, we will again print "Sup, World" using a different method
to demonstrate declaring controllers with proper dependency injection.

    ::js
    // With better dependency injection.
    app.controller('SupWorldCtrl', ['$scope', function(scope) {
        scope.targetOfSalutation = 'World';
    }]);

In an array , we pass the names of the dependencies we want as strings. We then
pass the controller constructor with its dependencies as its parameters in the
same order. Note we can name the function parameters what we want as long as
they are in the same order as we injected them.

As well as controllers, dependency injection can be used in the other Angular
factory methods for creating services, filters, and directives.

## Methods in the Controller

We can set a method on the scope from within a controller and can call the
method from the template in an expression. It is better practice to place
presentational behavior in the controller, as to please MVC's separation of
concerns. Defining behavior in the view would not only be incorrect but would
also be more difficult as Angular expressions are inherently limited.

### Example

In *Jack in the Box*, we will create a button that, on a random click, pop goes
the weasel, to demonstrate using methods in the controller.

    ::js
    app.controller('JackInTheBoxCtrl', ['$scope', function($scope) {
        $scope.crank = function() {
            if (Math.random() < 0.3) {
                $scope.pop = 'Pop Goes the Weasel!';
            }
        };
    }]);

We define a method in the controller as a property on the scope. We use
```Math.random()``` to set the value of ```pop``` on a *random* click,
something we would not be able to do from the template.

    ::html
    <body ng-controller="JackInTheBoxCtrl">
      <h1>Jack in the Box</h1>
      <div><h2>{{ pop }}</h2></div>
      <button ng-click='crank()'>Crank</button>
    </body>

Then we can call it from the template by passing it to the ```ngClick```
directive, with parenthesis to indicate a function. We could even pass
parameters to the function if we desired.

<iframe src="/files/ng-book/examples/jackinthebox/index.html"></iframe>

## Controller Inheritance

Controller inheritance is based on scope inheritance. Just as scopes can
inherit from other scopes, controllers can inherit from other controllers.
Inner controllers contain their own scopes, while those scopes inherit from
their outer controllers' scopes.

To create a child controller, declare it within the element of the parent
controller with the ```ngController``` directive.

### Example

In *No Church in the Wild*, we will use Kanye West's bar, "What's a mob to a
king? What's a king to a god? What's a god to a non-believer?" to create a a
little food chain heirarchy.

    ::html
    <body ng-init="alpha = 'Kevin'">
      <h1>No Church in the Wild<h1>
      <div ng-controller="NonBelieverCtrl">
        {{ alpha }}
        <div ng-controller="GodCtrl">
          {{ alpha }}
          <div ng-controller="KingCtrl">
            {{ alpha }}
            <div ng-controller="MobCtrl">
              {{ alpha }}

The ```body``` element encompasses the root scope. For each ```ng-
controller```, another child controller is added to the heirarchy. The root
scope's value for ```alpha``` is initialized to "Kevin".

When the ```NonBelieverCtrl``` child controller is created, a new scope is
created that inherits from the root scope, therefore inheriting ```alpha```'s
value of "Kevin". But in the ```NonBelieverCtrl``` controller, we will override
that initial value.

    ::js
    app.controller('NonBelieverCtrl', ['$scope', function($scope) {
        $scope.alpha = 'Non-Believer';
    }]);

    app.controller('GodCtrl', ['$scope', function($scope) {
        $scope.alpha = 'God';
    }]);

We can then continue going down the chain, overriding "Non-Believer" with "God"
in ```GodCtrl```, overriding "God" with "King", then finally overriding "King"
with "Mob".

<iframe src="/files/ng-book/examples/nochurchinthewild/index.html"></iframe>

## Up Next

Time to move onto the last component of *MVC*, the view. We have seen the role
of the controller, how it interacts with the scope. Having exposed some
capabilties of the controller, we now have more expressive power in the
view. In [ch.4 Templates](/blog/angular-4), we will explore more about Angular
templates, although having already been using them in our examples.
