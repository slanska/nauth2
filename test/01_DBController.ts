/**
 * Created by slanska on 2016-10-04.
 */

///<reference path="testing.d.ts"/>

import assert = require('assert');
import mocha = require('mocha');
import * as Types from '../lib/Types';
var authentication = require('feathers-authentication/client');
import {TestService} from './helper';

/*
 Tests directly on database (no http server involved).
 Uses local SQLite database
 */

describe('DB access', () =>
{
    it('load user admin using cache', (done) =>
    {
    });

    it('load system admin using cache', (done) =>
    {
    });
});