var ASSERT = require("assert");
var STYLE = require("geoscript/style");

exports["test: constructor"] = function() {
    
    var symbolizer = new STYLE.Fill({});
    
    ASSERT.ok(symbolizer instanceof STYLE.Fill, "Fill is a Fill");

    var symbolizer = new STYLE.Fill({
        fill: "#ff00ff",
        opacity: 0.7
    });
    ASSERT.strictEqual(symbolizer.fill, "#ff00ff", "stroke color properly set");
    ASSERT.strictEqual(symbolizer.opacity, 0.7, "fill opacity properly set");
    
};

exports["test: fill"] = function() {
    
    var symbolizer = new STYLE.Fill({});
    ASSERT.strictEqual(symbolizer.fill, "#808080", "fill color gray by default");

    symbolizer.fill = "#00FF00";
    ASSERT.strictEqual(symbolizer.fill, "#00ff00", "fill color properly set");

    symbolizer.fill = "green";
    ASSERT.strictEqual(symbolizer.fill, "#008000", "fill color properly set with color name");

};

exports["test: opacity"] = function() {

    var symbolizer = new STYLE.Fill({});
    ASSERT.strictEqual(symbolizer.opacity, 1, "fill opcity 1 by default");

    symbolizer.opacity = 0.8;    
    ASSERT.strictEqual(symbolizer.opacity, 0.8, "fill opacity properly set");
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
