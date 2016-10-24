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
function verifyUniqueUserEmail(emailField = 'email')
{
    var result = function(p:hooks.HookParams)
    {
        var self = this as feathers.Service;
        var email = p.data[emailField];
        var qry = {};
        qry['email'] = email;
        var result = self.find({query: qry})
            .then((r:feathers.FindResult)=>
            {
                if (r && r.data && r.data.length > 0)
                    throw new errors.BadRequest('This email is already in use');
            });
        return result;

    };
    return result;
}

export = verifyUniqueUserEmail;