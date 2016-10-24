/**
 * Created by slanska on 2016-10-24.
 */

/*
Service to handle /auth/confirmRegister request
 */

import * as Types from '../Types';
import feathers = require("feathers");
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');

export function createRegisterConfirmService(cfg:Types.INAuth2Config)
{
    var path = `${this.cfg.basePath}/confirmRegister`;
    var svc = this.app.service(path, {
        find: (params:hooks.HookParams)=>
        {
            console.log(params);
        }
    });
    svc.before({find: []});
}