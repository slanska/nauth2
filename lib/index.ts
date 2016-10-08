/**
 * Created by slanska on 2016-10-04.
 */

import Router = require("./Router");
import * as Types from "./Types";

function nauth2(cfg:Types.INAuth2Config)
{
    return function()
    {
        new Router(this, cfg);
    }
}

export = nauth2;