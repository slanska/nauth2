/**
 * Created by slanska on 2016-10-02.
 */

///<reference path="../typings/tsd.d.ts"/>

import * as knex from 'knex';
import * as Nodemailer from 'nodemailer';
import * as NodemailerSmtpTransport from 'nodemailer-smtp-transport';
import * as express from 'express';

namespace Types
{
    interface ILoginPayload
    {
        email:string,
        password:string;
    }

    interface IRegisterPayload
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

    interface ILoginResult
    {
        token:string;
    }

    interface IRegisterResult
    {
    }

    /*
     Modes for user registration

     */
    export enum RegisterMode {
        /*
         Only authorized users can add new user. /register is not allowed
         */
        ByAdminOnly,

        /*
         New user can register and email with confirmation link will be sent. Once link is processed,
         user becomes a registered member
         */
        SelfAndConfirm,

        /*
         Prospective member fill registration form, user admin(s) will be notified via email and
         either approve or reject a new user. User will be notified via email
         */
        SelfAndApproveByAdmin,

        /*
         A new user fills registration form and immediately becomes registered. User admin(s) will
         get notified via email
         */
        SelfStart
    }

    /*
     General NAuth2 configuration
     */
    export interface INAuth2Config
    {
        /*
         Optional base path to be used for all end-points in NAuth2.
         For example, if basePath == 'auth', then users end point would be 'auth/users',
         for 'userroles' -> 'auth/userroles'.

         If domains are enabled, the following paths will be configured (assume '_sub' as domain prefix):
         '_sub/:domainName/auth/users' - for domain users
         '_sub/:domainName/auth/userroles' - for domain user roles

         Default: 'auth'
         */
        basePath?:string;

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
             Default: '_sub'.
             Example: mydomain.example.com -> example.com/_sub/mydomain
             */
            namespace?:string;
        };

        /*
         Applicable only if subdomains are enabled.
         If true, users with role [Domain Admin] can create domain specific roles
         Default: false
         */
        allowDomainRoles?:boolean;

        /*
         Roles assigned to a new member upon creation/registration
         Default: none
         */
        newMemberRoles?:string[];

        /*
         Defines how new users will be registered.
         Default: ByAdminOnly
         */
        registerMode?:RegisterMode;

        /*
         Path to email templates.
         */
        templatePath?:string;

        /*
         Knex configuration for database connection
         */
        dbConfig:knex.Config;

        /*

         */
        emailConfig:NodemailerSmtpTransport.SmtpOptions;
    }

    interface IForgotPasswordResponse
    {
    }

    interface IReqParams
    {
        subdomain?:string;
    }

    /*
     Typed extension of Express request
     */
    interface Request<T, P extends IReqParams, Q> extends express.Request
    {
        body:T;
        params:P;
        query:Q;
    }

    interface ISaveResult
    {

    }

    interface IUserProfile
    {
    }

    interface IForgotPasswordPayload
    {
    }

    interface IUserParams
    {
        userID:string;
    }

    interface IUserQuery
    {

    }

    interface  IChangePasswordPayload
    {
        oldPassword:string;
        newPassword:string;
        confirmNewPassword:string;
    }

    interface IRoleParams
    {
    }

    interface IRolesQuery
    {
    }
}

export = Types;

