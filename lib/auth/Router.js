/**
 * Created by slanska on 2016-10-01.
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'express', 'knex', './DBController'], factory);
    }
})(function (require, exports) {
    "use strict";
    ///<reference path="../../typings/tsd.d.ts"/>
    var express = require('express');
    var knex = require('knex');
    var HapiCatBox = require('catbox');
    var HapiCatBoxMem = require('catbox-memory');
    var DBController_1 = require('./DBController');
    /*
     Router:
     -  registers routes with handlers
     -  opens db connection
     -  calls db init if needed
     -  initializes passport middleware
    
     DBController
     -  all db related activities
    
     Emailer
     -  all email sending
    
     DBInit
     -  database initialization
    
     Captcha
     -  captcha support
    
     Const
     -  constant declaration
    
     Types
     -  typed interfaces for payload etc.
    
     */
    var NAuth2;
    (function (NAuth2) {
        var Router = (function () {
            function Router(cfg) {
                this.cfg = cfg;
                this.DBController = new DBController_1.DBController(this.cfg.dbConfig);
            }
            /*
             Generic handler for all http requests
             @param cb - function which takes request and should return a promise
             */
            Router.prototype.wrap = function (cb) {
                var fn = function (req, res, next) {
                    // TODO log start
                    cb(req, res).then(function (data) {
                        // TODO log end
                        res.json(data);
                    }).catch(function (err) {
                        // TODO log error
                        next(err, null);
                    });
                };
                return fn;
            };
            Router.prototype.use = function (app) {
                var self = this;
                self.router = express.Router();
                this.router.post('/login', this.wrap(this.DBController.login));
                /*
    
                 */
                self.router.post('/register', this.wrap(this.DBController.register));
                self.router.post('/forgotPassword', this.wrap(this.DBController.forgotPassword));
                self.router.post('/changePassword', this.wrap(this.DBController.changePassword));
                self.router.get('/users', this.wrap(this.DBController.getUser));
                self.router.get('/user', this.wrap(this.DBController.getUser));
                self.router.post('/user', this.wrap(this.DBController.saveUser));
                self.router.put('/user', this.wrap(this.DBController.saveUser));
                self.router.delete('/user', this.wrap(this.DBController.deleteUser));
                self.router.get('/roles', this.wrap(this.DBController.getRole));
                self.router.get('/role', this.wrap(this.DBController.getRole));
                self.router.post('/role', this.wrap(this.DBController.saveRole));
                self.router.put('/role', this.wrap(this.DBController.saveRole));
                self.router.delete('/role', this.wrap(this.DBController.deleteRole));
                self.router.get('/domains', this.wrap(this.DBController.getDomain));
                self.router.get('/domain', this.wrap(this.DBController.getDomain));
                self.router.post('/domain', this.wrap(this.DBController.saveDomain));
                self.router.put('/domain', this.wrap(this.DBController.saveDomain));
                self.router.delete('/domain', this.wrap(this.DBController.deleteDomain));
                // TODO use captcha API
                // self.router.get('/captcha', self.getUserCallback);
            };
            Router.prototype.getEmailTemplate = function () {
            };
            Router.prototype.sendEmail = function () {
            };
            Router.prototype.initDatabase = function () {
                var self = this;
                knex(self.cfg.dbConfig);
            };
            return Router;
        }());
        NAuth2.Router = Router;
    })(NAuth2 || (NAuth2 = {}));
    return NAuth2;
});
//# sourceMappingURL=Router.js.map