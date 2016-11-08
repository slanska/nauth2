/**
 * Created by slanska on 2016-10-16.
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import {methodMap, rules} from '../accessRules';
var Notation = require('notation');

/*
 BEFORE (for create/update/patch operations) or AFTER (for get/find) hook
 Applies filtering from accesscontrol.js to sanitize data based on granted access rules.
 Pre-requisites: user must be authenticated and populated, token should be verified and parsed
 @param (string) resourceName - name of REST resource (users, roles etc.)
 @param (string) ownAttribute
 */
function sanitizeData(resourceName:string)
{
    var result = function (p:hooks.HookParams)
    {
        var action = methodMap[p.method];

        if (!action)
            throw new errors.NotImplemented(`${p.method} is not supported by authorization hook`);

        var permission = rules.permission({
            role: ['systemAdmin'], // TODO p.params.token.roles,
            resource: resourceName,
            action: action + ':any'
        });

        if (!permission.granted)
        {
            permission = rules.permission({
                role: p.params.token.roles,
                resource: resourceName,
                action: action + ':own'
            });
        }


        if (p.type === 'before')
        {
            p.data = permission.filter(p.data);
        }
        else
        {
            p.result.data = permission.filter(p.result.data);
        }
    };

    return result;
}

export = sanitizeData;