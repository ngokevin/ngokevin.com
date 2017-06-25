---
title: "Dropdown Component Using Custom Elements (vs. React)"
type: blog
layout: blog
date: 2015-05-14
id: custom-elements-react
tags: [code]

image:
    url: http://i.imgur.com/zPR4gcE.png
    caption: Dropdowns have never been easier and native.
---

We have been building an increasing amount of [Custom
Elements](https://developer.mozilla.org/docs/Web/Web_Components/Custom_Elements),
or Web Components, over at the [Firefox
Marketplace](https://marketplace.firefox.com) (using a
[polyfill](https://github.com/WebReflection/document-register-element)). Custom
Elements are a W3C specification that allow you to define your own HTML
elements. Using Custom Elements, rather than arbitrary JS, encourages
modularity and testability, with portability and reusability being the enticer.

Over the last several months, I worked on revamping the UI for the Firefox
Marketplace. Part of it was building a custom dropdown element that would allow
users to filter apps based on platform compatibility. I wanted it to behave
exactly like a ```<select>``` element, complete with its interface, but with
the full license to style it however I needed.

In this post, I'll go over Custom Elements, introduce an interesting "proxy"
pattern to extend native elements, and then compare Custom Elements with the
currently reigning Component king, [React](http://facebook.github.io/react/).

---

[Custom Select source code](https://github.com/mozilla/fireplace/blob/36ed622f6944a375d5d34e836025895fd149e91d/src/media/js/elements/select.js).

## Building a Custom Element

[Custom
Elements](http://www.html5rocks.com/en/tutorials/webcomponents/customelements/)
are still in working draft, but there is a nice [document.registerElement
polyfill](https://github.com/WebReflection/document-register-element). Here
is an extremely simple Custom Element that simple wraps a ```div``` and
defines some interface on the element's prototype.

```js
document.registerElement('input-wrapper', {
    prototype: Object.create(HTMLElement.prototype, {
        createdCallback: {
            value: function () {
                // Called after the component is "mounted" onto the DOM.
                this.appendChild(document.createElement('input'));
            }
        },
        input: {
            get: function() {
                return this.querySelector('input');
            }
        },
        value: {
            get: function() {
                return this.input.value;
            },
            set: function(val) {
                this.input.value = val;
            }
        }
    })
});

var inputWrapper = document.createElement('input-wrapper');
document.body.appendChild(inputWrapper);
```

We define the interface using Javascript's ```Object.create```, extending the
basic ```HTMLElement```. The element simply wraps an input, and provides a
getter and setter on the input's value. We drop it into the DOM, and it will
natively have whatever interface we defined for it. So we could do something
like ```inputWrapper.value = 5``` to directly set the inner ```input```'s
value. Basic example, but being able to create these native Custom Elements can
go far in modular development.

## Proxy Pattern: Extending the Select Element by Rerouting Interface

Now we got a gist of what a Custom Element is, let's see how we can use it to
create a custom dropdown by extending the native ```<select>``` element.

Here's an example of how our element will be used in the HTML:

```html
<custom-select name="my-select">
  <custom-selected>
    The current selected option is <custom-selected-text></custom-selected-text>
  </custom-selected>
  <optgroup>
    <option value="1">First value</option>
    <option value="2">Second value</option>
    <option value="3">Third value</option>
    <option value="4">Fourth value</option>
  </optgroup>
</mkt-select>
```

What we'll do in the ```createdCallback``` is, if you check the source code,
create an actual internal hidden select element, copying the attributes
defined on ```<custom-select>```. Then we'll create ```<custom-options>```,
copying the original options into the hidden select. We extend the custom
select's interface to have an attribute pointing to the hidden select like so:

```js
select: {
    // Actual <select> element to proxy to, steal its interface.
    // Value set in the createdCallback.
    get: function() {
        return this._select;
    },
    set: function(select) {
        copyAttrs(select, this);
        this._select = select;
    }
},
```

This will allow our custom element to *absorb* the functionality of the
native select element. All we have to do is implement the entire interface of
the select element by routing to the internal select element.

```js
function proxyInterface(destObj, properties, methods, key) {
    // Proxies destObj.<properties> and destObj.<methods>() to
    // destObj.<key>.
    properties.forEach(function(prop) {
        if (Object.getOwnPropertyDescriptor(destObj, prop)) {
            // Already defined.
            return;
        }
        // Set a property.
        Object.defineProperty(destObj, prop, {
            get: function() {
                return this[key][prop];
            }
        });
    });

    methods.forEach(function(method) {
        // Set a method.
        Object.defineProperty(destObj, method, {
            value: function() {
                return this[key][method].call(arguments);
            }
        });
    });
}

proxyInterface(CustomSelectElement.prototype,
    ['autofocus', 'disabled', 'form', 'labels', 'length', 'multiple',
     'name', 'onchange', 'options', 'required', 'selectedIndex', 'size',
     'type', 'validationMessage', 'validity', 'willValidate'],

    ['add', 'blur', 'checkValidity', 'focus', 'item', 'namedItem',
     'remove', 'setCustomValidity'],

    'select');
```

```proxyInterface``` will "route" the property lookups (the first array), and
method calls (the second array) from the custom select element to the internal
select element. Then all we need to do is make sure our select element's value
is up-to-date while we interact with our custom select element, then we can do
things like ```customSelectElement.selectedIndex``` or
```customSelectElement.checkValidity()``` without manually implementing the
interface.

Note we could have simply looped over ```HTMLSelectElement.prototype``` rather
than manually entering in each property and method name, but unfortunately that
doesn't play well with some older browsers.

With all of this, we have a custom select element that is fully stylizable
while having all the functionality of a native select element (because it
extends it!).

## Comparing Custom Elements to React

I love React and am using it for a couple of projects. How does Custom Elements
compare to it?

1. Custom Elements has no answer to React's JSX template/syntax. In most of
our Custom Elements, we have to manually shuffle things around using the native
DOM API. JSX is much, much easier.

2. Custom Elements has no data-binding or automatic DOM updates whenever data
updates. It's all imperative with Custom Elements, you have to listen for changes
and manually update the DOM. React is, well, reactive. Whenever a component's
state, so does its representation in the DOM.

3. Custom Elements is a bit harder to nest components than React. In React,
it's natural for a component to render a component that renders a component
that renders other components. With Custom Elements, it's a bit difficult to
connect components together in a nice heirarchy, and the only communication
you get is through Events.

4. Custom Elements, however, is smaller in KB. React is about 26KB after
min+gzip whereas a Custom Elements polyfill is maybe a few KB. Though the 26KB
might be worth it since you'll end up writing less code, and you get the
performance of virtual DOM diffing.

5. Custom Elements has no answer to React Native.

They're both just as portable, they both can be dropped into any framework.
They both have similar interfaces as well in creating components. Although,
React is more powerful. In React, I really enjoy keeping data compartmentalized
in states and passing down data as props. Loose comparison, but it's like
combining the data-binding and template power of Angular with the ideas of
Custom Elements.

However, it doesn't have to be one or the other either. Why not both? React can
wrap Custom Elements if you want it to. As always, choose the best tools for
the job.
