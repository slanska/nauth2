/**
 * Created by slanska on 2016-10-23.
 */

/*
 BEFORE hook to determine if current user ID is the same as params 'id' (for GET, PUT, PATCH, DELETE /users/:id)
 This hook should be listed after auth.initUser hook
 Result is set to params.context.ownUser
 */

import {Types} from '../../typings/server.d';
import hooks = require("feathers-hooks");
import _ = require('lodash');

/*
 Two hooks to process JSON attributes in hook's param data
 */
export function jsonDataParse(jsonField = 'extData')
{
    var result = (p:hooks.HookParams)=>
    {
        if (_.isString(p.data[jsonField]))
        {
            p.data[jsonField] = JSON.parse(p.data[jsonField]);
        }
    };
    return result;
}

export function jsonDataStringify(jsonField = 'extData')
{
    var result = (p:hooks.HookParams)=>
    {
        if (!_.isString(p.data[jsonField]))
        {
            p.data[jsonField] = JSON.stringify(p.data[jsonField]);
        }
    };
    return result;
}

