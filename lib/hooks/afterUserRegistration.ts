/**
 * Created by slanska on 2016-10-09.
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import sendEmailToUser = require('./sendEmailToUser');

/*
 Checks registration mode and depending on it, will send notification emails
 */
function afterUserRegistration(cfg:Types.INAuth2Config)
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
                break;

            case Types.UserCreateMode.SelfAndConfirm:
                // Send email to the user with confirmation link
                sendEmailToUser('registerConfirm')(p);
                break;

            case Types.UserCreateMode.SelfStart:
                // Send Welcome email and update user status
                sendEmailToUser('welcomeNewUser')(p);
                break;
        }
       
        
    };
    return f;
}

export = afterUserRegistration;