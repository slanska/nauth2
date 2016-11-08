/**
 * Created by slanska on 2016-10-16.
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import {methodMap, rules} from '../accessRules';

/*
 BEFORE hook that authorizes request.
 @param (string) resourceName - name of REST resource (users, roles etc.)
 @param (string) ownAttribute
 */
function authorize(resourceName:string, ownAttribute:string)
{
    var result = function (p:hooks.HookParams)
    {
        var action = methodMap[p.method];

        if (!action)
            throw new errors.NotImplemented(`${p.method} is not supported by authorization hook`);

        var roles = ['systemAdmin'];
        var permission = rules.permission({
            role: roles, //p.params['payload'].roles,
            resource: resourceName,
            action: action + ':any'
        });
        if (!permission.granted && ownAttribute)
        {
            if (p.params['context'] && p.params['context'].hasOwnProperty(ownAttribute) && p.params['context'][ownAttribute])
            {
                permission = rules.permission({
                    role: p.params['payload'].roles,
                    resource: resourceName,
                    action: action + ':own'
                });
                if (!permission.granted)
                {
                    throw new errors.MethodNotAllowed('Not authorized');
                }
            }

            throw new errors.MethodNotAllowed('Not authorized');
        }
    };

    return result;
}

export = authorize;
