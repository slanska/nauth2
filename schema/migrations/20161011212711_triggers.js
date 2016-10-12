/*
 Initializes triggers
 */



exports.up = function (knex, Promise)
{
    if (knex.client.driverName === 'sqlite3')
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




};

exports.down = function (knex, Promise)
{

};
