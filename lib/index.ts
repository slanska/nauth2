/**
 * Created by slanska on 2016-10-04.
 */

///<reference path="./Types.d.ts"/>

import Router = require("./Router");
import {INAuth2Config} from "./Types";

function nauth2(cfg:INAuth2Config)
{
    return function()
    {
        new Router(this, cfg);
    }
}

export = nauth2;