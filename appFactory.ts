/**
 * Created by slanska on 2016-10-25.
 */

/*
 Creates instance of NAuth2 REST API service.
 This instance can be run standalone, in cluster, or be configured for 
 */

import Types = require('./lib/Types');
import feathers = require('feathers');
var rest = require('feathers-rest');
import hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var errors = require('feathers-errors/handler');
import nauth2 = require('./lib/index');
var cors = require('cors');

export = (config:Types.INAuth2Config) =>
{
    var app = feathers();

    // Enable REST services
    app.configure(rest())

    // Hooks, cors and body parser MUST be configured before authentication
        .configure(hooks())

        .use(cors())

        // Turn on JSON parser for REST services
        .use(bodyParser.json())

        // Turn on URL-encoded parser for REST services
        .use(bodyParser.urlencoded({extended: true}))

        .configure(nauth2(app, config));

    // Just like Express your error middleware needs to be
    // set up last in your middleware chain.
    app.use(errors({
        html: function (error, req, res, next)
        {
            // TODO use ECT to render error view with the error object
            res.render('error', error);
            res.json(error);
        }
    }));

    process.on('unhandledRejection', (reason, p) =>
    {
        console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    });

    /*
     Use extended version of query parser, so that nested objects and other advanced features
     will be available
     */
    app.set('query parser', 'extended');

    return app;
}
