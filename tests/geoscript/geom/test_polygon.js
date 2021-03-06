var ASSERT = require("assert");
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");
    
exports["test: constructor"] = function() {

    var p = new GEOM.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    ASSERT.ok(p instanceof GEOM.Geometry, "polygon is a geometry");
    ASSERT.ok(p instanceof GEOM.Polygon, "polygon is a polygon");
    ASSERT.strictEqual(p.coordinates.length, 2, "polygon has two items in coordinates");
    ASSERT.strictEqual(p.area, 48600, "polygon has correct area");
    
};

exports["test: json"] = function() {

    var g = new GEOM.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var json = g.json;
    ASSERT.strictEqual(typeof json, "string", "json is string");
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        ASSERT.strictEqual(obj.type, "Polygon", "correct type");
        ASSERT.deepEqual(obj.coordinates, g.coordinates, "correct coordinates");
    } else {
        ASSERT.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: bounds"] = function() {

    var g, b;
    
    var g = new GEOM.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    b = g.bounds;
    
    ASSERT.ok(b instanceof GEOM.Bounds, "is bounds");
    ASSERT.deepEqual([-180, -90, 180, 90], b.toArray(), "is correct bounds");
    
    g.projection = "epsg:4326";
    b = g.bounds;
    ASSERT.ok(b instanceof GEOM.Bounds, "[projection] is bounds");
    ASSERT.deepEqual([-180, -90, 180, 90], b.toArray(), "[projection] is correct bounds");
    ASSERT.ok(b.projection instanceof PROJ.Projection, "[projection] has projection");
    ASSERT.strictEqual(b.projection.id, "EPSG:4326", "[projection] correct projection");

};

exports["test: centroid"] = function() {

    var p = new GEOM.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    
    var c = p.centroid;
    ASSERT.ok(c instanceof GEOM.Point, "centroid is point");
    ASSERT.ok(c.equals(new GEOM.Point([0, 0])), "correct centroid");

};

exports["test: clone"] = function() {

    var p = new GEOM.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);
    var c = p.clone();
    ASSERT.ok(c instanceof GEOM.Polygon, "clone is polygon");
    ASSERT.ok(c.equals(p), "clone is equivalent to original");
    
    c.projection = "EPSG:4326";
    ASSERT.ok(p.projection === undefined, "modifying clone doesn't modify original");
    
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
