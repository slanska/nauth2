/**
 * Created by slanska on 2016-10-09.
 */

///<reference path="../typings/tsd.d.ts"/>

import assert = require('assert');
import mocha = require('mocha');
import * as Types from '../lib/Types';
var authentication = require('feathers-authentication/client');
var ZombieBrowser = require('zombie');
ZombieBrowser.waitDuration = '60s';

import {TestHelper} from './helper';

function registerUser(env: TestHelper, user, done)
{
    return env.req
        .post('/auth/register')
        .send(user)
        .end(err =>
        {
            done(err);
        });
}

describe('register', () =>
{
    var browser = new ZombieBrowser({
        debug: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
    });

    //teardown after tests
    after(done =>
    {
        done();

    });

    it('success', (done) =>
    {
        var env = new TestHelper();
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
                registerUser(env, user, done);
            })
            .then(() =>
            {
                // Start verifying confirm email
                return new Promise((resolve, reject) =>
                {
                    browser.visit('https://www.mailinator.com', () =>
                    {
                        return resolve();
                    });
                });
            })
            .then(() =>
            {
                return new Promise((resolve, reject) =>
                {
                    browser.fill('#inboxfield', uu.email);
                    browser.once('loaded', (document) =>
                    {
                        browser.wait(() =>
                        {
                            return resolve();
                        });
                    });

                    browser.pressButton('Go!', (err) =>
                    {
                        if (err)
                        {
                            console.error(err);
                            return reject(err);
                        }

                        console.log('Go handled');
                    });
                });
            })
            .then(() =>
            {
                return new Promise((resolve, reject) =>
                {
                    console.log(browser.url);
                    let node = browser.querySelectorAll('div > .outermail')[0].parentNode; //.attributes.onclick.nodeValue
                    browser.once('loaded', () =>
                    {
                        browser.wait(() =>
                        {
                            return resolve();
                        });
                    });
                    return browser.click(node, (err) =>
                    {
                        if (err)
                        {
                            console.error(err);
                            return reject(err);
                        }
                        console.log('email selected');
                    });
                });
            })
            .then(() =>
            {
                console.log(browser.url);
                return new Promise((resolve, reject) =>
                {
                    browser.click('Confirm Email Address', (err) =>
                    {
                        if (err)
                            return reject(err);
                        return resolve();
                    });
                });
            })
            .then((result) =>
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
        return;

        // var env = new TestHelper();
        //
        // env.config.userCreateMode = Types.UserCreateMode.SelfAndConfirm;
        // env.start()
        //     .then(() =>
        //     {
        //         return env.createNewUser();
        //     })
        //     .then(user =>
        //     {
        //         registerUser(env, user, done);
        //     })
        //     .catch(err =>
        //     {
        //         done(err);
        //     });
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
