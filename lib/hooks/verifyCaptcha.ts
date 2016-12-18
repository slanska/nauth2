/**
 * Created by slanska on 2016-10-09.
 */

/*
 Verifies captcha value entered by user
 Expects 'captcha' attribute in params.data 
 */

import Types = require('../Types');
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import Captcha = require('../Captcha');

function verifyCaptcha(captchaField = 'captcha')
{
    var result = (p:hooks.HookParams)=>
    {
        var captcha = p.data[captchaField] as Types.ICaptcha;
        if (!captcha)
        {
            throw new errors.BadRequest('Missing captcha value');
        }

        return Captcha.verify(captcha.hash, captcha.value)
            .then(ok=>
                {
                    if (!ok)
                        throw new errors.BadRequest('Invalid captcha value');
                }
            );
    };
    return result;
}

export = verifyCaptcha;