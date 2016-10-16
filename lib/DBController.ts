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
        };

        /*
         Configures service for REST /auth/users
         */
        protected createUserService():feathers.Service
        {
            var svcCfg = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Users,
                    id: 'UserID',
                    paginate: {max: 200, "default": 50}
                });
            this.Services.Users = this.app.service(this.Path.Users, svcCfg);
            this.Services.Users.before({
                all: [
                    auth.hooks.populateUser(this.authCfg),
                    auth.hooks.restrictToAuthenticated(this.authCfg),
                    auth.hooks.verifyToken(this.authCfg),
                    nhooks.authorize('users', 'userID'),
                ],
                create: [
                    auth.hooks.hashPassword(this.authCfg),
                    nhooks.sanitizeData('users'),
                    nhooks.setTimestamps()],
                find: [],
                get: [],
                update: [
                    nhooks.sanitizeData('users'),
                    nhooks.setTimestamps()],
                patch: [
                    nhooks.sanitizeData('users'),
                    nhooks.setTimestamps()],
                remove: []

            });
            this.Services.Users.after({
                all: [
                    nhooks.sanitizeData('users')
                ]
            });
            return this.Services.Users;
        }

        /*
         Configures service for POST /auth/register
         */
        protected createUserRegistrationService():feathers.Service
        {
            this.Path.Register = `${this.cfg.basePath}/register`;
            var result = this.app.service(this.Path.Register, this.createUserService());
            result.before({
                all: nhooks.supportedMethods('create'),
                create: [
                    nhooks.verifyCaptcha('captcha'),
                    nhooks.verifyNewPassword(this.cfg, 'password', 'confirmPassword'),
                    hooks.remove('captcha'),
                    hooks.remove('confirmPassword'),
                    auth.hooks.hashPassword(this.authCfg),
                    nhooks.verifyEmail(),
                    nhooks.verifyUniqueUserEmail(this.app.service(this.Path.Users)),
                    nhooks.setTimestamps()
                ]
            });

            result.after({
                create: [
                    nhooks.afterUserRegistration(this.app, this.cfg)
                    // nhooks.knexCommit(),
                    /*
                     TODO
                     set default roles
                     create log entry

                     if domain register - add to domain, assign domain policy
                     */
                ]
            });

            return result;
        }

        /*
         Configures service for POST /auth/login
         */
        protected createUserLoginService()
        {
            this.Path.Login = `${this.cfg.basePath}/login`;
            var result = this.app.service(this.Path.Register, this.createUserService());
            result.before({
                all: nhooks.supportedMethods('create'),
                create: [
                    auth.hooks.associateCurrentUser(this.authCfg)
                    // auth.hooks.hashPassword(this.authCfg),
                ]
            });

            result.after({
                create: [
                    // nhooks.afterUserRegistration(this.app, this.cfg)
                    // nhooks.knexCommit(),
                    /*
                     TODO
                     set default roles
                     create log entry

                     if domain register - add to domain, assign domain policy
                     */
                ]
            });

            return result;
        }

        protected createRolesService()
        {
            this.Services.Roles = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Roles,
                    id: 'RoleID',
                    paginate: {max: 200, "default": 50}
                });
            this.app.use(this.Path.Roles, this.Services.Roles);
        }

        protected createUserRolesService()
        {
            this.Services.UserRoles = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.UserRoles,
                    id: ['UserID', 'RoleID'],
                    paginate: {max: 200, "default": 50}
                });
            this.app.use(this.Path.UserRoles, this.Services.UserRoles);
        }

        protected createDomainsService()
        {
            this.Services.Domains = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Domains,
                    id: 'DomainID',
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.Domains, this.Services.Domains);
        }

        protected createDomainUserLoginService()
        {
            //TODO
            return Promise.resolve('Obana!');
        }

        /*
         Configures service for POST /_sub/:domain/auth/register
         */
        protected createDomainUserRegistrationService()
        {
            //TODO
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
            this.createUserService();

            // Roles
            this.createRolesService();

            // UserRoles
            this.createUserRolesService();

            // Log
            this.createLogService();

            // this.app.use(this.Path.Log, this.Services.Log);

            switch (cfg.userCreateMode)
            {
                case Types.UserCreateMode.Auto:
                case  Types.UserCreateMode.ByAdminOnly:
                    this.createUserRegistrationService();
                    break;
            }

            this.createUserLoginService();

            if (cfg.subDomains)
            {
                this.Path.Domains = `${cfg.basePath}/domains`;
                this.Path.DomainUsers = `/${cfg.subDomains.namespace}/:domain/${cfg.basePath}/users`;
                this.Path.DomainLogin = `/${cfg.subDomains.namespace}/:domain/${cfg.basePath}/login`;

                // Domains
                this.createDomainsService();

                // DomainUsers
                this.createDomainUsersService();

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

        /*

         */
        protected createDomainUsersService()
        {
            this.Services.DomainUsers = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.DomainUsers,
                    id: ['DomainID', 'UserID'],
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.DomainUsers, this.Services.DomainUsers);
        }

        /*

         */
        private createLogService()
        {
            this.Services.Log = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Log,
                    id: 'LogID',
                    paginate: {max: 200, "default": 50}
                });
        }
    }
}

export = NAuth2;