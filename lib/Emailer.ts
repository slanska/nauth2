/**
 * Created by slanska on 2016-10-10.
 */

import * as Types from './Types';
import nodemailer = require('nodemailer');
import feathers = require('feathers');
import errors = require('feathers-errors');
import hooks = require('feathers-hooks');
import Promise = require('bluebird');
import _ = require('lodash');
import path = require('path');
import fs = require('fs');
var ECT = require('ect');

var renderer = ECT({
    root: path.join(__dirname, '../templates'),
    watch: true,
    ext: '.html'
});

// import sendgrid = require('feathers-sendgrid');

/*
 Helper class for composing emails for different users (based on their IDs)
 and using different templates.
 Templates are stored as HTML files, without JavaScript.
 Templating is implemented using lodash template function (https://lodash.com/docs/4.16.4#template)
 Supported syntax:
 <%= user %> or ${ user } - to refer to param.data.user attribute
 <%- value %> - to escape HTML
 <% function() %> - to execute JavaScript code

 Templates are running in sandbox, with standard JavaScript functions only (Math and Date)
 with addition of attachImage() function
 Result of templating is sanitized to ensure that there is no JavaScript
 */
class Emailer
{
    sendMailAsync:(options:nodemailer.SendMailOptions)=>Promise<hooks.HookParams>;

    static readFileAsync = Promise.promisify(fs.readFile);

    constructor(protected app:feathers.Application, protected cfg:Types.INAuth2Config)
    {
        this.sendMailAsync = Promise.promisify<hooks.HookParams>(cfg.emailTransport.sendMail);
    }

    /*
     subject: parameter
     from: site email address
     html/text: from template + params.data
     to
     cc?
     bcc?
     */
    send(emailOptions:nodemailer.SendMailOptions, templateName:string,
         params:hooks.HookParams, culture = 'en'):Promise<hooks.HookParams>
    {
        var self = this;
        return new Promise<any>((resolve, reject) =>
        {
            var dd = {
                confirmRegistrationUrl: '#',
                title: 'Confirmation',
                companyName: 'crudbit.com'
            };

            renderer.render(`${culture}/${templateName}`, dd, (err, html)=>
            {
                if (err)
                    reject(err);
                else
                {
                    resolve();
                    emailOptions.html = html;
                    self.sendMailAsync(emailOptions);
                }
            });

        });
    }
}

export = Emailer;