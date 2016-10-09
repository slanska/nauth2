/**
 * Created by slanska on 2016-10-09.
 */

import supportedMethods = require('./supportMethods');
import verifyCaptcha = require('./verifyCaptcha');
import verifyNewPassword = require('./verifyNewPassword');
import sendEmail = require('./sendEmail');

export =
{
    supportedMethods,
    verifyCaptcha,
    verifyNewPassword,
    sendEmail
}