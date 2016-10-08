/**
 * Created by slanska on 2016-10-08.
 */

///<reference path="../../typings/knex/knex.d.ts"/>

var DB = require('../../lib/Consts');
var Knex = require("knex");

export function up(knex:Knex)
{
    "use strict";

    return knex.schema.createTable(DB.Tables.Domains,
        (tbl)=>
        {
            tbl.string(DB.Domains.DomainID).notNullable().primary();
            tbl.boolean(DB.Domains.Active).notNullable().defaultTo(true);
            tbl.string(DB.Domains.Name).notNullable().unique().index();
            tbl.string(DB.Domains.Description);
            tbl.string(DB.Domains.FavIconLink);
            tbl.string(DB.Domains.Title);
            tbl.timestamps();
            tbl.integer(DB.Domains.MaxPageCount).defaultTo(100 * 1024 / 8);
            tbl.string(DB.Domains.DBServer);
            tbl.string(DB.Domains.Description);
            tbl.enu(DB.Domains.UserCreateMode, []);
            tbl.string(DB.Domains.MembershipID);
            /*
             [Active] BOOLEAN DEFAULT 1,
             [Name] TEXT NOT NULL,
             [Domain] TEXT NOT NULL,
             [Description] TEXT,
             [FavIconLink] TEXT,
             [Title] TEXT,
             [ID] TEXT NOT NULL,
             [Created] DATETIME DEFAULT (julianday()),
             [MaxPageCount] INTEGER DEFAULT ((100 * 1024 / 8)),
             [DBServer] TEXT,
             [DBFileName] TEXT,
             [UserCreateMode] INTEGER DEFAULT 0,
             [MembershipID] TEXT NOT NULL CONSTRAINT [fkMembership_AppDomain] REFERENCES [Membership]([ID]) ON DELETE RESTRICT ON UPDATE RESTRICT,

             */
        })
        .then(()=>
        {
        })
        .then(()=>
        {
            return knex.schema.createTable(DB.Tables.Users,
                (tbl)=>
                {
                });

        })
        .then(()=>
        {
            return knex.schema.createTable(DB.Tables.Roles,
                (tbl)=>
                {
                });
        })
        .then(()=>
        {
            return knex.schema.createTable(DB.Tables.DomainUsers, (tbl)=>
            {
            });
        })
        .then(()=>
        {
            return knex.schema.createTable(DB.Tables.UserRoles, (tbl)=>
            {
            });
        })
        .then(()=>
        {
            return knex.schema.createTable(DB.Tables.Log, (tbl)=>
            {
            });
        })
        .then(()=>
        {
            return knex.schema.createTable(DB.Tables.Config, (tbl)=>
            {
            });
        });
}

export function down(knex:Knex)
{
    return Promise.all([
        knex.schema.dropTableIfExists(DB.Tables.Domains),
        knex.schema.dropTableIfExists(DB.Tables.Users),
        knex.schema.dropTableIfExists(DB.Tables.UserRoles),
        knex.schema.dropTableIfExists(DB.Tables.Roles),
        knex.schema.dropTableIfExists(DB.Tables.DomainUsers),
        knex.schema.dropTableIfExists(DB.Tables.Log),
        knex.schema.dropTableIfExists(DB.Tables.Config)
    ]);

}



