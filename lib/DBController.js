/**
 * Created by slanska on 2016-10-02.
 */
"use strict";
var knex = require('knex');
var knexServiceFactory = require('feathers-knex');
var NAuth2;
(function (NAuth2) {
    var DBController = (function () {
        function DBController(app, cfg) {
            this.app = app;
            this.cfg = cfg;
            this.db = knex(cfg.dbConfig);
            this.Path = {
                Users: cfg.basePath + "/users",
                Roles: cfg.basePath + "/roles",
                UserRoles: cfg.basePath + "/userroles",
                Log: cfg.basePath + "/log"
            };
            this.Services = {};
            // Users
            this.Services.Users = knexServiceFactory({
                Model: this.db,
                name: 'Users',
                id: 'UserID',
                paginate: { max: 200, "default": 50 }
            });
            this.app.use(this.Path.Users, this.Services.Users);
            // Roles
            this.Services.Roles = knexServiceFactory({
                Model: this.db,
                name: 'Roles',
                id: 'RoleID',
                paginate: { max: 200, "default": 50 }
            });
            this.app.use(this.Path.Roles, this.Services.Roles);
            // UserRoles
            this.Services.UserRoles = knexServiceFactory({
                Model: this.db,
                name: 'UserRoles',
                id: ['UserID', 'RoleID'],
                paginate: { max: 200, "default": 50 }
            });
            this.app.use(this.Path.UserRoles, this.Services.UserRoles);
            // Log
            this.Services.Log = knexServiceFactory({
                Model: this.db,
                name: 'Log',
                id: 'LogID',
                paginate: { max: 200, "default": 50 }
            });
            this.app.use(this.Path.Log, this.Services.Log);
            if (cfg.subDomains) {
                this.Path.Domains = cfg.basePath + "/domains";
                this.Path.DomainUsers = cfg.basePath + "/domainusers";
                // Domains
                this.Services.Domains = knexServiceFactory({
                    Model: this.db,
                    name: 'Domains',
                    id: 'DomainID',
                    paginate: { max: 200, "default": 50 }
                });
                this.app.use(this.Path.Domains, this.Services.Domains);
                // DomainUsers
                this.Services.DomainUsers = knexServiceFactory({
                    Model: this.db,
                    name: 'DomainUsers',
                    id: ['DomainID', 'UserID'],
                    paginate: { max: 200, "default": 50 }
                });
                this.app.use(this.Path.DomainUsers, this.Services.DomainUsers);
            }
        }
        return DBController;
    }());
    NAuth2.DBController = DBController;
})(NAuth2 || (NAuth2 = {}));
module.exports = NAuth2;
//# sourceMappingURL=DBController.js.map