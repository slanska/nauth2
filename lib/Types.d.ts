/**
 * Created by slanska on 2016-10-02.
 */

///<reference path="../typings/tsd.d.ts"/>

import knex = require('knex');
import Nodemailer = require('nodemailer');
import NodemailerSmtpTransport = require('nodemailer-smtp-transport');

declare interface IRegisterPayload
{
    email:string;
    password:string;
    confirmPassword:string;

    // Optional
    firstName?:string;
    lastName?:string;
    addressLine1?:string;
    addressLine2?:string;
    city?:string;
    postalCode?:string;
    country?:string;
    stateOrProvince?:string;

    captcha?:string;
    captchaToVerify?:string;
}

declare interface IRegisterResult
{
}

declare interface INAuth2Config
{
    dbConfig:knex.Config;
    emailConfig:NodemailerSmtpTransport.SmtpOptions;
}