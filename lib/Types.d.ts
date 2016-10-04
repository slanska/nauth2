/**
 * Created by slanska on 2016-10-02.
 */

///<reference path="../typings/tsd.d.ts"/>

import knex = require('knex');
import Nodemailer = require('nodemailer');
import NodemailerSmtpTransport = require('nodemailer-smtp-transport');
import express = require('express');

export interface ILoginPayload
{
    email:string,
    password:string;
}

export interface IRegisterPayload
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

export interface ILoginResult
{
    token:string;
}

export interface IRegisterResult
{
}

export interface INAuth2Config
{
    /*
     Optional configuration for subdomains.
     Based on configuration: https://github.com/patmood/wildcard-subdomains
     */
    subDomains?:{
        /*
         Ignore 'www' subdomain
         Default: true
         */
        www?:boolean;

        /*
         Prepended to the path
         Default: '_sub'
         */
        namespace?:string;
    };

    /*

     */
    templatePath?:string;

    /*

     */
    dbConfig:knex.Config;

    /*

     */
    emailConfig:NodemailerSmtpTransport.SmtpOptions;
}

export interface IForgotPasswordResponse
{
}

export interface IReqParams
{
    subdomain?:string;
}

/*
 Typed extension of Express request
 */
export interface Request<T, P extends IReqParams, Q> extends express.Request
{
    body:T;
    params:P;
    query:Q;
}

export interface ISaveResult
{

}

export interface IUserProfile
{
}

export interface IForgotPasswordPayload
{
}

export interface IUserParams
{
    userID:string;
}

export interface IUserQuery
{

}

export interface  IChangePasswordPayload
{
    oldPassword:string;
    newPassword:string;
    confirmNewPassword:string;
}

export interface IRoleParams
{
}

export interface IRolesQuery
{
}


