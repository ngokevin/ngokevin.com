---
title: "ng-okevin's Angular ch.5 - Forms"
type: blog
category: blog
date: 2014-04-03
slug: angular-5
tags: [code, angularjs]

image:
    url: http://i.imgur.com/FaQEtTM.jpg
    caption: Validation is the foundation of a form.

weight: 5
---

The form, input, select, and textarea elements are augmented (as directives) in
Angular for added sauce. Angular forms have a built-in awareness of their
state, such as whether data has been inputted or whether the forms are valid.
Angular forms provide

- two-way data binding with the model.
- form state.

---

We have covered the two-way data binding in [ch.1 AngularJS](/blog/angular-1).
Form state, however, can be used to conditionally

- enable or disable form controls (e.g. buttons).
- style the form.

With directives though, we can also achieve

- custom form validation.
- custom form controls.

## Form State

A bit about the backend. Angular forms and inputs are instances of
```FormController```. As instances of ```FormController```, form and input
directives contain a handful of useful properties that represent form state.

- ```$pristine```: True if the user has not yet interacted with the form
- ```$dirty```: opposite of ```$pristine```
- ```$valid```: True if all of containing forms and controls are valid
- ```$invalid```: opposite of ```$valid```
- ```$error```: a JS object referencing invalid forms or a mapping of error
  names to booleans

```$error``` is a bit confusing as it has two faces. If getting the ```$error```
attribute from a *form's* ```FormController```, it will be a reference to invalid
form controls.

    ::js
    {"required": [{}], "max": false}

Else if getting the ```$error``` attribute from an *input's*
```FormController```, it will be a mapping of error names to booleans (with
"true" indicating an error).

    ::js
    {"required": false, "max": true}

To reference all these properties though, the form and input directives need to
be given a ```name``` attribute to register it into scope. We can then use
these properties to drive form interaction and behavior.

### Example

In *Muffin Button*, we will create a button that dispenses a number of muffins
to demonstrate form states.

    ::html
    <form name="muffinForm" ng-submit="muffins = muffinNum">
      <input id="muffinNum" type="number" name="muffinNumInput"
             ng-model="muffinNum" min="1" max="255">

      <button ng-disabled="muffinForm.muffinNumInput.$invalid">
        Dispense Muffins
      </button>

      <span ng-show="muffinForm.muffinNumInput.$error.max">
        Muffin Overload!
      </span>

      <img src="muffin.png" ng-repeat="i in [] | range: muffins">
    </form>

*Muffin Button* contains a number input field. Given a number, it dispenses or
displays a respective number of muffins when pressing the muffin button. We use
form states to disable the muffin button on invalid and non-number inputs, and
we also use it to display a specific error message in the case that too many
muffins are requested.

We disabled the button with the ```ng-disabled``` directive when our
HTML5 number input field is invalid. We give the input field the name
```muffinNumInput```. That name can then be referenced from the
```muffinForm``` object in the scope as ```muffinForm.muffinNumInput```. Our
number field dictates whether the form is invalid. If the input is not a
number, is under the min, or over the max,
```muffinForm.muffinNumInput.$invalid``` will be switched on.

However, ```$invalid``` is general catch-all flag. If we want make use of more
detailed form states, we can make use of the ```$error``` attribute to see
specific error flags. In the example, we display an error message with the
```ng-show``` directive when the number input field contains too large of a
number. In that case, the ```max``` flag will be set and can be referenced by
```muffinForm.muffinNumInput.$error.max```.

<iframe src="/files/ng-book/examples/muffinbutton/index.html"></iframe>

### Styling the Form Based on Form State

We can style elements differently based on form states. It is nothing new, we
simply use form states in conjunction with ```ng-class```. With that, we can
give the number input element a red error border when the input is invalid and
green when valid.

As a side thriller, we use ```$pristine``` to not apply these classes when the
form has not been touched. The border color would then initially default to
gray.

    ::html
    <input id="muffinNum" type="number" name="muffinNumInput"
           ng-model="muffinNum" min="1" max="255"
           ng-class="{'error': !muffinForm.$pristine && muffinForm.muffinNumInput.$invalid,
                      'valid': !muffinForm.$pristine && !muffinForm.muffinNumInput.$invalid}">

## Up Next

Scopes, controllers, and templates lay the foundation of the cake. Now we can
start decorating with the frostiest part of Angular,
[Directives](/blog/angularslider), where I demonstrate hands-on how to build a
mobile slider.
