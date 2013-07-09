var autoscale = require("autoscale-canvas");
var Rectangle = require("./lib/rectangle.js");
var Circle = require("./lib/circle.js");

function System(config) {
    this.config = config || "canvas";
    this.renderList = [];
}

System.prototype.init = function (engine) {
    var options;

    console.log("2D Canvas system loaded");
    this.engine = engine;

    options = this.engine.config(this.config);

    //create the canvas element and set up the canvas options
    this.createCanvas(options);

    //add the rendering functions
    this.initRenderables(options.renderables);

    this.engine.on("componentCreated", this.onComponentCreated.bind(this));
    this.engine.on("componentRemoved", this.onComponentRemoved.bind(this));
};

System.prototype.initRenderables = function (renderables) {
    var type;

    this.renderables = renderables || {};

    //default renderables
    if (!this.renderables.rectangle) {
        this.renderables.rectangle = Rectangle;
    }
    if (!this.renderables.circle) {
        this.renderables.circle = Circle;
    }

    //instantiate all the render classes
    for (type in this.renderables) {
        if (this.renderables.hasOwnProperty(type)) {
            this.addRenderable(type);
        }
    }
};

System.prototype.addRenderable = function (type) {
    if (typeof this.renderables[type] !== "function") {
        return;
    }

    this.renderables[type] = new this.renderables[type](this.engine);

    //render objects need to have a render method
    if (!this.renderables[type].render) {
        console.error("Render type '" + type + "' is missing render function");
        delete this.renderables[type];
    }
};

System.prototype.onComponentCreated = function (type, id, entity) {
    //update instance list if a new renderable is created
    if (type === "renderable") {
        this.renderList.push(this.engine.get(entity, type));
    }
};

System.prototype.onComponentRemoved = function (type, id) {
    //if a renderable is deleted, reset the instance list completely
    //might be an improvement to loop through the list and simply remove
    //only the deleted component
    if (type === "renderable") {
        this.renderList.length = 0;
        this.renderList = this.engine.getAll("renderable");
    }
};


function componentSort(a, b) {
    return (a.zIndex || 0) - (b.zIndex || 0);
}

/**
* Sort renderables by z index
* Call the render function of each component
*/
System.prototype.render = function () {
    var i, component;

    //sort by z index
    this.renderList.sort(componentSort);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (i = 0; i < this.renderList.length; ++i) {
        component = this.renderList[i];

        if (component.visible === false) {
            //Object is not visible, skip it
            continue;
        }

        if (!component.type || !this.renderables.hasOwnProperty(component.type)) {
            //Render type is not recognized
            continue;
        }

        this.context.save();
        this.renderComponent(component);
        this.context.restore();
    }
};

System.prototype.renderComponent = function (component) {
    var position, rotation;

    position = this.engine.get(component._entity, "position");
    if (position === undefined) {
        //Don't draw something if it doesn't have a position
        return;
    }
    this.context.translate(position.x, position.y);

    rotation = this.engine.get(component._entity, "rotation");
    if (rotation !== undefined) {
        this.context.rotate(rotation.angle);
    }

    //TODO: add scale

    this.renderables[component.type].render(this.context, component._entity);
};

System.prototype.createCanvas = function (options) {
    if (!options.element) {
        this.canvas = document.createElement("canvas");
    } else {
        this.canvas = options.element;
    }

    //retina scaling
    if (options.retina === true) {
        autoscale(this.canvas);
    }

    //canvas size
    this.width = options.width || this.canvas.width;
    this.height = options.height || this.canvas.height;
    if (options.width || options.height) {
        //Only resize if a custom width/height is set
        //Otherwise don't change the original canvas element
        //Since it may already be sized with css or html
        this.resize();
    }

    //canvas context
    this.context = this.canvas.getContext("2d");
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
