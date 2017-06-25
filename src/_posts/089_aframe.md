---
title: "A-Frame - Virtual Reality on the Web Simplified"
type: blog
layout: blog
date: 2015-12-16
id: aframe
tags: [code]

image:
  url: http://i.imgur.com/TyqA9Gwl.png
  caption: A psychadelic example I created with A-Frame VR.
---

Today, the Mozilla virtual reality team ([MozVR](http://mozvr.com))
released an open-source library for beginners and developers alike to easily
create WebVR experiences. It's called [A-Frame](http://aframe.io). A-Frame
wraps three.js into custom elements so the HTML and DOM manipulations that web
developers are accustomed to can be used to create 3D VR scenes in the
browser. Under the hood, A-Frame brings the [entity component
system](https://en.wikipedia.org/wiki/Entity_component_system), a pattern
common in game development, to the DOM. It supports both desktop, if you got a
Rift, or easier, you can even use a smartphone. This post serves as a
speed-through introduction of A-Frame, refer the
[documentation](http://aframe.io/docs) at any time for much more detail.

---

A-Frame, like the video games that have influenced all of us, ships at a
several difficulty levels. We'll journey all the way from the comfortable bed
of hierarchical HTML, through the jungles of the core entity-component system,
and finally scale the walls of integration with [React](https://facebook.github.io/react/).

![](http://i.imgur.com/tf9DteR.png)
<div class="page-caption"><span>
  Check out A-Frame stylin' with the DevTools.
</span></div>

## Enabling WebVR

At time of writing, to view the scenes in VR:

- On desktop, get Firefox Developer Edition or Firefox Nightly, and install the
  [WebVR Enabler Add-on][addon]. To use with an Oculus Rift DK2, have the Oculus
  runtime installed (0.5.x for OS X).
- On mobile, just open any A-Frame site using your phone browser (e.g., Firefox
  for iOS, Firefox for Android, Chrome for Android, Safari for iOS).

## "Piece of Cake" Difficulty - Codepen

For those that just want to play around with A-Frame immediately, check out the
[example on Codepen][codepen]. Codepen lets you edit code in the browser and
immediately see the result. You'll see a scene that currenty looks something
like this:

![A-Frame Codepen](http://i.imgur.com/4uSINKZ.png)

With the introductory Codepen examples, we are exposing a very high-level
abstraction on top of A-Frame, using templated primitives, to ease developers
into the entity-component system. So this should be fairly readable to most. Now
what do we do with this?  Click on the Goggles icon to view in VR. And try
modifying some values and see the scene change live.

- Try changing the color of the cube (e.g., `color="#748B9C"` for a rainy day blue).
- Try changing the size of the sphere (e.g., `radius="0.25"` to make it a little baby sphere).
- Try changing the position of the cylinder (e.g., `position="1 1 1"` to raise the roof).

As amazing as that was, a Codepen is still a pen. The ambitions of VR are not
suitable for being fenced in. Like the Kool-Aid Man, we must break out of the
confinements of a coding playground.

## "Let's Rock" Difficulty - Boilerplate

For beginners that want to start playing with some toy scenes locally and hacking away,
check out the basic [A-Frame boilerplate](https://github.com/aframevr/aframe-boilerplate).
Boilerplate refers to pre-written reusable code that can be made your own with
minimal modification.

Note that I say this intended for beginners because it focuses on using the
templated primitives abstraction and hides away the underlying engine. For
developers that want to get their hands dirty, I would skip this and move
directly to the entity-component system.

The boilerplate provides the same code found in the Codepen above, but also can
be downloaded as a ZIP package or forked on Github. Once you have the code on
your machine, just modify it in your favorite text editor and fire it up in the
browser.

## "Come Get Some" Difficulty - Primitives

For those that want to start writing scenes from scratch in vanilla HTML, check
out A-Frame's [pre-built primitive](https://aframe.io/docs/primitives/).

A "primitive" in computer graphics is a basic building block like a cube or a
sphere. They are:

- Are pre-fabricated custom elements like `<a-cube>` or `<a-sphere>` that combine
  recipes of components to achieve the intended result.
- Are a convenience and usability wrapper on top of the underlying entity-component system.
- Are much cleaner in syntax but are less flexible and composable than using the
  entity-component system directly.

For example, rather than having:

```html
<a-scene>
  <a-entity>
    <a-entity camera look-controls wasd-controls></a-entity>
  </a-entity>
  <a-entity geometry="primitive: box; depth: 1; height: 1; width: 1" material="color: red">
  </a-entity>
</a-scene>
```

Templates wrap the entity into something more concise:

```html
<a-scene>
  <a-cube color="red" depth="1" height="1" width="1"></a-cube>
</a-scene>
```

Anyone can create their own templates since they are just defined in HTML.
Let's reveal the definition of `<a-cube>`:

```html
<template is="a-template"
          element="a-cube"
          width="1.5"
          height="1.5"
          depth="1.5"
          translate="0 0 0"
          color="gray"
          opacity="1.0"
          shader="standard"
          transparent="true"
          metalness="0.0"
          roughness="0.5"
          src="">
  <a-entity geometry="primitive: box;
                      width: ${width};
                      height: ${height};
                      depth: ${depth};
                      translate: ${translate}"
            material="color: ${color};
                      opacity: ${opacity};
                      shader: ${shader};
                      transparent: ${transparent};
                      metalness: ${metalness};
                      roughness: ${roughness};
                      src: url(${src})"></a-entity>
</template>
```

`<a-cube>` wraps a single entity (with the `geometry.primitive=box`) and
exposes a few component attributes as HTML attributes. Don't worry about the
attributes that seem unfamiliar, we will go over some of them later and point
to the comprehensive documentation.

A-Frame also has [an animation system](http://aframe.io/docs/core/animation.html). Let's try
makng the cube rotate indefinitely. The animation system also works with the core system,
not just templates.

```html
<a-scene>
  <a-cube color="red" depth="1" height="1" width="1">
    <a-animation attribute="rotation" repeat="indefinite" to="0 360 360"></a-animation>
  </a-cube>
</a-scene>
```

### Caveats

Templates *may* be subject to flux such as reimplementation or modularization
into a different repository. From a technical standpoint, A-Frame templates and
primitives are somewhat immature and less flexible, but from a product standpoint,
they are more usable and less exotic to newer users of A-Frame. For full flexbility,
we have to dig deeper.

## "Damn I'm Good" Difficulty - Entity-Component System

For those that want to be unleashed into the full promised power, flexibility,
and composability of A-Frame, we can finally end the hand-waving and check out
the [core entity-component system](http://aframe.io/docs/core/).

Despite having been abstracted away from the aforementioned templates, A-Frame is built on an
entity-component system. Entities are general purpose placeholder objects.
Components modify the appearance, behavior, or functionality of the entities.
And every object in the scene is an entity whether it be the player, a tree, a
monster, the sky, a sound, lights. Components can be mixed and matched,
composed and overridden. A-Frame comes with a bunch of components, and anyone
can write their own components to have objects look however or do whatever
they want. Check out all of the [shipped components](http://aframe.io/docs/components/),
and check out some third-party custom components at [awesome-aframe][awesome-aframe].

Let's start with a blank entity:

```html
<a-entity></a-entity>
```

By default, this lonely entity inherently only has a position, rotation, and
scale in the scene. Without any other components, nothing will render on the
scene. Let's change that, giving it a geometry (shape) and material (appearance).

```html
<a-entity geometry="primitive: sphere" material="color: red"></a-entity>
```

Now we should be seeing something. But why stop there? Let's make it emit light on other
entities.

```html
<a-entity geometry="primitive: sphere" material="color: red"
          light="type: point; intensity: 2"></a-entity>
```

Let's have it stare at the camera.

```html
<a-entity geometry="primitive: sphere" material="color: red"
          light="type: point; intensity: 2" look-at="[camera]"></a-entity>
```

Let's have it emit sound.

```html
<a-entity geometry="primitive: sphere" material="color: red"
          light="type: point; intensity: 2" look-at="[camera]"
          sound="src: squeak.mp3"></a-entity>
```

There are all of these components that can customize our entities. And all
these attributes that can customize our components. And anyone can [write their
own components][write-components], having free reign to add any behavior they
can imagine. Some components we might write include a layout component, a
vibrate component, a cloner component, an explode component, a set-on-fire
component. I am very excited to see what people come up with.

The raw entity-component system is what we consider low-level. But all
low-level things are made to be abstracted. Bring on the hot trend of 2015,
React.

## "Born to be Wild" Difficulty - React

Note that A-Frame + React integration is experimental and is currently my
personal project. I haven't yet stress-tested possible performance limitations
that the Virtual DOM may introduce. [react-three](https://github.com/Izzimach/react-three),
another React library on top of three.js, had limitations because each object
introduced its own `requestAnimationFrame`. React + A-Frame does not have those kinds of
limitations.

React is a great fit with A-Frame now that React v0.14 accepts custom
attributes.  I gave it a shot and within an hour, I developed a [library
integrating A-Frame and React][aframe-react] and [a boilerplate featuring
aframe-react and Webpack][aframe-react-boilerplate].

Why does React work so well with A-Frame?

- A-Frame is already based on custom elements. It does not take much to wrap it with React.
- Reactive updates and data binding vastly reduces the amount of manual DOM manipulation.
- The React ecosystem with NPM provides a great way for sharing A-Frame templates, mixins,
  and components.
- Redux can then be layered on to provide statefulness to the application which will be
  great for editors and tooling.
- Event handling is easier as we can just set event handler functions as props on
  our A-Frame/React components.
- `props` makes it easy to extend and compose A-Frame component data, making A-Frame
  mixins completely obsolete.
- With Babel, a standard tool for transpiling React, giving object rest/spread properties
  and templating strings, passing down components are easy and concise.

Here's an [example scene][react-scene] where clicking a spinning cube changes its color.

```js
class ExampleScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red'
    }
  }

  changeColor = () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  render () {
    return (
      <Scene>
        <Camera><Cursor/></Camera>

        <Sky/>

        <Light type="ambient" color="#888"/>
        <Light type="directional" intensity="0.5" position="-1 1 0"/>
        <Light type="directional" intensity="1" position="1 1 0"/>

        <Entity geometry="primitive: box" material={{color: this.state.color}}
                onClick={this.changeColor}
                position="0 0 -5">
          <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
        </Entity>
      </Scene>
    );
  }
}
```

Using React provides the best of all the worlds. The conciseness of A-Frame
templates, the power of the A-Frame core system, and the ecosystem of NPM. The
scene here is pretty concise and easy to read.

To demonstrate how easy it is to create React components, here is the definition
for a dumb `<Light>` using a stateless React component:

```js
export default const Light = props => {
  return <Entity light={...props}></Entity>;
};
```

I imagine, with the current state of web development, that people will enjoy
this. I know I will.

## Behind the Scenes - Developing A-Frame

Getting more into personal notes, I have been contributing to MozVR and A-Frame over the last
couple months, working on the core entity-component pieces of the system at
[A-Frame Core](http://github.com/aframevr/aframe-core). With Firefox OS
smartphones having "fallen" and with my previous team as well as dissolved,
working in 3D and VR has been immensely exciting. To catch up, I have had to
read and take notes about design, brush up on my linear alegbra, and dive into
the world of 3D rendering. [The Design of Everything Things][design],
[Real-Time Rendering][rendering], [3D Math Primer][3d],
[Rework](https://37signals.com/rework/) and [Virtual Reality Insider][insider]
were all books that came in handy.

The hardest thing about developing on A-Frame was feeling out the target
audience. Should this be for beginners, for everyone and their grandma, for
novices, for seasoned developers? I still don't feel it's been quite resolved.
It's a question that has driven a lot of debates with the API design and
messaging. One instance of contention was the naming of `<a-entity>` vs. the
former `<a-object>`. Or whether or not to hide the entity-component system
behind templates and primitives such that A-Frame does not seem too exotic.

The most fun thing about developing on A-Frame was how much there was to learn
and discover. I was just about to hit a ceiling on the Firefox Marketplace
team; after taking the whole React and Redux journey and absorbing everything,
I had well outgrown the project (well, especially since it was dying). Jumping
into 3D and VR, I accumulated [noob
gains](http://nattyornot.com/bodybuilding-basics-noob-gains-explained/) on 3D
development, rendering, game development patterns, and API design. And working
with a team in-person rather than remotely was refreshing

And there's more to discover like what standard VR interactions will form and
what will VR web browsing look like? It's imagining a future that hasn't come.
Y'all remember bring your A-Frame.

## Further Resources

- Check out the [official docs](http://aframe.io/docs/).
- Connect with us and the community on the [A-Frame Slack channel](http://aframevr.slack.com).
- See a community-populated list of resources at [awesome-aframe][awesome-aframe].

[awesome-aframe]: http://github.com/aframevr/awesome-aframe
[3d]: http://www.amazon.com/Primer-Graphics-Development-Wordware-Library/dp/1556229119
[addon]: https://addons.mozilla.org/en-US/firefox/addon/mozilla-webvr-enabler/
[aframe-react]: http://github.com/ngokevin/aframe-react
[aframe-react-boilerplate]: http://github.com/ngokevin/aframe-react-boilerplate
[design]: http://www.amazon.com/Design-Everyday-Things-Donald-Norman/dp/1452654123
[codepen]: http://codepen.io/team/mozvr/pen/BjygdO?editors=100
[react-scene]: http://github.com/ngokevin/aframe-react-boilerplate/tree/master/src/js/app.js
[rendering]: http://www.realtimerendering.com/
[write-components]: http://github.com/ngokevin/aframe-component-boilerplate
[insider]: http://www.amazon.com/Virtual-Reality-Insider-Guidebook-Industry/dp/0990999920
