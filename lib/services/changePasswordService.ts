/**
 * Created by slanska on 2016-12-08.
 */

import * as Types from '../Types';
import knex = require('knex');
import * as DB from '../Consts';
import Promise = require('bluebird');
var knexServiceFactory = require('feathers-knex');
import feathers = require("feathers");
import nhooks = require('../hooks/index');
import hooks = require('feathers-hooks');
import auth  = require('feathers-authentication');
import jwt = require('jsonwebtoken');
import errors = require('feathers-errors');
import HTTPStatus = require('http-status');
import _ = require('lodash');
import Qs = require('qs');
import bcrypt = require('bcryptjs');
var uuid = require('uuid');
import objectHash = require('object-hash');
import {getSystemRoles} from "../hooks/loadSysRoles";
import NAuth2 = require('../DBController');
import {BaseLoginService} from './baseLoginService';

/*
 Service for password changing
 */
export class ChangePasswordService extends BaseLoginService
{
    /*
     POST /auth/changePassword
     */
    public create(data, params: feathers.MethodParams)
    {
        var self = this;

        var token = data.accessToken;


        // Check token

        // Check newPassword === confirmPassword
        if (data.newPassword !== data.confirmPassword)
        {
            throw new Error(`Password mismatch`);
        }

        // Check if newPassword !== password
        if (data.password === data.newPassword)
        {
            throw new Error(`Cannot re-use old password`);
        }

        // Check newPassword is not in password history

        // Save new password: clear changePasswordOnNextLogin, set prePwdHash, pwdExpireOn
        return self.DBController.db('NAuth2_Users').update({})
            .then(() =>
            {
            });


        // Automatically proceed with login: generate tokens etc.
    }

    /*
     Initializes hooks
     */
    public setup(app: feathers.Application)
    {
        var self = this;

        self.asService.before({
            create: [

                // Parse and verify token

                // Set attributes: oldPassword, password, confirmPassword
                (p: hooks.HookParams) =>
                {

                },


                nhooks.verifyNewPassword(this.DBController.cfg, 'newPassword', 'confirmPassword'),

                // Compare old and new password - should not be the same, depending on configuration

                // Pluck attributes
                hooks.hooks.remove('newPassword', 'confirmPassword'),

                auth.hooks.hashPassword(this.DBController.authCfg)

                // Update Nauth2_Users
            ]
        });

        self.asService.after({
            create: [
                // Init payload


                // Generate login tokens: accessToken and refreshToken

                // Set 'navigateTo' link

                // Send notification email ('Password has changed'), if configured
            ]
        });
    }
}