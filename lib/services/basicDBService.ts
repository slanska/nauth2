/**
 * Created by slanska on 2017-01-15.
 */

import Types = require('../Types');
import knex = require('knex');
import Promise = require('bluebird');
import {Service as KnexService, ServiceConfig} from 'feathers-knex';
import feathers = require("feathers");
import nhooks = require('../hooks/index');
import hooks = require('feathers-hooks');
import auth  = require('feathers-authentication');
import jwt = require('jsonwebtoken');
import errors = require('feathers-errors');
import HTTPStatus = require('http-status');
import _ = require('lodash');
import * as NAuth2 from "../DBController";
import Knex = require("knex");
import {PaginateConfig} from "feathers-knex";

export interface DBServiceConfig
{
    /*
     Required. The KnexJS database instance
     */
    Model?: Knex,

    /*
     Required. The name of the table
     */
    name: string,

    /*
     [optional] - The name of the id property.
     default: 'id'
     */
    id?: string | string[],

    /*
     A pagination object (optional)
     */
    paginate?: PaginateConfig;

}

export abstract class BaseDBService extends KnexService
{
    static initServiceConfig(DBController: NAuth2.DBController, cfg:DBServiceConfig)
    {
        if (!cfg.Model)
            cfg.Model = DBController.db;
        if (!cfg.paginate)
            cfg.paginate = {max: 200, 'default': 50};

        return cfg as ServiceConfig;
    }

    constructor(protected DBController: NAuth2.DBController, protected config:DBServiceConfig)
    {
        super(BaseDBService.initServiceConfig(DBController, config));
    }

    setup(app:feathers.Application)
    {
        this.app = app;
    }

    protected app: feathers.Application;
}