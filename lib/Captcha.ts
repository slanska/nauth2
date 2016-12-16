/**
 * Created by slanska on 2015-11-02.
 */

import {Types} from '../typings/server.d';
import express = require('express');
import crypto = require('crypto');
var captchapng = require('captchapng');
import Promise = require('bluebird');

var _hashSalt = crypto.randomBytes(32).toString('base64');
var pbkdf2Async = Promise.promisify(crypto.pbkdf2);

/*

 */
class Captcha
{
    static calcHash(value): Promise<Buffer>
    {
        return pbkdf2Async(value, _hashSalt, 256, 32, 'sha256');
    }

    /*

     */
    static verify(originalHash: string, codeToVerify: string): Promise<boolean>
    {
        return Captcha.calcHash(codeToVerify)
            .then(hashToVerify =>
            {
                return hashToVerify.toString('base64') === originalHash
            });
    }

    /*

     */
    static init(app: express.Application, path = '/captcha', debug = false)
    {
        app.use(path,
            function (req, res, next)
            {
                // Generate random value: 0001-9999
                var value = (Math.round(Math.random() * 9000 + 1000)).toString();
                Captcha.calcHash(value)
                    .then(hash =>
                    {
                        var p = new captchapng(80, 30, value); // width,height,numeric captcha
                        p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
                        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

                        var img = p.getBase64();

                        var result: Types.ICaptcha = {
                            hash: hash.toString('base64'),
                            imageBase64: img
                        };

                        if (debug)
                        {
                            result.value = value;
                        }

                        res.status(200).json(result);
                        res.end();
                    });
            });
    }
}

export = Captcha;

