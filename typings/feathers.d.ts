/**
 * Created by slanska on 2016-10-08.
 */

///<reference path="./express/express.d.ts"/>
///<reference path="./knex/knex.d.ts"/>
///<reference path="./nodemailer/nodemailer.d.ts"/>

declare module "feathers"
{
    import * as express from 'express';
    import * as nodemailer from 'nodemailer';

    namespace f
    {
        interface Hook
        {
            create?:(data, params, callback?:express.NextFunction)=>any;
            find?:(params, callback?)=>any;
            get?:(id, params, callback?)=>any;
            remove?:(id, params, callback?)=>any;
            patch?:(id, data, params, callback?)=>any;
            update?:(id, data, params, callback?)=>any;
            setup?:(app:Application)=>any;
        }

        interface Service
        {
            create?:(data, params, callback?:express.NextFunction)=>any;
            find?:(params, callback?)=>any;
            get?:(id, params, callback?)=>any;
            remove?:(id, params, callback?)=>any;
            patch?:(id, data, params, callback?)=>any;
            update?:(id, data, params, callback?)=>any;
            setup?:(app:Application)=>any;
            before?:Hook;
            after?:Hook;
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
    export = null;
}

declare module "feathers-authentication"
{
    interface AuthConfig
    {
        /*
         JWT token configuration
         */
        token:{
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
    namespace f
    {
        function create(email:nodemailer.SendMailOptions, params?);
    }
    function f(transport:nodemailer.Transport, defaults?);

    export = f;
}