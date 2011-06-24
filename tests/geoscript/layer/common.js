var ASSERT = require("assert");
var Feature = require("geoscript/feature").Feature;
var GEOM = require("geoscript/geom");
var PROJ = require("geoscript/proj");

exports["test: features"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var count, features, feature;
    
        // get all features
        features = layer.features;
        count = layer.count;

        ASSERT.ok(features.hasNext(), "hasNext returns true");
    
        var log = [];
        var testScope = {};
        features.forEach(function() {log.push({args: arguments, scope: this})}, testScope);

        ASSERT.strictEqual(log.length, count, "forEach calls block once for each feature");
        ASSERT.ok(log[0].args[0] instanceof Feature, "forEach calls block with feature");
        ASSERT.strictEqual(log[0].scope, testScope, "forEach calls block with correct scope");
    
        ASSERT.ok(!features.hasNext(), "after forEach, hasNext returns false");
        ASSERT.strictEqual(features.next(), undefined, "if not hasNext, next returns undefined");
    
        // test some additional cursor properties
        features = layer.features;
        ASSERT.strictEqual(features.index, -1, "index is -1 to start");
        ASSERT.strictEqual(features.current, null, "current is null before read");
    
        // read 1 - index: 0
        feature = features.next();
        ASSERT.ok(feature instanceof Feature, "0: next reads a feature");
        ASSERT.strictEqual(features.index, 0, "0: index is 0 after 1 read");
        ASSERT.ok(feature === features.current, "0: current feature set to most recently read");
    
        // skip 3 - index: 3
        features.skip(3);
        ASSERT.strictEqual(features.index, 3, "3: index is 3 after skip");
        ASSERT.ok(feature === features.current, "3: current feature is still last read");
    
        // read 3 - index: 6
        var list = features.read(3);
        ASSERT.strictEqual(list.length, 3, "6: read 3 returns 3");
        ASSERT.ok(list[0] instanceof Feature, "6: list contains features");
        ASSERT.ok(list[2] === features.current, "6: current is most recetly read");
    
        // skip 40 - index: 46
        features.skip(40);
        ASSERT.strictEqual(features.index, 46, "46: index is 46 after skip");
    
        // read 10 - index: 48 (only 49 features)
        list = features.read(10);
        ASSERT.strictEqual(features.index, 48, "48: index is 48 after exhausting cursor");
        ASSERT.strictEqual(list.length, 2, "48: 2 features read");
        ASSERT.strictEqual(features.current, null, "48: current is null after closing cursor");
        
        layer.workspace.close();
    
    };
};

exports["test: update"] = function(getLayer) {
    return function() {
        var layer, cursor, feature;
        
        layer = getLayer();
        
        cursor = layer.query("STATE_ABBR = 'MT'");
        feature = cursor.next();
        cursor.close();

        // modify feature but do not persist changes
        ASSERT.strictEqual(feature.get("STATE_NAME"), "Montana", "original name");
        feature.set("STATE_NAME", "Montucky");
        
        // re-read layer
        layer = getLayer();
        cursor = layer.query("STATE_ABBR = 'MT'");
        feature = cursor.next();
        cursor.close();

        // confirm that original name is still set
        ASSERT.strictEqual(feature.get("STATE_NAME"), "Montana", "same old name");
        
        // set new name
        feature.set("STATE_NAME", "Montucky");
        // and make it bigger while we're at it
        var big = feature.geometry.area;
        feature.geometry = feature.geometry.buffer(2);
        // now persist changes
        layer.update();
        
        // finally, confirm that changes stuck
        layer = getLayer();
        cursor = layer.query("STATE_ABBR = 'MT'");
        feature = cursor.next();
        cursor.close();
        ASSERT.strictEqual(feature.get("STATE_NAME"), "Montucky", "new name");
        ASSERT.ok(feature.geometry.area > big, "bigger");
        
        layer.workspace.close();
    
    };
};

exports["test: bounds"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var bounds = layer.bounds;
        ASSERT.ok(bounds instanceof GEOM.Bounds);
        if (layer.projection) {
            var projection = bounds.projection;
            ASSERT.ok(projection instanceof PROJ.Projection, "has projection");
            ASSERT.ok(projection.equals(layer.projection), "correct projection");
        }
        ASSERT.ok(
            bounds.equals(GEOM.Bounds.fromArray([-124.73142200000001, 24.955967, -66.969849, 49.371735], layer.projection)),
            "correct bounds for layer"
        );
    }
}

exports["test: getBounds"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var bounds = layer.getBounds("STATE_ABBR = 'MT'");
        ASSERT.ok(bounds instanceof GEOM.Bounds);
        if (layer.projection) {
            var projection = bounds.projection;
            ASSERT.ok(projection instanceof PROJ.Projection, "has projection");
            ASSERT.ok(projection.equals(layer.projection), "correct projection");
        }
        ASSERT.ok(
            bounds.equals(GEOM.Bounds.fromArray([-116.0625, 44.35372899999999, -104.04258, 49], layer.projection)),
            "correct bounds for MT"
        );
    }
};

exports["test: query"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        var count, features, feature;

        // query with a filter
        features = layer.query("STATE_ABBR EQ 'TX'");
        ASSERT.ok(features.hasNext(), "hasNext returns true");
    
        feature = features.next();
        ASSERT.strictEqual(feature.get("STATE_ABBR"), "TX", "got feature with expected STATE_ABBR");
    
        ASSERT.isFalse(features.hasNext(), "only one feature in query results");    

        layer.workspace.close();        
    };
};

exports["test: remove"] = function(getLayer) {
    return function() {
        var layer = getLayer();
        ASSERT.strictEqual(layer.count, 49, "49 features before remove");
    
        layer.remove("STATE_NAME = 'Illinois'");
        ASSERT.strictEqual(layer.count, 48, "48 features after remove");  
        
        layer.workspace.close();
    };
};
