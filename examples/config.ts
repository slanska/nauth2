/**
 * Created by slanska on 2016-10-04.
 */

import NAuth = require('../lib/Router');
import * as Types from '../lib/Types';
import path = require('path');
var knexConfig = require('../schema/knexfile');
import nodemailer = require('nodemailer');
var nodemailerSendGrid= require('nodemailer-sendgrid-transport');

var d = {} as Types.INAuth2Config;
d.subDomains = {};
d.dbConfig = {};
d.dbConfig.client = 'sqlite3';
d.dbConfig.connection = {filename: path.join(__dirname, '../data/nauth2.db')}; // TODO
d.emailTransport = nodemailer.createTransport(nodemailerSendGrid(
    {
        auth: {
            api_key: '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'
        }
    }));

var s = {} as Types.INAuth2Config;

var p = {} as Types.INAuth2Config;

export = {
    development: d,
    staging: s,
    production: p
};