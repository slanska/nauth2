/**
 * Created by slanska on 2016-10-09.
 */

///<reference path="testing.d.ts"/>

import assert = require('assert');
import mocha = require('mocha');
import * as Types from '../lib/Types';
var authentication = require('feathers-authentication/client');
import {MailinatorHelper} from './emailAutomated/mailinator';

import {TestService} from './helper';

/*
 Makes API call: POST /auth/register
 Returns promise
 */
export function registerUser(env: TestService, user)
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
 Handy shortcut to start server, create a new user and register him/her
 */
export function startServerAndCreateAndRegisterUser(env: TestService): Promise<IUserRecord>
{
    return env.start()
        .then(() => env.createNewUser())
        .then(user => registerUser(env, user));
}

/*

 */
export function selfConfirmUserRegistration(env: TestService, user: IUserRecord): Promise<IUserRecord>
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
{

}

/*
 Performs all steps to register user:
 * generate fake user data
 * get captcha
 * POST /auth/register
 * GET /auth/confirmRegister

 Returns promise to resolve as IUserRecord
 */
export function userRegisterAndConfirm(env: TestService): Promise<IUserRecord>
{
    env.config.userCreateMode = Types.UserCreateMode.SelfAndConfirm;
    return startServerAndCreateAndRegisterUser(env)
        .then(user => selfConfirmUserRegistration(env, user));
}

export function userSelfRegister(env: TestService): Promise<IUserRecord>
{
    env.config.userCreateMode = Types.UserCreateMode.SelfStart;
    return startServerAndCreateAndRegisterUser(env);
}

/*

 */
export function userRegistrationByAdmin(env: TestService)
{
    env.config.userCreateMode = Types.UserCreateMode.SelfAndApproveByAdmin;
    return startServerAndCreateAndRegisterUser(env);
}

/*
 * UserCreateMode: SelfStart
 */
describe('user register', () =>
{
    let env: TestService;

    beforeEach((done) =>
    {
        env = new TestService();
        env.config.userCreateMode = Types.UserCreateMode.SelfStart;
        done();
    });

    afterEach((done) =>
    {
        if (env && env.server)
            env.server.close();
        done();
    });

    it('register user: self and approve by admin', (done) =>
    {
        userRegistrationByAdmin(env)
            .then(() => done())
            .catch(err => done(err));
    });

    it('register user: self start', (done) =>
    {
        env.config.userCreateMode = Types.UserCreateMode.SelfStart;
        startServerAndCreateAndRegisterUser(env)
            .then(() => done())
            .catch(err => done(err));
    });

    it('cannot register because only admin can create new users', (done) =>
    {
        env.config.userCreateMode = Types.UserCreateMode.ByAdminOnly;
        startServerAndCreateAndRegisterUser(env)
            .then(() =>
            {
                assert.ifError(null);
                done();
            })
            .catch(err =>
            {
                assert.ifError(err);
                env.should.equal(err.message, 'Error');
                done(err);
            });
    });

    it('register user and confirm', (done) =>
    {
        let uu: IUserRecord;

        env.config.userCreateMode = Types.UserCreateMode.SelfAndConfirm;
        env.start()
            .then(() => env.createNewUser())
            .then(user =>
            {
                uu = user;
                return registerUser(env, user);
            })
            .then(() => new MailinatorHelper().checkPresenseOfItemInInbox(uu.email, 'Confirm your email', true))
            .then(() => done())
            .catch(err => done(err));
    });

    it('wrong captcha', (done) =>
    {
        env.start()
            .then((captcha) => env.createNewUser())
            .then((item:any) =>
            {
                item.captcha.value = item.captcha.value + 2;
                return registerUser(env, item);
            })
            .then(() => done())
            .catch(err => done(err));
    });

    it('weak password', (done) =>
    {
        env.config.userCreateMode = Types.UserCreateMode.SelfAndConfirm;
        env.start()
            .then(() => env.createNewUser())
            .then(user =>
            {
                user.password = user['confirmPassword'] = '1';
                return registerUser(env, user);
            })
            .then(() =>
            {
                assert.ifError(null);
                done();
            })
            .catch(err =>
            {
                assert.ifError(err);
                done(err);
            });
    });

    it('password and confirm password mismatch', (done) =>
    {
        env.config.userCreateMode = Types.UserCreateMode.SelfAndConfirm;
        env.start()
            .then(() =>
            {
                return env.createNewUser();
            })
            .then(user =>
            {
                user['confirmPassword'] = user.password + '1';
                return registerUser(env, user);
            })
            .then(() =>
            {
                assert.ifError(null);
                done();
            })
            .catch(err =>
            {
                assert.ifError(err);
                done(err);
            });
    });

    /*
     Creates new user (in self-start mode)
     Then tries to register another user with the same email
     */
    it('email already used', (done) =>
    {
        let user1: IUserRecord;
        let user2: IUserRecord;
        env.config.userCreateMode = Types.UserCreateMode.SelfStart;
        env.start()
            .then(() => userSelfRegister(env))
            .then((uu) =>
            {
                user1 = uu;
                return env.createNewUser();
            })
            .then((uu) =>
            {
                user2 = uu;
                user2.email = user1.email;
                return registerUser(env, user2);
            })
            .then(() =>
            {
                assert.ifError(null);
                done();
            })
            .catch(err =>
            {
                assert.ifError(err);
                done(err);
            });
    });

    it('user self-registered', (done) =>
    {
        userSelfRegister(env)
            .then(() => done())
            .catch(err => done(err));
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
        env.start()
            .then(() => env.loadUserAdmin())
            .then(() => done())
            .catch(err => done(err));
    });

});

