var UTIL = require("../util");

var Style = UTIL.extend(Object, {
    
    minScaleDenominator: null,
    maxScaleDenominator: null,
    filter: null,

    constructor: function Style() {
        this.parts = [this];
    },

    get simple() {
        return this.parts.length === 1;
    },
    
    and: function(style) {
        this.parts.push(style);
        return this;
    },
    
    range: function(values) {
        if ("min" in values) {
            this.minScaleDenominator = values.min;
        }
        if ("max" in values) {
            this.maxScaleDenominator = values.max;
        }
        return this;
    },
    
    where: function(filter) {
        if (!(filter instanceof Filter)) {
            filter = new Filter(filter);
        }
        this.filter = filter;
        return this;
    }  
    
});

exports.Style = Style;