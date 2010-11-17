var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Style = require("./style").Style;

var geotools = Packages.org.geotools;
var SLD = geotools.styling.SLD;

/** api: (define)
 *  module = style
 *  class = Symbolizer
 */

var Symbolizer = UTIL.extend(Style, {
    
    /** api: config[zIndex]
     *  ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
     *  with higher zIndex values will be drawn over symbolizers with lower
     *  values.  By default, symbolizers have a zIndex of ``0``.
     */
    zIndex: 0,

    /** api: constructor
     *  .. class:: Symbolizer
     *
     *      Instances of the symbolizer base class are not created directly.  
     *      See the constructor details for one of the symbolizer subclasses.
     */
    constructor: function Symbolizer(config) {
    },

    /** api: method[clone]
     *  :arg config: ``Object`` Optional configuration object.
     *  :returns: :class:`style.Symbolizer` A symbolizer of the same type as 
     *      this one.
     *
     *  Create a copy of this symbolizer.  The optional ``config`` argument
     *  can be used to override any of this symbolizer's properties for the
     *  clone.
     */
    clone: function(config) {
        config = UTIL.applyIf(config, this.config);
        return new STYLE_UTIL.create(config);
    },

    /** private: property[config]
     */
    get config() {
        return {};
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this symbolizer.
     */
    get json() {
        return JSON.stringify(this.config);
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        var items = [];
        var config = this.config;
        var val;
        for (var key in config) {
            if (key !== "type") {
                val = config[key];
                if (typeof val === "string") {
                    val = '"' + val + '"';
                }
                items.push(key + ": " + val);
            }
        }
        return items.join(", ");
    }

});

exports.Symbolizer = Symbolizer;
