var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Style = require("./style").Style;

var geotools = Packages.org.geotools;
var SLD = geotools.styling.SLD;

var Stroke = UTIL.extend(Style, {

    /** api: config[zIndex]
     *  ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
     *  with higher zIndex values will be drawn over symbolizers with lower
     *  values.  By default, symbolizers have a zIndex of ``0``.
     */
    zIndex: 0,
    
    constructor: function Stroke(config) {
        if (typeof config === "string") {
            config = {stroke: config};
        }
        if (config) {
            this._symbolizer = STYLE_UTIL._builder.createLineSymbolizer();
            UTIL.apply(this, config);
        }
        Style.prototype.constructor.apply(this, arguments);
    },

    /** api: config[stroke]
     *  ``String``
     *  The stroke color.  This may be a named CSS color (e.g. ``"olive"``) or a 
     *  hexidecimal color value (e.g. ``"#808000"``).
     */
    set stroke(color) {
        var hex = STYLE_UTIL.getHexColor(color);
        if (hex) {
            var stroke = SLD.stroke(this._symbolizer);
            stroke.setColor(STYLE_UTIL._filterFactory.literal(hex));
        } else {
            throw new Error("Can't determine hex color from stroke '" + color + "'.")
        }
    },
    /** api: property[stroke]
     *  ``String``
     *  The stroke color.
     */
    get stroke() {
        var stroke = SLD.stroke(this._symbolizer);
        return String(stroke.getColor());
    },

    /** api: config[width]
     *  ``Number``
     *  The stroke width in pixels.
     */
    set width(num) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setWidth(STYLE_UTIL._filterFactory.literal(num));
    },
    /** api: property[width]
     *  ``Number``
     *  The stroke width in pixels.
     */
    get width() {
        var stroke = SLD.stroke(this._symbolizer);
        return Number(stroke.getWidth());
    },

    /** api: config[opacity]
     *  ``Number``
     *  The stroke opacity (``0``-``1``).
     */
    set opacity(num) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setOpacity(STYLE_UTIL._filterFactory.literal(num));
    },
    /** api: property[opacity]
     *  ``Number``
     *  The stroke opacity (``0``-``1``).
     */
    get opacity() {
        var stroke = SLD.stroke(this._symbolizer);
        return Number(stroke.getOpacity());
    },

    /** api: config[cap]
     *  ``String``
     *  The style that determines how lines are capped at the ends.  Allowed 
     *  values are ``"butt"``, ``"round"``, and ``"square"``.  Default is 
     *  ``"butt"``.
     */
    set cap(style) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setLineCap(STYLE_UTIL._filterFactory.literal(style));
    },
    /** api: property[cap]
     *  ``String``
     *  The stroke line cap style.
     */
    get cap() {
        var stroke = SLD.stroke(this._symbolizer);
        return String(stroke.getLineCap());
    },
    
    /** api: config[dash]
     *  ``Array``
     *  The stroke dash style.  The first number gives the length in pixels to
     *  draw, the second number gives the amount of space to leave, and this
     *  pattern repeats.  If an odd number of values is given, then the pattern 
     *  is expanded by repeating it twice to give an even number of values.
     */
    set dash(list) {
        var stroke = SLD.stroke(this._symbolizer)
        stroke.setDashArray(list);
    },
    /** api: property[dash]
     *  ``Array``
     *  The stroke dash style.
     */
    get dash() {
        var stroke = SLD.stroke(this._symbolizer);
        return stroke.getDashArray();
    },

    /** private: property[config]
     */
    get config() {
        return {
            type: "Stroke",
            stroke: this.stroke,
            width: this.width,
            opacity: this.opacity,
            cap: this.cap,
            dash: this.dash
        };
    }


});

exports.Stroke = Stroke;