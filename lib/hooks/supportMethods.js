/**
 * Created by slanska on 2016-10-09.
 */
"use strict";
var errors = require('feathers-errors');
function supportMethods() {
    var onlyMethods = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        onlyMethods[_i - 0] = arguments[_i];
    }
    var result = function (p) {
        if (onlyMethods.indexOf(p.method) <= 0) {
            throw new errors.NotImplemented("'" + p.method + "' not supported");
        }
    };
    return result;
}
module.exports = supportMethods;
//# sourceMappingURL=supportMethods.js.map