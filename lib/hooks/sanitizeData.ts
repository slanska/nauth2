/**
 * Created by slanska on 2016-10-16.
 */

import Types = require('../Types');
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import {methodMap, getRules} from '../accessRules';
import Knex = require('knex');
import Promise = require('bluebird');
import _ = require('lodash');

/*
 BEFORE (for create/update/patch operations) or AFTER (for get/find) hook
 Applies filtering from accesscontrol.js to sanitize data based on granted access rules.
 Pre-requisites: user must be authenticated and populated, token should be verified and parsed
 @param (string) resourceName - name of REST resource (users, roles etc.)
 @param (string) ownAttribute
 */
function sanitizeData(db:Knex, resourceName:string)
{
    var result = function (p:hooks.HookParams)
    {
        return getRules(db)
            .then(rules=>
            {
                var action = methodMap[p.method];

                if (!action)
                    throw new errors.NotImplemented(`${p.method} is not supported by authorization hook`);

                var permission = rules.permission({
                    role: p.params['payload'].roles,
                    resource: resourceName,
                    action: action + ':any'
                });

                if (!permission.granted)
                {
                    permission = rules.permission({
                        role: p.params['payload'].roles,
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
                    if (p.result.data)
                        p.result.data = permission.filter(p.result.data);
                    else p.result = permission.filter(p.result);
                }
            }) as any;
    };

    return result;
}

export = sanitizeData;