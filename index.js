function System(options) {
  //canvas element
  if (options.element) {
    this.canvas = options.element;
  } else {
    this.canvas = this.createCanvas();
  }

  //canvas context
  this.context = this.canvas.getContext('2d');

  //canvas size
  this.width = options.width || this.canvas.width;
  this.height = options.height || this.canvas.height;
  if (options.width || options.height) {
    //Only resize if a custom width/height is set
    //Otherwise don't change the original canvas element
    //Since it may already be sized with css or html
    this.resize();
  }

  //renderable components
  this.renderables = options.renderableComponents || [];
}

System.prototype.init = function (engine) {
  console.log('2D Canvas system loaded');
  this.engine = engine;
};

/**
 * Get all renderable components
 * Sort them by z index
 * Call the render function of each component
 *
 * At the moment this generates loads of garbage every render tick
 * TODO: add events when components are added and deleted
 * listen to those events and simply update the internal list of renderables
 * instead of getting a new list each loop
 */
System.prototype.render = function () {
  var components, i, position, component;

  //get all renderable components
  components = [];
  for (i = 0; i < this.renderables.length; ++i) {
    components.push(this.engine.getComponentInstances(this.renderables[i]));
  }

  //flatten components array of arrays into a single array
  components = [].concat.apply([], components);

  //sort components by z index
  components.sort(function (a, b) {
    return (b.zIndex || 0) - (a.zIndex || 0);
  });

  //render each renderable component
  for (i = 0; i < components.length; ++i) {
    component = components[i];
    this.context.save();

    if (component._object.position) {
      position = this.engine.getComponentInstance('position', component._object.position);
      this.context.translate(position.x, position.y);
    } else {
      //Don't draw something if it doesn't have a position
      continue;
    }

    if (component._object.rotation) {
      rotation = this.engine.getComponentInstance('rotation', component._object.rotation);
      this.context.rotate(rotation.angle);
    }

    //TODO: add scale

    component.renderCanvas(this.context);

    this.context.restore();
  }
};

System.prototype.createCanvas = function () {
  return document.createElement("canvas");
};

System.prototype.resize = function () {
  this.canvas.width = this.width;
  this.canvas.height = this.height;
};

System.prototype.setWidth = function (width) {
  this.width = width;
  this.resize();
};

System.prototype.setHeight = function (height) {
  this.height = height;
  this.resize();
};

module.exports = System;
