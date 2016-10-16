/**
 * Created by slanska on 2016-10-08.
 */

exports.up = function (knex, Promise)
{
    "use strict";

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

                tbl.json('extData').nullable();
                tbl.integer('userCreateMode').notNullable().defaultTo(0);
                tbl.integer('changePwdEveryDays').defaultTo(0);

                /*
                 Non listed domains are not discoverable, i.e. excluded from search results
                 */
                tbl.boolean('listed').defaultTo(true);

                tbl.timestamps();
            })
        .createTable('NAuth2_Users',
            function (tbl)
            {
                tbl.increments('userID');
                tbl.string('email').notNullable().unique();
                tbl.string('password').notNullable();
                tbl.string('prevPwdHash').nullable();
                tbl.date('pwdExpireOn').nullable();
                tbl.boolean('changePwdOnNextLogin').nullable();
                tbl.boolean('suspended').notNullable().defaultTo(false);
                tbl.string('nickName', 40).nullable().unique();
                tbl.string('firstName', 40).nullable();
                tbl.string('lastName', 40).nullable();
                tbl.date('birthDate').nullable();
                tbl.string('gender', 1).nullable();
                tbl.string('avatar', 200).nullable();
                tbl.json('extData').nullable();
                tbl.integer('maxCreatedDomains').defaultTo(0);
                tbl.timestamps();
            })
        .createTable('NAuth2_Roles',
            function (tbl)
            {
                tbl.increments('roleID');
                tbl.integer('domainID').nullable().references('domainId').inTable('NAuth2_Domains').index();
                tbl.string('name', 40).notNullable().unique();
                tbl.string('title', 64).notNullable();
                tbl.boolean('systemRole').notNullable().defaultTo(false);

                /*
                 TODO Confirm definition?
                 */
                tbl.boolean('domainSpecific').notNullable().defaultTo(false);
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
                    'addUserToDomain', 'removeUserFromFromDomain', 'userRegistered', 'userLoggedIn']).notNullable();
            })
        .then(function ()
        {
            // Init roles

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

        });
};

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