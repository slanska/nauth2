/**
 * Created by slanska on 2016-10-08.
 */

///<reference path="./express/express.d.ts"/>
///<reference path="./knex/knex.d.ts"/>

declare module "feathers"
{
    import * as express from 'express';

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
    export = null;
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