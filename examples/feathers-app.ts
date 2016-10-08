/**
 * Created by slanska on 2016-10-04.
 */

///<reference path="../typings/tsd.d.ts"/>

import express = require('express');
var app = express();

var cfg = require('./config')[process.env.NODE_ENV || 'development'];
import NAuth = require('../lib/Router');
var r = new NAuth.Router(app, cfg);
r.use(app);

var port = process.env.PORT || 8800;
app.listen(port, ()=>
{
    console.log(`Listening on ${port}`);
});
