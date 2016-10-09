/**
 * Created by slanska on 2016-10-01.
 */
"use strict";
var DBController_1 = require('./DBController');
var wildcardSubdomains = require('wildcard-subdomains');
var path = require('path');
var Types = require("./Types");
var Emailer = require("./Emailer");
var authentication = require('feathers-authentication');
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
/*

 */
var Router = (function () {
    function Router(app, cfg) {
        if (cfg === void 0) { cfg = {}; }
        this.app = app;
        this.cfg = cfg;
        app.configure(authentication());
        this.cfg.basePath = this.cfg.basePath || '/auth';
        this.cfg.newMemberRoles = this.cfg.newMemberRoles || [];
        this.cfg.userCreateMode = this.cfg.userCreateMode || Types.UserCreateMode.ByAdminOnly;
        this.cfg.templatePath = this.cfg.templatePath || path.join(__dirname, '../templates');
        if (this.cfg.subDomains) {
            this.cfg.subDomains.namespace = this.cfg.subDomains.namespace || '_sub';
            // This will add new parameter to request - :subdomain
            this.app.use(wildcardSubdomains(cfg.subDomains));
        }
        // Ensure that prerequisite modules are configured
        // 1. Hooks
        // 2. Rest
        // 3. Authentication
        // Register services
        this.DBController = new DBController_1.DBController(this.app, this.cfg);
        this.Emailer = new Emailer(this.app, this.cfg);
    }
    Router.prototype.isAuthenticated = function (req, res, next) {
    };
    Router.prototype.IsAdmin = function (req, res, next) {
    };
    Router.prototype.IsDomainAdmin = function (req, res, next) {
    };
    return Router;
}());
module.exports = Router;
//# sourceMappingURL=Router.js.map