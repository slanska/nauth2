/**
 * Created by slanska on 2016-10-04.
 */

import NAuth = require('../lib/Router');
import * as Types from '../lib/Types';
import path = require('path');
var knexConfig = require('../schema/knexfile');
import nodemailer = require('nodemailer');
var nodemailerSendGrid = require('nodemailer-sendgrid-transport');
import fs = require('fs');

var d = {} as Types.INAuth2Config;
d.subDomains = {};
d.dbConfig = {};
d.dbConfig.client = 'sqlite3';
d.dbConfig.connection = {filename: path.join(__dirname, '../data/nauth2.db')}; // TODO
d.emailTransport = nodemailer.createTransport(nodemailerSendGrid(
    {
        auth: {
            api_key: 'INSERT_YOUR_SEND_GRID_API_KEY_HERE'
        }
    }));

var s = {} as Types.INAuth2Config;

var p = {} as Types.INAuth2Config;
var m = {} as Types.INAuth2Config;

var priv_cfg_stat = fs.statSync(path.join(__dirname, './private.config.js'));
if (priv_cfg_stat.isFile())
{
    var priv_cfg = require('./private.config.js');
    var emailTransport = nodemailer.createTransport(nodemailerSendGrid(
        {
            auth: {
                api_key: priv_cfg.APIKey2
            }
        }));
    d.emailTransport = s.emailTransport = p.emailTransport = m.emailTransport = emailTransport;
}

export = {
    development: d,
    staging: s,
    production: p,
    mariadb_test: m,
    pg_test: s
};