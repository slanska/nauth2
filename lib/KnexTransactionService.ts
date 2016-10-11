/**
 * Created by slanska on 2016-10-10.
 */

import * as Types from './Types';
import knex = require('knex');
import Promise = require('bluebird');
import feathers = require("feathers");
import hooks = require('feathers-hooks');
import errors = require('feathers-errors');
import express = require('express');

/*

 */
class KnexTransactionService implements feathers.ServiceConfig
{
    constructor(protected knex:knex, protected endService:feathers.ServiceConfig)
    {

    }

    protected run(method:Function, args:IArguments):Promise<any>
    {
        if (method)
        {
            var result = new Promise((resolve, reject)=>
            {
                this.knex
                    .transaction((trx)=>
                    {
                        method.apply(this.endService, args)
                            .then(resolve)
                            .then(trx.commit)
                            .catch(trx.rollback);
                    })
                    .catch(err =>
                    {
                        reject(err)
                    });
            });
            return result;
        }

        throw new errors.NotImplemented('');
    }

    create(data, params, callback?:express.NextFunction):any
    {
        return this.run(this.endService.create, arguments);
    }

    find(params, callback?):any
    {
        return this.endService.find(params, callback);
    }

    get(id, params, callback?):any
    {
        return this.endService.find(params, callback);
    }

    remove(id, params, callback?):any
    {
        return this.run(this.endService.remove, arguments);
    }

    patch(id, data, params, callback?):any
    {
        return this.run(this.endService.patch, arguments);
    }

    update(id, data, params, callback?):any
    {
        return this.run(this.endService.update, arguments);
    }

    setup(app:feathers.Application):any
    {
        return this.run(this.endService.setup, arguments);
    }
}

export = KnexTransactionService;