/**
 * Created by slanska on 2017-01-12.
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
import {BaseService} from "./baseService";

export class ConfirmRegisterService extends BaseService
{
    setup(app: feathers.Application)
    {
        let self = this;
        self.app = app;
        self.asService.before({find: []});
    }

    find(params: feathers.MethodParams)
    {
        let self = this;
        return new Promise((resolve, reject) =>
        {
            jwt.verify(params.query.t, self.DBController.authCfg.token.secret,
                (err, decoded) =>
                {
                    if (err)
                        return reject(err);

                    // Update status of user to '(A)ctive'
                    return self.DBController.Services.RegisterUsers.find(
                        {query: {email: decoded.email}, paginate: {limit: 1}})
                        .then(users =>
                        {
                            // Check if user is found
                            // Check if user is marked as suspended or deleted
                            if (!users || users.length !== 1 || users[0].status === 'D' || users[0].status === 'S')
                            {
                                // TODO Translate
                                reject(new errors.NotFound('User not found or suspended'));
                            }

                            // Finally, update its status
                            return this.DBController.Services.RegisterUsers.patch(users[0].userId,
                                {status: 'A'},
                                {});
                        })
                        .then(d =>
                        {
                            // Redirects or renders default page
                            if (self.DBController.cfg.run_mode === 'website')
                            {

                            }
                            else
                            {

                            }
                            var result = {} as feathers.ResponseBody;
                            result.name = 'Success';
                            result.className = 'success';
                            result.code = HTTPStatus.OK;

                            // TODO Send confirmation email, if applicable
                            result.message = 'Registration successful. Check your email';
                            return resolve(result);
                        })
                        .catch(err =>
                        {
                            return reject(err);
                        });
                });
        });
    }
}