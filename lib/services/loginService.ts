/**
 * Created by slanska on 2016-12-08.
 */

import Types = require('../Types');
import Promise = require('bluebird');
import feathers = require("feathers");
import nhooks = require('../hooks/index');
import hooks = require('feathers-hooks');
import auth  = require('feathers-authentication');
import errors = require('feathers-errors');
import _ = require('lodash');
import bcrypt = require('bcryptjs');
import NAuth2 = require('../DBController');
import {BaseLoginService} from './baseLoginService';
import HTTPStatus = require('http-status');

/*
 Service for user password changing
 */
export class LoginService extends BaseLoginService
{
    protected app: feathers.Application;

    setup(app: feathers.Application)
    {
        const self = this;
        self.app = app;

        self.asService.before({
            create: [
                // Load user by email/name into p.params.user
                self.findUserByEmailOrName,

                // Verify password
                (p: hooks.HookParams) =>
                {
                    if (!bcrypt.compareSync(p.data.password, p.params['user'].password))
                        throw NAuth2.DBController.invalidLoginError();
                }
            ]
        });

        self.asService.after({
            create: [
                self.loadUserProfile,

                nhooks.sendEmailToUser(self.app, self.DBController.cfg, 'registerConfirmReminder',
                    (p:hooks.HookParams) =>
                    {
                        // TODO
                        return '';
                    },
                    'email',
                    () =>
                    {
                        // TODO
                        // send this email only if result status = OK and navigateTo = 'registerNotComplete'

                        return false;
                    })
            ]
        });
    }

    /*
     POST /auth/login
     Expects:
     * params.user
     * params.token
     * params.payload

     Returns:
     * accessToken?
     * message
     * status
     * refreshToken?
     * navigateTo
     * userProfile?
     */
    create(data, params: feathers.MethodParams)
    {
        var self = this;
        var result = {} as ILoginResponse;

        return new Promise((resolve, reject) =>
        {
            var user: IUserRecord = params['user'];

            // TODO also check user.pwd_expires_at
            if (user.changePasswordOnNextLogin)
            {
                // Redirect or return warning
                return self.generateChangePasswordToken(user)
                    .then((token: any) =>
                    {
                        result.accessToken = token;
                        result.navigateTo = 'changePassword';
                        return resolve(result);
                    });
            }

            switch (user.status)
            {
                case 'A':
                {
                    /*
                     TODO Payload includes:
                     userId
                     all assigned general roles (not domain specific)
                     top N assigned domains and all their roles (if applicable)
                     */
                    return self.generateRefreshToken(user, params['request'])
                        .then(tt =>
                        {
                            result.refreshToken = tt;
                            return self.generateAccessToken(user);
                        })
                        .then(tt =>
                        {
                            result.accessToken = tt.token;
                            return self.getNavigateToLink(tt.roles);
                        })
                        .then(link =>
                        {
                            result.navigateTo = link;
                            return resolve(result);
                        })
                        .catch(err =>
                        {
                            return reject(err);
                        });
                }

                case 'S':
                case 'D':
                {
                    // suspended or deleted - return error
                    // TODO Log? Notification email
                    return reject(NAuth2.DBController.invalidLoginError());
                }

                case 'P':
                    // TODO Registration is not yet confirmed - resend email
                {
                    result.navigateTo = 'registerNotComplete';
                    result.message = '';
                    result.status = HTTPStatus.UNAUTHORIZED;
                    return resolve(result);
                }
            }
        });
    }
}