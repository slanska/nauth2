/**
 * Created by slanska on 2016-10-29.
 */

/*
 Exports configuration object based on the following process.ENV settings:

 ENV: 'production' | 'test_mariadb' | 'test_sqlite3' | 'test_pg' | 'development' (default)
 MODE: 'apiservice' | 'website' (default)
 */

import Types = require('../lib/Types');
import _ = require('lodash');

var mode = process.env.MODE || 'website';
var base_cfg = require('./base.config');

var specific_cfg = require(`./${mode}.config`);
var ultimate_cfg = _.merge(base_cfg, specific_cfg);

ultimate_cfg.debug = ultimate_cfg.debug || process.env.ENV === 'development';

export = ultimate_cfg;
