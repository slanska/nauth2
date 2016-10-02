/**
 * Created by slanska on 2016-10-02.
 */

///<reference path="../Types.d.ts"/>

import knex = require('knex');
import {Tables, Columns} from '../Consts';

module NAuth2
{
    export class DBController
    {
        protected db:knex;

        constructor(protected cfg:knex.Config)
        {
            this.db = knex(cfg);
        }

        register(data:IRegisterPayload):Promise<IRegisterResult>
        {
            var self = this;
            // self.db.table(Tables.Users).insert(data).then();

            var result = self.db.select(Tables.Users).where(Columns.Email, data.email).first()
                .then(()=>
                {
                    // email found
                });
            return result;
        }

        private loginCallback(req, res, next)
        {
        }

        private forgotPasswordCallback(req, res, next)
        {
        }

        private getUserCallback(req, res, next)
        {
        }

        private saveUserCallback(req, res, next)
        {
        }

        private deleteUserCallback(req, res, next)
        {
        }



    }
}

export = NAuth2;