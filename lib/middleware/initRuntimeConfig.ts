/**
 * Created by slanska on 2016-10-23.
 */

/*
 Initializes global configuration based on request information (browser language,
 host url etc.)
 Initializes database if needed
 */

import * as Types from '../Types';
import _ = require('lodash');
import express = require('express');
import url = require('url');


export = (controller:Types.INAuth2Controller) =>
{
    var done = false;

    /*
     Init authentication configuration
     */
    // this.AuthConfig.token = {expiresIn: '1d'} as any;
    controller.AuthConfig.idField = 'userId';
    controller.AuthConfig.userEndpoint = `/${controller.cfg.basePath}/users`;
    if (!_.isEmpty(controller.cfg.tokenSecret))
        controller.AuthConfig.token = {
            secret: controller.cfg.tokenSecret,
            expiresIn: controller.cfg.tokenExpiresIn || '1d'
        };

    var result = (req:express.Request, res:express.Response, next)=>
    {
        // Executed on every request

        // TODO Determine if this is AJAX or normal call
        if (req.xhr || req.headers["x-requested-with"] === 'XMLHttpRequest'
            || req.headers['accept'].indexOf('json') > -1)
        {
            //ajax request
        }

        //Executed only once
        if (!done)
        {
            done = true;
            if (_.isEmpty(controller.cfg.publicHostUrl))
            {
                var prefix = req.secure ? 'https' : 'http';
                controller.cfg.publicHostUrl = `${prefix}://${req.headers['host']}`;
            }

            if (_.isEmpty(controller.cfg.termsOfServiceUrl))
            {
                // url.format()
            }

            if (_.isEmpty(controller.cfg.supportEmail))
            {

                controller.cfg.supportEmail = `${controller.cfg.companyName} Support<support@nauth2.com>`;
            }
        }

        next();
    };


    return result;
};