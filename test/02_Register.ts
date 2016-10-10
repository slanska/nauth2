/**
 * Created by slanska on 2016-10-09.
 */

///<reference path="../typings/tsd.d.ts"/>

import chai = require('chai');
// import {should, expect} from 'chai';
import chaiHttp = require('chai-http');
import assert = require('assert');
import mocha = require('mocha');
import * as Types from '../lib/Types';
const app = require('../examples/feathers-app');
var authentication = require('feathers-authentication/client');

var token;

chai.use(chaiHttp);
var should = chai.should();

function req()
{
    return chai.request(app);
}

describe('menu service', () =>
{
    //setup
    before((done) =>
    {
        //start the server
        this.server = app.listen(3030);
        //once listening do the following
        this.server.once('listening', () =>
        {
            done();
            // //setup a request to get authentication token
            // chai.request(app)
            // //request to /auth/local
            //     .post('/auth/local')
            //     //set header
            //     .set('Accept', 'application/json')
            //     //send credentials
            //     .send({
            //         'username': 'resposadmin',
            //         'password': 'igzSwi7*Creif4V$'
            //     })
            //     //when finished
            //     .end((err, res) =>
            //     {
            //         //set token for auth in other requests
            //         token = res.body.token;
            //         done();
            //     });
        });

    });
});

//teardown after tests
after((done) =>
{
    //delete contents of menu in mongodb
    done();

});

it('fails: wrong captcha', (done) =>
{
    var captcha:Types.ICaptcha;
    req().get('/auth/captcha')
        .then(res=>
        {
            captcha = res.body as Types.ICaptcha;
            var result = req()
                .post('/auth/register')
                .send({
                    email: 'sss@fff.com',
                    password: '123Abcd!', confirmPassword: '123Abcd!',
                    captcha: {hash: captcha.hash, value: captcha.value}
                }).end((err, res)=>
                {
                    console.log(err);
                    done();
                });
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

/*
 TODO other cases:
 templates on different languages
 redirect
 */

it('should post the menuitem data', function (done)
{
    done();
    //setup a request
    // chai.request(app)
    // //request to /store
    //     .post('/menus')
    //     .set('Accept', 'application/json')
    //     .set('Authorization', 'Bearer '.concat(token))
    //     //attach data to request
    //     .send({
    //         name: 'shrimp fettuccine',
    //         price: 12.99,
    //         categories: 'dinner, pasta'
    //     })
    //     //when finished do the following
    //     .end((err, res) =>
    //     {
    //         res.body.should.have.property('name');
    //         res.body.name.should.equal('shrimp fettuccine');
    //         res.body.should.have.property('price');
    //         res.body.price.should.equal(12.99);
    //         res.body.categories.should.be.an('array')
    //             .to.include.members(['dinner, pasta']);
    //         done();
    //     });
});