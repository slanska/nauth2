/**
 * Created by slanska on 2016-10-10.
 */

import Types = require( "../Types");
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');

/*
 Verifies that email specified in payload is not yet used by other users
 */
function verifyEmail(emailField = 'email')
{
    // Email regex according to RFC5322 (http://www.ietf.org/rfc/rfc5322.txt & http://emailregex.com)
    var rx = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    var result = (p: hooks.HookParams) =>
    {
        var email = p.data[emailField];
        if (!email.match(rx))
        {
            throw new errors.BadRequest('Invalid email');
        }
    };
    return result;
}

export = verifyEmail;
