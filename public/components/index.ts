/**
 * Created by slanska on 2016-11-20.
 */

///<reference path="../../typings/browser.d.ts"/>

import Vue = require('vue');
import inputBoxComponent = require('./inputbox');

export function registerComponents()
{
    Vue.component('input-box', inputBoxComponent);
}