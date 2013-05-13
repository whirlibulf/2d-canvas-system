function Circle(engine) {
  this.engine = engine;
}

Circle.prototype.render = function (context, objectID) {
  var size, color;

  size = this.engine.getComponentInstance(objectID, 'size');
  if (size === undefined) {
    return;
  }

  color = this.engine.getComponentInstance(objectID, 'color');

  context.beginPath();
  context.arc(0, 0, size.radius, 0, 2 * Math.PI, false);

  if (color !== undefined && color.fill) {
    context.fillStyle = color.fill;
  } else {
    context.fillStyle = 'red';
  }

  context.fill();
};

module.exports = Circle;
