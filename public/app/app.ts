/**
 * Created by slanska on 2016-11-12.
 */

///<reference path="../../typings/browser.d.ts"/>

/*
 Helper class for application initialization
 */

import Vue = require('vue');
var Framework7Vue = require('framework7-vue');
import {registerComponents} from '../components/index';
import _ = require('lodash');
var feathers = require('feathers-client');
var Promise = require('promiz');

Vue.use(Framework7Vue);

var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

Template7.global = {
    android: isAndroid,
    ios: isIos
};

registerComponents();

// TODO ?? Needed
var $$ = Dom7;

if (!isIos)
{
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}

var appData: any = {
    popupOpened: false,
    loginScreenOpened: false,
    pickerOpened: false,
    actionsOpened: false
};

export var F7App;

// Vue app configuration
var appConfig = {
    // Root Element
    el: '#app',

    // Framework7 Parameters
    framework7: {
        root: '#app', //Should be same as app el
        animateNavBackIcon: true,
        // TODO routes: Routes,
        // Enable Material theme for Android device only
        material: isIos ? false : true,
        // Enable Template7 pages
        template7Pages: true,
        pushState: true
    },
    // Custom App Data
    data: () =>
    {
        return appData;
    },
    // Custom App Methods
    methods: {
        onF7Init: (nauth2App) =>
        {
            F7App = nauth2App;
            // Init View
            var nauth2MainView = nauth2App.addView('#mainView', {
                // Material doesn't support it but don't worry about it
                // F7 will ignore it for Material theme
                dynamicNavbar: true,

                //Needed to enable navigation between inline pages
                domCache: true
            });

            // set scripts based on client
            if (!isIos)
            {
                Dom7('head').append(
                    '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.material.min.css">' +
                    '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.material.colors.min.css">'
                    + '<link rel="stylesheet" href="css/style.css">'
                    + ' <link rel="stylesheet" href="./bower_components/framework7-icons/css/framework7-icons.css">'
                );
            }
            else
            {
                Dom7('head').append(
                    '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.ios.min.css">' +
                    '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.ios.colors.min.css">'
                    +
                    '<link rel="stylesheet" href="css/style.css">'
                    +
                    '<link rel="stylesheet" href="./bower_components/framework7-icons/css/framework7-icons.css">'
                );
            }
        }
    }
} as vuejs.ComponentOption;

declare type HttpMethod = 'GET'|'POST'|'PUT'|'DELETE'|'PATCH';

export interface Dom7AjaxOptions
{
    url: string;
    async?: boolean;
    method?: HttpMethod;
    cache?: boolean;
    contentType?: string;
    crossDomain?: boolean;
    data?: any;
    processData?: boolean;
    dataType?: string;
    headers?: Object;
    xhrFields?: Object;
    username?: string;
    password?: string;
    timeout?: number;
    beforeSend?: Function;
    error?: Function;
    success?: Function;
    complete?: Function;
    statusCode?: Object;

}


/*
 Returns promise which resolves to auth configuration
 */
var _authConfig = null;
export function getAuthConfig(): Promise<any>
{
    if (_authConfig)
        return Promise.resolve(_authConfig);

    return http.get('/auth/config')
        .then(d =>
        {
            _authConfig = d;
            return _authConfig;
        });
}

/*

 */
export function initApp(data: Object, methods: {[name: string]: Function})
{
    appData = _.merge(appData, data);
    appConfig.methods = _.merge(appConfig.methods, methods);
    return new Vue(appConfig);
}

/*

 */
export class http
{
    private static ajax(method: HttpMethod, url: string, data?: any, headers?: Object)
    {
        var options = {} as Dom7AjaxOptions;

        var result = new Promise((resolve, reject) =>
        {
            options.method = method;
            options.data = data;
            options.headers = headers;
            options.url = url;
            options.success = (data, status, xhr) =>
            {
                if (status !== 200 && status !== 201)
                    return reject(new Error(`${status}: ${data}`));

                if (typeof data === 'string')
                    data = JSON.parse(data);
                return resolve(data);
            };

            options.error = (xhr, status) =>
            {
                var error = xhr.response;
                if (typeof error === 'string')
                    error = JSON.parse(error);
                return reject(error);
            };

            $$.ajax(options);
        });
        return result;
    }

    public static get(url: string, data?: any, headers?: Object)
    {
        return http.ajax('GET', url, data, headers);
    }

    public static post(url: string, data?: any, headers?: Object)
    {
        return http.ajax('POST', url, data, headers);
    }

    public static put(url: string, data?: any, headers?: Object)
    {
        return http.ajax('PUT', url, data, headers);
    }

    public static delete(url: string, data?: any, headers?: Object)
    {
        return http.ajax('DELETE', url, data, headers);
    }

    public static patch(url: string, data?: any, headers?: Object)
    {
        return http.ajax('PATCH', url, data, headers);
    }
}

/*
 Generic handler for displaying error messages
 */
export function showError(error)
{
    if (typeof error === 'object')
    {
        error = `${error.code}: ${error.message}`;
    }

    if (F7App)
    {
        F7App.alert(error, 'Error');
    }
}

export function toast(message: string)
{
    if (F7App)
        F7App.addNotification({title: message, closeOnClick: true, hold: 3000});
}

export var feathersApp = feathers();
// feathersApp.configure(rest(),jquery($));





