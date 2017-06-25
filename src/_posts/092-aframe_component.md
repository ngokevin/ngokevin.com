---
title: "How to Write an A-Frame VR Component"
type: blog
layout: blog
date: 2016-01-17
id: aframe-component
tags: [code]

image:
  url: http://thevrjump.com/assets/img/articles/aframe-system/aframe-example.jpg
  caption: Abstract representation of components by @rubenmueller of thevrjump.com.
---

[boilerplate]: https://github.com/ngokevin/aframe-component-boilerplate
[changelog]: https://github.com/aframevr/aframe/blob/dev/CHANGELOG.md#dev
[collide]: https://github.com/dmarcos/a-invaders/tree/master/js/components
[docs]: https://aframe.io/docs/core/
[follow]: https://jsbin.com/dasefeh/edit?html,output
[geometry]: https://aframe.io/docs/components/geometry.html
[layout]: https://github.com/ngokevin/aframe-layout-component
[light]: https://aframe.io/docs/components/light.html
[look-at]: https://aframe.io/docs/components/look-at.html
[look-controls]: https://aframe.io/docs/components/look-controls.html
[physics]: https://github.com/ngokevin/aframe-physics-components
[position]: https://aframe.io/docs/components/position.html
[rotation]: https://aframe.io/docs/components/rotation.html
[text]: https://github.com/ngokevin/aframe-text-component
[three]: http://threejs.org/
[visible]: https://aframe.io/docs/components/visible.html

[A-Frame](/blog/aframe) is a WebVR framework that introduces the
[entity-component system](/blog/aframe-vs-3dml) ([docs](docs)) to the DOM. The
entity-component system treats every **entity** in the scene as a placeholder
object which we apply and mix **components** to in order to add appearance,
behavior, and functionality. A-Frame comes with some standard components out of
the box like camera, geometry, material, light, or sound. However, people can
write, publish, and register their own components to do **whatever** they want
like have entities [collide/explode/spawn][collide], be controlled by
[physics][physics], or [follow a path][follow]. Today, we'll be going through
how we can write our own A-Frame components.

---

> **Note**: This article is now part of the A-Frame documentation. View the most [up-to-date version](https://aframe.io/docs/master/core/component.html).

## Table of Contents

- [What a Component Looks Like](#what-a-component-looks-like)
    - [From the DOM](#from-the-dom)
    - [Under the Hood](#under-the-hood)
- [Defining the Schema](#defining-the-schema)
    - [Property Types](#property-types)
    - [Single-Property Schemas](#single-property-schemas)
    - [Multiple-Property Schemas](#multiple-property-schemas)
- [Defining the Lifecycle Methods](#defining-the-lifecycle-methods)
    - [Component.init() - Set Up](#component-init-set-up)
    - [Component.update(oldData) - Do the Magic](#component-update-olddata-do-the-magic)
    - [Component.remove() - Tear Down](#component-remove-tear-down)
    - [Component.tick() - Background Behavior](#component-tick-time-background-behavior)
    - [Component.pause() and Component.play() - Stop and Go](#component-pause-and-component-play-stop-and-go)
- [Boilerplate](#boilerplate)
- [Examples](#examples)
    - [Line Component](#line-component)
        - [Line Component - Skeleton](#line-component-skeleton)
        - [Line Component - Schema](#line-component-schema)
        - [Line Component - Update](#line-component-update)
        - [Line Component - Usage](#line-component-usage)

## What a Component Looks Like

A component contains a bucket of data in the form of component properties. This
data is used to modify the entity. For example, we might have an *engine*
component. Possible properties might be *horsepower* or *cylinders*.

![](http://thevrjump.com/assets/img/articles/aframe-system/aframe-system.jpg)
<div class="page-caption"><span>
Abstract representation of a component by @rubenmueller of thevrjump.com.
</span></div>

### From the DOM

Let's first see what a component looks like from the DOM.

For example, the [light component][light] has properties such as type, color,
and intensity. In A-Frame, we register and configure a component to an entity
using an HTML attribute and a style-like syntax:

```html
<a-entity light="type: point; color: crimson; intensity: 2.5"></a-entity>
```

This would give us a light in the scene. To demonstrate composability, we could
give the light a spherical representation by mixing in the [geometry
component][geometry].

```html
<a-entity geometry="primitive: sphere; radius: 5"
          light="type: point; color: crimson; intensity: 2.5"></a-entity>
```

Or we can configure the position component to move the light sphere a bit to the right.

```html
<a-entity geometry="primitive: sphere; radius: 5"
          light="type: point; color: crimson; intensity: 2.5"
          position="5 0 0"></a-entity>
```

Given the style-like syntax and that it modifies the appearance and behavior of
DOM nodes, component properties can be thought of as a rough analog to CSS. In
the near future, I can imagine component property stylesheets.

### Under the Hood

Now let's see what a component looks like **under the hood**. A-Frame's most
basic component is the [position component][position]:

```js
AFRAME.registerComponent('position', {
  schema: { type: 'vec3' },

  update: function () {
    var object3D = this.el.object3D;
    var data = this.data;
    object3D.position.set(data.x, data.y, data.z);
  }
});
```

The position component uses only a tiny subset of the component API, but what
this does is register the component with the name "position", define a `schema`
where the component's value with be parsed to an `{x, y, z}` object, and when
the component initializes or the component's data updates, set the position of
the entity with the `update` callback. `this.el` is a reference from the
component to the DOM element, or entity, and `object3D` is the entity's
[three.js][three]. Note that A-Frame is built on top of three.js so many
components will be using the three.js API.

So we see that components consist of a name and a definition, and then they can
be registered to A-Frame. We saw the the position component definition defined
a `schema` and an `update` handler. Components simply consist of the `schema`,
which defines the shape of the data, and several handlers for the component to
modify the entity in reaction to different types of events.

Here is the current list of properties and methods of a component definition:

| Property | Description |
| -------- | ----------- |
| data     | Data of the component derived from the schema default values, mixins, and the entity's attributes. |
| el       | Reference to the [entity](https://aframe.io/docs/core/entity.html) element. |
| schema   | Names, types, and default values of the component property value(s). |

| Method | Description |
| ------ | ----------- |
| init   | Called once when the component is initialized. |
| update | Called both when the component is initialized and whenever the component's data changes (e.g, via *setAttribute*). |
| remove | Called when the component detaches from the element (e.g., via *removeAttribute*). |
| tick   | Called on each render loop or tick of the scene. |
| play   | Called whenever the scene or entity plays to add any background or dynamic behavior. |
| pause  | Called whenever the scene or entity pauses to remove any background or dynamic behavior. |

## Defining the Schema

The component's schema defines what type of data it takes. A component can
either be single-property or consist of multiple properties. And properties
have *property types*. Note that single-property schemas and property types are
being released in A-Frame `v0.2.0`.

A property might look like:

```js
{ type: 'int', default: 5 }
```

And a schema consisting of multiple properties might look like:

```js
{
  color: { default: '#FFF' },
  target: { type: 'selector' },
  uv: {
    default: '1 1',
    parse: function (value) {
      return value.split(' ').map(parseFloat);
    }
  },
}
```

Since components in the entity-component system are just buckets of data that
are used to affect the appearance or behavior of the entity, the schema plays a
crucial role in the definition of the component.

### Property Types

A-Frame comes with several built-in property types such as `boolean`, `int`,
`number`, `selector`, `string`, or `vec3`. Every single property is assigned a
type, whether explicitly through the `type` key or implictly via inferring the
value. And each type is used to assign `parse` and `stringify` functions. The
parser deserializes the incoming string value from the DOM to be put into the
component's data object. The stringifier is used when using `setAttribute` to
serialize back to the DOM.

We can actually define and register our own property types:

```js
AFRAME.registerPropertyType('radians', {
  parse: function () {

  }

  // Default stringify is .toString().
});
```

### Single-Property Schemas

If a component has only one property, then it must either have a `type` or a
`default` value. If the type is defined, then the type is used to parse and
coerce the string retrieved from the DOM (e.g., `getAttribute`). Or if the
default value is defined, the default value is used to infer the type.

Take for instance the [visible component][visible]. The schema property
definition implicitly defines it as a boolean:

```js
AFRAME.registerComponent('visible', {
  schema: {
    // Type will be inferred to be boolean.
    default: true
  },

  // ...
});
```

Or the [rotation component][rotation] which explicitly defines the value as a `vec3`:

```js
AFRAME.registerComponent('rotation', {
  schema: {
    // Default value will be 0, 0, 0 as defined by the vec3 property type.
    type: 'vec3'
  }

  // ...
});
```

Using these defined property types, schemas are processed by
`registerComponent` to inject default values, parsers, and stringifiers for
each property. So if a default value is not defined, the default value will be
whatever the property type defines as the "default default value".

### Multiple-Property Schemas

If a component has multiple properties (or one named property), then it consists of
one or more property definitions, in the form described above, in an object keyed by
property name. For instance, a physics body component might define a schema:

```js
AFRAME.registerComponent('physics-body', {
  schema: {
    boundingBox: {
      type: 'vec3',
      default: { x: 1, y: 1, z: 1 }
    },
    mass: {
      default: 0
    },
    velocity: {
      type: 'vec3'
    }
  }
}
```

Having multiple properties is what makes the component take the syntax in the
form of `physics="mass: 2; velocity: 1 1 1"`.

With the schema defined, all data coming into the component will be passed
through the schema for parsing. Then in the lifecycle methods, the component
has access to `this.data` which in a single-property schema is a value and in a
multiple-propery schema is an object.

## Defining the Lifecycle Methods

### Component.init() - Set Up

`init` is called once in the component's lifecycle when it is mounted to the
entity. `init` is generally used to set up variables or members that may used
throughout the component or to set up state. Though not every component will
need to define an `init` handler. Sort of like the component-equivalent method
to `createdCallback` or `React.ComponentDidMount`.

For example, the `look-at` component's `init` handler sets up some variables:

```js
init: function () {
  this.target3D = null;
  this.vector = new THREE.Vector3();
},

// ...
```

Example uses of `init` by some of the standard A-Frame components:

| Component     | Usage |
| ---------     | ----- |
| camera        | Create and set a THREE.PerspectiveCamera on the entity. |
| cursor        | Attach event listeners. |
| light         | Register light to the lighting system. |
| look-at       | Create a helper vector. |
| material      | Set up variables, mainly to visualize the state of the component. |
| wasd-controls | Set up an object to keep track of pressed keys. Bind methods. |

### Component.update(oldData) - Do the Magic

The `update` handler is called both at the beginning of the component's
lifecycle with the initial `this.data` *and* every time the component's data
changes (generally during the entity's `attributeChangedCallback` like with a
`setAttribute`). The update handler gets access to the previous state of the
component data passed in through `oldData`. The previous state of the component
can be used to tell exactly which properties changed to do more granular
updates.

The update handler uses `this.data` to modify the entity, usually interacting
with three.js APIs. One of the simplest update handlers is the
[visible][visible] component's:

```js
update: function () {
  this.el.object3D.visible = this.data;
}
```

A slightly more complex update handler might be the [light][light] component's,
which we'll show via abbreviated code:

```js
update: function (oldData) {
  var diffData = diff(data, oldData || {});

  if (this.light && !('type' in diffData)) {
    // If there is an existing light and the type hasn't changed, update light.
    Object.keys(diffData).forEach(function (property) {
      light[property] = diffData[property];
    });
  } else {
    // No light exists yet or the type of light has changed, create a new light.
    this.light = this.getLight(this.data));

    // Register the object3D of type `light` to the entity.
    this.el.setObject3D('light', this.light);
  }
}
```

The entity's `object3D` is a plain THREE.Object3D. Other three.js object types
such as meshes, lights, and cameras can be set with `setObject3D` where they
will be appeneded to the entity's `object3D`.

Example uses of `update` by some of the standard A-Frame components:

| Component     | Usage |
| ---------     | ----- |
| camera        | Set THREE.PerspectiveCamera object properties such as aspect ratio, fov, or near/far clipping planes. |
| look-at       | Set or update target entity to track the position of.
| material      | If component is just attaching, create a material. If shader has not changed, update material. If shader has changed, replace the material.
| wasd-controls | Update the position based on the current velocity. Update the velocity based on the keys pressed.

### Component.remove() - Tear Down

The `remove` handler is called when the component detaches from the entity such
as with `removeAttribute`. This is generally used to remove all modifications,
listeners, and behaviors to the entity that the component added.

For example, when the [light component][light] detaches, it removes the light
it previously attached from the entity and thus the scene:

```js
remove: function () {
  this.el.removeObject3D('light');
}
```

Example uses of `remove` by some of the standard A-Frame components:

| Component     | Usage |
| ---------     | ----- |
| camera        | Remove the THREE.PerspectiveCamera from the entity. |
| geometry      | Set a plain THREE.Geometry on the mesh. |
| material      | Set a default THREE.MeshBasicMaterial on the mesh and unregister material from the system. |
| wasd-controls | Remove keydown and keyup listeners. |

### Component.tick(time) - Background Behavior

The `tick` handler is called on every single tick or render loop of the scene.
So expect it to run on the order of 60-120 times for second. The global uptime of
the scene in seconds is passed into the tick handler.

For example, the [look-at][look-at] component, which instructs an entity to
look at another target entity, uses the tick handler to update the rotation in
case the target entity changes its position:

```js
tick: function (t) {
  // target3D and vector are set from the update handler.
  if (this.target3D) {
    this.el.object3D.lookAt(this.vector.setFromMatrixPosition(target3D.matrixWorld));
  }
}
```

Example uses of `tick` by some of the standard A-Frame components:

| Component     | Usage |
| ---------     | ----- |
| look-at       | Update rotation of entity to face towards tracked target, in case the target is moving.
| physics       | Update the physics world simulation.
| wasd-controls | Use current velocity to move the entity (generally the camera), update velocity if keys are pressed.

### Component.pause() and Component.play() - Stop and Go

To support pause and play, just as with a video game or to toggle entities for
performance, components can implement `play` and `pause` handlers. These are
invoked when the component's entity runs its `play` or `pause` method. When an
entity plays or pauses, all of its child entities are also played or paused.

Components should implement play or pause handlers if they register any
dynamic, asynchronous, or background behavior such as animations, event
listeners, or tick handlers.

For example, the `look-controls` component simply removes its event listeners
such that the camera does not move when the scene is paused, and it adds its
event listeners when the scene starts playing or is resumed:

```js
pause: function () {
  this.removeEventListeners()
},

play: function () {
  this.addEventListeners()
}
```

Example uses of `pause` and `play` by some of the standard A-Frame components:

| Component     | Usage |
| ---------     | ----- |
| sound         | Pause/play sound.
| wasd-controls | Remove/attach event listeners.

## Boilerplate

I suggest that people start off with my [component boilerplate][boilerplate],
even hardcore tool junkies. This will get you straight into building a
component and comes with everything you will need to publish your component
into the wild. The boilerplate handles creating a stubbed component, build
steps for both NPM and browser distribution files, and publishing to Github
Pages.

Generally with boilerplates, it is better to start from scratch and build your
own boilerplate, but the A-Frame component boilerplate contains a lot of tribal
inside knowledge about A-Frame and is updated frequently to reflect new things
landing on A-Frame. The only possibly opinionated pieces about the boilerplate
is the development tools it internally uses that are hidden away by NPM
scripts.

## Examples

### Line Component

Let's go through building a basic complete component, a *line* component. This
line component will simply render a line. We will make it the component
flexible to be able to specify the vertices and color.

> Play with this [example line component in Codepen](https://codepen.io/team/mozvr/pen/yeEQNG).

#### Line Component - Skeleton

Here is a high-level view of the skeleton of the component, without the meat.
For this component, we'll need the `schema`, as all components require, the
`update` handler, and the `remove` handler. The rest of the lifecycle method
handlers aren't necessary.

```js
var coordinates = AFRAME.utils.coordinates;

AFRAME.registerComponent('line', {
  // Allow line component to accept vertices and color.
  schema: {},

  // Create or update the line geometry.
  update: {},

  // Remove the line geometry.
  remove: {}
});
```

#### Line Component -Schema

Since we have two properties we want to accept, `color` and `path`, we will
need a multi-property schema. The `color` property will just be a simple string
that will be fed to `THREE.Color` which does a lot of work for us. The `path`
property will need a custom property type to parse an array of `vec3`s. That
property type does not exist as a built-in type yet, but we can define an
inline parse and stringifier.

```js
  // Allow line component to accept vertices and color.
  schema: {
    color: { default: '#333' },

    path: {
      default: [
        { x: -0.5, y: 0, z: 0 },
        { x: 0.5, y: 0, z: 0 }
      ],

      // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
      parse: function (value) {
        return value.split(',').map(coordinates.parse);
      },

      // Serialize array of vec3s in case someone does
      // setAttribute('line', 'path', [...]).
      stringify: function (data) {
        return data.map(coordinates.stringify).join(',');
      }
    }
  },

  //...
```

The component API is entirely up to us. If we wanted the path to take a
different syntax or abstract it further such that it maybe only accepts a
starting point and a length and handle the math for the developer, that is our
perogative to permissionlessly implement.

The schema will handle the shape of the data so by the time it gets to the
lifecycle handlers, it will be in a nice data structure.

#### Line Component - Update

The `update` handler is called both on component attach and on the entity's
`attributeChangedCallback`. In the update for the line component, we want to
reate a line geometry if it doesn't exist yet, or update it if it does. We can
create a line in `three.js` by combining a `THREE.LineBasicMaterial` and
`THREE.Geometry` and manually pushing vertices.

```js
update: function (oldData) {
  // Set color with material.
  var material = new THREE.LineBasicMaterial({
    color: this.data.color
  });

  // Add vertices to geometry.
  var geometry = new THREE.Geometry();
  this.data.path.forEach(function (vec3) {
    geometry.vertices.push(
      new THREE.Vector3(vec3.x, vec3.y, vec3.z)
    );
  });

  // Apply mesh.
  this.el.setObject3D('mesh', new THREE.Line(geometry, material));
},

// ...
```

For simplicity, we can just update the line by completely replacing it. In
other components, we might want to more granularly update objects for
performance.

When we set the object with `setObject3D`, we specify the object type. In this
case, it is a `mesh`, which is a geometry combined with a material. Other
object types might be `light` or `camera`. `setObject3D` just puts the object
into a map and appends the object under the entity's scene graph
(`THREE.Group`).

#### Line Component - Remove

For removal, we can just use `removeObject3D`:

```js
remove: function () {
  this.el.removeObject3D('mesh');
}
```

This will remove the object from the entity's scene graph.

#### Line Component - Usage

Then we with the line component written and registered, we can use it in HTML:

```html
<a-scene>
  <a-assets>
    <a-mixin id="red" line="color: #E20049"></a-mixin>
  </a-assets>

  <a-entity id="happy-face" position="0 2 -10">
    <a-entity mixin="red" line="path: -1 1 0, -1 0.5 0, -1 0 0"></a-entity>
    <a-entity mixin="red" line="path: 1 1 0, 1 0.5 0, 1 0 0"></a-entity>
    <a-entity mixin="red" line="path: -2 -1 0, 0 -2 0, 2 -1"></a-entity>
  </a-entity>

  <a-sky color="#FFEED0"></a-sky>
</a-scene>
```

And voila!

![](http://i.imgur.com/icggby2.jpg)
<div class="page-caption"><span>
  Happy face with the line component! Play with it on [Codepen](http://codepen.io/team/mozvr/pen/yeEQNG).
</span></div>
