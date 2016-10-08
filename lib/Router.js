/**
 * Created by slanska on 2016-10-01.
 */
"use strict";
///<reference path="../typings/tsd.d.ts"/>
var express = require('express');
var DBController_1 = require('./DBController');
var wildcardSubdomains = require('wildcard-subdomains');
var config = require('./config');
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
    /*

     */
    var Router = (function () {
        function Router(app, cfg) {
            this.app = app;
            this.cfg = cfg;
            this.DBController = new DBController_1.DBController(this.cfg.dbConfig);
            if (this.cfg.subDomains) {
                // This will add new parameter to request - :subdomain
                this.app.use(wildcardSubdomains(cfg.subDomains));
            }
        }
        Router.prototype.isAuthenticated = function (req, res, next) {
        };
        Router.prototype.IsAdmin = function (req, res, next) {
        };
        Router.prototype.IsDomainAdmin = function (req, res, next) {
        };
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
            // Subdomain support
            self.router.get("/" + self.cfg.subDomains.namespace + "/:domain/auth/users", this.wrap(this.DBController.getUser));
            self.router.get('/user', this.wrap(this.DBController.getUser));
            self.router.post('/user', this.wrap(this.DBController.saveUser));
            self.router.put('/user', this.wrap(this.DBController.saveUser));
            self.router.delete('/user', this.wrap(this.DBController.deleteUser));
            self.router.get('/roles', this.wrap(this.DBController.getRole));
            self.router.get('/role', this.wrap(this.DBController.getRole));
            self.router.post('/role', this.wrap(this.DBController.saveRole));
            self.router.put('/role', this.wrap(this.DBController.saveRole));
            self.router.delete('/role', this.wrap(this.DBController.deleteRole));
            /*
             Must be authenticated. Domains will be filtered based on user permissions
             */
            self.router.get('/domains', this.wrap(this.DBController.getDomain));
            self.router.get('/domain', this.wrap(this.DBController.getDomain));
            self.router.post('/domain', this.wrap(this.DBController.saveDomain));
            self.router.put('/domain', this.wrap(this.DBController.saveDomain));
            self.router.delete('/domain', this.wrap(this.DBController.deleteDomain));
            /*
             Must be Domain Admin or Domain User Admin
             */
            self.router.get('/userdomains', this.wrap(this.DBController.getDomain));
            self.router.get('/userdomain', this.wrap(this.DBController.getDomain));
            self.router.post('/userdomain', this.wrap(this.DBController.saveDomain));
            self.router.put('/userdomain', this.wrap(this.DBController.saveDomain));
            self.router.delete('/userdomain', this.wrap(this.DBController.deleteDomain));
            /*
             Must be System User Admin
             */
            self.router.get('/userroles', this.wrap(this.DBController.getDomain));
            self.router.get('/userrole', this.wrap(this.DBController.getDomain));
            self.router.post('/userrole', this.wrap(this.DBController.saveDomain));
            self.router.put('/userrole', this.wrap(this.DBController.saveDomain));
            self.router.delete('/userrole', this.wrap(this.DBController.deleteDomain));
            self.router.get('/auth/log', this.wrap(this.DBController.deleteDomain));
            // TODO use captcha API
            // self.router.get('/captcha', self.getUserCallback);
        };
        return Router;
    }());
    NAuth2.Router = Router;
})(NAuth2 || (NAuth2 = {}));
module.exports = NAuth2;
//# sourceMappingURL=Router.js.map