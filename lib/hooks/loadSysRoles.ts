/**
 * Created by slanska on 2016-12-05.
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
import Knex = require('knex');
import Promise = require('bluebird');
import _ = require('lodash');
var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10 /* seconds */});

/*
 Returns hash of system roles (by role name).
 Memory cache is used for performance
 */
export function getSystemRoles(db: Knex): Promise<Types.RolesHash>
{
    return memoryCache.wrap('db:systemRoles',
        () =>
        {
            return db.table('nauth2_roles').where({systemRole: true})
                .then((roles: Types.INauth2Role[]) =>
                {
                    var rr = {} as any;
                    _.forEach(roles, (it) =>
                    {
                        rr[it.roleId] = it;
                    });
                    return rr;
                })
        }, {ttl: 60 * 60});
}

/*
 Returns system role by its name.
 Uses cache manager for better performance
 */
export function getSystemRoleByName(db: Knex, roleName: string): Promise<Types.INauth2Role>
{
    return getSystemRoles(db)
        .then((roles: Types.RolesHash) =>
        {
            return roles[roleName];
        })
}


/*
 Feathers JS hook. Ensures that system roles are loaded and added to cache
 */
export function loadSystemRoles(db: Knex)
{
    var result = function (p: hooks.HookParams)
    {
        return getSystemRoles(db);
    };

    return result;
}
