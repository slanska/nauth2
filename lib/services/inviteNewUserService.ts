/**
 * Created by slanska on 2016-12-27.
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
import {BaseLoginService} from "./baseLoginService";

export class InviteNewUserService extends BaseLoginService
{
}
