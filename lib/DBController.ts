/**
 * Created by slanska on 2016-10-02.
 */

import Types = require('./Types');
import knex = require('knex');
import * as DB from './Consts';
import Promise = require('bluebird');
var knexServiceFactory = require('feathers-knex');
import feathers = require("feathers");
import nhooks = require('./hooks/index');
import hooks = require('feathers-hooks');
import auth  = require('feathers-authentication');
import jwt = require('jsonwebtoken');
import errors = require('feathers-errors');
import HTTPStatus = require('http-status');
import _ = require('lodash');

module NAuth2
{
    export class DBController
    {
        public db: knex;

        Path: {
            Users: string,
            Roles: string,
            UserRoles: string;
            Log: string;
            Domains?: string;
            DomainUsers?: string;
            Register?: string;
            Login: string;
            DomainRegister?: string;
            DomainLogin?: string;
            ResetPassword?: string;
            ChangePassword?: string;
        };

        Services: {
            Users: feathers.Service;
            Roles: feathers.Service;
            UserRoles: feathers.Service;
            Log: feathers.Service;
            Domains: feathers.Service;
            DomainUsers: feathers.Service;

            /*
             Similar to Users service, but intended for internal usage
             Exposes only POST /register
             */
            RegisterUsers: feathers.Service;

            /*
             Exposes only POST /login
             */
            Login: feathers.Service;

            /*
             POST /changePassword
             */
            ChangePassword: feathers.Service;
        };

        /*
         Create a new instance of users service, without hooks and other customization
         */
        protected initUserService(path: string)
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
        protected createUserService(): feathers.Service
        {
            this.Services.Users = this.initUserService(this.Path.Users);
            this.Services.Users.before({
                all: [
                    auth.hooks.verifyToken(this.authCfg),
                    this.populateUserHook(),
                    auth.hooks.restrictToAuthenticated(this.authCfg),
                    nhooks.authorize(this.db, 'users', 'userId'),
                ],
                create: [
                    auth.hooks.hashPassword(this.authCfg),
                    nhooks.sanitizeData(this.db, 'users')
                ],
                find: [],
                get: [],
                update: [
                    nhooks.sanitizeData(this.db, 'users')],
                patch: [
                    nhooks.sanitizeData(this.db, 'users')],
                remove: []

            });
            this.Services.Users.after({
                all: [
                    nhooks.sanitizeData(this.db, 'users')
                ]
            });
            return this.Services.Users;
        }

         /*
         Populates user data based on data.userId field
         */
        populateUserHook()
        {
            var self = this;

            var result = (p: hooks.HookParams) =>
            {
                return self.db.table('NAuth2_Users').select('*').where({userId: p.params['payload'].userId})
                    .then(users =>
                    {
                        if (!users || users.length === 0)
                            throw new errors.GeneralError(`User ${p.data.userId} not found`);

                        p.params['user'] = users[0];
                    });
            };
            return result;
        }

        /*
         Finds user by his/her email or name. Returns promise
         */
        findUserByNameOrEmail(emailOrName: string): Promise<IUserRecord>
        {
            var self = this;
            if (_.isEmpty(emailOrName))
                return Promise.reject(new Error(`Missing email or name`));

            return new Promise((resolve, reject) =>
            {
                self.db('NAuth2_Users').where({email: emailOrName}).orWhere({userName: emailOrName})
                    .then(users =>
                    {
                        if (!users || users.length !== 1)
                            return resolve(null);

                        return resolve(users[0]);
                    });
            }) as any;
        }

        static invalidLoginError()
        {
            // TODO translate
            return new errors.GeneralError('Invalid email, user name or password, suspended or deleted account');
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
            return Promise.resolve('Obana 2!');
        }

        constructor(public app: feathers.Application,
                    public cfg: Types.INAuth2Config,
                    public authCfg: auth.AuthConfig)
        {
            this.db = knex(cfg.dbConfig);

            this.Path = {
                Users: authCfg.userEndpoint,
                Roles: `${cfg.basePath}/roles`,
                UserRoles: `${cfg.basePath}/userroles`,
                Log: `${cfg.basePath}/log`,
                Login: `${cfg.basePath}/login`,
                ResetPassword: `${cfg.basePath}/resetPassword`
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
                    id: ['domainId', 'userId'],
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