function Rectangle(engine) {
  this.engine = engine;
}

Rectangle.prototype.render = function (context, objectID) {
  var size, color;

  size = this.engine.getComponentInstance(objectID, 'size');
  if (size === undefined) {
    return;
  }

  color = this.engine.getComponentInstance(objectID, 'color');

  context.beginPath();
  context.rect(0, 0, size.width, size.height);

  if (color !== undefined && color.fill) {
    context.fillStyle = color.fill;
  } else {
    context.fillStyle = 'red';
  }

  context.fill();
};

module.exports = Rectangle;
