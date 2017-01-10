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

         */
        private setRolesToNewUser()
        {
            var self = this;

            var result = (p: hooks.HookParams) =>
            {
                return self.db.table('NAuth2_Roles').where({'name': {$in: self.cfg.newMemberRoles || []}})
                    .then(rr =>
                    {
                        var roles = _.map(rr, (r: any) =>
                        {
                            return {userId: p.result.userId, roleId: r.roleId};
                        });

                        if (roles.length === 0)
                            return Promise.resolve();

                        return self.db.table('NAuth2_UserRoles')
                            .insert(roles);
                    });

            };
            return result;
        }

        /*
         Sets status for new user as 'A'(Active), if user create mode is SelfStart
         */
        private setNewUserStatusHook()
        {
            var self = this;
            var result = (p: hooks.HookParams) =>
            {
                if (self.cfg.userCreateMode === Types.UserCreateMode.SelfStart)
                    p.data.status = 'A';
            };
            return result;
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
                    this.setNewUserStatusHook(),
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
                    this.setRolesToNewUser(),
                    hooks.pluck('email'),

                    // TODO afterUserRegister
                    nhooks.setRegisterConfirmActionUrl(this.cfg, this.authCfg),
                    nhooks.sendEmailToUser(this.app, this.cfg, 'welcomeAndConfirm',
                        // TODO Localize
                        _.template('Welcome to <%-companyName%>! Confirm your email')),

                    (p: hooks.HookParams) =>
                    {
                        p.result = {} as feathers.ResponseBody;
                        p.result.name = 'Success';
                        p.result.className = 'success';
                        p.result.code = HTTPStatus.OK;
                        p.result.message = 'Registration successful. Check your email';
                    }
                ]
            });
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

        protected createRegisterConfirmService()
        {
            var self = this;
            var path = `${self.cfg.basePath}/confirmRegister`;
            var svc = self.app.service(path, {
                find: (params: feathers.MethodParams) =>
                {
                    return new Promise((resolve, reject) =>
                    {
                        jwt.verify(params.query.t, self.authCfg.token.secret,
                            (err, decoded) =>
                            {
                                if (err)
                                    return reject(err);

                                // Update status of user to '(A)ctive'
                                return this.Services.RegisterUsers.find(
                                    {query: {email: decoded.email}, paginate: {limit: 1}})
                                    .then(users =>
                                    {
                                        // Check if user is found
                                        // Check if user is marked as suspended or deleted
                                        if (!users || users.length !== 1 || users[0].status === 'D' || users[0].status === 'S')
                                        {
                                            // TODO Translate
                                            reject(new errors.NotFound('User not found or suspended'));
                                        }

                                        // Finally, update its status
                                        return this.Services.RegisterUsers.patch(users[0].userId,
                                            {status: 'A'},
                                            {});
                                    })
                                    .then(d =>
                                    {
                                        // Redirects or renders default page
                                        if (self.cfg.run_mode === 'website')
                                        {

                                        }
                                        else
                                        {

                                        }
                                        var result = {} as feathers.ResponseBody;
                                        result.name = 'Success';
                                        result.className = 'success';
                                        result.code = HTTPStatus.OK;

                                        // TODO Send confirmation email, if applicable
                                        result.message = 'Registration successful. Check your email';
                                        return resolve(result);
                                    })
                                    .catch(err =>
                                    {
                                        return reject(err);
                                    });

                            });

                    });
                }
            });

            // TODO Needed?
            svc.before({find: []});
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

            switch (cfg.userCreateMode)
            {
                case  Types.UserCreateMode.SelfAndApproveByAdmin:
                case Types.UserCreateMode.SelfAndConfirm:
                case  Types.UserCreateMode.SelfStart:
                    this.createUserRegisterService();
                    this.createRegisterConfirmService();
                    break;
            }

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