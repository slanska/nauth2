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
        var Emailer = (function () {
            function Emailer() {
            }
            return Emailer;
        }());
        NAuth2.Emailer = Emailer;
    })(NAuth2 || (NAuth2 = {}));
    return NAuth2;
});
//# sourceMappingURL=Emailer.js.map