/**
 * Created by slanska on 2016-10-02.
 */
"use strict";
var Types = require('./Types');
var knex = require('knex');
var DB = require('./Consts');
var Promise = require('bluebird');
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
                Log: cfg.basePath + "/log",
                Login: cfg.basePath + "/login"
            };
            this.Services = {};
            // Users
            this.Services.Users = knexServiceFactory({
                Model: this.db,
                name: DB.Tables.Users,
                id: 'UserID',
                paginate: { max: 200, "default": 50 }
            });
            this.app.use(this.Path.Users, this.Services.Users);
            this.Services.Users.before = {};
            // Roles
            this.Services.Roles = knexServiceFactory({
                Model: this.db,
                name: DB.Tables.Roles,
                id: 'RoleID',
                paginate: { max: 200, "default": 50 }
            });
            this.app.use(this.Path.Roles, this.Services.Roles);
            // UserRoles
            this.Services.UserRoles = knexServiceFactory({
                Model: this.db,
                name: DB.Tables.UserRoles,
                id: ['UserID', 'RoleID'],
                paginate: { max: 200, "default": 50 }
            });
            this.app.use(this.Path.UserRoles, this.Services.UserRoles);
            // Log
            this.Services.Log = knexServiceFactory({
                Model: this.db,
                name: DB.Tables.Log,
                id: 'LogID',
                paginate: { max: 200, "default": 50 }
            });
            this.app.use(this.Path.Log, this.Services.Log);
            switch (cfg.userCreateMode) {
                case Types.UserCreateMode.Auto:
                case Types.UserCreateMode.ByAdminOnly:
                    this.Path.Register = cfg.basePath + "/register";
                    this.app.use(this.Path.Register, {
                        create: this.registerUser.bind(this)
                    });
                    var svc = this.app.service(this.Path.Register);
                    svc.before = {};
                    svc.after = {};
                    // .before({
                    //     //create: check confirm password, check captcha, remove confirm password & captcha
                    // })
                    // .after({
                    //     //create: send email - to user if selfComplete, to admin(s) if approveByAdmin
                    // });
                    break;
            }
            this.app.use(this.Path.Login, {
                create: this.loginUser.bind(this)
            });
            if (cfg.subDomains) {
                this.Path.Domains = cfg.basePath + "/domains";
                this.Path.DomainUsers = "/" + cfg.subDomains.namespace + "/:domain/" + cfg.basePath + "/users";
                this.Path.DomainLogin = "/" + cfg.subDomains.namespace + "/:domain/" + cfg.basePath + "/login";
                // Domains
                this.Services.Domains = knexServiceFactory({
                    Model: this.db,
                    name: DB.Tables.Domains,
                    id: 'DomainID',
                    paginate: { max: 200, "default": 50 }
                });
                this.app.use(this.Path.Domains, this.Services.Domains);
                // DomainUsers
                this.Services.DomainUsers = knexServiceFactory({
                    Model: this.db,
                    name: DB.Tables.DomainUsers,
                    id: ['DomainID', 'UserID'],
                    paginate: { max: 200, "default": 50 }
                });
                this.app.use(this.Path.DomainUsers, this.Services.DomainUsers);
                this.app.use(this.Path.DomainLogin, {
                    create: this.domainLoginUser.bind(this)
                });
                switch (cfg.userCreateMode) {
                    case Types.UserCreateMode.Auto:
                    case Types.UserCreateMode.ByAdminOnly:
                        this.Path.DomainRegister = "/" + cfg.subDomains.namespace + "/:domain/" + cfg.basePath + "/register";
                        this.app.use(this.Path.DomainRegister, {
                            create: this.domainRegisterUser.bind(this)
                        });
                        break;
                }
            }
        }
        DBController.prototype.registerUser = function (data, params) {
            var self = this;
            return self.Services.Users.create(data, params);
        };
        DBController.prototype.loginUser = function () {
            return Promise.resolve('Obana!');
        };
        DBController.prototype.domainLoginUser = function () {
            return Promise.resolve('Obana!');
        };
        DBController.prototype.domainRegisterUser = function () {
            return Promise.resolve('Obana!');
        };
        return DBController;
    }());
    NAuth2.DBController = DBController;
})(NAuth2 || (NAuth2 = {}));
module.exports = NAuth2;
//# sourceMappingURL=DBController.js.map