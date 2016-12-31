/**
 * Created by slanska on 2016-12-08.
 */

import Types = require('../Types');
// import knex = require('knex');
import Promise = require('bluebird');
import feathers = require("feathers");
import nhooks = require('../hooks/index');
import hooks = require('feathers-hooks');
import auth  = require('feathers-authentication');
// import jwt = require('jsonwebtoken');
import errors = require('feathers-errors');
// import HTTPStatus = require('http-status');
import _ = require('lodash');
// import Qs = require('qs');
import NAuth2 = require('../DBController');
import {BaseLoginService} from './baseLoginService';
var ms = require('ms');
import moment = require('moment');

/*
 Service for user password changing
 */
export class ChangePasswordService extends BaseLoginService
{
    authCfg: auth.AuthConfig;

    constructor(DBController: NAuth2.DBController)
    {
        super(DBController);
        this.authCfg = _.cloneDeep(this.DBController.authCfg);
        this.authCfg.token.secret = this.DBController.cfg.changePasswordTokenSecret;
        this.authCfg.secret = this.DBController.cfg.changePasswordTokenSecret;
    }

    /*
     POST /auth/changePassword
     */
    public create(data, params: feathers.MethodParams)
    {
        var self = this;

        var user = params['user'] as IUserRecord;

        // Check newPassword is not in password history
        let pwdExpireOn = void 0;
        if (typeof self.DBController.cfg.passwordLifetime === 'string')
        {
            pwdExpireOn = moment().add('ms', ms(self.DBController.cfg.passwordLifetime));
        }

        // Load user record - get prevPwdHash value (space separated list of hashes)

        // Save new password: clear changePasswordOnNextLogin, set prePwdHash, pwdExpireOn
        return self.DBController.db('NAuth2_Users').update({
            changePasswordOnNextLogin: false,
            prevPwdHash: '',
            pwdExpireOn: pwdExpireOn,
            password: data.password
        })
            .then(() =>
            {
            });

        // Automatically proceed with login: generate tokens etc.
    }

    private initPayloadHook(p:hooks.HookParams)
    {
        p.result = {};
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
                auth.hooks.verifyToken(self.authCfg),

                // self.findUserByEmailOrName,

                nhooks.verifyNewPassword(this.DBController.cfg, 'newPassword', 'confirmPassword'),

                // Set attributes: oldPassword, password, confirmPassword
                (p: hooks.HookParams) =>
                {
                    const pwd = p.data['password'];

                    // Make sure that new password differs from old one
                    if (pwd === p.data.newPassword)
                        throw new Error(`Cannot re-use old password`);

                    p.data.password = p.data.newPassword;
                },

                hooks.remove('newPassword', 'confirmPassword'),

                auth.hooks.hashPassword(this.DBController.authCfg),

                self.findUserByIdHook
            ]
        });

        self.asService.after({
            create: [
                // Init payload
                self.initPayloadHook,

                // Generate login tokens: accessToken and refreshToken
                self.generateRefreshTokenHook,
                self.generateAccessTokenHook,

                // Set 'navigateTo' link
                self.getNavigateToLinkHook,

                // Send notification email ('Password has changed'), if configured
                nhooks.sendEmailToUser(app, self.DBController.cfg, 'passwordChanged',
                    () =>
                    {
                        // TODO Translate
                        return 'Password change notification'
                    },
                    'email',
                    () => self.DBController.cfg.sendEmailOnChangePassword
                )
            ] as any
        });
    }
}