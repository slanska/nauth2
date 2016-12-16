/**
 * Created by slanska on 2016-10-16.
 */

/*
 BEFORE hook to determine if current user ID is the same as params 'id' (for GET, PUT, PATCH, DELETE /users/:id)
 This hook should be listed after auth.initUser hook
 Result is set to params.context.ownUser
 */

import {Types} from '../../typings/server.d';
import hooks = require("feathers-hooks");

function detectOwnUser(userField = 'userID')
{
    var result = (p:hooks.HookParams)=>
    {
        p.params['context'] = p.params['context'] || {};
        p.params['context'].ownUser = p.data[userField] === p.params.token.userID;
    };
    return result;
}

export = detectOwnUser;