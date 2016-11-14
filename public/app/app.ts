/**
 * Created by slanska on 2016-11-12.
 */

///<reference path="../../typings/browser.d.ts"/>

declare var Template7;
declare var Dom7;
declare var Framework7;

// require('framework7');
import Vue = require('vue');

import _ = require('lodash');

console.log(Vue, _);

var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

Template7.global = {
    android: isAndroid,
    ios: isIos
};

var $$ = Dom7;

if (!isIos)
{
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}

// Init App
export var nauth2App = new Framework7({
    // Enable Material theme for Android device only
    material: isIos ? false : true,
    // Enable Template7 pages
    template7Pages: true,
    pushState: true
});

// Init View
export var nauth2MainView = nauth2App.addView('.view-main', {
    // Material doesn't support it but don't worry about it
    // F7 will ignore it for Material theme
    dynamicNavbar: true
});

// create app

// set scripts based on client

(function ()
{
    if (!isIos)
    {
        Dom7('head').append(
            '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.material.min.css">' +
            '<link rel="stylesheet" href="public/bower_components/Framework7/dist/css/framework7.material.colors.min.css">'
            // public/bower_components/Framework7/dist/css/framework7.material.rtl.min.css
            + '<link rel="stylesheet" href="css/style.css">'
        );
    }
    else
    {
        Dom7('head').append(
            '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.ios.min.css">' +
            '<link rel="stylesheet" href="bower_components/Framework7/dist/css/framework7.ios.colors.min.css">'
            // public/bower_components/Framework7/dist/css/framework7.ios.rtl.min.css
            +
            '<link rel="stylesheet" href="css/style.css">'
        );
    }
})();

//