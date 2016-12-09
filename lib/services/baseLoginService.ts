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

    public setNavigateToHook()
    {

    }

    public generateAccessTokenHook()
    {

    }

    public generateRefreshTokenHook()
    {

    }

    public initPayloadHook()
    {

    }

    public loadUserProfileHook()
    {
    }


}