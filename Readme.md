
# 2d-canvas-system

2D canvas rendering system for the whirlibulf game engine.

## Required Components

* [whirlibulf/renderable-component](http://github.com/whirlibulf/renderable-component) - The type of renderable
* [whirlibulf/position-component](http://github.com/whirlibulf/position-component) - Position of the renderable

## Optional Components

* [whirlibulf/size-component](http://github.com/whirlibulf/size-component) - Required for primitive shapes
* [whirlibulf/color-component](http://github.com/whirlibulf/color-component) - Required for fill colors
* [whirlibulf/rotation-component](http://github.com/whirlibulf/rotation-component) - Apply a rotation to renderables


## Installation

    $ component install whirlibulf/2d-canvas-system

## Usage

This system *requires* a position component to know where to render objects.

Register the system:

    var Canvas = require('2d-canvas-system');
    var system = new Canvas({
      element: document.getElementById('game'),
      width: 800,
      height: 600,
      renderables: {
        'custom-shape': CustomRenderObject
      }
    });
    game.addSystem(system);

The system takes several options:

### element

This is the HTML canvas element that you wish to render onto.

If you leave this empty, a new off-screen canvas element will be created.

### width and height

The size of the canvas element.

If you leave these out, the size will not be changed, and the canvas will keep whatever CSS or HTML size you may have given it.

### renderables

This is an optional property where you can add your own custom rendering
functions for rendering special types of objects.

This property is an object where the keys are the types, and the values are
a class which implements a `render` function.

For example, if you used this `renderables` option:

    renderables: {
      sprite: Sprite
    }

The system will essentially run this code:

    this.renderObjects['sprite'] = new Sprite(this.engine);

Then `this.renderObjects['sprite'].render(context, component)` will be run in
the render loop whenever a sprite renderable is being drawn.

See the source code for the built-in render types for examples of how to write
a custom render class.

## Built-in Render Types

### rectangle

Requires the `width` and `height` properties from the `size` component.

Uses the `fill` property from the `color` component for the fill color.

### circle

Requires the `radius` property from the `size` component.

Uses the `fill` property from the `color` component for the fill color.

## License

  MIT
