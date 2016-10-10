/**
 * Created by slanska on 2016-10-10.
 */

import * as Types from '../Types';
import feathers = require("feathers");
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');

/*
 Verifies that email specified in payload is not yet used by other users
 */
function verifyUniqueUserEmail(userService:feathers.Service, emailField = 'email')
{
    var result = (p:hooks.HookParams)=>
    {
        var email = p.data[emailField];
        // TODO

    };
    return result;
}

export = verifyUniqueUserEmail;