/**
 * Created by slanska on 2016-10-09.
 */

import supportedMethods = require('./supportMethods');
import verifyCaptcha = require('./verifyCaptcha');
import verifyNewPassword = require('./verifyNewPassword');
import sendEmailToUser = require('./sendEmailToUser');
import verifyUniqueUserEmail = require('./verifyUniqueUserEmail');
import verifyEmail = require('./verifyEmail');
import afterUserRegistration = require('./afterUserRegistration');
import detectOwnUser = require('./detectOwnUser');
import detectOwnDomain = require('./detectOwnDomain');
import authorize = require('./authorize');
import sanitizeData = require('./sanitizeData');
import setRegisterConfirmActionUrl = require('./setRegisterConfirmActionUrl');
import {jsonDataParse, jsonDataStringify} from './jsonDataConvertor';
import copyDataToResult = require('./copyDataToResult');
import {setPasswordSalt, hashPassword} from './passwordHelpers';
import {loadSystemRoles} from './loadSysRoles';

export =
{
    supportedMethods,
    verifyCaptcha,
    verifyNewPassword,
    sendEmailToUser,
    verifyUniqueUserEmail,
    verifyEmail,
    afterUserRegistration,
    detectOwnUser,
    detectOwnDomain,
    authorize,
    sanitizeData,
    setRegisterConfirmActionUrl,
    jsonDataParse,
    jsonDataStringify,
    copyDataToResult,
    setPasswordSalt,
    hashPassword,
    loadSystemRoles
}