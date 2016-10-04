/**
 * Created by slanska on 2015-11-02.
 */

/// <reference path="../typings/tsd.d.ts" />

import express = require('express');
import crypto = require('crypto');
var captchapng = require('captchapng');

var _hashSalt = crypto.randomBytes(128).toString('base64');

/*

 */
declare interface ICaptchaResponse
{
    hash:string;
    image:Buffer;
    value?:string;
}

/*

 */
class Captcha
{
    /*

     */
    static verify(originalHash:string, codeToVerify:string):boolean
    {
        var hashToVerify = crypto.pbkdf2Sync(codeToVerify, _hashSalt, 4096, 128, 'sha256').toString('base64');

        return hashToVerify === originalHash;
    }

    /*

     */
    static init(app:express.Application, path = '/captcha', debug = false)
    {
        app.use(path, function (req, res, next)
        {
            // Generate random value

            var value = (Math.round(Math.random() * 9000 + 1000)).toString();
            var hash = crypto.pbkdf2Sync(value, _hashSalt, 4096, 128, 'sha256').toString('base64');


            var p = new captchapng(80, 30, value); // width,height,numeric captcha
            p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
            p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

            var img = p.getBase64();
            var imgbase64 = new Buffer(img, 'base64');

            var result:ICaptchaResponse = {
                hash: hash,
                image: imgbase64
            };

            if (debug)
            {
                result.value = value;
            }

            res.status(200).json(result);
            res.end();

        });
    }
}

export = Captcha;

