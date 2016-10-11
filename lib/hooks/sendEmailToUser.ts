/**
 * Created by slanska on 2016-10-09.
 */

/*
 Sends email using given template name and params.data as source of data for template
 to the address specified by emailField attribute in data
 */

import * as Types from '../Types';
import feathers = require("feathers");
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import Emailer = require('../Emailer');

function sendEmail(app:feathers.Application, cfg:Types.INAuth2Config,
                   templateName:string, emailField = 'email')
{
    var emailer = new Emailer(app, cfg);
    var result = (p:hooks.HookParams)=>
    {
        // TODO get list of users
        return emailer.send([], templateName, p);
    };
    return result;
}

export = sendEmail;