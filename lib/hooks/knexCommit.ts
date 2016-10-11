/**
 * Created by slanska on 2016-10-10.
 */


import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import knex = require('knex');

function knexCommit()
{
    var result = (p:hooks.HookParams)=>
    {
        if (!p['trx'])
        {
            throw new errors.GeneralError('No active transaction');
        }
        return p['trx'].commit;
    };
    return result;
}

export = knexCommit;