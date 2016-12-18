/**
 * Created by slanska on 2016-10-16.
 */

import Types = require('./Types');
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
var AccessControl = require('accesscontrol');
import Promise = require('bluebird');
import Knex = require('knex');
import _ = require('lodash');

export var ruleList = [
    /*
     Users tables
     */
    {
        role: ["SystemAdmin", "UserAdmin"],
        resource: "users",
        action: "create:any",
        attributes: ['*', '!password', '!prevPwdHash']
    },
    {
        role: ["SystemAdmin", "UserAdmin"],
        resource: "users",
        action: "read:any",
        attributes: ['*', '!password', '!prevPwdHash']
    },
    {
        role: ["SystemAdmin", "UserAdmin"],
        resource: "users",
        action: "update:any",
        attributes: ['*', '!created_at']
    },
    {role: ["SystemAdmin", "UserAdmin"], resource: "users", action: "delete:any"},

    // create and delete are not allowed
    {
        role: "Member", resource: "users", action: "update:own",
        attributes: ['*', '!prevPwdHash', '!userID', '!pwdExpireOn', '!changePwdOnNextLogin', '!suspended', '!created_at',
            '!updated_at', '!maxCreatedDomains']
    },
    {
        role: "Member",
        resource: "users",
        action: "read:own",
        attributes: ['*', '!prevPwdHash', '!password', '!pwdExpireOn', '!changePwdOnNextLogin', '!suspended', '!created_at',
            '!updated_at', '!maxCreatedDomains']
    },

    // POST /register TODO Needed?
    {
        role: "Guest", resource: "users", action: "create:any",
        attributes: ['*', '!prevPwdHash', '!userID', '!pwdExpireOn', '!changePwdOnNextLogin', '!suspended', '!created_at',
            '!updated_at', '!maxCreatedDomains']
    },

    /*
     Domains
     */
    {
        role: "Member", resource: "domains", action: "create:own", attributes: ['*']
    },

    {role: "DomainAdmin", resource: "domains", action: "read:own", attributes: ['*']},
    {role: "DomainAdmin", resource: "domains", action: "update:own", attributes: ['*']},
    {role: "DomainAdmin", resource: "domains", action: "delete:own"},

    {role: ["SystemAdmin", "domainSuperAdmin"], resource: "domains", action: "create:any", attributes: ['*']},
    {role: ["SystemAdmin", "domainSuperAdmin"], resource: "domains", action: "read:any", attributes: ['*']},
    {role: ["SystemAdmin", "domainSuperAdmin"], resource: "domains", action: "update:any", attributes: ['*']},
    {role: ["SystemAdmin", "domainSuperAdmin"], resource: "domains", action: "delete:any"},

    /*
     Roles - can be managed by system admin or domainAdmin (for domain roles) only
     */
    {role: "SystemAdmin", resource: "roles", action: "create:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "SystemAdmin", resource: "roles", action: "read:any", attributes: ['*']},
    {role: "SystemAdmin", resource: "roles", action: "update:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "SystemAdmin", resource: "roles", action: "delete:any"},

    /*
     UserRoles
     */
    {
        role: ["SystemAdmin", "UserAdmin"],
        resource: "userRoles",
        action: "create:any",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {
        role: ["SystemAdmin", "UserAdmin"],
        resource: "userRoles",
        action: "read:any",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {
        role: ["SystemAdmin", "UserAdmin"],
        resource: "userRoles",
        action: "update:any",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {role: ["SystemAdmin", "UserAdmin"], resource: "userRoles", action: "delete:any"},

    /*
     DomainUsers
     */
    {
        role: "DomainUserAdmin",
        resource: "domains",
        action: "create:own",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {role: "DomainUserAdmin", resource: "domains", action: "read:own", attributes: ['*', '!created_at', '!updated_at']},
    {
        role: "DomainUserAdmin",
        resource: "domains",
        action: "update:own",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {role: "DomainUserAdmin", resource: "domains", action: "delete:own"},

    {role: "SystemAdmin", resource: "domains", action: "create:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "SystemAdmin", resource: "domains", action: "read:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "SystemAdmin", resource: "domains", action: "update:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "SystemAdmin", resource: "domains", action: "delete:any"},

    /*
     Log
     */
    {role: "SystemAdmin", resource: "log", action: "read:any", attributes: ['*']}
];

/*
 Initialization of access rules
 */
var _rules = void 0;

/*
 Called once, on first request, to replace access rules' role names into role IDs
 */
export function getRules(db: Knex): Promise<any>
{
    if (_rules)
        return Promise.resolve(_rules);

    return db.table('NAuth2_Roles')
        .then(roles =>
        {
            var roleIDs = {};
            _.forEach(roles, (rr) =>
            {
                roleIDs[rr.name] = rr.roleId;
            });
            _.forEach(ruleList, (it) =>
            {
                if (_.isArray(it.role))
                {
                    it.role = _.map(it.role, (rn: string) =>
                    {
                        let rid = roleIDs[rn];
                        if (rid)
                            return String(rid);
                        return rn;
                    });
                }
                else
                {
                    let rid = it.role as string;
                    if (rid)
                        it.role = String(roleIDs[rid]);
                }
            });
            _rules = new AccessControl(ruleList);
            return _rules;
        });
}

/*
 Mapping between feathers.js method names and CRUD operation names expected by accesscontrol
 */
export const methodMap = {
    'create': 'create',
    'find': 'read',
    'get': 'read',
    'remove': 'delete',
    'update': 'update',
    'patch': 'update'
};




