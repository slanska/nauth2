/**
 * Created by slanska on 2016-10-16.
 */

/*
 BEFORE hook for 'domains', 'domainUsers', ''users and 'userRoles' to determine if current user is associated with current domain
 Used for 'domainAdmin' and 'domainUserAdmin' roles
 This hook should be listed after auth.initUser hook
 Result is set to params.context.ownDomain
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");

function detectOwnDomain()
{
    var result = (p:hooks.HookParams)=>
    {
        // Check current domain
        // Check domain assignments for the current user
        //If domain not in the token, load it and update token

        // result = current domain in the user's domain list
    };
    return result;
}

export = detectOwnDomain;