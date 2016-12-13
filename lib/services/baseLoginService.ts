/**
 * Created by slanska on 2016-12-08.
 */

import * as Types from '../Types';
import knex = require('knex');
import Promise = require('bluebird');
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
import assign = require("lodash/assign");
import jsonwebtoken = require('jsonwebtoken');

/*
 Base class to serve login/signing calls
 Provides standard hooks and database operations needed for user login
 */
export abstract class BaseLoginService
{
    constructor(protected DBController: NAuth2.DBController)
    {
    }

    protected get asService(): feathers.Service
    {
        return this as any;
    }

    /*
     Returns promise which will resolve to string 'navigateTo' (user's landing page)
     which depends on primary user's role
     SysAdmin: Admin dashboard
     SysUserAdmin: User Admin
     regular user: default home page
     */
    public getNavigateToLink(roles)
    {
        var self = this;
        return getSystemRoles(self.DBController.db)
            .then(rr =>
                {
                    if (roles.indexOf(rr['SystemAdmin'].roleId) >= 0)
                        return 'admin:dashboard';

                    if (roles.indexOf(rr['UserAdmin'].roleId) >= 0)
                        return 'admin:users';

                    if (roles.indexOf(rr['DomainSuperAdmin'].roleId) >= 0)
                        return 'admin:domains';

                    return 'home';
                }
            );
    }

    /*
     Returns promise which will resolve to string 'navigateTo' (user's landing page)
     which depends on primary user's role
     SysAdmin: Admin dashboard
     SysUserAdmin: User Admin
     regular user: default home page

     Expects:
     * p.data.roles
     */
    public setNavigateToLinkHook(p: hooks.HookParams)
    {
        return this.getNavigateToLink(p.data.roles);
    }

    /*
     Hook to load user by his/her email or name.
     Prerequisites:
     p.data.email should be set to email or name

     Uses: DBController.findUserByEmailOrName
     */
    public findUserByEmailOrName(p: hooks.HookParams)
    {
        const self = this;
        if (!p.data || !p.data.email)
            throw NAuth2.DBController.invalidLoginError();

        return self.DBController.findUserByNameOrEmail(p.data.email)
            .then(uu =>
            {
                if (!uu)
                    throw NAuth2.DBController.invalidLoginError();
                p.params['user'] = uu;
            });
    }

    /*
     Generates temporary token which is valid for changing password only
     Returns promise which resolves to token
     */
    public generateChangePasswordToken(user: Types.IUserRecord)
    {
        return new Promise((resolve, reject) =>
        {
            var self = this;
            var payload = {userId: user.userId, roles: [], domains: []};
            var options = {} as jsonwebtoken.SignOptions;
            options.expiresIn = '15 min'; // TODO use config?
            options.subject = 'change_password';
            var token = jsonwebtoken.sign(payload, self.DBController.cfg.tokenSecret, options);
            return resolve(token);
        });
    }

    /*
     Hook to generate change password token
     This token typically has short lifetime (configurable)
     and can be used ONLY for password change

     Expects:
     * p.params.user

     Returns:
     * p.result.accessToken (with subject 'change_password')
     */
    public generateChangePasswordTokenHook(p: hooks.HookParams)
    {
        return this.generateChangePasswordToken(p.params['user'])
            .then(tt =>
            {
                p.result.accessToken = tt;
            });
    }

    public generateAccessTokenHook(p: hooks.HookParams)
    {
        return this.generateAccessToken(p.params['user'])
            .then(tt =>
            {
                p.result.accessToken = tt;
            });
    }

    /*
     Generates access token.
     Token payload will have:
     * userId
     * roles - all user roles
     * domains - limited list of domains
     Expects:
     * p.result.refreshToken
     * p.params.user
     Returns:
     * p.result.accessToken (with subject 'access')
     */
    public generateAccessToken(user: Types.IUserRecord)
    {
        var self = this;
        var roles;
        var payload = {userId: user.userId, roles: [], domains: []};

        // load roles
        return self.DBController.db.select('roleId').from('NAuth2_UserRoles').where({userId: user.userId})
            .then(rr =>
            {
                payload.roles = _.map(rr, 'roleId');
                roles = rr;

                // load top 10 freshly used domains, based on refresh tokens history (if applicable)
                return self.DBController.db.table('NAuth2_DomainUsers')
                    .where({userId: user.userId})
                    .limit(10); // TODO Use config for limit? How about orderBy
            })
            .then(dd =>
            {
                payload.domains = _.map(dd, 'domainId');

                let signOptions = {} as jwt.SignOptions;
                signOptions.expiresIn = self.DBController.cfg.tokenExpiresIn;
                signOptions.subject = 'access';
                return {roles, token: jsonwebtoken.sign(payload, self.DBController.authCfg.token.secret, signOptions)};
            });
    }

    /*
     'after' hook
     Generates refresh token after successful login.
     Prerequisites: p.params.user set to IUserRecord
     Returns: p.result.refreshToken
     */
    public generateRefreshTokenHook(p: hooks.HookParams)
    {
        return this.generateRefreshToken(p.params['user'], p.params['request'])
            .then(token =>
            {
                p.result.refreshToken = token;
            });
    }

    /*

     */
    public generateRefreshToken(user: Types.IUserRecord, req)
    {
        var token;
        const self = this;
        let it = {} as Types.IRefreshTokenRecord;
        it.tokenUuid = uuid.v4();
        // var req = p.params['request'];
        it.userAgent = req.headers['user-agent'];
        it.userId = user.userId;

        // Determine client IP address taking into account possible proxy server (e.g. nginx)
        it.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        it.signatureHash = objectHash(it.userAgent, {});

        let payload = {userId: user.userId, tokenID: it.tokenUuid} as any;
        let options = {} as jsonwebtoken.SignOptions;
        options.expiresIn = self.DBController.cfg.refreshTokenExpiresIn;
        options.subject = 'refresh';
        token = jsonwebtoken.sign(payload, self.DBController.cfg.tokenSecret, options)

        let t = jsonwebtoken.decode(token);
        console.log(t);
        it.validUntil = new Date(t.exp * 1000); // TODO
        return self.DBController.db.table('NAuth2_RefreshTokens').insert(it)
            .then(() =>
            {
                return token;
            });
    }

    /*
     Hook to load user profile (if configuration allow this
     and login request has corresponding flag)
     Expects:
     * p.params.user
     *
     */
    public loadUserProfile(p: hooks.HookParams)
    {
        var self = this;
        if (self.DBController.cfg.returnUserProfileOnLogin)
        {
            // TODO
        }
    }
}
