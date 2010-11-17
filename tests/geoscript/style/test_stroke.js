var ASSERT = require("assert");
var STYLE = require("geoscript/style");

exports["test: constructor"] = function() {

    var symbolizer = new STYLE.Stroke({});

    ASSERT.ok(symbolizer instanceof STYLE.Stroke, "symbolizer is a Stroke");

    var symbolizer = new STYLE.Stroke({
        stroke: "#ff00ff",
        cap: "round"
    });
    ASSERT.strictEqual(symbolizer.stroke, "#ff00ff", "stroke color properly set");
    ASSERT.strictEqual(symbolizer.cap, "round", "stroke line cap properly set");

};

exports["test: strokeColor"] = function() {
    
    var symbolizer = new STYLE.Stroke({});
    ASSERT.strictEqual(symbolizer.stroke, "#000000", "stroke color black by default");

    symbolizer.stroke = "#ff0000";
    ASSERT.strictEqual(symbolizer.stroke, "#ff0000", "stroke color properly set");

    symbolizer.stroke = "silver";
    ASSERT.strictEqual(symbolizer.stroke, "#c0c0c0", "stroke color properly set with color name");
    
};

exports["test: width"] = function() {

    var symbolizer = new STYLE.Stroke({});

    ASSERT.strictEqual(symbolizer.width, 1, "stroke width 1 by default");
    symbolizer.width = 3;
    ASSERT.strictEqual(symbolizer.width, 3, "stroke width properly set");

};

exports["test: opacity"] = function() {

    var symbolizer = new STYLE.Stroke({});

    ASSERT.strictEqual(symbolizer.opacity, 1, "stroke opacity 1 by default");
    symbolizer.opacity = 0.8;    
    ASSERT.strictEqual(symbolizer.opacity, 0.8, "stroke opacity properly set");
    
};

exports["test: cap"] = function() {

    var symbolizer = new STYLE.Stroke({});

    ASSERT.strictEqual(symbolizer.cap, "butt", "stroke line cap butt by default");
    symbolizer.cap = "round";
    ASSERT.strictEqual(symbolizer.cap, "round", "stroke line cap properly set");
    
};

exports["test: dash"] = function() {

    var symbolizer = new STYLE.Stroke({});

    ASSERT.strictEqual(symbolizer.dash, null, "stroke dash array null by default");
    symbolizer.dash = [5, 3, 2, 1];
    ASSERT.deepEqual(symbolizer.dash, [5, 3, 2, 1], "stroke dash array properly set");
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
