/**
 * Created by slanska on 2016-10-29.
 */

///<reference path="../../typings/browser.d.ts"/>

/*
 User activities
 - login
 - register
 - change password
 - reset password request
 - view/edit profile
 - invite other users


 */

var F7Vue = require('framework7-vue');
import _ = require('lodash');
import profileController = require('./profileController');
import app = require('./app');

export function init()
{
    console.log(app.nauth2App);
}
