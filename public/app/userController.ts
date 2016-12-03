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
import {initApp, http, getAuthConfig, showError, toast, F7App} from './app';
import {ProfileController} from "./profileController";
import Vue = require('vue');

class UserController
{
    private profileController = new ProfileController();

    /*
     Logs user in. Returns promise which is resolved to access and refresh tokens
     */
    public login(emailOrName: string, password: string, rememberMe: boolean)
    {
        F7App.showPreloader();
        return getAuthConfig()
            .then(cfg =>
            {
                var url = `${cfg.basePath}/login`;
                return http.post(url, {email: emailOrName, password: password});
            })
            .then(res =>
            {
                if (rememberMe)
                // store refresh token
                {

                }

                // store access token

                // show toast message
                // TODO Translate
                F7App.hidePreloader();
                toast('Successfully logged in');

                // redirect to landing page
            })
            .catch(err =>
            {
                F7App.hidePreloader();
                showError(err);
            });
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

var app: any = initApp({
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
            return userController.login(app.emailOrName, app.password, app.rememberMe);
        }
    });