/**
 * Created by slanska on 2016-10-04.
 */

import NAuth = require('../lib/index');
import * as Types from '../lib/Types';
import path = require('path');
import nodemailer = require('nodemailer');
import _ = require('lodash');
import fs = require('fs');

var common_cfg = {
    subDomains: {},
    userCreateMode: Types.UserCreateMode.SelfAndConfirm,
    tokenSecret: 'PLACE_YOUR_TOKEN_SECRET_HERE',
    sendEmailOnChangePassword: true,
    numberOfDomainsInToken: 10

    /*
     emailTransport: nodemailer.createTransport(nodemailerSendGrid(
     {
     auth: {
     api_key: 'INSERT_YOUR_SEND_GRID_API_KEY_HERE'
     }
     }));
     */
};

/*
 Environment specific config
 */
var env_config = {
    "development": {
        dbConfig: {
            client: 'sqlite3',
            connection: {filename: path.join(__dirname, '../data/nauth2.db')}
        }
    },
    "test_sqlite3": {
        dbConfig: {
            client: 'sqlite3',
            connection: {filename: path.join(__dirname, '../data/nauth2.db')}
        }
    },
    "test_mariadb": {
        dbConfig: {
            client: 'mysql',
            connection: {filename: path.join(__dirname, '../data/nauth2.db')}
        }
    },
    "test_pg": {
        dbConfig: {
            client: 'pg',
            connection: {filename: path.join(__dirname, '../data/nauth2.db')}
        }
    },

    "production": {}
};

var result_cfg = _.merge(common_cfg, env_config[process.env.NODE_ENV || 'development']);

var priv_cfg_stat = fs.statSync(path.join(__dirname, './private.config.js'));
if (priv_cfg_stat.isFile())
{
    var priv_cfg = require('./private.config.js');
    result_cfg = _.merge(result_cfg, priv_cfg);
}

export = result_cfg;