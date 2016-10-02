/**
 * Created by slanska on 2016-10-01.
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var NAuth2;
    (function (NAuth2) {
        var DBInit = (function () {
            function DBInit() {
            }
            DBInit.run = function () {
            };
            return DBInit;
        }());
        NAuth2.DBInit = DBInit;
    })(NAuth2 || (NAuth2 = {}));
    return NAuth2;
});
//# sourceMappingURL=DBInit.js.map