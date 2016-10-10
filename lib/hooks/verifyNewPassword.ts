/**
 * Created by slanska on 2016-10-09.
 */

/*
 Verifies new password 
 1) should match password rules (defined in INAuth2Config)
 2) password and confirm password should match
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');

function verifyNewPassword(cfg?:Types.INAuth2Config, passwordField = 'password', confirmPasswordField = 'confirmPassword')
{
    var {passwordRules} = (Object as any).assign({}, cfg, {passwordRules: /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/});
    var pwdx = new RegExp(passwordRules);

    var result = (p:hooks.HookParams)=>
    {
        var pwd = String(p.data[passwordField]);
        var cpwd = String(p.data[confirmPasswordField]);
        if (pwd !== cpwd)
        // TODO Use phrases.json - PasswordShouldMatch
            throw new errors.BadRequest('Password and confirm password are not the same');

        if (!pwd.match(pwdx))
        // TODO Use phrases.json - WeakPassword
            throw new errors.BadRequest('Weak or missing password');
    };
    return result;
}

export = verifyNewPassword;