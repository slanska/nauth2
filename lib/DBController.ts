/**
 * Created by slanska on 2016-10-02.
 */

///<reference path="./Types.d.ts"/>

import * as Types from './Types';
import knex = require('knex');
import {Tables, Users} from './Consts';
import Promise = require('bluebird');

module NAuth2
{
    export class DBController
    {
        protected db:knex;

        constructor(protected cfg:knex.Config)
        {
            this.db = knex(cfg);
        }

        register(req:Types.Request<Types.IRegisterPayload, any, any>):Promise<Types.IRegisterResult>
        {

            var self = this;

            // self.db.table(Tables.Users).insert(data).then();

            var result = self.db.select(Tables.Users).where(Users.Email, req.body.email).first()
                .then(()=>
                {
                    // email found
                });
            return result as any;
        }

        login(req:Types.Request<Types.ILoginPayload, any, any>):Promise<Types.ILoginResult>
        {
            var result;


            return result as any;

        }

        forgotPassword(req:Types.Request<Types.IForgotPasswordPayload, any, any>):Promise<Types.IForgotPasswordResponse>
        {
            return null;
        }

        /*
         TODO user request
         */
        getUser(req:Types.Request<any, Types.IUserParams, Types.IUserQuery>)
        {
        }

        saveUser(req:Types.Request< Types.IUserProfile, any, any>)
        {
        }

        deleteUser(req:Types.Request<any, Types.IUserParams, Types.IUserQuery>):Promise<Types.ISaveResult>
        {
            return null;
        }

        changePassword(req:Types.Request<Types.IChangePasswordPayload, any, any>)
        {
        }

        getRole(req:Types.Request<any, Types.IRoleParams, Types.IRolesQuery>)
        {
        }

        saveRole(req:Types.Request<any, Types.IRoleParams, Types.IRolesQuery>)
        {
        }

        deleteRole(req:Types.Request<any, Types.IRoleParams, Types.IRolesQuery>)
        {
        }

        getDomain(req:Types.Request<any, Types.IRoleParams, Types.IRolesQuery>)
        {
        }

        saveDomain(req:Types.Request<any, Types.IRoleParams, Types.IRolesQuery>)
        {
        }

        deleteDomain(req:Types.Request<any, Types.IRoleParams, Types.IRolesQuery>)
        {
        }
    }
}

export = NAuth2;