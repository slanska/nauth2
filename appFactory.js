/**
 * Created by slanska on 2016-10-25.
 */
"use strict";
var feathers = require('feathers');
var rest = require('feathers-rest');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var errors = require('feathers-errors/handler');
var nauth2 = require('./lib/index');
var cors = require('cors');
module.exports = function (config) {
    var app = feathers();
    // Enable REST services
    app.configure(rest())
        .configure(hooks())
        .use(cors())
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({ extended: true }))
        .configure(nauth2(app, config));
    // Just like Express your error middleware needs to be
    // set up last in your middleware chain.
    app.use(errors({
        html: function (error, req, res, next) {
            // TODO use ECT to render error view with the error object
            res.render('error', error);
            res.json(error);
        }
    }));
    process.on('unhandledRejection', function (reason, p) {
        console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    });
    /*
     Use extended version of query parser, so that nested objects and other advanced features
     will be available
     */
    app.set('query parser', 'extended');
    return app;
};
//# sourceMappingURL=appFactory.js.map