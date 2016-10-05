/**
 * Created by slanska on 2016-10-04.
 */

///<reference path="../lib/Types.d.ts"/>

import NAuth = require('../lib/Router');
import * as Types from '../lib/Types';

var d = {} as Types.INAuth2Config;
d.subDomains = {};
d.dbConfig = {};
d.dbConfig.client = 'sqlite3';
d.dbConfig.connection = {filename: ''}; // TODO

var s = {} as Types.INAuth2Config;

var p = {} as Types.INAuth2Config;

export = {
    development: d,
    staging: s,
    production: p
};