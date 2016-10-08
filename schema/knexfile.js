// Update with your config settings.

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './data/nauth2.db'
        },
        pool: {
            min: 2,
            max: 10,
            afterCreate: ()=>
            {
            }
        }
    },

    staging: {
        client: 'postgresql',
        connection: {
            database: 'nauth2-stag',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'nauth2-prod',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};
