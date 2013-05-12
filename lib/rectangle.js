function Rectangle(engine) {
  this.engine = engine;
}

Rectangle.prototype.render = function (context, component) {
  var size;

  if (component._object.size === undefined) {
    return;
  }

  size = this.engine.getComponentInstance('size', component._object.size);

  context.beginPath();
  context.rect(0, 0, size.width, size.height);
  //TODO: create a color component and use it here
  context.fillStyle = 'black';
  context.fill();
};

module.exports = Rectangle;
