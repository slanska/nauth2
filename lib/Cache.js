/**
 * Created by slanska on 2016-10-03.
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'cache-manager'], factory);
    }
})(function (require, exports) {
    "use strict";
    ///<reference path="../typings/tsd.d.ts"/>
    var cache = require('cache-manager');
    // var cfg:typeof cache = {store: 'memory', ttl: 10};
    cache.caching({});
});
//# sourceMappingURL=Cache.js.map