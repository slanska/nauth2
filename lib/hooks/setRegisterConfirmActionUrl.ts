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
            signOptions.expiresIn = '24h';
            signOptions.subject = 'confirm_registration';
            jwt.sign(payload, authCfg.token.secret, signOptions, (err, token)=>
            {
                if (err)
                    reject(err);
                else
                {
                    p.data['actionUrl'] = `${cfg.publicHostUrl}/confirmRegister?${token}`;
                    p.data['actionTitle'] = 'Confirm Email Address'; // TODO Localize
                    resolve(p);
                }
            });
        });
    };
    return result;
}

export = setRegisterConfirmActionUrl;