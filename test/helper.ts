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
// var chaiAsPromised = require("chai-as-promised");
// var chaiThings = require('chai-things');

global.Promise = Promise;

chai.should();
// chai.use(chaiThings);
// chai.use(chaiAsPromised);
chai.use(chaiHttp);

/*
 Promise oriented helper routines
 */
export function expectReject(promise: Promise<any>, done: Function, expectedError?: string)
{
    promise
        .then(() => done(new Error(`Expected to fail: ${expectedError}`)))
        .catch(err =>
        {
            if (expectedError !== void 0 && err.message !== expectedError)
                return done(err);

            if (!expectedError)
                console.warn(`Rejected with error: ${err.message}`);

            return done();
        });
}

export function expectOK(promise: Promise<any>, done: Function)
{
    promise
        .then(() => done())
        .catch(err => done(err));
}


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

    public start(userCreateMode?: Types.UserCreateMode)
    {
        let self = this;

        if (userCreateMode)
            self.config.userCreateMode = userCreateMode;

        return new Promise((resolve) =>
        {
            self.app = AppFactory(self.config);
            self._req = void 0;
            self.server = self.app.listen(3030);
            self.server.once('listening', () =>
            {
                return resolve(self);
            });
        });
    }

    private _req = void 0;
    public get req()
    {
        if (!this._req)
            this._req = chai.request(this.app);
        return this._req;
    }

    public get faker()
    {
        return Faker;
    }

    generateCaptcha(): Promise<Types.ICaptcha>
    {
        let self = this;
        return self.req.get(`${self.config.basePath}captcha`)
            .then(res => res.body as Types.ICaptcha) as any;
    }

    /*
     Returns promise which resolves to IUserRecord with user's fake data
     */
    createNewUser(): Promise<IUserRecord>
    {
        let self = this;
        return self.generateCaptcha()
            .then(captcha =>
            {
                let password = self.generatePassword();
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
        return self.req.post(`${self.config.basePath}login`);
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
    loadUserAdmin(): Promise<IUserRecord>
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
    loadAnyUserWithRole(roleName: string): Promise<IUserRecord>
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

