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
import path = require('path');

var mode = process.env.MODE || 'website';
var base_cfg = require('./base.config');

var specific_cfg = require(`./${mode}.config`);
var ultimate_cfg = _.merge(base_cfg, specific_cfg) as Types.INAuth2Config;

ultimate_cfg.debug = ultimate_cfg.debug || process.env.ENV === 'development';

ultimate_cfg.basePath = ultimate_cfg.basePath || '/auth/';
ultimate_cfg.newMemberRoles = ultimate_cfg.newMemberRoles || [];
ultimate_cfg.userCreateMode = ultimate_cfg.userCreateMode || Types.UserCreateMode.ByAdminOnly;
ultimate_cfg.templatePath = ultimate_cfg.templatePath || path.join(__dirname, '../templates');
ultimate_cfg.passwordRules = new RegExp(ultimate_cfg.passwordRules as any || '(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$');
ultimate_cfg.companyName = ultimate_cfg.companyName || 'YOUR_COMPANY_NAME';

if (ultimate_cfg.subDomains)
{
    ultimate_cfg.subDomains.namespace = ultimate_cfg.subDomains.namespace || '_sub';
}

export = ultimate_cfg;
