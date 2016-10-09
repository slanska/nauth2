/**
 * Created by slanska on 2016-10-04.
 */
"use strict";
///<reference path="../typings/tsd.d.ts"/>
var feathers = require('feathers');
var rest = require('feathers-rest');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var errors = require('feathers-errors/handler');
var nauth2 = require('../lib/index');
var cors = require('cors');
var config = require('./config')[process.env.NODE_ENV || 'development'];
var app = feathers()
    .configure(rest())
    .configure(hooks())
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .configure(nauth2(config));
// Just like Express your error middleware needs to be
// set up last in your middleware chain.
app.use(errors({
    html: function (error, req, res, next) {
        // render your error view with the error object
        res.json(error);
    }
}));
process.on('unhandledRejection', function (reason, p) {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});
app.set('query parser', 'extended');
var port = process.env.PORT || 8800;
app.listen(port, function () {
    console.log("Listening on " + port);
});
//# sourceMappingURL=feathers-app.js.map