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
        function static(path: string): express.RequestHandler;

        interface FindResult
        {
            data: any[];
            limit: number;
            skip: number;
            total: number;
        }

        /*

         */
        interface MethodParams
        {
            query?: any;
            token?: any;
            paginate?: {limit?: number, offset?: number};
        }

        /*
         Configuration for API service
         */
        interface ServiceConfig
        {
            create?: (data, params: MethodParams, callback?: express.NextFunction) => any;
            find?: (params: MethodParams, callback?) => any;
            get?: (id, params: MethodParams, callback?) => any;
            remove?: (id, params: MethodParams, callback?) => any;
            patch?: (id, data, params: MethodParams, callback?) => any;
            update?: (id, data, params: MethodParams, callback?) => any;
            setup?: (app: Application) => any;
        }

        /*
         Service object
         */
        interface Service extends ServiceConfig
        {
            before(hooks: hooks.Hook): Service;
            after(hooks: hooks.Hook): Service;

            on(callback: Function): Service;
            on(eventName: string, callback: Function): Service;
            once(callback: Function): Service;
            once(eventName: string, callback: Function): Service;
            emit(eventName: string): Service;
        }

        /*
         Intermediate class to have feathers.js specific declarations only.
         */
        interface ApplicationCore
        {
            service(path: string): Service;
            service(path: string, service: ServiceConfig): Service;
            services: {[servicePath: string]: Service};
            use(path: string, service: ServiceConfig): Application;
        }

        /*
         United express' and feathers' application
         */
        type Application = ApplicationCore & express.Application

        /*
         Standard structure of response body
         */
        interface ResponseBody
        {
            /*
             Status class description. E.g. "Not implemented"
             */
            name: string,

            /*
             Specific message
             */
            message: string,

            /*
             HTTP status code
             */
            code: number,

            /*
             Status class name. E.g. "not-implemented"
             */
            className: string,

            /*
             Optional hash of errors
             */
            errors?: Object
        }
    }

    function f(): f.Application;

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
            method: 'create' | 'find' | 'get' | 'remove' | 'update' | 'patch',

            /*
             - The hook type (before or after)
             */
            type: 'before' | 'after',

            /*
             - The original callback (can be replaced but shouldn't be called in your hook)
             */
            callback: Function,

            /*
             - The service method parameters
             */
            params: {
                provider: 'rest'|'socketio'|'primus',
                query: any,
                token: any,
                [name: string]: any;
            },

            /*
             - The request data (for create, update and patch)
             */
            data: any,

            /*
             - The app object
             */
            app: feathers.Application,

            /*
             - The id (for get, remove, update and patch)
             */
            id: string | number,

            /*
             Can be optionally set in 'before' hook to stop flow, or used in 'after' hook to process returned data
             */
            result?: any
        }

        type HookFunction = ((p: HookParams) => any) | (((p: HookParams) => any)[]);
        interface Hook
        {
            create?: HookFunction;
            find?: HookFunction;
            get?: HookFunction;
            remove?: HookFunction;
            patch?: HookFunction;
            update?: HookFunction;
            all?: HookFunction;
        }

        /*
         Predefined hooks
         */

        /*
         uses a property from the result (or every item if it is a list) to retrieve a single related object from
         a service and add it to the original object. It is meant to be used as an after hook on any service method.
         @param  fieldName (required) - The field name you want to populate the related object on to.
         @param service (required) - The service you want to populate the object from.
         @param field (default: 'fieldName') [optional] - The field you want to look up the related object
         by from the service. By default it is the same as the target fieldName.
         */
        function populate(fieldName: string, service: feathers.Service, field?: string);

        /*
         Disables access to a service method completely or for a specific provider. All providers
         (REST, Socket.io and Primus) set the params.provider property which is what disable checks for.
         There are several ways to use the disable hook:
         @param providers (default: disables everything) [optional] - The transports that you want to
         disable this service method for. Options are:
         socketio - will disable the method for the Socket.IO provider
         primus - will disable the method for the Primus provider
         rest - will disable the method for the REST provider
         external - will disable access from all providers making a service method only usable internally.
         @param callback (default: runs when not called internally) [optional] -
         A function that receives the hook object where you can put your own logic to determine whether this hook should run.
         Returns either true or false.
         */
        function disable(providers?: 'socketio' | 'primus' | 'rest' | 'external', callback?: Function);

        /*
         Remove the given fields either from the data submitted (as a before hook for create, update or patch)
         or from the result (as an after hook). If the data is an array or a paginated find result the hook will
         remove the field for every item.
         @param fields (required) - The fields that you want to remove from the object(s).
         @param callback (default: runs when not called internally) [optional] -
         A function that receives the hook object where you can put your own logic to determine whether this hook should run.
         Returns either true or false.
         */
        function remove(...fields: string[]);
        function remove(fields: string, callback?: Function);

        /*
         Remove the given fields from the query params. Can be used as a before hook for any service method.
         @param fields (required) - The fields that you want to remove from the query object.
         @param callback (default: runs when not called internally) [optional] - A function that receives the hook object
         where you can put your own logic to determine whether this hook should run. Returns either true or false.
         */
        function removeQuery(...fields: string[]);
        function removeQuery(fields: string, callback?: Function);

        /*
         Discard all other fields except for the provided fields either from the data submitted
         (as a before hook for create, update or patch) or from the result (as an after hook).
         If the data is an array or a paginated find result the hook will remove the field for every item.
         @param fields (required) - The fields that you want to retain from the object(s). All other fields will be discarded.
         @param callback (default: runs when not called internally) [optional] - A function that receives
         the hook object where you can put your own logic to determine whether this hook should run. Returns either true or false.
         */
        function pluck(...fields: string[]);
        function pluck(fields: string, callback?: Function);

        /*
         Discard all other fields except for the given fields from the query params.
         Can be used as a before hook for any service method.
         @param fields (required) - The fields that you want to retain from the query object. All other fields will be discarded.
         @param callback (default: runs when not called internally) [optional] - A function that receives the hook object
         where you can put your own logic to determine whether this hook should run. Returns either true or false.
         */
        function pluckQuery(...fields: string[]);
        function pluckQuery(fields: string, callback?: Function);

        /*
         Lowercases the given fields either in the data submitted (as a before hook for create, update or patch)
         or in the result (as an after hook). If the data is an array or a paginated find result
         the hook will lowercase the field for every item.
         @param fields (required) - The fields that you want to lowercase from the retrieved object(s).
         */
        function lowerCase(...fields: string[]);
    }

    function f();

    export = f;
}

declare module "feathers-authentication"
{
    import * as Hooks from 'feathers-hooks';

    function f(cfg?: f.AuthConfig);

    /*
     Standard hooks for user authentication.
     Most of them accept authentication configuration as a parameter.
     If config is not passed, hooks will use default configuration, as defined for service 'auth'
     */
    namespace f
    {
        export interface AuthConfig
        {
            /*
             [optional] - The local auth provider config. By default this is included in a Feathers app. If set to false it will not be initialized.
             */
            local?: {
                /*
                 (default: 'email') [optional] - The database field on the user service you want to use as the username.
                 */
                usernameField?: string,

                /*
                 (default: 'password') [optional] - The database field containing the password on the user service.
                 */
                passwordField?: string,

                /*
                 (default: 'false') [optional] - Whether the local Passport auth strategy should use sessions.
                 */
                session?: boolean
            },

            /*
             (default: '/auth/success') [optional] -
             The endpoint to redirect to after successful authentication or signup.
             Only used for requests not over Ajax or sockets.
             */
            successRedirect?: string,

            /*
             (default: '/auth/failure') [optional] - The endpoint to redirect to for a failed authentication or signup.
             Only used for requests not over Ajax or sockets. Can be set to false to disable redirects.
             */
            failureRedirect?: string,

            /*
             (default: true) [optional] - Can be set to false to disable setting up the default success redirect route handler.
             Required if you want to render your own custom page on auth success.
             */
            shouldSetupSuccessRoute?: boolean,

            /*
             (default: true) [optional] - Can be set to false to disable setting up the default failure redirect route handler.
             Required if you want to render your own custom page on auth failure.
             */
            shouldSetupFailureRoute ?: boolean,

            /*
             (default:'_id') [optional] - the id field for you user's id. This is use by many of the authorization hooks.
             */
            idField ?: string,

            /*
             (default:'/auth/local') [optional] - The local authentication endpoint used to create new tokens
             using local auth
             */
            localEndpoint?: string,

            /*
             (default:'/users') [optional] - The user service endpoint
             */
            userEndpoint?: string,

            /*
             (default:'/auth/token') [optional] - The JWT auth service endpoint
             */
            tokenEndpoint?: string,

            /*
             (default:'authorization') [optional] - The header field to check for the token. This is case sensitive.
             */
            header?: string,

            /*
             (default:see options) [optional] -
             The cookie options used when sending the JWT in a cookie for OAuth or plain form posts.
             You can disable sending the cookie by setting this to false.
             */
            cookie?: {
                /*
                 (default: 'feathers-jwt') [optional] - The cookie name. This is case sensitive.
                 */
                name?: string,

                /*
                 (default: 'false') [optional] - Prevents JavaScript from accessing the cookie on the client.
                 Should be set to true if you are not using OAuth or Form Posts for authentication.
                 */
                httpOnly?: boolean,

                /*
                 (default: 'true' in production) [optional] - Marks the cookie to be used with HTTPS only.
                 */
                secure?: boolean,

                /*
                 (default: 30 seconds from current time) [optional] - The time when the cookie should expire.
                 Must be a valid Date object.
                 */
                expires?: Date
            },

            /*
             JWT secret?
             */
            secret?: string;

            /*
             JWT token configuration
             */
            token?: {
                /*
                 (required) (default: a strong auto generated one) - Your secret used to sign JWT's.
                 If this gets compromised you need to rotate it immediately!
                 */
                secret: string,

                /*
                 (default: '[]') [optional] - An array of fields from your user object that should be included in the JWT payload.
                 */
                payload?: string[],

                /*
                 (default: 'password') [optional] - The database field containing the password on the user service.
                 */
                passwordField?: string,

                /*
                 (default: 'feathers') [optional] - The JWT issuer field
                 */
                issuer?: string,

                /*
                 (default: 'HS256') [optional] - The accepted JWT hash algorithm.
                 List of supported values is defined on: https://github.com/auth0/node-jsonwebtoken
                 */
                algorithm?: 'HS256'| 'HS384' | 'HS512' | 'RS256' | 'RS384'| 'RS512'| 'ES256'| 'ES384'| 'ES512',

                /*
                 (default:'1d') [optional] - The time a token is valid for
                 Examples: ''
                 */
                expiresIn: string

            },

            /*
             Optional list of roles to verify against. Used by hasRoleOrRestrict hook
             */
            roles?: [string|number],

            /*
             Name for query parameter to set user ID (used by queryWithCurrentUser hook)
             */
            as?: string,

            /*
             Used by restrictToOwner hook to extract owner ID/IDs to verify that current user is tha owner of data.
             Value can be array of IDs (multiple owners)
             */
            ownerField?: string
        }

        export namespace hooks
        {
            /*

             */
            export function associateCurrentUser(cfg?: AuthConfig);

            /*
             Hashes password with generated salt. Uses passwordField attribute in p.data and replaces it
             with hashed value. Note: salt is generated as a part of hashed value
             */
            export function hashPassword(cfg?: AuthConfig);

            /*
             Uses cfg.userEndpoint to access User service and retrieve user information
             */
            export function populateUser(cfg?: AuthConfig);

            /*
             Sets current user ID from payload to query using cfg.as for attribute name
             */
            export function queryWithCurrentUser(cfg?: AuthConfig);

            /*
             Checks if there is registered user
             */
            export function restrictToAuthenticated(cfg?: AuthConfig);

            /*
             Checks if data.owner attribute (determined by cfg.ownerField) is id of current user
             */
            export function restrictToOwner(cfg?: AuthConfig);

            /*
             Checks if current user has one of allowed roles in the config
             */
            export function restrictToRoles(cfg?: AuthConfig);

            /*
             Checks if JWT is valid and sets HookParams.params.payload to token's payload
             */
            export function verifyToken(cfg?: AuthConfig);

            /*
             Only for find or get methods
             NOT SURE what this hook is doing
             */
            export function verifyOrRestrict();

            /*
             Only for find or get methods
             */
            export function populateOrRestrict(cfg?: AuthConfig);

            /*
             Only for find or get methods
             */
            export function hasRoleOrRestrict(cfg?: AuthConfig);
        }
    }

    export = f;
}

declare module "feathers-rest"
{
    // TODO
    export = null;

}

declare module "feathers-knex"
{
    import * as feathers from 'feathers';
    import * as Knex from 'knex';
    import * as hooks from 'feathers-hooks';
    import * as express from 'express';

    namespace k
    {
        export class Service implements feathers.Service
        {
            constructor(cfg: ServiceConfig);

            before(hooks: hooks.Hook): Service;

            after(hooks: hooks.Hook): Service;

            on(callback: Function): Service;
            on(eventName: string, callback: Function): Service;

            once(callback: Function): Service;
            once(eventName: string, callback: Function): Service;

            emit(eventName: string): Service;
        }

        export interface PaginateConfig
        {
            "default": number;
            max: number;
        }

        export interface ServiceConfig
        {
            /*
             Required. The KnexJS database instance
             */
            Model: Knex,

            /*
             Required. The name of the table
             */
            name: string,

            /*
             [optional] - The name of the id property.
             default: 'id'
             */
            id?: string | string[],

            /*
             A pagination object (optional)
             */
            paginate?: PaginateConfig;

        }
    }

    function k(cfg: k.ServiceConfig): feathers.Service;

    export = k;
}

declare module "feathers-mailer"
{
    import * as nodemailer from 'nodemailer';

    namespace f
    {
        function create(email: nodemailer.SendMailOptions, params?);
    }
    function f(transport: nodemailer.Transport, defaults?);

    export = f;
}

/*
 Standard errors
 */
declare module "feathers-errors"
{
    interface Error
    {
        new(message: string, data?: any)
    }

    namespace f
    {
        var BadRequest: Error;
        var NotAuthenticated: Error;
        var PaymentError: Error;
        var Forbidden: Error;
        var NotFound: Error;
        var MethodNotAllowed: Error;
        var NotAcceptable: Error;
        var Timeout: Error;
        var Conflict: Error;
        var Unprocessable: Error;
        var GeneralError: Error;
        var NotImplemented: Error;
        var Unavailable: Error;
    }

    export = f;
}

declare module "feathers-sendgrid"
{
    namespace f
    {
    }

    export = f;
}