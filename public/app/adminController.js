/**
 * Created by slanska on 2016-10-29.
 */
"use strict";
/*
 Admin activities
 - user list
 - user profile
 - roles
 - domains
 - domain edit (uses domainController)
 - log

 - create domain
 */
/*
 TODO
 Collapsible sidebar (when shown)
 Back button
 / - menu: [Logoff]
 /admin - menu: [Logoff], * [Domains] - if domains are enabled
 login
 resetPassword
 register (list of controls driven by field names in config)
 Left View -> menu icon, App Title
 Main View -> < Back, Page Title
 if not mobile - show footer with company name, application name
 use icons for sidebar items
 */
var profileController_1 = require('./profileController');
var domainController_1 = require('./domainController');
var app_1 = require('./app');
var AdminController = (function () {
    function AdminController() {
        this.profileController = new profileController_1.ProfileController();
        this.domainController = new domainController_1.DomainController();
    }
    return AdminController;
}());
exports.AdminController = AdminController;
var adminController = new AdminController();
var app = app_1.initApp({}, {});
//# sourceMappingURL=adminController.js.map