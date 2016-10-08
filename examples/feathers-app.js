/**
 * Created by slanska on 2016-10-04.
 */
"use strict";
///<reference path="../typings/tsd.d.ts"/>
var feathers = require('feathers');
var rest = require('feathers-rest');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var authentication = require('feathers-authentication');
var nauth2 = require('../lib/index');
var config = require('./config')[process.env.NODE_ENV || 'development'];
var app = feathers()
    .configure(rest())
    .configure(hooks())
    .configure(authentication())
    .configure(nauth2(config))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));
app.set('query parser', 'extended');
var port = process.env.PORT || 8800;
app.listen(port, function () {
    console.log("Listening on " + port);
});
//# sourceMappingURL=feathers-app.js.map