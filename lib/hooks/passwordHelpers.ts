/**
 * Created by slanska on 2016-11-03.
 */

/*
 Set of password related helper hooks
 */

import crypto = require('crypto');
import Types = require('../Types');
import hooks = require("feathers-hooks");
import Promise = require('bluebird');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 * Source: https://code.ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
 */
export function generatePasswordSalt(length:number = 32)
{
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
export function getPasswordHash(password:string, salt:string)
{
    var hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

/*
 Creates salt for user password
 */
export function setPasswordSalt(saltField = 'pwdSalt')
{
    var result = (p:hooks.HookParams)=>
    {
        p.data[saltField] = generatePasswordSalt(32);
    };
    return result;
}


/*
 Converts open password to its hash using given salt field
 */
export function hashPassword(passwordField = 'password', saltField = 'pwdSalt')
{
    const result = (p:hooks.HookParams)=>
    {
        p.data[passwordField] = getPasswordHash(p.data[passwordField], p.data[saltField]);
    };

    return result;
}
