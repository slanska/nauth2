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
 - view/edit profile (via profileController)
 - invite other users
 */

var F7Vue = require('framework7-vue');
import _ = require('lodash');
import {initApp} from './app';
import {ProfileController} from "./profileController";
import Vue = require('vue');

class UserController
{
    private profileController = new ProfileController();

    /*
     Logs user in. Returns promise which is resolved to access and refresh tokens
     */
    public login(emailOrName: string, password: string)
    {
        console.log(`login: ${emailOrName}, ${password}`);
    }

    /*
     Issues request to reset user's password. Returns promise which resolves to result of call
     */
    public requestPasswordReset(email: string)
    {
        console.log(`requestPasswordReset: ${email}`);
    }

    /*
     TODO IUserObject
     */
    public register()
    {
    }

    /*
     User is expected to be logged in
     */
    public changePassword()
    {
    }

    /*
     TODO Use row
     */
    public invite(email: string, salutaion: string, firstName: string, lastName: string)
    {
    }
}

var userController = new UserController();

var app = initApp({
        emailOrName: '',
        password: '',
        confirmPassword: '',
        rememberMe: true
    },
    {
        resetPassword: () =>
        {
            return userController.requestPasswordReset(app.emailOrName);
        },
        proceedLogin: () =>
        {
            return userController.login(app.emailOrName, app.password);
        }
    });