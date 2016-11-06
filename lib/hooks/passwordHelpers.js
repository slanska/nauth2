/**
 * Created by slanska on 2016-11-03.
 */
"use strict";
/*
 Set of password related helper hooks
 */
var crypto = require('crypto');
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 * Source: https://code.ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
 */
function generatePasswordSalt(length) {
    if (length === void 0) { length = 32; }
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
}
exports.generatePasswordSalt = generatePasswordSalt;
/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function getPasswordHash(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}
exports.getPasswordHash = getPasswordHash;
/*
 Creates salt for user password
 */
function setPasswordSalt(saltField) {
    if (saltField === void 0) { saltField = 'pwdSalt'; }
    var result = function (p) {
        p.data[saltField] = generatePasswordSalt(32);
    };
    return result;
}
exports.setPasswordSalt = setPasswordSalt;
/*
 Converts open password to its hash using given salt field
 */
function hashPassword(passwordField, saltField) {
    if (passwordField === void 0) { passwordField = 'password'; }
    if (saltField === void 0) { saltField = 'pwdSalt'; }
    var result = function (p) {
        p.data[passwordField] = getPasswordHash(p.data[passwordField], p.data[saltField]);
    };
    return result;
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=passwordHelpers.js.map