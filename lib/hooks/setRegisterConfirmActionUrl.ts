/**
 * Created by slanska on 2016-10-23.
 */

import * as Types from '../Types';
import feathers = require("feathers");
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import auth = require('feathers-authentication');
import jwt = require('jsonwebtoken');
import Promise = require('bluebird');
import Qs = require('qs');

/*
 Generates temporary encrypted token for the given user's email
 This token to be included into welcomeAndConfirm email.
 Token will have expiry time in 24 hours
 TODO have it configurable?

 @param app : Application instance
 @param cfg : global NAuth2 configuration. emailConfig is needed
 */
function setRegisterConfirmActionUrl(cfg:Types.INAuth2Config, authCfg:auth.AuthConfig,
                                     emailFiield = 'email')
{
    var result = function (p:hooks.HookParams)
    {
        return new Promise((resolve, reject)=>
        {
            var payload = {email: p.data[emailFiield]};
            var signOptions = {} as jwt.SignOptions;
            signOptions.expiresIn = cfg.confirmTokenExpiresIn;
            signOptions.subject = 'confirm_registration';
            jwt.sign(payload, authCfg.token.secret, signOptions, (err, token)=>
            {
                if (err)
                    reject(err);
                else
                {
                    var qry = Qs.stringify({t: token});
                    p.data['actionUrl'] = `${cfg.publicHostUrl}${cfg.basePath}/confirmRegister?${qry}`;
                    p.data['actionTitle'] = 'Confirm Email Address'; // TODO Localize
                    p.data['companyName'] = cfg.companyName;
                    resolve(p);
                }
            });
        });
    };
    return result;
}

export = setRegisterConfirmActionUrl;