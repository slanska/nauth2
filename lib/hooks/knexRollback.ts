/**
 * Created by slanska on 2016-10-10.
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import knex = require('knex');

function knexRollback()
{
    var result = (p:hooks.HookParams)=>
    {
        if (!p['trx'])
        {
            throw new errors.GeneralError('No active transaction');
        }
        return p['trx'].rollback;
    };
    return result;
}

export = knexRollback;