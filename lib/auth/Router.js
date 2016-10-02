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
                self.router.post('/login', self.loginCallback);
                /*
    
                 */
                self.router.post('/register', this.wrap(this.DBController.register));
                self.router.post('/forgotPassword', self.forgotPasswordCallback);
                self.router.post('/changePassword', self.forgotPasswordCallback);
                self.router.get('/users', self.getUserCallback);
                self.router.get('/user', self.getUserCallback);
                self.router.post('/user', self.saveUserCallback);
                self.router.put('/user', self.saveUserCallback);
                self.router.delete('/user', self.deleteUserCallback);
                self.router.get('/roles', self.getUserCallback);
                self.router.get('/role', self.getUserCallback);
                self.router.post('/role', self.getUserCallback);
                self.router.put('/role', self.getUserCallback);
                self.router.delete('/role', self.getUserCallback);
                self.router.get('/domains', self.getUserCallback);
                self.router.get('/domain', self.getUserCallback);
                self.router.post('/domain', self.getUserCallback);
                self.router.put('/domain', self.getUserCallback);
                self.router.delete('/domain', self.getUserCallback);
                self.router.get('/captcha', self.getUserCallback);
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