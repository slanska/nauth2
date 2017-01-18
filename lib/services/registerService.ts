/**
 * Created by slanska on 2016-12-08.
 */

import Types = require('../Types');
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
import objectHash = require('object-hash');
import NAuth2 = require('../DBController');
import assign = require("lodash/assign");
import jsonwebtoken = require('jsonwebtoken');
import {BaseDBService} from "./basicDBService";

export class RegisterService extends BaseDBService
{
    constructor(DBController: NAuth2.DBController)
    {
        super(DBController, {
            name: 'NAuth2_Users',
            id: 'userID'
        });
    }

    /*
     Sets status for new user as 'A'(Active), if user create mode is SelfStart
     */
    private setNewUserStatusHook()
    {
        var self = this;
        var result = (p: hooks.HookParams) =>
        {
            if (self.DBController.cfg.userCreateMode === Types.UserCreateMode.SelfStart)
                p.data.status = 'A';
        };
        return result;
    }

    /*

     */
    private setRolesToNewUser()
    {
        var self = this;

        var result = (p: hooks.HookParams) =>
        {
            return self.DBController.db.table('NAuth2_Roles').where({'name': {$in: self.DBController.cfg.newMemberRoles || []}})
                .then(rr =>
                {
                    let roles = _.map(rr, (r: any) =>
                    {
                        return {userId: p.result.userId, roleId: r.roleId};
                    });

                    if (roles.length === 0)
                        return Promise.resolve();

                    return self.DBController.db.table('NAuth2_UserRoles')
                        .insert(roles);
                });

        };
        return result;
    }

    setup(app: feathers.Application)
    {
        super.setup(app);

        this.before({
            create: [
                nhooks.verifyCaptcha('captcha'),
                nhooks.verifyNewPassword(this.DBController.cfg, 'password', 'confirmPassword'),
                hooks.remove('captcha'),
                hooks.remove('confirmPassword'),
                auth.hooks.hashPassword(this.DBController.authCfg),
                nhooks.verifyEmail(),
                nhooks.verifyUniqueUserEmail(),
                this.setNewUserStatusHook(),
                nhooks.jsonDataStringify()
            ],
            get: [hooks.disable('external')],
            find: [hooks.disable('external')],
            update: [hooks.disable('external')],
            remove: [hooks.disable('external')],
            patch: [hooks.disable('external')],
        });
        this.after({
            create: [
                this.setRolesToNewUser(),
                hooks.pluck('email'),

                // TODO afterUserRegister
                nhooks.setRegisterConfirmActionUrl(this.DBController.cfg, this.DBController.authCfg),
                nhooks.sendEmailToUser(this.app, this.DBController.cfg, 'welcomeAndConfirm',
                    // TODO Localize
                    _.template('Welcome to <%-companyName%>! Confirm your email')),

                (p: hooks.HookParams) =>
                {
                    p.result = {} as feathers.ResponseBody;
                    p.result.name = 'Success';
                    p.result.className = 'success';
                    p.result.code = HTTPStatus.OK;
                    p.result.message = 'Registration successful. Check your email';
                }
            ]
        });
    }
}