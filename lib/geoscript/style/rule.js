var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Factory = require("../factory").Factory;
var Filter = require("../filter").Filter
var Symbolizer = require("./symbolizer").Symbolizer;

/** api: (define)
 *  module = style
 *  class = Rule
 */

var Rule = UTIL.extend(Object, {
    
    /** private: property[defaultSymbolizerType]
     *  ``String``
     */
    defaultSymbolizerType: null,

    /** api: constructor
     *  .. class:: Rule
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a rule for rendering features.
     */
    constructor: function Rule(config) {
        this.cache = {};
        UTIL.apply(this, config);
    },
    
    /** api: method[clone]
    *  :arg config: ``Object`` Optional configuration object.
    *  :returns: :class:`style.Rule` A rule with the same properties as this
    *      one.
    *
    *  Create a copy of this rule.  The optional ``config`` argument can be used
    *  to override any of this rule's properties for the clone.
     */
    clone: function(config) {
        config = UTIL.applyIf(config, this.config);
        delete config.type;
        return new Rule(config);
    },
    
    /** api: config[filter]
     *  :class:`filter.Filter`
     *  Optional filter for the rule.  If provided, only features for which 
     *  ``filter.evaluate(feature)`` is ``true`` will be rendered with this 
     *  rule's symbolizeers.  In addition to a filter instance, a filter CQL 
     *  string can be provided (e.g. ``"state = 'Montana'"``).
     */
    set filter(filter) {
        if (filter) {
            if (!(filter instanceof Filter)) {
                filter = new Filter(filter);
            }
            this.cache.filter = filter;
        }
    },
    /** api: property[filter]
     *  :class:`feature.Filter`
     *  Optional filter for the rule.
     */
    get filter() {
        return this.cache.filter;
    },
    
    /** api: config[symbolizers]
     *  ``Array`` List of :class:`style.Symbolizer` objects for the rule.  In 
     *  addition to a list of symbolizer instances, a list of symbolizer config
     *  objects can be provided.
     */
    set symbolizers(list) {
        var item;
        for (var i=0, ii=list.length; i<ii; ++i) {
            item = list[i];
            if (!(item instanceof Symbolizer)) {
                if (!item.defaultSymbolizerType) {
                    item.defaultSymbolizerType = this.defaultSymbolizerType;
                }
                list[i] = STYLE_UTIL.create(item);
            }
        }
        this.cache.symbolizers = list;
    },
    /** api: property[symbolizers]
     *  ``Array`` List of :class:`style.Symbolizer` objects for the rule.
     */
    get symbolizers() {
        return this.cache.symbolizers || [];
    },
    
    /** api: config[minScaleDenominator]
     *  ``Number`` Optional minimum scale denominator threshold for the rule.
     *  If provided, this rule will only apply at scale denominators equal to or
     *  greater than this value.
     */
    /** api: property[minScaleDenominator]
     *  ``Number`` Optional minimum scale denominator threshold for the rule.
     */
    minScaleDenominator: null,

    /** api: config[maxScaleDenominator]
     *  ``Number`` Optional maximum scale denominator threshold for the rule.
     *  If provided, this rule will only apply at scale denominators less than
     *  this value.
     */
    /** api: property[maxScaleDenominator]
     *  ``Number`` Optional maximum scale denominator threshold for the rule.
     */
    maxScaleDenominator: null,

    /** private: property[config]
     */
    get config() {
        return {
            type: "Rule",
            minScaleDenominator: this.minScaleDenominator,
            maxScaleDenominator: this.maxScaleDenominator,
            symbolizers: this.symbolizers.map(function(symbolizer) {
                return symbolizer.config;
            }),
            filter: this.filter && this.filter.config
        };
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this rule.
     */
    get json() {
        return JSON.stringify(this.config);
    },
    
    /** private: property[_rule]
     *  ``org.geotools.styling.Rule``
     *  A flattened representation of the rule - ignoring zIndex.  This should
     *  only be used for rules where all symbolizers have the same zIndex.
     */
    get _rule() {
        var _symbolizers = this.symbolizers.map(function(symbolizer) {
            return symbolizer._symbolizer;
        });
        var _rule = STYLE_UTIL._builder.createRule(_symbolizers);
        if (this.filter) {
            _rule.setFilter(this.filter._filter);
        }
        if (this.minScaleDenominator) {
            _rule.setMinScaleDenominator(this.minScaleDenominator);
        }
        if (this.maxScaleDenominator) {
            _rule.setMaxScaleDenominator(this.maxScaleDenominator);
        }
        return _rule;
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        return "";
    }
    
});

exports.Rule = Rule;

/** api: example
 *  Sample code to create a new rule with two symbolizers.  Features will only
 *  be rendered with this rule if the ``type`` value is equal to ``"highway"``.
 * 
 *  .. code-block:: javascript
 * 
 *      js> var rule = new STYLE.Rule({
 *        >     filter: "type = 'highway'",
 *        >     symbolizers: [{
 *        >         type: "LineSybolizer",
 *        >         strokeColor: "red",
 *        >         strokeWidth: 5,
 *        >         zIndex: 0
 *        >     }, {
 *        >         type: "LineSybolizer",
 *        >         strokeColor: "orange",
 *        >         strokeWidth: 3,
 *        >         zIndex: 1
 *        >     }]
 *        > });
 */

// register a rule factory for the module
STYLE_UTIL.register(new Factory(Rule, {
    handles: function(config) {
        return (
            "filter" in config ||
            "symbolizers" in config ||
            "minScaleDenominator" in config ||
            "maxScaleDenominator" in config
        );
    }
}));
