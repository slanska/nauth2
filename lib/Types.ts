/**
 * Created by slanska on 2016-10-02.
 */

///<reference path="../typings/tsd.d.ts"/>

import * as knex from 'knex';
import nodemailer = require( 'nodemailer');
import {strictEqual} from "assert";

namespace Types
{
    /*
     Modes for user registration

     */
    export enum UserCreateMode {
        /*
         For domains 'Auto' mode means that system wide setting will be used. For system level setting, 'Auto' is treated as 'ByAdminOnly'
         */
        Auto = 0,

        /*
         Only authorized users can add new user. /register is not allowed
         */
        ByAdminOnly = 1,

        /*
         New user can register and email with confirmation link will be sent. Once link is processed,
         user becomes a registered member
         */
        SelfAndConfirm = 2,

        /*
         Prospective member fill registration form, user admin(s) will be notified via email and
         either approve or reject a new user. User will be notified via email
         */
        SelfAndApproveByAdmin = 3,

        /*
         A new user fills registration form and immediately becomes registered. User admin(s) will
         get notified via email
         */
        SelfStart = 4
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
         Your secret used to sign JWT's.
         If this gets compromised you need to rotate it immediately!
         (default: a strong auto generated one)
         */
        tokenSecret?:string,

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
        userCreateMode?:UserCreateMode;

        /*
         Path to email templates.
         Default: /templates
         */
        templatePath?:string;

        /*
         Knex configuration for database connection
         */
        dbConfig:knex.Config;

        /*
         configuration to send emails
         */
        emailTransport:nodemailer.Transporter;

        /*
         If true, newly created domains will have their paths reversed from their names
         I.e. name 'state.county.city' will be converted to path 'city.county.state'.
         Default: false
         */
        reverseDomainPath?:boolean;

        /*
         Regular expression for good password validation.
         Default rules:
         1) The password length must be greater than or equal to 8
         2) The password must contain one or more uppercase characters
         3) The password must contain one or more lowercase characters
         4) The password must contain one or more numeric values
         5) The password must contain one or more special characters

         Default rules regexp:
         /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/

         NOTE: custom rules can be string or RegExp. If specified as string, make sure that all backslashes and presented properly
         (i.e. doubled). I.e. expression above in string format should be set as:
         '(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$'

         If password does not match rules, message 'WeakPassword' from templates/phrases.json will be sent back
         */
        passwordRules?:string|RegExp,

        /*
         Your company name, to be included into emails etc.
         By default: 'YOUR_COMPANY_NAME'
         */
        companyName?:string,

        /*
         Publicly available web address to be used for interaction with user
         (via email and admin pages).
         For example, upon registration user will receive welcomeAndConfirm message
         with link to complete registration. This link will be composed as:
         publicHostUrl + '/registerConfirm?' + registerToken

         By default publicHostUrl = request.headers.host + '/' + basePath
         */
        publicHostUrl?:string;

        /*
         'from' email used to send all generated messages to the users
         By default: '<%-companyName%> Support<support@publicHostUrl>'
         (publicHostUrl will have website url portion only, e.g.
         if publicHostUrl == 'www.example.com/auth', then email will have 'example.com' only)
         */
        supportEmail?:string;

        /*
         Link to end user's Terms of Service.
         By default: link to /templates/<language>/termsOfService.html
         */
        termsOfServiceUrl?:string;
    }

    /*
     Captcha information used to verify whether there is a human being on the other side of connection
     When returned from server, hash hash and imageBase64
     When sent back to server, should have original hash and value, entered by user
     */
    export interface ICaptcha
    {
        hash:string
        value?:string,
        imageBase64?:string
    }

    export type TemplateFunction = (params:Object)=>string;
}

export = Types;