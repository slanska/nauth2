/**
 * Created by slanska on 2016-10-08.
 */

exports.up = function (knex, Promise)
{
    "use strict";

    console.log('up');

    return knex.schema
        .createTable('NAuth2_Domains',
            function (tbl)
            {
                console.log('Domains');
                tbl.increments('domainId');
                tbl.boolean('active').notNullable().defaultTo(true);
                tbl.string('name', 64).notNullable().unique();
                tbl.string('description', 200).nullable();
                tbl.string('favIconLink', 200).nullable();
                tbl.string('title', 64).nullable();
                tbl.string('path', 64).notNullable().unique();
                tbl.json('extData').nullable();
                tbl.integer('userCreateMode').notNullable().defaultTo(0);
                tbl.integer('changePwdEveryDays').defaultTo(0);

                tbl.timestamps();
            })
        .createTable('NAuth2_Users',
            function (tbl)
            {
                tbl.increments('userID');
                tbl.string('email').notNullable().unique();
                tbl.string('pwdHash').notNullable();
                tbl.string('pwdSalt').notNullable();
                tbl.string('prevPwdHash').nullable();
                tbl.date('pwdExpireOn').nullable();
                tbl.boolean('changePwdOnNextLogin').nullable();
                tbl.boolean('suspended').notNullable().defaultTo(false);
                tbl.string('nickName', 40).nullable();
                tbl.string('firstName', 40).nullable();
                tbl.string('lastName', 40).nullable();
                tbl.date('birthDate').nullable();
                tbl.string('gender', 1).nullable();
                tbl.string('avatar', 200).nullable();
                tbl.json('extData').nullable();
                tbl.timestamps();
            })
        .createTable('NAuth2_Roles',
            function (tbl)
            {
                tbl.increments('roleID');
                tbl.integer('domainID').nullable().references('domainId').inTable('NAuth2_Domains').index();
                tbl.string('name', 40).notNullable().unique();
                tbl.string('title', 64).notNullable();
                tbl.boolean('systemRole').defaultTo(false);
                tbl.timestamps();
            })
        .createTable('NAuth2_DomainUsers',
            function (tbl)
            {
                tbl.integer('domainId').notNullable().references('domainId').inTable('NAuth2_Domains');
                tbl.integer('userId').notNullable().references('userId').inTable('NAuth2_Users').index();
                tbl.timestamps();
                tbl.primary(['domainId', 'userId'])
            })
        .createTable('NAuth2_UserRoles',
            function (tbl)
            {
                tbl.integer('userId').notNullable().references('userId').inTable('NAuth2_Users');
                tbl.integer('roleId').notNullable().references('roleId').inTable('NAuth2_Roles').index();
                tbl.timestamps();
                tbl.primary(['userId', 'roleId']);
            })
        .createTable('NAuth2_Log',
            function (tbl)
            {
                tbl.bigIncrements('logID');
                var col = tbl.dateTime('created_at').notNullable();
                if (knex.client === 'sqlite')
                    col.defaultTo(knex.raw("date('now')"));
                else if (knex.client === 'postgres')
                    col.defaultTo(knex.raw('now()'));
                tbl.binary('clientIpAddr', 6).nullable();
                tbl.integer('userId').nullable().references('userId').inTable('NAuth2_Users');
                tbl.integer('roleId').nullable().references('roleId').inTable('NAuth2_Roles');
                tbl.integer('domainId').nullable().references('domainId').inTable('NAuth2_Domains');
                tbl.enu('op', ['createUser', 'updateUser', 'removeUser', 'createRole', 'updateRole', 'removeRole',
                    'grantRole', 'revokeRole', 'createDomain', 'updateDomain', 'removeDomain',
                    'addUserToDomain', 'removeUserFromFromDomain','userRegistered', 'userLoggedIn']).notNullable();
            });

// .then(function ()
// {
//     // Init roles
//
//     return knex['NAuth2_Roles'].insert([
//         {},
//         {}
//     ]);
// });
}
;

exports.down = function (knex, Promise)
{
    console.log('down');

    return knex.schema
        .dropTableIfExists('NAuth2_UserRoles')
        .dropTableIfExists('NAuth2_DomainUsers')
        .dropTableIfExists('NAuth2_Domains')
        .dropTableIfExists('NAuth2_Users')
        .dropTableIfExists('NAuth2_Roles')
        .dropTableIfExists('NAuth2_Log');
};