/**
 * Created by slanska on 2016-11-12.
 */

///<reference path="../../typings/browser.d.ts"/>

import Vue = require('vue');

/*
 Framework7 input box component.
 Renders differently depending on current theme - iOS or Material.
 */

var inputBoxComponent = {} as vuejs.ComponentOption;

inputBoxComponent['render'] = function (createElement)
{
    var self = this;

    var children = [];
    if (self.icon)
        children.push(createElement('div', {class: {'item-media': true}}, [
            createElement('i', {
                class: {'f7-icons': true},
                domProps: {innerHTML: self.icon}
            })
        ]));

    var inputEl = [];
    if (!Framework7.prototype.device.ios)
    {
        inputEl.push(createElement('div', {
            class: {'item-title': true, 'floating-label': true},
            domProps: {innerHTML: self.label}
        }));
    }
    inputEl.push(createElement('div', {class: 'item-input'}, [
        // TODO id, name
        createElement('input', {
            attrs: {
                type: self.type || 'text', placeholder: self.placeHolder || self.label
            },
            domProps: {
                value: self.value || '', placeholder: self.placeHolder || self.label
            }
        })
    ]));
    children.push(createElement('div', {class: 'item-inner'}, [inputEl]));

    return createElement('div', {class: {[self.className || 'item-content']: true}}, children);
};

inputBoxComponent.props = {
    'value': [String, Number],
    'icon': String,
    'type': String,
    'placeHolder': String,
    'className': String,
    'label': String,
    'id': String,
    'name': String
};


export = inputBoxComponent;
