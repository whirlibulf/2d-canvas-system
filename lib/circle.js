function Circle(engine) {
  this.engine = engine;
}

Circle.prototype.render = function (context, objectID) {
  var size;

  size = this.engine.getComponentInstance(objectID, 'size');
  if (size === undefined) {
    return;
  }

  context.beginPath();
  context.arc(0, 0, size.radius, 0, 2 * Math.PI, false);
  //TODO: create a color component and use it here
  context.fillStyle = 'black';
  context.fill();
};

module.exports = Circle;
