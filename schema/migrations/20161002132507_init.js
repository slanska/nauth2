var DB = require('../../lib/Consts');

function createDatabase(knex)
{
    "use strict";

    return knex.schema.createTable(DB.Tables.Domains,
        (tbl)=>
        {
            tbl.string(DB.Domains.DomainID).notNullable();
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


exports.up = function (knex, Promise)
{
    return createDatabase(knex);
};

exports.down = function (knex, Promise)
{

};
