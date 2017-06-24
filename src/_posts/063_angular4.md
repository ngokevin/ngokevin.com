---
title: "ng-okevin's Angular ch.4 - Templates"
type: blog
category: blog
date: 2014-04-04
id: angular-4
tags: [code, angularjs]

image:
    url: http://i.imgur.com/VJBdacX.jpg
    caption: You don't need that HTML Spec Instruction Manual, be a master builder with Angular templates!

weight: 4
---

Angular **templates** are an enhanced specification of HTML that, along with
information from the model, becomes the rendered view that the user sees in the
browser. Recall that the view, in the MVC pattern, generates the output
representation with assistance from the model.

The templates were designed, through the use of directives, to be more
declarative for specifying UI. They are the standard, static DOM sprinkled with
various Angular elements that add behavior to make the view more dynamic and
more closely binded with the model.

---

Angular seasons several different types of spices on top of standard HTML,

- **expressions** that are evaluated JS-like code snippets placed in
  bindings.
- directives that augment existing DOM elements or represent a reusable
  component.
- **filters** that format or prettify data for display.
- form controls that allow the user to input and allow the application to
  validate data.

## Angular Expressions

Angular expressions are like inline JS snippets in the template,
though, following MVC, they are purposely limited in power. They are often
placed in bindings in the form of ```{{ expression }} ``` or in quotes for some
directives.

In previous chapters, we have already been using expressions to evaluate
properties against scopes and to specify event handlers. They can also evaluate
simple mathematical and logical expressions. Example expressions might be

- 1 + 1 * 42
- someScopeAttr
- someScopeAttr || someOtherScopeAttr
- someScopeMethod()

Expressions can also be separated by semicolons. A case where this would be
useful would be within the ```ngInit``` directive, where we could initialize
multiple properties on the scope.

### Angular Expressions vs. Javascript Expressions

Angular expressions are not simply ```eval()```ed JS expressions. Angular
expressions are like a subset of JS expressions. There are several notable
distinctions between the two. Angular

- evaluates attributes against the scope, whereas JS would evaluate
  against the global ```window```.
- resolves errors and exceptions to ```undefined``` or ```null```,
  whereas JS would throw an exception.
- contains no control flow constructs such as conditionals or loops.

### Example

In *An NBA Poem*, we will write a poem involving some basketball memes to
demonstrate Angular expressions.

    ::html
    <body ng-init="theDeludedOne = 'monta'; lebronRings = 0; bromance = true;">
    Not {{ lebronRings + 1 }}. Not {{ lebronRings + 2 }}. Not {{ lebronRings + 3 }}.

    Because {{ theDeludedOne }} have it all.

    {{ chris || 'Cliff' }} and {{ cliff || 'Chris' }} Paul, hoping for the championship.

    While {{ bromance && 'Parsons' || 'Basketball' }} and Lin, a most delicate relationship.

With the scope property ```lebronRings``` initialized to "0", we can perform
simple addition such as in ```{{ lebronRings + 1 }}}``` to yield "1".

Or we can simply output properties, as is, as a string. Such is the case where
```{{ theDeludedOne }}``` evaluates to "monta".

Because expressions are forgiving, even though  ```chris``` has not been
defined, ```{{ chris || 'Cliff' }}``` still evaluates to "Cliff". Attempting to
evaluate this expression in JS would raise a "ReferenceError: chris is not
defined", on the other hand.

The expression ```{{ chris || 'Cliff' }}``` also demonstrates the use of
boolean logic to accomplish a simple conditional without any control flow
constructs. It evaluates ```chris``` if it exists, else it evalutes to "Cliff".

#### Ternary Operations in Expressions

Often in templates, an ```if then else``` kind of evaluation is useful. Angular
expressions do not contain any control flow constructs, however. Traditionally
in JS, we could use an ```if then else``` flow.

    ::js
    if (a) {
        return b;
    } else {
        return c;
    }

JS contains the ternary operator, to make it more succinct

    ::js
    return a ? b : c;

Angular expressions do not contain the ternary operator. Equivalently, we can
use boolean logic to achieve the same control. In *An NBA Poem*, the expression
```{{ bromance && 'Parsons' || 'Basketball }}``` demonstrates an
```if then else``` evaluation. If ```bromance``` is not falsy, then the
expression evaluates to "Parsons", else it evaluates to "Basketball".

## Built-in Directives

Directives teach HTML new tricks and allows us to forge reusable widgets.
Already, we have been using basic built-in Angular directives such as
```ngApp```, ```ngModel```, ```ngController```, and ```ngClick```.

Built-in directives can declared in all of several different styles, via

- element: ```<directive></directive>```
- attribute: ```<div directive="expression"></div>```
- class: ```<div class="directive = 'expression"></div>```
- comment: ```<!--directive: expression-->```

We will delve deeper into directives, and how to craft custom directives, in
*Directives, Teaching an Old HTML New Tricks*.

For now, we will cover some useful directives that have not yet been covered.
The official Angular documentation contains an API reference detailing all of
the directives, totaling over 50 at time of writing.

### ngClass

```ngClass``` allows us to dynamically set CSS classes. We pass an expression
containing class names that are either space-delimited, in an array, or in a
map that maps the classes to boolean values. Often, we use scope properties
to conditionally determine whether a class is to be set.

Note classes set with ```ngClass``` are *appended* to the classes normally set
via the HTML ```class``` attribute.

One way to register the directive is to pass ```expression``` into
```ng-class```. The official Angular docmentation denotes expressions in
brackets when describing directive use, ```{expression}```, but note that it is
for annotation purposes. Expressions should **not** actually be surrounded in
brackets, unless we are passing a map which are coincidentally surrounded by
brackets.

    ::html
    <ANY ng-class="{expression}">
      ...
    </ANY>

#### Example

In *Transformer*, we will create checkboxes that will set classes to transform
an HTML element to demonstrate ```ngClass```.

    ::html
    <div class="box" ng-class="{'border': border, 'circle': circle, 'red': red,
                                'rotate': rotate, 'scale': scale}"></div>
    <label for="rotate">
      <input id="rotate" type="checkbox" ng-model="rotate">Rotate
    </label>

We pass a mapping of classes to expressions. If the expressions are truthy,
then the class is set. For example, enabling the ```#rotate``` input will set
```rotate``` to *true*. The "rotate" class will then be added to the
```div``` on top of its "box" class.

<iframe src="/files/ng-book/examples/transformer/index.html"></iframe>

#### Setting Classes on Specific Values

We can also conditionally set classes based on the specific value of a scope
property with ```ngClass```. In *Transfomer*, pretend ```rotate```'s possible
values are "rotateSmall", "rotateMed", and "rotateLarge". For each, we wish to
set different classes.

    ::html
    <div class="box" ng-class="{rotateSmall: 'rotateSmall red',
                                rotateMed: 'rotateMed green'
                                rotateLarge: 'rotateLarge blue'}[rotate]"></div>

Instead mapping from class names to boolean values, we can map from
property values to class names. We use the scope property to fish the desired
classes. For example, if ```rotate``` is "rotateSmall", then the ```div``` will
have the classes "rotateSmall" and "red".

### ngRepeat

```ngRepeat``` is like a loop in the template. We can loop over an given array
or map and generate a chunk of template on each iteration. Each instantiated
template is given its own scope, and each instantiated template is given access
to temporary variables in context of the loop (e.g. ```$index```, ```$first```,
```$last```). Often, ```ngRepeat``` is used to generate some sort of list
view.

    ::html
    <ANY ng-repeat="{repeatExpression}">
      ...
    </ANY>

#### Example

In *Gym Leaders*, we will present a list of Pokemon gym leaders and their
respective Pokemon to demonstrate ```ngRepeat```.

    ::js
    $scope.gymLeaders = [
        {name: 'Brock', pokemon: ['Geodude', 'Onyx']},
        {name: 'Misty', pokemon: ['Staryu', 'Starmie']},
        {name: 'Lt. Surge', pokemon: ['Voltorb', 'Magnemite', 'Raichu']},
        // ...
    ];

The ```gymLeaders``` data structure is an array of objects which we iterate
through in the template. Note if ```gymLeaders``` is changed, Angular will
```$apply``` the changes, updating the template.

    ::html
    <div ng-repeat="gymLeader in gymLeaders">
      <h2>{{ gymLeader.name }}</h2>
      <span class="ngRepeat: pokemon in gymLeader.pokemon">
        {{ pokemon }}
      </span>
    </div>

We iterate over ```gymLeaders```. In a nested loop, we also iterate through
their ```pokemon```. Each iteration copies the element with the ```ngRepeat```
directive along with whatever is within.

*Template generated by an iteration of ng-repeat*

    ::html
    <div ng-repeat="gymLeader in gymLeaders" class="ng-scope">
      <h2 class="ng-binding">Brock</h2>
      <!-- ngRepeat: pokemon in gymLeader.pokemon -->
      <span class="ngRepeat: pokemon in gymLeader.pokemon ng-scope ng-binding">
        Geodude
      </span>
      <span class="ngRepeat: pokemon in gymLeader.pokemon ng-scope ng-binding">
        Onyx
      </span>
    </div>

```ngRepeat``` can also iterate over JS objects, unpacking the keys and
values. We could have defined ```gymLeaders``` using names of the gym leaders
as keys.

    ::js
    $scope.gymLeaders = {
        'Brock': ['Geodude', 'Onyx'],
        'Misty': ['Staryu', 'Starmie'],
        'Lt. Surge': ['Voltorb', 'Magnemite', 'Raichu'],
        // ...
    };

We could then iterate with ```ngRepeat```, although the order in which we
defined the gym leaders would not be preserved.

    ::html
    <div ng-repeat="(gymLeader, pokemon) in gymLeaders">
        // ...

<iframe src="/files/ng-book/examples/gymleaders/index.html"></iframe>

### ngInclude

```ngInclude``` allows us to fetch, compile, and embed an external HTML
fragment or template. This inherits and creates a new scope. Often, we use
```ngInclude``` to include HTML that we have abstracted into a **partial**, a
separate HTML template, for encapsulation or reusability.

    ::html
    <ANY ng-include="{srcString}">
      ...
    </ANY>

Since we are often including our own partial, ```srcString``` is usually a
relative path to the partial file. Note **cross-origin resource sharing**
(CORS) restrictions still apply to included resources so the partial must be
within the same domain.

#### Example

In *Gym Leaders*, we will recycle our previous example and create a small
partial to use within ```ng-repeat``` to demonstrate ```ng-include```.

    ::html
    <h2>{{ gymLeader.name }}</h2>
    <span class="ngRepeat: pokemon in gymLeader.pokemon">
      {{ pokemon }}
    </span>

We abstract the HTML from within our earlier ```ngRepeat``` loop into its
own partial. When we include the partial, it inherit the scope so the data
bindings will still evaluate properly.

    ::html
    <div ng-repeat="gymLeader in gymLeaders">
      <div ng-include="'partials/gym_leader.html'"></div>
    </div>

Then we simply include our partial. The compiled HTML is identical to had we
not used a partial. Though now the main HTML file is somewhat cleaner, and we
could reuse our partial in other parts of the app if needed.

## Filters

Angular filters format or prettify data for display to the user. They can take
colon-delimited arguments and can also be chained.

    ::js
    {{ expression | firstFilter | secondFilter:arg1:arg2 }}

Angular comes with a handful of handy filters built-in, all of which can be
found in the official Angular API reference.

### Example

In *Hot Chat Phone Bill*, we will create a fake phone bill to demonstrate some
built-in Angular filters.

    ::html
    <dt>ID</dt> <dd>{{ 'oskpmknz' | uppercase }}</dd>
    <dt>Date</dt> <dd>{{ billDate | date:'medium' }}</dd>
    <dt>Charge Amount</dt> <dd>{{ 199.98 | currency }}</dd>

These filters highlight basic use. The ```uppercase``` filter simply transforms
a string to uppercase representation, no strings attached.

Filters can also take argments. The ```date``` demonstrates such, taking a
string format describing how we want the date to be represented. "medium" is
a built-in choice by Angular.

    ::html
    <thead>
      <tr>
        <th ng-click="orderby = 'operator'; reverse = false"><a>Operator</a></th>
        <th ng-click="orderby = 'minutes'; reverse = true"><a>Minutes</a></th>
      </tr>
    </thead>
    <tbody ng-init="orderby = 'minutes'; reverse = true">
      <tr ng-repeat="call in calls | orderBy:(orderby):reverse">
        <td>{{ call.operator }}</td>
        <td>{{ call.minutes }}</td>
      </tr>
    </tbody>

Some filters operate on arrays. ```orderBy``` sorts an array and can take in
multiple arguments. These arguments include what object properties to order by
and whether to sort forwards or backwards.

We sort the call transactions either by the name of the operator or the minutes
of the call. To mix it up, we make it a bit more dynamic, by changing the sort
property and order upon clicking respective table headers.

<iframe src="/files/ng-book/examples/hotchatphonebill/index.html"></iframe>

### Creating Custom Filters

Use the Angular ```module```'s ```filter``` factory method to create and
register a custom filter. The method should take the name of the filter as the
first argument and the filter function as the second argument.

To take arguments, the parameter function should return the filter function.
The filter function should take the input as the first argument. Additional
arguments can also be passed to the function.

    ::js
    angular.module('myModule', []).filter('myFilter', function() {
        return function(input, arg) {
            // Do something with input.
            return input;
        }
    });

The filter can now be called in the template. Sorry, no hot chat examples for
custom filters.

## Up Next

So now we got all this ability to manipulate and display data. Let's take a
quick step into [ch.5 Forms](/blog/angular-5), in which Angular provides
facilities for form validation and styling.
