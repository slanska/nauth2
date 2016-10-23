/**
 * Created by slanska on 2016-10-09.
 */

import * as Types from '../Types';
import feathers = require("feathers");
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import Emailer = require('../Emailer');

/*
 Sends email with action link (e.g. confirm registration) to the user
 using given template name and params.data as source of data for template
 to the address specified by emailField attribute in data

 @param app : Application instance
 @param cfg : global NAuth2 configuration. emailConfig is needed
 @param templateName : path to html template to generate email body
 @param subject : email subject. Can be template string in ECT format.
 */
function sendEmailToUser(app:feathers.Application, cfg:Types.INAuth2Config,
                         templateName:string, subject:string|Types.TemplateFunction, emailField = 'email')
{
    var emailer = new Emailer(app, cfg);
    var result = (p:hooks.HookParams)=>
    {
        var emailOptions = {} as nodemailer.SendMailOptions;
        emailOptions.to = p.data[emailField];
        emailOptions.from = cfg.supportEmail;
        if (typeof subject === 'string')
        {
            emailOptions.subject = subject as any;
        }
        else
        {
            subject = (subject as Types.TemplateFunction)(p.data);
        }

        return emailer.send(emailOptions, templateName, p);
    };
    return result;
}

export = sendEmailToUser;