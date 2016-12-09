/**
 * Created by slanska on 2016-10-02.
 */

///<reference path="../typings/tsd.d.ts"/>

import * as knex from 'knex';
import nodemailer = require( 'nodemailer');
import authentication = require('feathers-authentication');

namespace Types
{
    /*
     Modes for user registration

     */
    import DateTimeFormat = Intl.DateTimeFormat;
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
        basePath?: string;

        /*
         Your secret used to sign JWT's.
         If this gets compromised you need to rotate it immediately!
         (default: a strong auto generated one)
         */
        tokenSecret?: string,

        /*
         Lifetime of access token. By default: '1d'
         */
        tokenExpiresIn?: string;

        /*
         Lifetime of refresh token. By default: '15 days'
         */
        refreshTokenExpiresIn?: string;

        /*
         Lifetime of token sent after user registration.
         Default: '1 day'
         */
        confirmTokenExpiresIn?: string;

        /*
         Optional configuration for subdomains.
         Based on configuration: https://github.com/patmood/wildcard-subdomains

         */
        subDomains?: {
            /*
             Ignore 'www' subdomain
             Default: true
             */
            www?: boolean;

            /*
             Prepended to the path
             Default: '_sub'.
             Example: mydomain.example.com -> example.com/_sub/mydomain
             */
            namespace?: string;
        };

        /*
         Applicable only if subdomains are enabled.
         If true, users with role [Domain Admin] can create domain specific roles
         Default: false
         */
        allowDomainRoles?: boolean;

        /*
         Roles assigned to a new member upon creation/registration
         Array of role names
         Default: none
         */
        newMemberRoles?: string[];

        /*
         Defines how new users will be registered.
         Default: ByAdminOnly
         */
        userCreateMode?: UserCreateMode;

        /*
         Path to email templates.
         Default: /templates
         */
        templatePath?: string;

        /*
         Knex configuration for database connection
         */
        dbConfig: knex.Config;

        /*
         configuration to send emails
         */
        emailTransport: nodemailer.Transporter;

        /*
         If true, newly created domains will have their paths reversed from their names
         I.e. name 'state.county.city' will be converted to path 'city.county.state'.
         Default: false
         */
        reverseDomainPath?: boolean;

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
        passwordRules?: string|RegExp,

        /*
         Your company name, to be included into emails etc.
         By default: 'YOUR_COMPANY_NAME'
         */
        companyName?: string,

        /*
         Company contact information. Used for rendering view and email footers
         */
        contactInfo?: {
            addressLine1: string,
            addressLine2?: string,
            city: string,
            provinceOrState: string,
            postalCode: string,
            country: string
        },

        /*
         (optional) endpoints for email links
         */

        /*
         Link to navigate after user clicked [Confirm my email] link in email
         */
        afterConfirmEmailEndpoint?: string,

        /*
         Link to navigate after user clicked [Change password] link in email
         */
        changePasswordEndpoint?: string,

        /*
         Base link to navigate for taking action for the given user
         */
        userProfileEndpoint?: string,

        /*
         Runtime mode for NAuth2.
         In apiservice mode *Endpoint values above are mandatory
         In website mode simple integrated SPA application will be used (see /public for content)
         *Endpoint links are optional. If not set, integrated endpoints will be used
         Default value: 'website'

         TODO? Confirm design: apiservice/website dilemman may be not relevant as type of application
         can be determined based on AJAX and non-AJAX calls
         */
        run_mode: 'apiservice'|'website',

        /*
         Publicly available web address to be used for interaction with user
         (via email and admin pages).
         For example, upon registration user will receive welcomeAndConfirm message
         with link to complete registration. This link will be composed as:
         publicHostUrl + '/registerConfirm?' + registerToken

         By default publicHostUrl = request.headers.host + '/' + basePath
         */
        publicHostUrl?: string;

        /*
         'from' email used to send all generated messages to the users
         By default: '<%-companyName%> Support<support@publicHostUrl>'
         (publicHostUrl will have website url portion only, e.g.
         if publicHostUrl == 'www.example.com/auth', then email will have 'example.com' only)
         */
        supportEmail?: string;

        /*
         Link to end user's Terms of Service.
         By default: link to /templates/<language>/termsOfService.html
         */
        termsOfServiceUrl?: string;

        /*
         true if running in development/debug mode (process.env.ENV === 'development').
         Default: false
         */
        debug?: boolean;

        /*
         UI settings for embedded website
         */
        ui?: {
            /*
             default: auto
             */
            skin?: 'auto' | 'ios' | 'material',

            /*
             default: white
             */
            theme?: 'white' | 'dark',

            /*
             default: blue
             */
            color?: string
        },

        /*
         List of supported cultures
         Default: ['en']
         */
        supportedCultures?: string[];

        /*
         List of fields from nauth2_users table to be filled in during registration.
         Default: ['email']

         Complete list of all available fields:
         ['email', 'userName', 'firstName', 'lastName', 'gender', 'birthDate', 'avatar', 'culture',
         'addressLine1', 'addressLine2', 'city', 'stateOrProvince', 'postalCode', 'country',
         'homePhone', 'cellPhone', 'dayTimePhone']
         Fields can be:
         * array of strings
         * object with field names as keys
         */
        registerFields?: string[];

        /*
         List of extra fields from nauth2_users table to be viewed/edited in user profile/registration forms.
         Complete list of fields in user profile is determined by joining registerFields and extraUserProfileFields
         Default: ['firstName', 'lastName', 'gender', 'birthDate', 'avatar', 'culture']
         */
        extraUserProfileFields?: string[];

        /*
         If true, notification email will be sent on user's password change
         Default: true
         */
        sendEmailOnChangePassword?: boolean;
    }

    /*
     Captcha information used to verify whether there is a human being on the other side of connection
     When returned from server, hash hash and imageBase64
     When sent back to server, should have original hash and value, entered by user
     */
    export interface ICaptcha
    {
        hash: string
        value?: string,
        imageBase64?: string
    }

    /*
     Function to be used as template builder (e.g. for dynamic email subject texts)
     */
    export type TemplateFunction = (params: Object)=>string;

    /*

     */
    export interface IUserRecord
    {
        userId: number;
        name: string;
        password: string;
        email: string;
        created_at: Date;
        updated_at: Date;
        firstName?: string;
        lastName?: string;
        extData?: Object;
        status?: 'A'|'P'|'D'|'S';
        birthData?: Date;
        gender?: string;
        avatar?: string;
        culture?: string;
        maxCreatedDomains?: number;
        changePasswordOnNextLogin?: boolean;
        pwdSalt: string;
        // TODO TBC
    }

    /*

     */
    export interface IDomainRecord
    {
        domainId: number;
        // TODO TBC
    }

    export interface INAuth2Controller
    {
        AuthConfig: authentication.AuthConfig;
        cfg: Types.INAuth2Config;
    }

    /*
     NAuth2_RefreshTokens record
     */
    export interface IRefreshTokenRecord
    {
        tokenUuid: string;
        userId: number;
        userAgent: Object;
        ipAddress: string;
        validUntil: Date;
        state: string;
        signatureHash: string;
        created_at: Date;
        updated_at: Date;
    }

    /*
     Mapping to nauth2_roles record
     */
    export interface INauth2Role
    {
        roleId: number;
        domainId: number;
        name: string;
        title: string;
        systemRole: boolean;
        domainSpecific: boolean;
        created_at: Date;
        updated_at: Date;
    }

    export type RolesHash =  {[roleName: string]: Types.INauth2Role};
}

export = Types;