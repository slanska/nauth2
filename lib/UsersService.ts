/**
 * Created by slanska on 2016-10-09.
 */

import * as Types from './Types';
import feathers = require("feathers");
import {authorize} from "passport";
import {HookParams} from "feathers-hooks";

/*
 Implements proxy users service available via REST API
 */
class UsersService
{
    private authorize(p:HookParams)
    {

    }

    /*
     @param internalUserService - actual service which will handle users in the database
     */
    constructor(protected internalUserService:feathers.Service)
    {
        this.internalUserService.before = {
            all: authorize.bind(this)
        };
    }
}

export = UsersService;