/**
 * Created by slanska on 2016-10-09.
 */

import * as Types from '../Types';
import feathers = require("feathers");
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import sendEmailToUser = require('./sendEmailToUser');

/*
 Checks registration mode and depending on it, will send notification emails
 */
function afterUserRegistration(app:feathers.Application, cfg:Types.INAuth2Config)
{
    /*
     registrationComplete
     welcome
     */

    var f = (p:hooks.HookParams)=>
    {
        switch (cfg.userCreateMode)
        {
            case Types.UserCreateMode.Auto:
            case Types.UserCreateMode.ByAdminOnly:
                // Cannot be here
                break;

            case Types.UserCreateMode.SelfAndApproveByAdmin:
                // Send email to user admin(s) to review request
                // TODO
                break;

            case Types.UserCreateMode.SelfAndConfirm:
                // Send email to the user with confirmation link
                sendEmailToUser(app, cfg, 'registerConfirm')(p);
                break;

            case Types.UserCreateMode.SelfStart:
                // Send Welcome email and update user status
                sendEmailToUser(app, cfg, 'welcomeNewUser')(p);
                break;
        }
       
        
    };
    return f;
}

export = afterUserRegistration;