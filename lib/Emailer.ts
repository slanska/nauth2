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

/*
 Helper class for composing emails for different users (based on their IDs)
 and using different templates
 */
class Emailer
{
    sendMailAsync:(options:nodemailer.SendMailOptions)=>Promise<hooks.HookParams>;

    constructor(protected app:feathers.Application, protected cfg:Types.INAuth2Config)
    {
        this.sendMailAsync = Promise.promisify<hooks.HookParams>(cfg.emailTransport.sendMail);
    }

    send(userIDs:Object[], templateName:string, params:hooks.HookParams, culture = 'en'):Promise<hooks.HookParams>
    {
        var self = this;
        var options = {} as nodemailer.SendMailOptions;

        // Load template

        // Populate with params

        // Attach images if needed

        // Load users by their IDs

        var result = self.sendMailAsync(options);
        result.then(info=>
        {

        });
        return result;
    }
}

export = Emailer;