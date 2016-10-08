/**
 * Created by slanska on 2016-10-04.
 */
"use strict";
var path = require('path');
var d = {};
d.subDomains = {};
d.dbConfig = {};
d.dbConfig.client = 'sqlite3';
d.dbConfig.connection = { filename: path.join(__dirname, '../data/nauth2.db') }; // TODO
var s = {};
var p = {};
module.exports = {
    development: d,
    staging: s,
    production: p
};
//# sourceMappingURL=config.js.map