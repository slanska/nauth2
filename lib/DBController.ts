/**
 * Created by slanska on 2016-10-02.
 */

import * as Types from './Types';
import knex = require('knex');
import * as DB from './Consts';
import Promise = require('bluebird');
var knexServiceFactory = require('feathers-knex');
import feathers = require("feathers");
import nhooks = require('./hooks/index');
import hooks = require('feathers-hooks');
import auth  = require('feathers-authentication');

module NAuth2
{
    export class DBController
    {
        protected db:knex;

        Path:{
            Users:string,
            Roles:string,
            UserRoles:string;
            Log:string;
            Domains?:string;
            DomainUsers?:string;
            Register?:string;
            Login:string;
            DomainRegister?:string;
            DomainLogin?:string;
        };

        Services:{

            Users:feathers.Service;
            Roles:feathers.Service;
            UserRoles:feathers.Service;
            Log:feathers.Service;
            Domains:feathers.Service;
            DomainUsers:feathers.Service;

            /*
             Internally used service to operate on users. Not exposed via REST.
             Consumed by other REST services (/users & /register) which add custom validation
             and authorization on top of users service
             */
            InternalUsers:feathers.Service;
        };

        protected createUserService():feathers.Service
        {
            return knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Users,
                    id: 'UserID',
                    paginate: {max: 200, "default": 50}
                });
        }

        /*
         Configures service for POST /auth/register
         */
        protected createUserRegistrationService():feathers.Service
        {
            var self = this;
            this.app.use(this.Path.Register, this.createUserService());
            var result = this.app.service(this.Path.Register);

            // Assign hooks
            result.before = {
                all: nhooks.supportedMethods('create'),
                create: [
                    nhooks.verifyCaptcha('captcha'),
                    nhooks.verifyNewPassword(self.cfg, 'password', 'confirmPassword'),
                    hooks.remove('captcha', 'confirmPassword'),
                    auth.hooks.hashPassword(self.authCfg)
                ]
            };

            result.after = {
                create: [
                    // TODO send email conditionally
                    nhooks.sendEmail('registerComplete'),
                    nhooks.sendEmail('newUserNotification')
                ]
            };

            return result;
        }

        protected createUserLoginService()
        {
            return Promise.resolve('Obana!');
        }

        protected createDomainUserLoginService()
        {
            return Promise.resolve('Obana!');
        }

        /*
         Configures service for POST /_sub/:domain/auth/register
         */
        protected createDomainUserRegistrationService()
        {
            return Promise.resolve('Obana!');
        }

        constructor(protected app:feathers.Application, protected cfg:Types.INAuth2Config, protected authCfg:auth.AuthConfig)
        {
            this.db = knex(cfg.dbConfig);

            this.Path = {
                Users: `${cfg.basePath}/users`,
                Roles: `${cfg.basePath}/roles`,
                UserRoles: `${cfg.basePath}/userroles`,
                Log: `${cfg.basePath}/log`,
                Login: `${cfg.basePath}/login`
            };

            this.Services = {} as any;

            // Users
            this.Services.Users = this.createUserService();

            this.app.use(this.Path.Users, this.Services.Users);
            this.Services.Users.before = {
                // create: this.authorizeUsers
            };

            // Roles
            this.Services.Roles = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Roles,
                    id: 'RoleID',
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.Roles, this.Services.Roles);

            // UserRoles
            this.Services.UserRoles = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.UserRoles,
                    id: ['UserID', 'RoleID'],
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.UserRoles, this.Services.UserRoles);

            // Log
            this.Services.Log = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Log,
                    id: 'LogID',
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.Log, this.Services.Log);

            switch (cfg.userCreateMode)
            {
                case Types.UserCreateMode.Auto:
                case  Types.UserCreateMode.ByAdminOnly:
                    this.Path.Register = `${cfg.basePath}/register`;
                    this.app.use(this.Path.Register, {
                        create: this.createUserRegistrationService.bind(this)
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
                create: this.createUserLoginService.bind(this)
            });

            if (cfg.subDomains)
            {
                this.Path.Domains = `${cfg.basePath}/domains`;
                this.Path.DomainUsers = `/${cfg.subDomains.namespace}/:domain/${cfg.basePath}/users`;
                this.Path.DomainLogin = `/${cfg.subDomains.namespace}/:domain/${cfg.basePath}/login`;

                // Domains
                this.Services.Domains = knexServiceFactory(
                    {
                        Model: this.db,
                        name: DB.Tables.Domains,
                        id: 'DomainID',
                        paginate: {max: 200, "default": 50}
                    });

                this.app.use(this.Path.Domains, this.Services.Domains);

                // DomainUsers
                this.Services.DomainUsers = knexServiceFactory(
                    {
                        Model: this.db,
                        name: DB.Tables.DomainUsers,
                        id: ['DomainID', 'UserID'],
                        paginate: {max: 200, "default": 50}
                    });

                this.app.use(this.Path.DomainUsers, this.Services.DomainUsers);

                this.app.use(this.Path.DomainLogin, {
                    create: this.createDomainUserLoginService.bind(this)
                });

                switch (cfg.userCreateMode)
                {
                    case Types.UserCreateMode.Auto :
                    case  Types.UserCreateMode.ByAdminOnly:

                        this.Path.DomainRegister = `/${cfg.subDomains.namespace}/:domain/${cfg.basePath}/register`;
                        this.app.use(this.Path.DomainRegister, {
                            create: this.createDomainUserRegistrationService.bind(this)
                        });
                        break;
                }
            }
        }
    }
}

export = NAuth2;