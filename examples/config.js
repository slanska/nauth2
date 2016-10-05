/**
 * Created by slanska on 2016-10-04.
 */
"use strict";
var d = {};
d.subDomains = {};
d.dbConfig = {};
d.dbConfig.client = 'sqlite3';
d.dbConfig.connection = { filename: '' }; // TODO
var s = {};
var p = {};
module.exports = {
    development: d,
    staging: s,
    production: p
};
//# sourceMappingURL=config.js.map