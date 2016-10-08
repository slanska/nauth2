/**
 * Created by slanska on 2016-10-04.
 */

import NAuth2 = require('./Router');

export = (app)=>
{
    return new NAuth2.Router(app, null);
};