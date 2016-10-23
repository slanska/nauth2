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


export = (cfg:Types.INAuth2Config) =>
{
    var done = false;

    var result = (req:express.Request, res:express.Response, next)=>
    {
        if (!done)
        {
            done = true;
            if (_.isEmpty(cfg.publicHostUrl))
            {
                cfg.publicHostUrl = req.headers['host'];
            }

            if (_.isEmpty(cfg.termsOfServiceUrl))
            {
// url.format()
            }

            if (_.isEmpty(cfg.supportEmail))
            {
                cfg.supportEmail = `${cfg.companyName} Support<support@nauth2.com>`;
            }
        }

        next();
    };


    return result;
};