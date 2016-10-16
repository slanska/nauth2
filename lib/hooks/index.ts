/**
 * Created by slanska on 2016-10-09.
 */

import supportedMethods = require('./supportMethods');
import verifyCaptcha = require('./verifyCaptcha');
import verifyNewPassword = require('./verifyNewPassword');
import sendEmailToUser = require('./sendEmailToUser');
import verifyUniqueUserEmail = require('./verifyUniqueUserEmail');
import verifyEmail = require('./verifyEmail');
import knexBeginTrn = require('./knexBeginTrn');
import knexCommit = require('./knexCommit');
import knexRollback = require('./knexRollback');
import setTimestamps = require('./setTimestamps');
import afterUserRegistration = require('./afterUserRegistration');
import detectOwnUser = require('./detectOwnUser');
import detectOwnDomain = require('./detectOwnDomain');
import authorize = require('./authorize');

export =
{
    supportedMethods,
    verifyCaptcha,
    verifyNewPassword,
    sendEmailToUser,
    verifyUniqueUserEmail,
    verifyEmail,
    setTimestamps,
    knexBeginTrn,
    knexCommit,
    knexRollback,
    afterUserRegistration,
    detectOwnUser,
    detectOwnDomain,
    authorize
}