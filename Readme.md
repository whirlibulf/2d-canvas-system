
# 2d-canvas-system

2D canvas rendering system for the whirlibulf game engine.

## Required Components

* [whirlibulf/position-component](http://github.com/whirlibulf/position-component)

## Installation

    $ component install whirlibulf/2d-canvas-system

## Usage

This system *requires* the position component to know where to render objects.

Register the system:

    var Canvas = require('2d-canvas-system');
    var system = new Canvas({
      element: document.getElementById('game'),
      width: 800,
      height: 600,
      renderables: [
        'primitive-shapes'
      ]
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

A list of components that have a `renderCanvas` function.

See the list of compatible components below.

## Compatible Components

* [whirlibulf/primitive-shape-component](http://github.com/whirlibulf/primitive-shape-component)

## License

  MIT
