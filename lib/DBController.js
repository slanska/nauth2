/**
 * Created by slanska on 2016-10-02.
 */
"use strict";
var knex = require('knex');
var Consts_1 = require('./Consts');
var NAuth2;
(function (NAuth2) {
    var DBController = (function () {
        function DBController(cfg) {
            this.cfg = cfg;
            this.db = knex(cfg);
        }
        DBController.prototype.register = function (req) {
            var self = this;
            // self.db.table(Tables.Users).insert(data).then();
            var result = self.db.select(Consts_1.Tables.Users).where(Consts_1.Users.Email, req.body.email).first()
                .then(function () {
                // email found
            });
            return result;
        };
        DBController.prototype.login = function (req) {
            var result;
            return result;
        };
        DBController.prototype.forgotPassword = function (req) {
            return null;
        };
        /*
         TODO user request
         */
        DBController.prototype.getUser = function (req) {
        };
        DBController.prototype.saveUser = function (req) {
        };
        DBController.prototype.deleteUser = function (req) {
            return null;
        };
        DBController.prototype.changePassword = function (req) {
        };
        DBController.prototype.getRole = function (req) {
        };
        DBController.prototype.saveRole = function (req) {
        };
        DBController.prototype.deleteRole = function (req) {
        };
        DBController.prototype.getDomain = function (req) {
        };
        DBController.prototype.saveDomain = function (req) {
        };
        DBController.prototype.deleteDomain = function (req) {
        };
        return DBController;
    }());
    NAuth2.DBController = DBController;
})(NAuth2 || (NAuth2 = {}));
module.exports = NAuth2;
//# sourceMappingURL=DBController.js.map