/**
 * Created by slanska on 2016-10-16.
 */

/*
 Creates nauth2 tables, indexes, triggers.
 Populates initial data
 */

import Types = require('../lib/Types');
import Knex = require('knex');
import path = require('path');
import fs = require('fs');
import Promise = require('bluebird');
import authentication = require('feathers-authentication');
import hooks = require('feathers-hooks');
import feathers = require('feathers');

var env = process.env.NODE_ENV || 'development';
import config = require('../config/index');

import initRuntimeConfig = require('../lib/middleware/initRuntimeConfig');

var dummyController = {} as Types.INAuth2Controller;
dummyController.cfg = config;
dummyController.AuthConfig = {} as authentication.AuthConfig;
initRuntimeConfig(dummyController);

var dummyApp = feathers();
dummyApp.configure(hooks());
dummyApp.configure(authentication(dummyController.AuthConfig));

var knex = Knex(config.dbConfig);

/*
 Runs multi-statement script
 */

/*
 Since Knex does natively support executing SQL-agnostic multi-statement raw script, here is the solution
 */

type ScriptRunner = (db, script:string, callback:Function)=>void;

var scriptRunners:{[clientName:string]:ScriptRunner} = {
    'sqlite3': (db, script:string, callback:Function)=>
    {
        db.exec(script, callback);
    },
    'pg': (db, script:string, callback:Function)=>
    {
        db.query(script, callback);
    },
    'mysql': (db, script:string, callback:Function)=>
    {
        db.query(script, callback);
    }
};

function runSqlScript(script:string)
{
    return new Promise((resolve, reject)=>
    {
        knex.client.pool.acquire((error, db)=>
        {
            scriptRunners[config.dbConfig.client](db, script, (err, result)=>
            {
                if (err)
                    reject(err);
                resolve(knex.client.pool.release(db));
            });
        });
    });
}

/*
 Initializes SQLite specific database for better performance
 */
function preinitDB(knex:Knex):Promise<any>
{
    if (config.dbConfig.client === 'sqlite3')
    {
        console.info('Database configuration');

        return runSqlScript(`PRAGMA page_size = 8192;
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = 1;
            PRAGMA encoding = 'UTF-8';
            PRAGMA synchronous = NORMAL;
            PRAGMA recursive_triggers = 1;`);
    }
    return Promise.resolve(knex);
}

/*
 SQL expressions to get current UTC timestamp
 */
const utc_ts =
{

    'sqlite3': 'julianday()',
    'mysql': 'UTC_TIMESTAMP()',
    'pg': "now() at time zone 'UTC'"
};

function addJsonColumn(tbl:Knex.TableBuilder, columnName:string)
{
    switch (config.dbConfig.client)
    {
        case 'sqlite3':
            tbl.specificType(columnName, 'json1').nullable();
            break;

        case 'pg':
            tbl.jsonb(columnName).nullable();
            break;

        default:
            tbl.json(columnName).nullable();
            break;
    }
}

const json_cols =
{
    "sqlite3": "json1",
    "mysql": "json",
    "pg": "jsonb"
};

function addCreatedAt(tbl:Knex.TableBuilder)
{
    tbl.specificType(`created_at`, `datetime default (${utc_ts[config.dbConfig.client]})`);
}

function addTimestamps(tbl:Knex.TableBuilder)
{
    addCreatedAt(tbl);
    tbl.dateTime(`updated_at`).nullable();
}

function createTables(knex:Knex)
{
    return knex.schema
        .createTable('NAuth2_Domains',
            function (tbl)
            {
                tbl.increments('domainId');
                tbl.boolean('active').notNullable().defaultTo(true);

                /*
                 Hierarchical domain name, with optional multiple segments separated by dot.
                 Segment may have the following characters: '0'-'9', 'A'-'Z', '_', '-'
                 and start from alphanumeric character. Segment name is case insensitive, ie.
                 MyDomain == MYDOMAIN == mydomain
                 e.g. 'country.state.city'
                 Segments define hierarchy and scope, i.e.
                 */
                tbl.string('name', 64).notNullable().unique();

                tbl.boolean('reversePath');

                /*
                 If reversePath == true, path will be stored as reversed name.
                 E.g. for name 'canada.on.toronto' path would be set as 'toronto.on.canada'
                 */
                tbl.string('path', 64).notNullable().unique();

                tbl.string('description', 200).nullable();
                tbl.string('favIconLink', 200).nullable();
                tbl.string('title', 64).nullable();

                addJsonColumn(tbl, 'extData');
                tbl.integer('userCreateMode').notNullable().defaultTo(0);
                tbl.integer('changePwdEveryDays').defaultTo(0);

                /*
                 Non listed domains are not discoverable, i.e. excluded from search results
                 */
                tbl.boolean('listed').defaultTo(true);

                // TODO Needed?
                tbl.string('afterConfirmEmailEndpoint').nullable();
                tbl.string('changePasswordEndpoint').nullable();
                tbl.string('userProfileEndpoint').nullable();

                tbl.string('homeEndpoint').nullable();

                /*
                 Status of domain:
                 'A' - active
                 'P' - pending
                 'R' - removed (inactive)
                 'S' - suspended
                 */
                tbl.string('status').notNullable().defaultTo('A');

                addTimestamps(tbl);

                console.info('Domains table initialization');

            })
        .createTable('NAuth2_Users',
            function (tbl)
            {
                tbl.increments('userId');
                tbl.string('email').notNullable().unique();
                tbl.string('password').notNullable();
                tbl.string('prevPwdHash').nullable();
                tbl.date('pwdExpireOn').nullable();

                /*
                 Current status of user
                 Possible values:
                 'P' - pending approval or confirmation
                 'A' - active
                 'S' - suspended
                 'R' - removed (deactivated)
                 */
                tbl.string('status').notNullable().defaultTo('P');
                tbl.string('userName', 40).nullable().unique();
                tbl.string('firstName', 40).nullable();
                tbl.string('lastName', 40).nullable();
                tbl.date('birthDate').nullable();
                tbl.string('gender', 1).nullable();
                tbl.string('avatar', 200).nullable();
                tbl.string('culture', 10).nullable().defaultTo('en');
                addJsonColumn(tbl, 'extData');
                tbl.integer('maxCreatedDomains').defaultTo(0);
                tbl.boolean('changePasswordOnNextLogin').defaultTo(false);
                addTimestamps(tbl);

                console.info('Users table initialization');
            })
        .createTable('NAuth2_UserNames', function (tbl)
        {
            tbl.string('userName', 40).notNullable().primary();
            tbl.integer('userId').notNullable().unique()
                .references('userId').inTable('NAuth2_Users').onDelete('cascade').onUpdate('cascade');
        })
        .createTable('NAuth2_Roles',
            function (tbl)
            {
                tbl.increments('roleId');
                tbl.integer('domainID').nullable().references('domainId').inTable('NAuth2_Domains').index();
                tbl.string('name', 40).notNullable().unique();
                tbl.string('title', 64).notNullable();
                tbl.boolean('systemRole').notNullable().defaultTo(false);

                /*
                 TODO Confirm definition?
                 */
                tbl.boolean('domainSpecific').notNullable().defaultTo(false);
                addTimestamps(tbl);

                console.info('Roles table initialization');
            })
        .createTable('NAuth2_DomainUsers',
            function (tbl)
            {
                tbl.integer('domainId').notNullable().references('domainId').inTable('NAuth2_Domains');
                tbl.integer('userId').notNullable().references('userId').inTable('NAuth2_Users').index();
                addJsonColumn(tbl, 'extData');
                addTimestamps(tbl);
                tbl.primary(['domainId', 'userId']);

                console.info('DomainUsers table initialization');
            })
        .createTable('NAuth2_UserRoles',
            function (tbl)
            {
                tbl.integer('userId').notNullable().references('userId').inTable('NAuth2_Users');
                tbl.integer('roleId').notNullable().references('roleId').inTable('NAuth2_Roles').index();
                addTimestamps(tbl);
                tbl.primary(['userId', 'roleId']);

                console.info('UserRoles table initialization');
            })
        .createTable('NAuth2_Log',
            function (tbl)
            {
                tbl.bigIncrements('logID');

                addCreatedAt(tbl);
                tbl.binary('clientIpAddr').nullable();
                tbl.integer('userId').nullable().references('userId').inTable('NAuth2_Users');
                tbl.integer('roleId').nullable().references('roleId').inTable('NAuth2_Roles');
                tbl.integer('domainId').nullable().references('domainId').inTable('NAuth2_Domains');
                addJsonColumn(tbl, 'extData');

                /*
                 Standard operations. ':C' stands for create, ':U' - for update, ':D' - for delete
                 */
                tbl.enu('op', ['User:C', 'User:U', 'User:D', 'Role:C', 'Role:U', 'Role:D',
                    'UserRole:C', 'UserRole:D', 'Domain:C', 'Domain:U', 'Domain:D',
                    'DomainUser:C', 'DomainUser:D', 'register', 'login']).notNullable();

                console.info('Log table initialization');
            });
}

/*

 */
function createTriggers(knex:Knex)
{
    if (['pg', 'sqlite3', 'mysql'].indexOf(config.dbConfig.client) < 0)
        throw new Error(`Triggers generation is not support for ${config.dbConfig.client} database`);

    console.info('Creating triggers');
    var scriptPath = path.join(__dirname, `${config.dbConfig.client === 'pg' ? 'pg' : 'sqlite&mysql'}_triggers.sql`);
    var sql = fs.readFileSync(scriptPath, 'utf8');

    if (config.dbConfig.client === 'mysql')
    {
        // Handling MySQL/MariaDB specific syntax
        sql = sql.replace('/*REFERENCING NEW ROW AS new*/', 'REFERENCING NEW ROW AS new');
        sql = sql.replace('/*REFERENCING OLD ROW AS old*/', 'REFERENCING OLD ROW AS old');
    }
    sql = sql.replace("'/*now*/'", utc_ts[config.dbConfig.client]);

    return runSqlScript(sql);
}

function initData(knex:Knex)
{
    console.info('Initializing data');
    return knex.insert([
        /*
         Can do everything on the database: create/remove domains/users/roles, grant/revoke any roles etc.
         */
        {name: 'SystemAdmin', title: 'System Admin', systemRole: true, domainSpecific: false},

        /*
         Can create/remove users, grant/revoke roles, assign roles (except system roles). CANNOT manage domains/domain users and domain roles
         */
        {name: 'UserAdmin', title: 'User Admin', systemRole: true, domainSpecific: false},

        /*
         Can create/remove domains, grant/revoke domain roles, assign users to domains
         */
        {name: 'DomainSuperAdmin', title: 'Domain Super Admin', systemRole: true, domainSpecific: false},

        /*
         Can delete domain, manage users and roles within domain
         */
        {name: 'DomainAdmin', title: 'Domain Admin', systemRole: true, domainSpecific: true},

        /*
         Can manage users and roles within domain
         */
        {name: 'DomainUserAdmin', title: 'Domain User Admin', systemRole: true, domainSpecific: true}
    ]).into('NAuth2_Roles');
}

function insertAdmin(knex:Knex)
{
    var pp = {} as hooks.HookParams;
    pp.type = 'before';
    pp.app = dummyApp;
    pp.data = {password: 'admin'};

    var adminId;
    var roleId;

    var hashed = authentication.hooks.hashPassword()(pp);
    return hashed
        .then(()=>
        {
            return knex.insert([{
                email: '@',
                changePasswordOnNextLogin: true,
                userName: 'admin',
                password: pp.data.password
            }]).into('NAuth2_Users');
        }).then(d =>
        {
            return knex.select('userId').from('NAuth2_Users').where({userName: 'admin'});
        })
        .then(users=>
        {
            adminId = users[0].userId;
            return knex.select('roleId').from('NAuth2_Roles').where({
                name: 'SystemAdmin'
            });
        }).then((roles)=>
        {
            roleId = roles[0].roleId;
            return knex.insert([
                {
                    userId: adminId,
                    roleId: roleId
                }]).into('NAuth2_UserRoles');
        });
}

preinitDB(knex)
    .then(()=>
    {
        return createTables(knex);
    })
    .then(()=>
    {
        return createTriggers(knex);
    })
    .then(()=>
    {
        return initData(knex);
    })
    .then(()=>
    {
        return insertAdmin(knex);
    })
    .then(()=>
    {
        console.info('Done!');
        return knex.destroy();
    })
    .catch(err=>
    {
        knex.destroy();
        console.error(`${err}. Rolling back`);
        return Promise.all([
            knex.schema.dropTableIfExists('NAuth2_UserRoles'),
            knex.schema.dropTableIfExists('NAuth2_DomainUsers'),
            knex.schema.dropTableIfExists('NAuth2_Domains'),
            knex.schema.dropTableIfExists('NAuth2_UserNames'),
            knex.schema.dropTableIfExists('NAuth2_Users'),
            knex.schema.dropTableIfExists('NAuth2_Roles'),
            knex.schema.dropTableIfExists('NAuth2_Log')
        ]);
    })
    .finally(()=>
    {
        knex.destroy();
    });