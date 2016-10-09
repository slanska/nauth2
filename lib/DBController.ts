/**
 * Created by slanska on 2016-10-02.
 */

import * as Types from './Types';
import knex = require('knex');
import * as DB from './Consts';
import Promise = require('bluebird');
var knexServiceFactory = require('feathers-knex');
import feathers = require("feathers");

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

        protected registerUser(data, params)
        {
            var self = this;
            return self.Services.Users.create(data, params);
        }

        protected loginUser()
        {
            return Promise.resolve('Obana!');
        }

        protected domainLoginUser()
        {
            return Promise.resolve('Obana!');
        }

        protected domainRegisterUser()
        {
            return Promise.resolve('Obana!');
        }

        constructor(protected app:feathers.ApplicationCore, protected cfg:Types.INAuth2Config)
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
            this.Services.Users = knexServiceFactory(
                {
                    Model: this.db,
                    name: DB.Tables.Users,
                    id: 'UserID',
                    paginate: {max: 200, "default": 50}
                });

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
                        create: this.registerUser.bind(this)
                    });

                    var svc = this.app.service(this.Path.Register)
                        .before({
                            //create: check confirm password, check captcha, remove confirm password & captcha
                        })
                        .after({
                            //create: send email - to user if selfComplete, to admin(s) if approveByAdmin
                        });
                    break;
            }

            this.app.use(this.Path.Login, {
                create: this.loginUser.bind(this)
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
                    create: this.domainLoginUser.bind(this)
                });

                switch (cfg.userCreateMode)
                {
                    case Types.UserCreateMode.Auto :
                    case  Types.UserCreateMode.ByAdminOnly:

                        this.Path.DomainRegister = `/${cfg.subDomains.namespace}/:domain/${cfg.basePath}/register`;
                        this.app.use(this.Path.DomainRegister, {
                            create: this.domainRegisterUser.bind(this)
                        });
                        break;
                }
            }
        }
    }
}

export = NAuth2;