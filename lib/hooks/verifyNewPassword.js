/**
 * Created by slanska on 2016-10-09.
 */
"use strict";
var errors = require('feathers-errors');
function verifyNewPassword(cfg, passwordField, confirmPasswordField) {
    if (passwordField === void 0) { passwordField = 'password'; }
    if (confirmPasswordField === void 0) { confirmPasswordField = 'confirmPassword'; }
    var passwordRules = Object.assign({}, cfg, { passwordRules: /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/ }).passwordRules;
    var pwdx = new RegExp(passwordRules);
    var result = function (p) {
        var pwd = String(p.data[passwordField]);
        var cpwd = String(p.data[confirmPasswordField]);
        if (pwd !== cpwd)
            // TODO Use phrases.json - PasswordShouldMatch
            throw new errors.BadRequest('Password and confirm password are not the same');
        if (!pwd.match(pwdx))
            // TODO Use phrases.json - WeakPassword
            throw new errors.BadRequest('Weak password');
    };
    return result;
}
module.exports = verifyNewPassword;
//# sourceMappingURL=verifyNewPassword.js.map