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

describe('rolesManagement', () =>
{
    it('create a new role', (done) =>
    {
        done();
    });

    it('delete non referenced role', (done) =>
    {
        done();
    });

    it('cannot delete system role', (done) =>
    {
        done();
    });

    it(`fetch all roles for the user, using user's own credentials`, (done) =>
    {
        done();
    });

    it(`fetch all roles, using admin's roles`, (done) =>
    {
        done();
    });

    it(`cannot fetch roles by non authorized user`, (done) =>
    {
        done();
    });

    it(`cannot fetch roles by non authenticated client`, (done) =>
    {
        done();
    });

    it('create domain specific role', (done) =>
    {
        done();
    });

    it('delete domain specific role', (done) =>
    {
        done();
    });
});