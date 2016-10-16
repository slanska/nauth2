// Update with your config settings.

var path = require('path');

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, '../data/nauth2.db')
        },
        pool: {
            min: 2,
            max: 10
        }
    },

    dev_mariadb: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'nauth2',
            password: 'nauth2',
            database: 'nauth2'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    dev_postgres: {
        client: 'pg',
        connection: {
            host: '127.0.0.1',
            port: 5432,
            user: 'nauth2',
            password: 'nauth2',
            database: 'nauth2'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
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


