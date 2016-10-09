/**
 * Created by slanska on 2016-10-08.
 */

///<reference path="./express/express.d.ts"/>
///<reference path="./knex/knex.d.ts"/>
///<reference path="./nodemailer/nodemailer.d.ts"/>

declare module "feathers"
{
    import * as express from 'express';
    import * as hooks from 'feathers-hooks';

    namespace f
    {

        interface Service
        {
            create?:(data, params, callback?:express.NextFunction)=>any;
            find?:(params, callback?)=>any;
            get?:(id, params, callback?)=>any;
            remove?:(id, params, callback?)=>any;
            patch?:(id, data, params, callback?)=>any;
            update?:(id, data, params, callback?)=>any;
            setup?:(app:Application)=>any;
            before?:hooks.Hook;
            after?:hooks.Hook;

            on?:((callback)=>any) | ((eventName:string, callback)=>any);
        }

        /*
         Extending standard Express router handler to have additional declaration used by feathers.js
         */
        interface IRouterHandler<T>
        {
            (path:string, service:Service):Service;
        }

        /*
         Intermediate class to have feathers.js specific declarations only.
         */
        interface ApplicationCore
        {
            service(path:string):Service;
            services:{[servicePath:string]:Service};
            use(path:string, service:Service):Application;
        }

        /*
         United express' and feathers' application
         */
        type Application = ApplicationCore & express.Application
    }

    function f():f.Application;

    export = f;
}

declare module "feathers-hooks"
{
    import * as express from 'express';
    import * as feathers from 'feathers';

    namespace f
    {
        interface HookParams
        {
            /*
             - The method name
             */
            method:'create' | 'find' | 'get' | 'remove' | 'update' | 'patch',

            /*
             - The hook type (before or after)
             */
            type:'before' | 'after',

            /*
             - The original callback (can be replaced but shouldn't be called in your hook)
             */
            callback:Function,

            /*
             - The service method parameters
             */
            params:any,

            /*
             - The request data (for create, update and patch)
             */
            data:any,

            /*
             - The app object
             */
            app:feathers.Application,

            /*
             - The id (for get, remove, update and patch)
             */
            id:string | number
        }

        interface Hook
        {
            create?:(data, params, callback?:express.NextFunction)=>any;
            find?:(params, callback?)=>any;
            get?:(id, params, callback?)=>any;
            remove?:(id, params, callback?)=>any;
            patch?:(id, data, params, callback?)=>any;
            update?:(id, data, params, callback?)=>any;
            all?:(p:HookParams)=>any;
        }
    }
    export = f;
}

declare module "feathers-authentication"
{
    interface AuthConfig
    {
        /*
         [optional] - The local auth provider config. By default this is included in a Feathers app. If set to false it will not be initialized.
         */
        local?:{
            /*
             (default: 'email') [optional] - The database field on the user service you want to use as the username.
             */
            usernameField?:string,

            /*
             (default: 'password') [optional] - The database field containing the password on the user service.
             */
            passwordField?:string,

            /*
             (default: 'false') [optional] - Whether the local Passport auth strategy should use sessions.
             */
            session?:boolean
        },

        /*
         (default: '/auth/success') [optional] -
         The endpoint to redirect to after successful authentication or signup.
         Only used for requests not over Ajax or sockets.
         */
        successRedirect?:string,

        /*
         (default: '/auth/failure') [optional] - The endpoint to redirect to for a failed authentication or signup.
         Only used for requests not over Ajax or sockets. Can be set to false to disable redirects.
         */
        failureRedirect?:string,

        /*
         (default: true) [optional] - Can be set to false to disable setting up the default success redirect route handler.
         Required if you want to render your own custom page on auth success.
         */
        shouldSetupSuccessRoute?:boolean,

        /*
         (default: true) [optional] - Can be set to false to disable setting up the default failure redirect route handler.
         Required if you want to render your own custom page on auth failure.
         */
        shouldSetupFailureRoute ?:boolean,

        /*
         (default:'_id') [optional] - the id field for you user's id. This is use by many of the authorization hooks.
         */
        idField ?:string,

        /*
         (default:'/auth/local') [optional] - The local authentication endpoint used to create new tokens using local auth
         */
        localEndpoint?:string,

        /*
         (default:'/users') [optional] - The user service endpoint
         */
        userEndpoint?:string,

        /*
         (default:'/auth/token') [optional] - The JWT auth service endpoint
         */
        tokenEndpoint?:string,

        /*
         (default:'authorization') [optional] - The header field to check for the token. This is case sensitive.
         */
        header?:string,

        /*
         (default:see options) [optional] -
         The cookie options used when sending the JWT in a cookie for OAuth or plain form posts.
         You can disable sending the cookie by setting this to false.
         */
        cookie?:{
            /*
             (default: 'feathers-jwt') [optional] - The cookie name. This is case sensitive.
             */
            name?:string,

            /*
             (default: 'false') [optional] - Prevents JavaScript from accessing the cookie on the client.
             Should be set to true if you are not using OAuth or Form Posts for authentication.
             */
            httpOnly?:boolean,

            /*
             (default: 'true' in production) [optional] - Marks the cookie to be used with HTTPS only.
             */
            secure?:boolean,

            /*
             (default: 30 seconds from current time) [optional] - The time when the cookie should expire.
             Must be a valid Date object.
             */
            expires?:Date
        },

        /*
         JWT token configuration
         */
        token?:{
            /*
             (required) (default: a strong auto generated one) - Your secret used to sign JWT's.
             If this gets compromised you need to rotate it immediately!
             */
            secret:string,

            /*
             (default: '[]') [optional] - An array of fields from your user object that should be included in the JWT payload.
             */
            payload?:string[],

            /*
             (default: 'password') [optional] - The database field containing the password on the user service.
             */
            passwordField?:string,

            /*
             (default: 'feathers') [optional] - The JWT issuer field
             */
            issuer?:string,

            /*
             (default: 'HS256') [optional] - The accepted JWT hash algorithm.
             List of supported values is defined on: https://github.com/auth0/node-jsonwebtoken
             */
            algorithm?:'HS256'| 'HS384' | 'HS512' | 'RS256' | 'RS384'| 'RS512'| 'ES256'| 'ES384'| 'ES512',

            /*
             (default:'1d') [optional] - The time a token is valid for
             */
            expiresIn:string

        }


    }

    function f(cfg?:AuthConfig);

    export = f;
}

declare module "feathers-rest"
{
    export = null;

}

declare module "feathers-knex"
{
    import * as feathers from 'feathers';
    import * as Knex from 'knex';

    interface PaginateConfig
    {
        "default":number;
        max:number;
    }

    interface ServiceConfig
    {
        /*
         Required. The KnexJS database instance
         */
        Model:Knex.Config,

        /*
         Required. The name of the table
         */
        name:string,

        /*
         [optional] - The name of the id property.
         default: 'id'
         */
        id?:string | string[],

        /*
         A pagination object (optional)
         */
        paginate?:PaginateConfig;

    }

    function f(cfg:ServiceConfig):feathers.Service;

    export = f;
}

declare module "feathers-mailer"
{
    import * as nodemailer from 'nodemailer';

    namespace f
    {
        function create(email:nodemailer.SendMailOptions, params?);
    }
    function f(transport:nodemailer.Transport, defaults?);

    export = f;
}