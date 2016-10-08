/**
 * Created by slanska on 2016-10-04.
 */
"use strict";
///<reference path="../typings/tsd.d.ts"/>
var express = require('express');
var app = express();
var cfg = require('./config')[process.env.NODE_ENV || 'development'];
var NAuth = require('../lib/Router');
var r = new NAuth.Router(app, cfg);
r.use(app);
var port = process.env.PORT || 8800;
app.listen(port, function () {
    console.log("Listening on " + port);
});
//# sourceMappingURL=feathers-app.js.map