/**
 * Created by slanska on 2016-10-30.
 */

/*
 Copies given field values from params.data to params.result
 */

import Types = require('../Types');
import hooks = require("feathers-hooks");
import _ = require('lodash');

export = function copyDataToResult(...fieldNames:string[])
{
    var result = (p:hooks.HookParams)=>
    {
        if (!p.result)
            p.result = {};
        _.forEach(fieldNames, (fld)=>
        {
            p.result[fld] = p.data[fld];
        });
    };
    return result;
}