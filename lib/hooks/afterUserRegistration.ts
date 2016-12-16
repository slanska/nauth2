/**
 * Created by slanska on 2016-10-09.
 */

import {Types} from '../../typings/server.d';
import feathers = require("feathers");
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import sendEmailToUser = require('./sendEmailToUser');
import Knex = require('knex');

/*
 Checks registration mode and depending on it,
 sets attributes for sending notification and/or confirmation emails
 */
function afterUserRegistration(knex:Knex, cfg:Types.INAuth2Config, emailField = 'email')
{
    /*
     registrationComplete
     welcome
     */

    var f = (p:hooks.HookParams)=>
    {
        if (cfg.userCreateMode === Types.UserCreateMode.Auto)
        {
            // TODO For Domain - use main cfg.UserCreateMode
        }

        switch (cfg.userCreateMode)
        {
            case Types.UserCreateMode.Auto:
            case Types.UserCreateMode.ByAdminOnly:
                // Not supposed to be here. Just ignore

                break;

            case Types.UserCreateMode.SelfAndApproveByAdmin:
                // Send email to user admin(s) to review request
                var result = knex.select('email').from('NAuth2_Users')
                    .join('NAuth2_UserRoles', 'roleId', 'roleId')
                    .where('roleId').then;
                result(d=> {
                    p['emailOptions'] = [{
                        templateName: 'approveNewUser',
                        to: '', // TODO UserAdmin email
                        subject: ''
                    }];
                });
                return result;

            case Types.UserCreateMode.SelfAndConfirm:
                // Send email to the user with confirmation link
                p['emailOptions'] = [{
                    templateName: 'welcomeAndConfirm',
                    to: p.data[emailField],
                    subject: ''
                }];
                break;

            case Types.UserCreateMode.SelfStart:
                // Send Welcome email and update user status
                p['emailOptions'] = [{
                    templateName: 'welcome',
                    to: p.data[emailField],
                    subject: ''
                }];
                break;
        }
    };
    return f;
}

export = afterUserRegistration;