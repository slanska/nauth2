/**
 * Created by slanska on 2016-11-12.
 */

///<reference path="../../typings/browser.d.ts"/>

import Vue = require('vue');
var Framework7Vue = require('framework7-vue');

import {registerComponents} from '../components/index';

Vue.use(Framework7Vue);

import _ = require('lodash');

var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

Template7.global = {
    android: isAndroid,
    ios: isIos
};

registerComponents();

var $$ = Dom7;

if (!isIos)
{
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}


// Init Vue App
export var nauth2App: any = new Vue({
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
    data: ()=>
    {
        return {
            emailOrName: '',
            password: '',
            confirmPassword: '',
            rememberMe: true,
            user: {
                name: 'Vladimir',
                lastName: 'Kharlampidi',
                age: 30
            },
            popupOpened: false,
            loginScreenOpened: false,
            pickerOpened: false,
            actionsOpened: false
        };
    },
    // Custom App Methods
    methods: {
        onF7Init: (nauth2App)=>
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
        },
        proceedLogin: ()=>
        {
            console.log('proceedLogin');
        },
        resetPassword: ()=>
        {
            console.log('resetPassword');
        }
    }
});



