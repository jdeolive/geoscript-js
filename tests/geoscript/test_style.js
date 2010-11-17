
exports["test: Stroke"] = require("./style/test_stroke");

exports["test: Fill"] = require("./style/test_fill");

if (require.main == module.id) {
    require("test").run(exports);
}
