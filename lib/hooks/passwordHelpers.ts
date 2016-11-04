/**
 * Created by slanska on 2016-11-03.
 */

/*
 Set of password related helper hooks
 */

import crypto = require('crypto');
import * as Types from '../Types';
import hooks = require("feathers-hooks");
import Promise = require('bluebird');

const pbkdf2Async = Promise.promisify(crypto.pbkdf2);

export function generatePasswordSalt()
{
    return crypto.randomBytes(32).toString('base64');
}

/*
 Creates salt for user password
 */
export function setPasswordSalt(saltField = 'pwdSalt')
{
    var result = (p:hooks.HookParams)=>
    {
        p.data[saltField] = generatePasswordSalt();
    };
    return result;
}

/*
 Hashes password using given salt
 */
export function hashPasswordAsync(password:string, salt:string):Promise<string>
{
    return pbkdf2Async(password, salt, 256, 32, 'sha256')
        .then(bb=>
    {
        return bb.toString('base64');
    });
}

/*
 Converts open password to its hash using given salt field
 */
export function hashPassword(passwordField = 'password', saltField = 'pwdSalt')
{
    const result = (p:hooks.HookParams)=>
    {
        return hashPasswordAsync(p.data[passwordField], p.data[saltField]).then(hash=>
        {
            p.data[passwordField] = hash;
        });
    };

    return result;
}
