/**
 * Created by slanska on 2016-10-16.
 */

import * as Types from '../Types';
import hooks = require("feathers-hooks");
import errors = require('feathers-errors');
var AccessControl = require('accesscontrol');

var ruleList = [
    /*
     Users tables
     */
    {
        role: ["systemAdmin", "systemUserAdmin"],
        resource: "users",
        action: "create:any",
        attributes: ['*', '!password', '!prevPwd']
    },
    {
        role: ["systemAdmin", "systemUserAdmin"],
        resource: "users",
        action: "read:any",
        attributes: ['*', '!password', '!prevPwd']
    },
    {
        role: ["systemAdmin", "systemUserAdmin"],
        resource: "users",
        action: "update:any",
        attributes: ['*', '!created_at']
    },
    {role: ["systemAdmin", "systemUserAdmin"], resource: "users", action: "delete:any"},

    // create and delete are not allowed
    {
        role: "member", resource: "users", action: "update:own",
        attributes: ['*', '!prevPwd', '!userID', '!pwdExpireOn', '!changePwdOnNextLogin', '!suspended', '!created_at',
            '!updated_at', '!maxCreatedDomains']
    },
    {
        role: "member",
        resource: "users",
        action: "read:own",
        attributes: ['*', '!prevPwd', '!password', '!pwdExpireOn', '!changePwdOnNextLogin', '!suspended', '!created_at',
            '!updated_at', '!maxCreatedDomains']
    },

    // POST /register
    {
        role: "guest", resource: "users", action: "create:own",
        attributes: ['*', '!prevPwd', '!userID', '!pwdExpireOn', '!changePwdOnNextLogin', '!suspended', '!created_at',
            '!updated_at', '!maxCreatedDomains']
    },

    /*
     Domains
     */
    {
        role: "member", resource: "domains", action: "create:own", attributes: ['*']
    },

    {role: "domainAdmin", resource: "domains", action: "read:own", attributes: ['*']},
    {role: "domainAdmin", resource: "domains", action: "update:own", attributes: ['*']},
    {role: "domainAdmin", resource: "domains", action: "delete:own"},

    {role: ["systemAdmin", "domainSuperAdmin"], resource: "domains", action: "create:any", attributes: ['*']},
    {role: ["systemAdmin", "domainSuperAdmin"], resource: "domains", action: "read:any", attributes: ['*']},
    {role: ["systemAdmin", "domainSuperAdmin"], resource: "domains", action: "update:any", attributes: ['*']},
    {role: ["systemAdmin", "domainSuperAdmin"], resource: "domains", action: "delete:any"},

    /*
     Roles - can be managed by system admin or domainAdmin (for domain roles) only
     */
    {role: "systemAdmin", resource: "roles", action: "create:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "systemAdmin", resource: "roles", action: "read:any", attributes: ['*']},
    {role: "systemAdmin", resource: "roles", action: "update:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "systemAdmin", resource: "roles", action: "delete:any"},

    /*
     UserRoles
     */
    {
        role: ["systemAdmin", "systemUserAdmin"],
        resource: "userRoles",
        action: "create:any",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {
        role: ["systemAdmin", "systemUserAdmin"],
        resource: "userRoles",
        action: "read:any",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {
        role: ["systemAdmin", "systemUserAdmin"],
        resource: "userRoles",
        action: "update:any",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {role: ["systemAdmin", "systemUserAdmin"], resource: "userRoles", action: "delete:any"},

    /*
     DomainUsers
     */
    {
        role: "domainUserAdmin",
        resource: "domains",
        action: "create:own",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {role: "domainUserAdmin", resource: "domains", action: "read:own", attributes: ['*', '!created_at', '!updated_at']},
    {
        role: "domainUserAdmin",
        resource: "domains",
        action: "update:own",
        attributes: ['*', '!created_at', '!updated_at']
    },
    {role: "domainUserAdmin", resource: "domains", action: "delete:own"},

    {role: "systemAdmin", resource: "domains", action: "create:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "systemAdmin", resource: "domains", action: "read:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "systemAdmin", resource: "domains", action: "update:any", attributes: ['*', '!created_at', '!updated_at']},
    {role: "systemAdmin", resource: "domains", action: "delete:any"},

    /*
     Log
     */
    {role: "systemAdmin", resource: "log", action: "read:any", attributes: ['*']}
];

/*
 Initialization of access rules
 */
const rules = new AccessControl(ruleList);

/*
 Mapping between feathers.js method names and CRUD operation names expected by accesscontrol
 */
const methodMap = {
    'create': 'create',
    'find': 'read',
    'get': 'read',
    'remove': 'delete',
    'update': 'update',
    'patch': 'update'
};

/*
 BEFORE hook that authorizes request.
 @param (string) resourceName - name of REST resource (users, roles etc.)
 @param (string) ownAttribute
 */
function authorize(resourceName:string, ownAttribute:string)
{
    var result = function (p:hooks.HookParams)
    {
        var action = methodMap[p.method];

        if (!action)
            throw new errors.NotImplemented(`${p.method} is not supported by authorization hook`);

        var permission = rules.permission({
            role: p.params.token.roles,
            resource: resourceName,
            action: action + ':any'
        });
        if (!permission.granted && ownAttribute)
        {
            if (p.params['context'] && p.params['context'].hasOwnProperty(ownAttribute) && p.params['context'][ownAttribute])
            {
                permission = rules.permission({
                    role: p.params.token.roles,
                    resource: resourceName,
                    action: action + ':own'
                });
                if (!permission.granted)
                {
                    throw new errors.MethodNotAllowed('Not authorized');
                }
            }

            throw new errors.MethodNotAllowed('Not authorized');
        }
    };

    return result;
}

export = authorize;
