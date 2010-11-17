var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Style = require("./style").Style;

var geotools = Packages.org.geotools;
var SLD = geotools.styling.SLD;

var Fill = UTIL.extend(Style, {

    /** api: config[zIndex]
     *  ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
     *  with higher zIndex values will be drawn over symbolizers with lower
     *  values.  By default, symbolizers have a zIndex of ``0``.
     */
    zIndex: 0,
    
    constructor: function Fill(config) {
        if (typeof config === "string") {
            config = {fill: config};
        }
        if (config) {
            this._symbolizer = STYLE_UTIL._builder.createPolygonSymbolizer();
            UTIL.apply(this, config);
        }
        Style.prototype.constructor.apply(this, arguments);
    },
    
    /** api: config[fill]
     *  ``String``
     *  The fill color.  This may be a named CSS color (e.g. ``"fuchsia"``) or a 
     *  hexidecimal color value (e.g. ``"#ff00ff"``).
     */
    set fill(color) {
        var hex = STYLE_UTIL.getHexColor(color);
        if (hex) {
            var fill = SLD.fill(this._symbolizer)
            fill.setColor(STYLE_UTIL._filterFactory.literal(hex));
        } else {
            throw new Error("Can't determine hex color from fillColor '" + color + "'.")
        }
    },
    /** api: property[fill]
     *  ``String``
     *  The fill color.
     */
    get fill() {
        var fill = SLD.fill(this._symbolizer);
        return String(fill.getColor());
    },

    /** api: config[opacity]
     *  ``Number``
     *  The fill opacity (``0``-``1``).
     */
    set opacity(num) {
        var fill = SLD.fill(this._symbolizer)
        fill.setOpacity(STYLE_UTIL._filterFactory.literal(num));
    },
    /** api: property[opacity]
     *  ``Number``
     *  The fill opacity (``0``-``1``).
     */
    get opacity() {
        var fill = SLD.fill(this._symbolizer);
        return Number(fill.getOpacity());
    },
    
    /** private: property[config]
     */
    get config() {
        return {
            type: "Fill",
            fill: this.fill,
            opactiy: this.opacity
        };
    }

});

exports.Fill = Fill;
