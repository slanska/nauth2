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
                // store access token
                window.localStorage.setItem('nauth2.accessToken', res.accessToken);
                if (rememberMe)
                // store refresh token
                {
                    window.localStorage.setItem('nauth2.refreshToken', res.refreshToken);
                }

                // show toast message
                // TODO Translate
                F7App.hidePreloader();
                toast('Successfully logged in');

                // redirect to landing page
                // admin - for admin, user admin
                // change password
                // home page for regular users
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
        // Validate email
        F7App.showPreloader('Processing...');
        return getAuthConfig()
            .then(cfg =>
            {
                var url = `${cfg.basePath}/resetPassword`;
                return http.post(url, {email: email});
            })
            .then(res =>
            {
                // Redirect

                // TODO Translate

                F7App.hidePreloader();
                F7App.alert('Success!', `Password reset request has been emailed to ${email}`);
            })
            .catch(err =>
            {
                F7App.hidePreloader();
                showError(err);
            });
    }

    /*
     TODO IUserObject
     */
    public register(userData)
    {
        F7App.showPreloader();
        var url = ``;
        return http.post(url, userData)
            .then(res =>
            {
            })
            .catch(err =>
            {
                F7App.hidePreloader();
            });
    }

    /*
     User is expected to be logged in
     */
    public changePassword(oldPassword: string, newPassword: string, confirmPassword: string)
    {

    }

    /*
     Only authenticated user can invite another prospective user
     TODO Use row
     */
    public invite(email: string, salutaion: string, firstName: string, lastName: string)
    {

    }

    public logout()
    {
        // TODO redirect to
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
        },
        register: () =>
        {
            var userData = {} as any;
            return userController.register(userData);
        },
        invite: () =>
        {
            return userController.invite(app.emailOrName, app.salutation, app.firstName, app.lastName);
        },
        logout: () =>
        {
            return userController.logout();
        }

    });