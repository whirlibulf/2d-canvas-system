var autoscale = require("autoscale-canvas");
var Rectangle = require("./lib/rectangle.js");
var Circle = require("./lib/circle.js");

function System(config) {
    this.config = config || "canvas";
    this.renderList = [];
}

System.prototype.init = function (engine) {
    var type, componentSort, that;
    that = this;

    console.log("2D Canvas system loaded");
    this.engine = engine;

    options = this.engine.config(this.config);

    //canvas element
    if (options.element) {
        this.canvas = options.element;
    } else {
        this.canvas = this.createCanvas();
    }

    if (options.retina === true) {
        autoscale(this.canvas);
    }

    //canvas context
    this.context = this.canvas.getContext("2d");

    //canvas size
    this.width = options.width || this.canvas.width;
    this.height = options.height || this.canvas.height;
    if (options.width || options.height) {
        //Only resize if a custom width/height is set
        //Otherwise don't change the original canvas element
        //Since it may already be sized with css or html
        this.resize();
    }

    this.renderables = options.renderables || {};

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
            if (typeof this.renderables[type] !== "function") {
                continue;
            }

            this.renderables[type] = new this.renderables[type](this.engine);

            //render objects need to have a render method
            if (!this.renderables[type].render) {
                delete this.renderables[type];
            }
        }
    }


    //update instance list if a new renderable is created
    this.engine.on("componentCreated", function (type, instance) {
        if (type === "renderable") {
            that.renderList.push(instance);
        }
    });

    //if a renderable is deleted, reset the instance list completely
    //might be an improvement to loop through the list and simply remove
    //only the deleted component
    this.engine.on("componentRemoved", function (type, id) {
        if (type === "renderable") {
            that.renderList.length = 0;
            that.renderList = that.engine.getAll('renderable');
        }
    });
};


function componentSort(a, b) {
    return (a.zIndex || 0) - (b.zIndex || 0);
}

/**
* Sort renderables by z index
* Call the render function of each component
*/
System.prototype.render = function () {
    var i, position, rotation, component;

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

        position = this.engine.get(component._entity, 'position');
        if (position !== undefined) {
            this.context.translate(position.x, position.y);
        } else {
            //Don't draw something if it doesn't have a position
            this.context.restore();
            continue;
        }

        rotation = this.engine.get(component._entity, 'rotation');
        if (rotation !== undefined) {
            this.context.rotate(rotation.angle);
        }

        //TODO: add scale

        this.renderables[component.type].render(this.context, component._entity);

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
