var ASSERT = require("assert");
var GEOM = require("geoscript/geom");

exports["test: constructor"] = function() {
    
    var p = new GEOM.Point([1, 2]);
    
    ASSERT.ok(p instanceof GEOM.Geometry, "point is a geometry");
    ASSERT.ok(p instanceof GEOM.Point, "point is a point");
    ASSERT.equal(2, p.coordinates.length, "point has two items in coordinates");
    ASSERT.equal(1, p.x, "correct x coordinate");
    ASSERT.equal(2, p.y, "correct y coordinate");
    ASSERT.ok(isNaN(p.z), "no z");
    
    var p2 = new GEOM.Point([1, 2, 3]);
    ASSERT.equal(3, p2.z, "3d");
    
};

exports["test: equals"] = function() {

    var p1, p2;
    
    p1 = new GEOM.Point([1, 2]);
    p2 = new GEOM.Point([1, 2]);
    ASSERT.ok(p1.equals(p2));
    ASSERT.ok(p2.equals(p1));
    
    p1 = new GEOM.Point([1, 2]);
    p2 = new GEOM.Point([2, 3]);
    ASSERT.ok(!p1.equals(p2));
    ASSERT.ok(!p2.equals(p1));
    
    p1 = new GEOM.Point([1, 2, 3]);
    p2 = new GEOM.Point([1, 2, 3]);
    ASSERT.ok(p1.equals(p2), "[1] 3d");
    ASSERT.ok(p2.equals(p1), "[2] 3d");

    p1 = new GEOM.Point([1, 2, 3]);
    p2 = new GEOM.Point([1, 2, 4]);
    ASSERT.ok(p1.equals(p2), "[1] different z");
    ASSERT.ok(p2.equals(p1), "[2] different z");

    p1 = new GEOM.Point([1, 2]);
    p2 = new GEOM.Point([1, 2, 3]);
    ASSERT.ok(p1.equals(p2), "2d == 3d");
    ASSERT.ok(p2.equals(p1), "3d == 2d");

};

exports["test: json"] = function() {

    var g = new GEOM.Point([1, 2]);
    var json = g.json;
    ASSERT.strictEqual(typeof json, "string", "json is string");
    var obj, msg;
    try {
        obj = JSON.parse(json);
    } catch(err) {
        msg = err.message;
    }
    if (obj) {
        ASSERT.strictEqual(obj.type, "Point", "correct type");
        ASSERT.deepEqual(obj.coordinates, g.coordinates, "correct coordinates");
    } else {
        ASSERT.ok(false, "invalid json: " + msg);
    }
    
};

exports["test: buffer"] = function() {

    var p = new GEOM.Point([0, 0]);
    var b = p.buffer(1);
    
    ASSERT.ok(b instanceof GEOM.Polygon, "buffered point creates a polygon");
    ASSERT.strictEqual(b.area.toFixed(2), "3.12", "almost PI");
    
    b = p.buffer(1, 24);
    ASSERT.strictEqual(b.area.toFixed(2), "3.14", "more arc segments, higher accuracy");

};

exports["test: intersection"] = function() {
    var p1 = new GEOM.Point([0, 0]);
    var p2 = new GEOM.Point([0, 0]);
    var p3 = new GEOM.Point([1, 1]);
    
    var i12 = p1.intersection(p2);
    ASSERT.ok(i12 instanceof GEOM.Point, "intersection is point");
    ASSERT.ok(i12.equals(p1), "correct intersection");
    
    var i13 = p1.intersection(p3);
    ASSERT.ok(i13.isEmpty(), "empty intersection");
    
}

exports["test: clone"] = function() {
    
    var p = new GEOM.Point([0, 0]);
    p.projection = "EPSG:4326";
    
    var c = p.clone();
    ASSERT.ok(c instanceof GEOM.Point, "clone is point");
    ASSERT.ok(c.equals(p), "clone equivalent to original");
    ASSERT.ok(!!c.projection, "clone gets a projection");
    
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
