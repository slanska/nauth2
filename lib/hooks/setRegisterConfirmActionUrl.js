/**
 * Created by slanska on 2016-10-23.
 */
"use strict";
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
/*
 Generates temporary encrypted token for the given user's email
 This token to be included into welcomeAndConfirm email.
 Token will have expiry time in 24 hours
 TODO have it configurable?

 @param app : Application instance
 @param cfg : global NAuth2 configuration. emailConfig is needed
 */
function setRegisterConfirmActionUrl(cfg, authCfg, emailFiield) {
    if (emailFiield === void 0) { emailFiield = 'email'; }
    var result = function (p) {
        return new Promise(function (resolve, reject) {
            var payload = { email: p.data[emailFiield] };
            var signOptions = {};
            signOptions.expiresIn = '24h';
            signOptions.subject = 'confirm_registration';
            jwt.sign(payload, authCfg.token.secret, signOptions, function (err, token) {
                if (err)
                    reject(err);
                else {
                    // TODO http or https - temp
                    p.data['actionUrl'] = "http://" + cfg.publicHostUrl + "/confirmRegister?" + token;
                    p.data['actionTitle'] = 'Confirm Email Address'; // TODO Localize
                    resolve(p);
                }
            });
        });
    };
    return result;
}
module.exports = setRegisterConfirmActionUrl;
//# sourceMappingURL=setRegisterConfirmActionUrl.js.map