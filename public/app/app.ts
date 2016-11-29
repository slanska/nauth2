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
// var Promise = require('promiz');

// global.Promise = Promise;
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
            // Init View
            var nauth2MainView = nauth2App.addView('.view-main', {
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

/*
 Returns promise which resolves to auth configuration
 */
var _authConfig = null;
export function getAuthConfig(): Promise<any>
{
    if (_authConfig)
        return Promise.resolve(_authConfig);

    return new Promise((resolve, reject) =>
    {
        // feathers.

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





