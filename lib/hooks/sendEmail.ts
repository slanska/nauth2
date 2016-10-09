/**
 * Created by slanska on 2016-10-09.
 */

/*
 Sends email using given template name and params.data as source of data for template
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');

// TODO import Emailer

function sendEmail(templateName:string)
{
    var result = (p:hooks.HookParams)=>
    {
        // TODO Use nodemailer
    };
    return result;
}

export = sendEmail;