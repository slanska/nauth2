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
import jwt = require('jsonwebtoken');

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
             Similar to Users service, but intended for internal usage
             Exposes only POST /register
             */
            RegisterUsers:feathers.Service;

            /*
             Exposes only POST /login
             */
            Login:feathers.Service;
        };

        /*
         Create a new instance of users service, without hooks and other customization
         */
        protected initUserService(path:string)
        {
            var svcCfg = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Users,
                    id: 'UserID',
                    paginate: {max: 200, "default": 50}
                });
            return this.app.service(path, svcCfg);
        }

        /*
         Configures service for REST /auth/users
         */
        protected createUserService():feathers.Service
        {
            this.Services.Users = this.initUserService(this.Path.Users);
            this.Services.Users.before({
                all: [
                    auth.hooks.populateUser(this.authCfg),
                    auth.hooks.restrictToAuthenticated(this.authCfg),
                    auth.hooks.verifyToken(this.authCfg),
                    nhooks.authorize('users', 'userId'),
                ],
                create: [
                    auth.hooks.hashPassword(this.authCfg),
                    nhooks.sanitizeData('users')
                ],
                find: [],
                get: [],
                update: [
                    nhooks.sanitizeData('users')],
                patch: [
                    nhooks.sanitizeData('users')],
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
        protected createUserRegisterService()
        {
            this.Path.Register = `${this.cfg.basePath}/register`;
            this.Services.RegisterUsers = this.initUserService(this.Path.Register);
            this.Services.RegisterUsers.before({
                create: [
                    nhooks.verifyCaptcha('captcha'),
                    nhooks.verifyNewPassword(this.cfg, 'password', 'confirmPassword'),
                    hooks.remove('captcha'),
                    hooks.remove('confirmPassword'),
                    auth.hooks.hashPassword(this.authCfg),
                    nhooks.verifyEmail(),
                    nhooks.verifyUniqueUserEmail(),
                    nhooks.jsonDataStringify()
                ],
                get: [hooks.disable('external')],
                find: [hooks.disable('external')],
                update: [hooks.disable('external')],
                remove: [hooks.disable('external')],
                patch: [hooks.disable('external')],
            });

            this.Services.RegisterUsers.after({
                create: [
                    // TODO sets default roles
                    hooks.pluck('email'),
                    nhooks.setRegisterConfirmActionUrl(this.cfg, this.authCfg),
                    nhooks.sendEmailToUser(this.app, this.cfg, 'welcomeAndConfirm',
                        // TODO Localize
                        'Welcome to <%-companyName%>! Confirm your email')
                ]
            });
        }

        protected createRegisterConfirmService()
        {
            var self = this;
            var path = `${self.cfg.basePath}/confirmRegister`;
            var svc = self.app.service(path, {
                find: (params:feathers.MethodParams)=>
                {
                    jwt.verify(params.query.t, self.authCfg.token.secret,
                        (err, decoded)=>
                        {
                            if (err)
                                return Promise.reject(err);

                            // Update status of user to '(A)ctive'
                            this.Services.RegisterUsers.find(
                                {query: {email: decoded.email}, paginate: {limit: 1}})
                                .then(users=>
                                {
                                    // Check if user is found

                                    // Check if user is marked as suspended or deleted

                                    // Finally, update its status
                                    return this.Services.RegisterUsers.patch(users[0].userId,
                                        {status: 'A'},
                                        {});
                                })
                                .then(d=>
                                {
                                    // Return result or redirect
                                })
                                .catch(err=>
                                {
                                    throw err;
                                });

                        });
                }
            });
            svc.before({find: []});
        }

        /*
         Configures service for POST /auth/login
         */
        protected createUserLoginService()
        {
            this.Path.Login = `${this.cfg.basePath}/login`;
            this.Services.Login = this.initUserService(this.Path.Login);
            this.Services.Login.before({
                all: nhooks.supportedMethods('create'),
                create: [
                    auth.hooks.associateCurrentUser(this.authCfg)
                    // auth.hooks.hashPassword(this.authCfg),
                ]
            });

            this.Services.Login.after({
                create: [
                    // nhooks.afterUserRegistration(this.app, this.cfg)
                    // nhooks.knexCommit(),
                    /*
                     TODO
                     set default roles
                     create log entry

                     if domain login - add to domain, assign domain policy
                     */
                ]
            });
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
            var cfg = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.UserRoles,
                    id: ['UserID', 'RoleID'],
                    paginate: {max: 200, "default": 50}
                });
            this.Services.UserRoles = this.app.service(this.Path.UserRoles, cfg);
        }

        protected createDomainsService()
        {
            var cfg = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Domains,
                    id: 'DomainID',
                    paginate: {max: 200, "default": 50}
                });

            this.Services.Domains = this.app.service(this.Path.Domains, cfg);
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
                Users: authCfg.userEndpoint,
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
                case  Types.UserCreateMode.SelfAndApproveByAdmin:
                case  Types.UserCreateMode.SelfAndConfirm:
                case  Types.UserCreateMode.SelfStart:
                    this.createUserRegisterService();
                    this.createRegisterConfirmService();
                    break;
            }

            this.createUserLoginService();

            if (cfg.subDomains)
            {
                this.Path.Domains = `/${cfg.basePath}/domains`;
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