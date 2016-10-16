var fs = require('fs');

/*
 Initializes triggers
 Universal syntax for all supported RDBMs (SQLite, MySql/MariaDB, PostgreSQL)
  */
exports.up = function (knex, Promise)
{
    /*
     Generate triggers (and related stored procedures for PostgreSQL)
     The following triggers to be created
     on users/domain/roles/userroles/domainusers insert/update/delete -> update log

     */

    /*
    Triggers will handle:
    create domain by user:
     */

    var script = fs.readFileSync('./20161011212711_triggers.sqlite.sql', 'utf8');

    switch (knex.client.driverName)
    {
        case 'sqlite3':
        case 'mysql':
            
            break;

        case 'pg':
            break;
        default:
    }

    {
        //
        knex.runRaw('');
    }

    if (knex.client.driverName === 'pg')
    {
        //
    }

    if (knex.client.driverName === 'mysql')
    {
        //
    }

    return knex.schema;


};

exports.down = function (knex, Promise)
{

};
