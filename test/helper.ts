/**
 * Created by slanska on 2016-11-08.
 */

///<reference path="../typings/tsd.d.ts"/>

import * as Types from '../lib/Types';
import chai = require('chai');
import chaiHttp = require('chai-http');
import assert = require('assert');
import mocha = require('mocha');
const AppFactory = require('../appFactory');
var authentication = require('feathers-authentication/client');
import Faker = require('faker');
import feathers = require('feathers');
import config = require('../config/index');
import Promise = require('bluebird');
import knex = require('knex');

global.Promise = Promise;

// import Casper = require('casperjs');

chai.use(chaiHttp);

/*
 Test environment
 Provides access to:
 * config
 * app
 * request
 * faker and other test related modules

 Allows:
 * initialize new SQLite database

 Use:
 var env = new TestHelper();
 // it will load config
 // change config as needed
 env.start(done);
 */
export class TestService
{
    public config: Types.INAuth2Config;

    private _db: knex = void 0;
    public get db(): knex
    {
        if (!this._db)
        {
            this._db = knex(this.config.dbConfig);
        }
        return this._db;
    }

    constructor()
    {
        this.config = require('../config');
        this.config.debug = true;
    }

    public should = chai.should();

    public app: feathers.Application;
    public server;

    public start()
    {
        var self = this;
        return new Promise((resolve, reject) =>
        {
            self.app = AppFactory(self.config);
            self.server = self.app.listen(3030);
            self.server.once('listening', () =>
            {
                return resolve(self);
            });
        });
    }

    public get req()
    {
        return chai.request(this.app);
    }

    public get faker()
    {
        return Faker;
    }

    /*
     Returns promise which resolves to IUserRecord with user's fake data
     */
    createNewUser(): Promise<IUserRecord>
    {
        let self = this;
        return self.req.get(`/${self.config.basePath}/captcha`)
            .then(res =>
            {
                var captcha: Types.ICaptcha;
                captcha = res.body as Types.ICaptcha;
                var password = self.generatePassword();
                return {
                    email: self.faker.internet.userName() + '@mailinator.com',
                    password: password, confirmPassword: password,
                    extData: {_p: password},
                    captcha: {hash: captcha.hash, value: captcha.value}
                } as any;
            }) as any;
    }

    /*
     Performs user login by calling POST /auth/login
     Stores access token and refresh token for future use
     */
    loginUser(emailOrName: string)
    {
        let self = this;
        return self.req.post(`/${self.config.basePath}/login`);
    }

    private _userAccessToken = '';
    get userAccessToken()
    {
        return this._userAccessToken;
    }

    private _userRefreshToken = '';
    get userRefreshToken()
    {
        return this._userRefreshToken;
    }

    /*
     Generates password which conforms to default password rules
     */
    generatePassword()
    {
        return this.faker.internet.password(8, false, null, '@1zX');
    }

    /*
     Loads user admin (or admin if user admin does not exist)
     Returns promise which resolves to IUserRecord, with roles and domains
     */
    loadUserAdmin():Promise<IUserRecord>
    {
        let self = this;
        return self.loadAnyUserWithRole('UserAdmin')
            .then((user) =>
            {
                if (user)
                    return Promise.resolve(user);

                return self.loadAnyUserWithRole('SystemAdmin');
            });
    }

    /*
     Loads first found user who has given role assigned.
     Returns promise which resolves to IUserRecord, with roles and domains
     */
    loadAnyUserWithRole(roleName: string):Promise<IUserRecord>
    {
        let self = this;
        return self.db.select('*')
            .from('NAuth2_Users')
            .leftJoin('NAuth2_UserRoles', 'userId', 'userId')
            .leftJoin('NAuth_Roles', 'roleId', 'roleId')
            .where({roleName: roleName})
            .limit(1)
            .then((rows) =>
            {
                if (rows && rows.length > 0)
                    return rows[0];

                return void 0;
            }) as Promise<IUserRecord>;
    }
}






