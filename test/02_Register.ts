/**
 * Created by slanska on 2016-10-09.
 */

///<reference path="testing.d.ts"/>

import assert = require('assert');
import mocha = require('mocha');
import * as Types from '../lib/Types';
var authentication = require('feathers-authentication/client');
import {MailinatorHelper} from './emailAutomated/mailinator';

import {TestHelper} from './helper';

/*
 Makes API call: POST /auth/register
 Returns promise
 */
export function registerUser(env: TestHelper, user)
{
    return new Promise((resolve, reject) =>
    {
        return env.req
            .post('/auth/register')
            .send(user)
            .end(err =>
            {
                if (err)
                    return reject(err);
                return resolve(user);
            });
    }) as Promise<IUserRecord>;
}

/*

 */
export function selfConfirmUserRegistration(env: TestHelper, user: IUserRecord): Promise<IUserRecord>
{
    return new Promise((resolve, reject) =>
    {
        const url = ``;
        return env.req
            .get('/auth/confirmRegister')
            .send(user)
            .end(err =>
            {
                if (err)
                    return reject(err);
                return resolve(user);
            });
    }) as Promise<IUserRecord>;
}

/*

 */
export function adminConfirmUserRegistration()
{}

/*
 Performs all steps to register user:
 * generate fake user data
 * get captcha
 * POST /auth/register
 * GET /auth/confirmRegister

 Returns promise to resolve as IUserRecord
 */
export function selfUserRegistration(env: TestHelper): Promise<IUserRecord>
{
    return env.createNewUser()
        .then(user => registerUser(env, user))
        .then(user => selfConfirmUserRegistration(env, user));
}

/*

 */
export function userRegistrationByAdmin(env: TestHelper)
{

}

describe('register', () =>
{
    //tear down after tests
    after(done =>
    {
        done();

    });

    var env: TestHelper;

    beforeEach((done) =>
    {
        env = new TestHelper();
        done();
    });

    afterEach((done) =>
    {
        if (env && env.server)
            env.server.close();
        done();
    });

    it('success', (done) =>
    {
        var uu: IUserRecord;

        env.config.userCreateMode = Types.UserCreateMode.SelfAndConfirm;
        env.start()
            .then(() =>
            {
                return env.createNewUser();
            })
            .then(user =>
            {
                uu = user;
                return registerUser(env, user);
            })
            .then(() =>
            {
                return new MailinatorHelper().processConfirmEmail(uu.email);
            })
            .then(() =>
            {
                done();
            })
            .catch(err =>
            {
                done(err);
            });
    });

    it('fails: wrong captcha', (done) =>
    {
        done();
    });

    it('fails: weak password', (done) =>
    {
        done();
    });

    it('fails: password and confirm password mismatch', (done) =>
    {
        done();
    });

    it('fails: email already used', (done) =>
    {
        done();
    });

    it('user self-registered', (done) =>
    {
        done();
    });

    it('100 users self-registered and confirmed', (done) =>
    {
        done();
    });

    it('user registered and pending approval', (done) =>
    {
        done();
    });

    it('user created by admin', (done) =>
    {
        done();
    });

});
