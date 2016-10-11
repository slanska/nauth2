/**
 * Created by slanska on 2016-10-10.
 */

/*
 Sets created_at and updated_at attributes
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");

function setTimestamps(createAtField = 'created_at', updatedAtField = 'updated_at')
{
    var result = (p:hooks.HookParams)=>
    {
        var d = Date(); //TODO .getUTCMilliseconds();
        if (p.method === 'create')
        {
            if (createAtField)
                p.data[createAtField] = d;
        }
        else
            if (p.method === 'update' && updatedAtField)
            {
                p.data[updatedAtField] = d;
            }
    };
    return result;
}

export = setTimestamps;