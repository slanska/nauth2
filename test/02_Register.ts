/**
 * Created by slanska on 2016-10-09.
 */

///<reference path="../typings/tsd.d.ts"/>

global.Promise = require('bluebird');
import assert = require('assert');
import mocha = require('mocha');
import * as Types from '../lib/Types';
var authentication = require('feathers-authentication/client');

import {TestHelper} from './helper';

function registerUser(env:TestHelper, user, done)
{
    return env.req
        .post('/auth/register')
        .send(user)
        .end(err=>
        {
            done(err);
        });
}

describe('register', () =>
{

    //teardown after tests
    after(done =>
    {
        done();

    });

    it('fails: wrong captcha', (done) =>
    {
        var env = new TestHelper();

        env.config.userCreateMode = Types.UserCreateMode.SelfAndConfirm;
        env.start()
            .then(()=>
            {
                return env.createNewUser();
            })
            .then(user=>
            {
                registerUser(env, user, done);
            })
            .catch(err=>
            {
                done(err);
            });
    });

    it('fails: weak password', (done) =>
    {
        // assert.ok(app.service('menus'));
        done();
    });

    it('fails: password and confirm password mismatch', (done) =>
    {
        // assert.ok(app.service('menus'));
        done();
    });

    it('fails: email already used', (done) =>
    {
        // assert.ok(app.service('menus'));
        done();
    });

    it('user self-registered', (done)=>
    {
        done();
    });

    it('100 users self-registered and confirmed', (done)=>
    {
        done();
    });

    it('user registered and pending approval', (done)=>
    {
        done();
    });

    it('user created by admin', (done)=>
    {
        done();
    });

});
