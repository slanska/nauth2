/**
 * Created by slanska on 2016-11-12.
 */
"use strict";
///<reference path="../../typings/browser.d.ts"/>
/*
 Helper class for application initialization
 */
var Vue = require('vue');
var Framework7Vue = require('framework7-vue');
require('script-loader!framework7');
var index_1 = require('../components/index');
var _ = require('lodash');
var feathers = require('feathers-client');
var Promise = require('promiz');
/*
 Local storage key names
 */
exports.LocalStorage_AccessToken = 'nauth2.accessToken';
exports.LocalStorage_RefreshToken = 'nauth2.refreshToken';
Vue.use(Framework7Vue);
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
Template7.global = {
    android: isAndroid,
    ios: isIos
};
index_1.registerComponents();
exports.$$ = Dom7;
if (!isIos) {
    // Change class
    exports.$$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    exports.$$('.view .navbar').prependTo('.view .page');
}
var appData = {
    popupOpened: false,
    loginScreenOpened: false,
    pickerOpened: false,
    actionsOpened: false,
    appReady: false
};
exports.nauth2MainView = void 0;
// Vue app configuration
var appConfig = {
    // Root Element
    el: '#app',
    // Framework7 Parameters
    framework7: {
        root: '#app',
        animateNavBackIcon: true,
        // Enable Material theme for Android device only
        material: isIos ? false : true,
        // Enable Template7 pages
        template7Pages: true,
        pushState: true
    },
    // Custom App Data
    data: function () {
        return appData;
    },
    // Custom App Methods
    methods: {
        onF7Init: function (nauth2App) {
            exports.F7App = nauth2App;
            // Init View
            exports.nauth2MainView = nauth2App.addView('#mainView', {
                // Material doesn't support it but don't worry about it
                // F7 will ignore it for Material theme
                dynamicNavbar: true,
                //Needed to enable navigation between inline pages
                domCache: true
            });
            // set scripts based on client
            if (!isIos) {
                Dom7('head').append('<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.material.min.css">' +
                    '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.material.colors.min.css">'
                    + '<link rel="stylesheet" href="css/style.css">'
                    + ' <link rel="stylesheet" href="./bower_components/framework7-icons/css/framework7-icons.css">');
            }
            else {
                Dom7('head').append('<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.ios.min.css">' +
                    '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.ios.colors.min.css">'
                    +
                        '<link rel="stylesheet" href="css/style.css">'
                    +
                        '<link rel="stylesheet" href="./bower_components/framework7-icons/css/framework7-icons.css">');
            }
        }
    }
};
/*
 Returns promise which resolves to auth configuration
 */
var _authConfig = null;
function getAuthConfig() {
    if (_authConfig)
        return Promise.resolve(_authConfig);
    return http.get('/auth/config')
        .then(function (d) {
        _authConfig = d;
        return _authConfig;
    });
}
exports.getAuthConfig = getAuthConfig;
/*

 */
function initApp(data, methods) {
    appData = _.merge(appData, data);
    appConfig.methods = _.merge(appConfig.methods, methods);
    var app = new Vue(appConfig);
    Vue.nextTick(function () {
        app.appReady = true;
    });
    return app;
}
exports.initApp = initApp;
/*

 */
var http = (function () {
    function http() {
    }
    http.ajax = function (method, url, data, headers) {
        var options = {};
        var result = new Promise(function (resolve, reject) {
            options.method = method;
            if (typeof data === 'object') {
                options.dataType = 'json';
                options.processData = false;
                options.contentType = 'application/json';
                data = JSON.stringify(data);
                headers = headers || {};
                headers['Content-Type'] = 'application/json';
            }
            options.data = data;
            options.headers = headers;
            options.url = url;
            var accessToken = window.localStorage.getItem(exports.LocalStorage_AccessToken);
            if (accessToken) {
                options.headers = options.headers || {};
                options.headers['Authorization'] = "Bearer " + accessToken;
            }
            options.success = function (data, status, xhr) {
                if (status !== 200 && status !== 201)
                    return reject(new Error(status + ": " + data));
                if (typeof data === 'string')
                    data = JSON.parse(data);
                return resolve(data);
            };
            options.error = function (xhr, status) {
                var error = xhr.response;
                if (xhr.status === 404)
                    return reject(xhr.status + ": " + url + " not found");
                if (typeof error === 'string')
                    error = JSON.parse(error);
                return reject(error);
            };
            exports.$$.ajax(options);
        });
        return result;
    };
    http.get = function (url, data, headers) {
        return http.ajax('GET', url, data, headers);
    };
    http.post = function (url, data, headers) {
        return http.ajax('POST', url, data, headers);
    };
    http.put = function (url, data, headers) {
        return http.ajax('PUT', url, data, headers);
    };
    http.delete = function (url, data, headers) {
        return http.ajax('DELETE', url, data, headers);
    };
    http.patch = function (url, data, headers) {
        return http.ajax('PATCH', url, data, headers);
    };
    return http;
}());
exports.http = http;
/*
 Generic handler for displaying error messages
 */
function showError(error) {
    if (typeof error === 'object') {
        error = error.code + ": " + error.message;
    }
    if (exports.F7App) {
        exports.F7App.alert(error, 'Error');
    }
}
exports.showError = showError;
function toast(message) {
    if (exports.F7App)
        exports.F7App.addNotification({ title: message, closeOnClick: true, hold: 3000 });
}
exports.toast = toast;
exports.$$.ajaxSetup({
    beforeSend: function (xhr) {
        // var accessToken = window.localStorage.getItem(LocalStorage_AccessToken);
        // if (accessToken)
        // {
        //     xhr.requestParameters.headers = xhr.requestParameters.headers || {};
        //     xhr.requestParameters.headers['Authorization'] = `Bearer ${accessToken}`;
        //     xhr.withCredentials = true;
        // }
    },
    error: function (xhr, status) {
        console.log(xhr);
        // TODO If result is 'Expired token', use refresh token to get a new access token and repeat request
    }
});
exports.feathersApp = feathers();
//# sourceMappingURL=app.js.map