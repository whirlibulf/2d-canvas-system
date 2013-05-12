function Rectangle(engine) {
  this.engine = engine;
}

Rectangle.prototype.render = function (context, objectID) {
  var size;

  size = this.engine.getComponentInstance(objectID, 'size');
  if (size === undefined) {
    return;
  }

  context.beginPath();
  context.rect(0, 0, size.width, size.height);
  //TODO: create a color component and use it here
  context.fillStyle = 'black';
  context.fill();
};

module.exports = Rectangle;
