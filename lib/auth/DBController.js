/**
 * Created by slanska on 2016-10-02.
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'knex', '../Consts'], factory);
    }
})(function (require, exports) {
    "use strict";
    ///<reference path="../Types.d.ts"/>
    var knex = require('knex');
    var Consts_1 = require('../Consts');
    var NAuth2;
    (function (NAuth2) {
        var DBController = (function () {
            function DBController(cfg) {
                this.cfg = cfg;
                this.db = knex(cfg);
            }
            DBController.prototype.register = function (data) {
                var self = this;
                // self.db.table(Tables.Users).insert(data).then();
                var result = self.db.select(Consts_1.Tables.Users).where(Consts_1.Columns.Email, data.email).first()
                    .then(function () {
                    // email found
                });
                return result;
            };
            DBController.prototype.loginCallback = function (req, res, next) {
            };
            DBController.prototype.forgotPasswordCallback = function (req, res, next) {
            };
            DBController.prototype.getUserCallback = function (req, res, next) {
            };
            DBController.prototype.saveUserCallback = function (req, res, next) {
            };
            DBController.prototype.deleteUserCallback = function (req, res, next) {
            };
            return DBController;
        }());
        NAuth2.DBController = DBController;
    })(NAuth2 || (NAuth2 = {}));
    return NAuth2;
});
//# sourceMappingURL=DBController.js.map