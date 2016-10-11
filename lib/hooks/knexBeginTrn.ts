/**
 * Created by slanska on 2016-10-10.
 */

/*
 Sends email using given template name and params.data as source of data for template
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import knex = require('knex');

function knexBeginTrn(knex:knex)
{
    var result = (p:hooks.HookParams)=>
    {
        return new Promise((resolve, reject)=>
        {
            knex.transaction((trx)=>
            {
                p['trx'] = trx;
                resolve();
            });
        });

    };
    return result;
}

export = knexBeginTrn;