/**
 * Created by slanska on 2016-10-04.
 */

///<reference path="../typings/tsd.d.ts"/>

var feathers = require('feathers');
var rest = require('feathers-rest');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var errors = require('feathers-errors/handler');
import nauth2 = require('../lib/index');

var config = require('./config')[process.env.NODE_ENV || 'development'];

var app = feathers()

// Enable REST services
    .configure(rest())

    // Hooks MUST be configured before authentication
    .configure(hooks())

    // Turn on JSON parser for REST services
    .use(bodyParser.json())

    // Turn on URL-encoded parser for REST services
    .use(bodyParser.urlencoded({extended: true}))

    .configure(nauth2(config));

// Just like Express your error middleware needs to be
// set up last in your middleware chain.
// app.use(errors({
//     html: function (error, req, res, next)
//     {
//         // render your error view with the error object
//         res.render('error', error);
//     }
// }));

process.on('unhandledRejection', (reason, p) =>
{
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

app.set('query parser', 'extended');

var port = process.env.PORT || 8800;
app.listen(port, ()=>
{
    console.log(`Listening on ${port}`);
});
