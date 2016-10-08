/**
 * Created by slanska on 2016-10-02.
 */

import * as Types from './Types';
import knex = require('knex');
import {Tables, Users} from './Consts';
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
        };

        Services:{
            Users:feathers.Service;
            Roles:feathers.Service;
            UserRoles:feathers.Service;
            Log:feathers.Service;
            Domains:feathers.Service;
            DomainUsers:feathers.Service;
        };

        constructor(protected app:feathers.ApplicationCore, protected cfg:Types.INAuth2Config)
        {
            this.db = knex(cfg.dbConfig);

            this.Path = {
                Users: `${cfg.basePath}/users`,
                Roles: `${cfg.basePath}/roles`,
                UserRoles: `${cfg.basePath}/userroles`,
                Log: `${cfg.basePath}/log`
            };

            this.Services = {} as any;

            // Users
            this.Services.Users = knexServiceFactory(
                {
                    Model: this.db,
                    name: 'Users',
                    id: 'UserID',
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.Users, this.Services.Users);


            // Roles
            this.Services.Roles = knexServiceFactory(
                {
                    Model: this.db,
                    name: 'Roles',
                    id: 'RoleID',
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.Roles, this.Services.Roles);

            // UserRoles
            this.Services.UserRoles = knexServiceFactory(
                {
                    Model: this.db,
                    name: 'UserRoles',
                    id: ['UserID', 'RoleID'],
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.UserRoles, this.Services.UserRoles);

            // Log
            this.Services.Log = knexServiceFactory(
                {
                    Model: this.db,
                    name: 'Log',
                    id: 'LogID',
                    paginate: {max: 200, "default": 50}
                });

            this.app.use(this.Path.Log, this.Services.Log);

            if (cfg.subDomains)
            {
                this.Path.Domains = `${cfg.basePath}/domains`;
                this.Path.DomainUsers = `${cfg.basePath}/domainusers`;

                // Domains
                this.Services.Domains = knexServiceFactory(
                    {
                        Model: this.db,
                        name: 'Domains',
                        id: 'DomainID',
                        paginate: {max: 200, "default": 50}
                    });

                this.app.use(this.Path.Domains, this.Services.Domains);

                // DomainUsers
                this.Services.DomainUsers = knexServiceFactory(
                    {
                        Model: this.db,
                        name: 'DomainUsers',
                        id: ['DomainID', 'UserID'],
                        paginate: {max: 200, "default": 50}
                    });

                this.app.use(this.Path.DomainUsers, this.Services.DomainUsers);
            }
        }
    }
}

export = NAuth2;