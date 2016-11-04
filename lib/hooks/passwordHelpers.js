/**
 * Created by slanska on 2016-11-03.
 */
"use strict";
/*
 Set of password related helper hooks
 */
var crypto = require('crypto');
var Promise = require('bluebird');
var pbkdf2Async = Promise.promisify(crypto.pbkdf2);
function generatePasswordSalt() {
    return crypto.randomBytes(32).toString('base64');
}
exports.generatePasswordSalt = generatePasswordSalt;
/*
 Creates salt for user password
 */
function setPasswordSalt(saltField) {
    if (saltField === void 0) { saltField = 'pwdSalt'; }
    var result = function (p) {
        p.data[saltField] = generatePasswordSalt();
    };
    return result;
}
exports.setPasswordSalt = setPasswordSalt;
/*
 Hashes password using given salt
 */
function hashPasswordAsync(password, salt) {
    return pbkdf2Async(password, salt, 256, 32, 'sha256')
        .then(function (bb) {
        return bb.toString('base64');
    });
}
exports.hashPasswordAsync = hashPasswordAsync;
/*
 Converts open password to its hash using given salt field
 */
function hashPassword(passwordField, saltField) {
    if (passwordField === void 0) { passwordField = 'password'; }
    if (saltField === void 0) { saltField = 'pwdSalt'; }
    var result = function (p) {
        return hashPasswordAsync(p.data[passwordField], p.data[saltField]).then(function (hash) {
            p.data[passwordField] = hash;
        });
    };
    return result;
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=passwordHelpers.js.map