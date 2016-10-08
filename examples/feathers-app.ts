/**
 * Created by slanska on 2016-10-04.
 */

///<reference path="../typings/tsd.d.ts"/>

var feathers = require('feathers');
var rest = require('feathers-rest');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var authentication = require('feathers-authentication');
import nauth2 = require('../lib/index');

var config = require('./config')[process.env.NODE_ENV || 'development'];

var app = feathers()

    // Enable REST services
    .configure(rest())
    // Hooks MUST be configured before authentication
    .configure(hooks())
    .configure(authentication())
    .configure(nauth2(config))

    // Turn on JSON parser for REST services
    .use(bodyParser.json())
    // Turn on URL-encoded parser for REST services
    .use(bodyParser.urlencoded({extended: true}));

app.set('query parser', 'extended');

var port = process.env.PORT || 8800;
app.listen(port, ()=>
{
    console.log(`Listening on ${port}`);
});
