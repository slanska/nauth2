/**
 * Created by slanska on 2016-12-08.
 */

import {Types} from '../../typings/server.d';
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
// import {getSystemRoles} from "../hooks/loadSysRoles";
import NAuth2 = require('../DBController');
import {BaseLoginService} from './baseLoginService';

/*
 Service for user password changing
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

        // Check newPassword is not in password history

        // Save new password: clear changePasswordOnNextLogin, set prePwdHash, pwdExpireOn
        return self.DBController.db('NAuth2_Users').update({})
            .then(() =>
            {
            });


        // Automatically proceed with login: generate tokens etc.
    }

    private initPayload()
    {
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
                auth.hooks.verifyToken(self.DBController.authCfg),

                self.findUserByEmailOrName,

                nhooks.verifyNewPassword(this.DBController.cfg, 'newPassword', 'confirmPassword'),

                // Set attributes: oldPassword, password, confirmPassword
                (p: hooks.HookParams) =>
                {
                    const pwd = p.data['password'];
                    p.data['oldPassword'] = pwd;
                    p.data['password'] = p.data['newPassword'];
                },

                // Make sure that new password differs from old one
                (p: hooks.HookParams) =>
                {
                    if (p.data.password === p.data.newPassword)
                        throw new Error(`Cannot re-use old password`);
                },

                // Compare old and new password - should not be the same, depending on configuration
                (p: hooks.HookParams) =>
                {

                },

                // Remove attributes
                //nhooks.
                hooks.remove('oldPassword', 'confirmPassword'),

                auth.hooks.hashPassword(this.DBController.authCfg)

                // Update Nauth2_Users
            ]
        });

        self.asService.after({
            create: [
                // Init payload
                self.initPayload,

                // Generate login tokens: accessToken and refreshToken
                self.generateRefreshToken,
                self.generateAccessToken,

                // Set 'navigateTo' link
                self.getNavigateToLink,

                // Send notification email ('Password has changed'), if configured
                nhooks.sendEmailToUser(app, self.DBController.cfg, 'passwordChanged',
                    () =>
                    {
                        return ''
                    },
                    'email',
                    () => self.DBController.cfg.sendEmailOnChangePassword
                )
            ] as any
        });
    }
}