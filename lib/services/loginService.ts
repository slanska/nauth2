/**
 * Created by slanska on 2016-12-08.
 */

import * as Types from '../Types';
import knex = require('knex');
// import * as DB from '../Consts';
import Promise = require('bluebird');
// var knexServiceFactory = require('feathers-knex');
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
                },


            ]
        });

        self.asService.after({
            create: [
                self.generateAccessTokenHook
            ]
        });
    }

    /*
     POST /auth/login
     Expects:
     * params.user
     * params.token
     * params.payload
     */
    create(data, params: feathers.MethodParams)
    {
        var self = this;
        return new Promise((resolve, reject) =>
        {
            var user: Types.IUserRecord = params['user'];

            // TODO user.pwd_expires_at
            if (user.changePasswordOnNextLogin)
            {
                // Redirect or return warning
                return self.generateChangePasswordToken(user)
                    .then(() =>
                    {
                        return resolve({navigateTo: 'changePassword'});
                    });
            }

            switch (user.status)
            {
                case 'A':
                    /*
                     TODO Payload includes:
                     userId
                     all assigned general roles (not domain specific)
                     top N assigned domains and all their roles (if applicable)
                     */
                    var result = {accessToken: void 0, refreshToken: void 0, navigateTo: void 0};

                    return self.generateRefreshToken(user, params['request'])
                        .then(tt =>
                        {
                            result.refreshToken = tt;
                            return self.generateAccessToken(user);
                        })
                        .then(tt =>
                        {
                            result.accessToken = tt;
                            return self.DBController.db.select('roleId').from('NAuth2_UserRoles').where({userId: user.userId});
                        })
                        .then(roles =>
                        {
                            return self.getNavigateToLink(roles);
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

                case 'S':
                case 'D':
                    // suspended or deleted - return error
                    return reject(NAuth2.DBController.invalidLoginError());


                case 'P':
                    // TODO Registration is not yet confirmed - resend email
                    return resolve({});
            }
        });
    }
}