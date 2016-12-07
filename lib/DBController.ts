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
import errors = require('feathers-errors');
import HTTPStatus = require('http-status');
import _ = require('lodash');
import Qs = require('qs');
import bcrypt = require('bcryptjs');
var uuid = require('uuid');
import objectHash = require('object-hash');
import {getSystemRoles} from "./hooks/loadSysRoles";

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
         Creates entry for refresh token
         */
        createRefreshToken(userId: number, userAgent: Object): Promise<Types.IRefreshTokenRecord>
        {
            var self = this;
            var it = {} as Types.IRefreshTokenRecord;
            it.tokenUuid = uuid.v4();
            it.userAgent = userAgent;
            it.userId = userId;
            it.signatureHash = objectHash(userAgent, {});
            return self.db.table('NAuth2_RefreshTokens').insert(it);
        }

        /*
         Finds user by his/her email or name. Returns promise
         */
        findUserByNameOrEmail(emailOrName: string): Promise<Types.IUserRecord>
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
            svc.before({find: []});
        }

        private verifyUserOnLogin()
        {
            // TODO
        }

        static invalidLoginError()
        {
            return new errors.GeneralError('Invalid email, user name or password, suspended or deleted account');
        }

        /*
         Configures service for POST /auth/login
         */
        protected createUserLoginService()
        {
            var self = this;
            self.Path.Login = `${self.cfg.basePath}/login`;
            self.Services.Login = self.app.service(self.Path.Login, new LoginService(self));

            self.Services.Login.after({
                create: [
                    // nhooks.afterUserLogin(this.app, this.cfg)
                    /*
                     TODO
                     check if user active

                     set default roles
                     create log entry

                     get access token
                     get refresh token

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

    /*
     Internal service for user login
     */
    class LoginService
    {
        constructor(protected DBController: DBController)
        {

        }

        protected app: feathers.Application;

        setup(app: feathers.Application)
        {
            this.app = app;
        }

        /*
         Returns promise which will resolve to string 'navigateTo' (user's landing page)
         which depends on primary user's role
         SysAdmin: Admin dashboard
         SysUserAdmin: User Admin
         regular user: default home page
         */
        private getNavigateToLink(payload): Promise<string>
        {
            var self = this;
            var roles = payload.roles;
            return getSystemRoles(self.DBController.db)
                .then(rr =>
                {
                    if (roles.indexOf(rr['SystemAdmin'].roleId) >= 0)
                        return 'admin:dashboard';

                    if (roles.indexOf(rr['UserAdmin'].roleId) >= 0)
                        return 'admin:users';

                    if (roles.indexOf(rr['DomainSuperAdmin'].roleId) >= 0)
                        return 'admin:domains';

                    return 'home';
                });
        }

        create(data, params: feathers.MethodParams)
        {
            var self = this;
            return new Promise((resolve, reject) =>
            {
                var user: Types.IUserRecord = null;
                // Load user by email or name
                self.DBController.findUserByNameOrEmail(data.email)
                    .then(user =>
                    {
                        if (!user)
                            throw DBController.invalidLoginError();
                        return user;
                    })
                    .then((uu: Types.IUserRecord) =>
                    {
                        user = uu;
                    })
                    .then(() =>
                    {
                        // Verify password
                        if (!bcrypt.compareSync(data.password, user.password))
                        {
                            return reject(DBController.invalidLoginError());
                        }

                        // TODO user.pwd_expires_at
                        if (user.changePasswordOnNextLogin)
                        {
                            // Redirect or return warning
                            return resolve({navigateTo: 'changePassword'});
                        }

                        switch (user.status)
                        {
                            case 'A':
                                /*
                                 TODO Payload includes:
                                 userId
                                 all assigned general roles (not domain specific)
                                 top 10 assigned domains and all their roles (if applicable)
                                 */
                                var payload = {userId: user.userId, roles: [], domains: []};

                                // load roles
                                return self.DBController.db.select('roleId').from('NAuth2_UserRoles').where({userId: user.userId})
                                    .then(rr =>
                                    {
                                        payload.roles = _.map(rr, 'roleId');

                                        // load top 10 domains (if applicable)
                                        return self.DBController.db.table('NAuth2_DomainUsers')
                                            .where({userId: user.userId})
                                            .limit(10); // TODO Use config for limit? How about orderBy
                                    })
                                    .then(dd =>
                                    {
                                        payload.domains = _.map(dd, 'domainId');
                                        return self.getNavigateToLink(payload);
                                    })
                                    .then((navigateTo: string) =>
                                    {
                                        // generate tokens
                                        let signOptions = {} as jwt.SignOptions;
                                        signOptions.expiresIn = self.DBController.cfg.tokenExpiresIn;
                                        signOptions.subject = 'signin';
                                        jwt.sign(payload, self.DBController.authCfg.token.secret, signOptions, (err, token) =>
                                        {
                                            if (err)
                                                return reject(err);

                                            self.DBController.createRefreshToken(user.userId, params as any)
                                                .then(refreshToken =>
                                                {
                                                    return resolve({
                                                        token,
                                                        refreshToken,
                                                        navigateTo
                                                    });
                                                });
                                        });
                                    });

                            case 'S':
                            case 'D':
                                // suspended or deleted - return error
                                return reject(DBController.invalidLoginError());


                            case 'P':
                                // TODO Registration is not yet confirmed - resend email
                                return resolve({});
                        }

                    })
                    .catch(err =>
                    {
                        return reject(err);
                    });
            });
        }
    }
}

export = NAuth2;