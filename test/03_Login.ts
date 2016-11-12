/**
 * Created by slanska on 2016-11-08.
 */

///<reference path="../typings/tsd.d.ts"/>

import {TestHelper} from './helper';

function loadUsers(env:TestHelper)
{
    return env.req.get('/auth/users')
        .end(err, users=>
        {
        });
}

var adminPassword = 'admin';

function loginAsAdmin(env:TestHelper)
{
    return env.req.get('/auth/login').send({email: 'admin', password: adminPassword}).end(()=>
    {

    });
}

function changePassword(env:TestHelper, email:string, password:string, newPassword:string, confirmPassword:string)
{
    return env.req
        .post('/auth/changePassword')
        .send({
            email,
            password,
            newPassword,
            confirmPassword
        })
        .end;
}


describe('Login', ()=>
{
    it('admin first login', (done)=>
    {
        var env = new TestHelper();
        env.start()
            .then(()=>loginAsAdmin(env))
            .then(res=>
            {
                // Expected: need to change password
                adminPassword = env.generatePassword();
                return changePassword(env, 'admin', 'admin', adminPassword, adminPassword);
            })
            .then(done);
    });

    it('admin login', (done)=>
    {
        done();
    });

    it('random user login', (done)=>
    {
        // Generate few random users

        // Select random user from list

        // Login

        // Check access token and refresh token

        done();
    });

    it('wrong email or name', (done)=>
    {
        done();
    });

    it('wrong password', (done)=>
    {
        // Create user

        // Get certainly wrong password

        // Try to login

        done();
    });

    it('account suspended', (done)=>
    {
        // Create user

        // Mark as suspended

        // Try login

        done();
    });

    it('password needs to be changed', (done)=>
    {
        // Create user

        // Set 'change password'

        // Try to login

        // Check result - should be 'change password'

        done();
    });

    it('login by name', (done)=>
    {
        done();
    });

    it('token expired', (done)=>
    {
        done();
    });

    it('use token after server restart', (done)=>
    {
        done();
    });

    it('refresh token required', (done)=>
    {
        // Create user

        // Login

        // set config for short token expiry time (2 seconds)

        // Wait

        // Ask for data

        // Get new access token


        done();
    });


});