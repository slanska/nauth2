/**
 * Created by slanska on 2016-12-30.
 */

///<reference path="../typings/tsd.d.ts"/>

global.Promise = require('bluebird');
import assert = require('assert');
import mocha = require('mocha');
import * as Types from '../lib/Types';
var authentication = require('feathers-authentication/client');

import {TestHelper} from './helper';

describe('changePassword', () =>
{
    it('password has to be changed on next login', (done) =>
    {
        done();
    });

    it('password expired', (done) =>
    {
        done();
    });

    it('new and confirm password mismatch', (done) =>
    {
        done();
    });

    it('cannot reuse previous password', (done) =>
    {
        done();
    });

    it('new password too weak', (done) =>
    {
        done();
    });

    it('cannot change password by non authenticated client', (done) =>
    {
        done();
    });

    it('cannot change password with expired token', (done) =>
    {
        done();
    });

    it('after password change, user record should be updated', (done) =>
    {
        done();
    });
});