var STYLE_UTIL = require("./style/util");

/** api: module = style */

/** api: synopsis
 *  A collection of style types.
 */

/** api: summary
 *  The :mod:`style` module provides a provides constructors for creating rule
 *  based styles for rendering layers in a map.
 *
 *  .. code-block:: javascript
 *  
 *      js> var STYLE = require("geoscript/style");
 */

/** api: classes[] = stroke */
exports.Stroke = require("./style/stroke").Stroke;

/** api: classes[] = fill */
exports.Fill = require("./style/fill").Fill;

