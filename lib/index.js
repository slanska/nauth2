/**
 * Created by slanska on 2016-10-04.
 */
"use strict";
///<reference path="./Types.d.ts"/>
var Router = require("./Router");
function nauth2(cfg) {
    return function () {
        new Router(this, cfg);
    };
}
module.exports = nauth2;
//# sourceMappingURL=index.js.map