/**
 * Created by slanska on 2016-11-08.
 */

// /<reference path="../typings/tsd.d.ts"/>
// /<reference path="../typings/casperjs/casperjs.d.ts"/>

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

// import Casper = require('casperjs');

chai.use(chaiHttp);

/*
 Test environment
 Provides access to config, app, request, faker and other test related modules

 Use:
 var env = new TestHelper();
 // it will load config
 // change config as needed
 env.start(done);
 */
export class TestHelper
{
    public config:Types.INAuth2Config;

    // public casper = Casper.create();

    constructor()
    {
        this.config = require('../config');
        this.config.debug = true;
    }

    public should = chai.should();

    public app:feathers.Application;
    public server;

    public start()
    {
        return new Promise((resolve, reject)=>
        {
            this.app = AppFactory(this.config);
            this.server = this.app.listen(3030);
            this.server.once('listening', () =>
            {
                return resolve();
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

    createNewUser():Promise<any>
    {
        var self = this;
        return self.req.get('/auth/captcha')
            .then(res=>
            {
                var captcha:Types.ICaptcha;
                captcha = res.body as Types.ICaptcha;
                var password = self.generatePassword();
                return {
                    email: self.faker.internet.userName() + '@mailinator.com',
                    password: password, confirmPassword: password,
                    extData: {_p: password},
                    captcha: {hash: captcha.hash, value: captcha.value}
                };
            }) as Promise<any>;
    }

    generatePassword()
    {
        return this.faker.internet.password(8, false, null, '@1zX');
    }
}






