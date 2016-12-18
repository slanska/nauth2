/**
 * Created by slanska on 2016-10-10.
 */

import Types = require('./Types');
import nodemailer = require('nodemailer');
import feathers = require('feathers');
import errors = require('feathers-errors');
import hooks = require('feathers-hooks');
import Promise = require('bluebird');
import _ = require('lodash');
import path = require('path');
var ECT = require('ect');

var renderer = ECT({
    root: path.join(__dirname, '../templates'),
    watch: true,
    ext: '.html'
});

renderer.renderAsync = Promise.promisify(renderer.render);

/*
 Helper class for composing emails for different users (based on their IDs)
 and using different templates.
 Templates are stored as HTML files, without JavaScript.
 Templating is implemented using ECT template engine (https://github.com/baryshev/ect)
 Supported syntax:
 <%= @user %>  - to refer to param.data.user attribute
 <%- @value %> - to escape HTML
 */
class Emailer
{
    // sendMailAsync:(options:nodemailer.SendMailOptions)=>Promise<hooks.HookParams>;

    constructor(protected app:feathers.Application, protected cfg:Types.INAuth2Config)
    {
        // this.sendMailAsync = Promise.promisify<hooks.HookParams>(cfg.emailTransport.sendMail);
    }

    /*
     Sends email using given template

     param @emailOptions:
     The following properties are required to be set by caller:
     - subject
     - to

     The following properties will be set by this function:
     - html (result of rendering based on templateName and params.data. Path to template file is determined as
     /<culture>/<templateName>.html)
     - sender (from cfg)
     - from (from cfg)

     The following properties are optional:
     - cc
     - bcc
     Otherwise, template with name /<culture>/<templateName>.subject.html will be rendered)

     */
    send(emailOptions:nodemailer.SendMailOptions, templateName:string,
         params:hooks.HookParams, culture = 'en'):Promise<hooks.HookParams>
    {
        var self = this;
        var dd = _.cloneDeep(params.data);
        dd.companyName = self.cfg.companyName;
        dd.templateName = templateName;
        dd.title = emailOptions.subject;

        return new Promise<any>((resolve, reject) =>
        {
            /*
             actionTitle
             */

            renderer.render(`${culture}/${templateName}`, dd, (err, html)=>
            {
                if (err)
                    reject(err);
                else
                {
                    emailOptions.html = html;

                    self.cfg.emailTransport.sendMail(emailOptions, (error:Error, info:nodemailer.SentMessageInfo)=>
                    {
                        if (error)
                            reject(err);
                        else
                        {
                            resolve(params);
                        }
                    });
                }
            });

        });
    }
}

export = Emailer;