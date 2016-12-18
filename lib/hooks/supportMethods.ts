/**
 * Created by slanska on 2016-10-09.
 */

/*
 Checks if hook method matches allowed list. Cancels processing if no match found
 */

import Types = require('../Types');
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');

function supportMethods(...onlyMethods:string[])
{
    var result = (p:hooks.HookParams)=>
    {
        if (onlyMethods.indexOf(p.method) < 0)
        {
            throw new errors.NotImplemented(`'${p.method}' not supported`);
        }
    };
    return result;
}

export = supportMethods;