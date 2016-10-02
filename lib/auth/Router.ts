/**
 * Created by slanska on 2016-10-01.
 */

///<reference path="../../typings/tsd.d.ts"/>

import express = require('express');
import knex = require('knex');
import Nodemailer = require('nodemailer');
import NodemailerSmtpTransport = require('nodemailer-smtp-transport');
var HapiCatBox = require('catbox');
var HapiCatBoxMem = require('catbox-memory');
import Passport = require('passport');
import Promise = require('bluebird');
import {DBInit} from './DBInit';
import {Emailer} from './Emailer';
import {DBController} from './DBController';

/*
 Router:
 -  registers routes with handlers
 -  opens db connection
 -  calls db init if needed
 -  initializes passport middleware

 DBController
 -  all db related activities

 Emailer
 -  all email sending

 DBInit
 -  database initialization

 Captcha
 -  captcha support

 Const
 -  constant declaration

 Types
 -  typed interfaces for payload etc.

 */

module NAuth2
{



    export class Router
    {

        protected DBController:DBController;

        /*
         Generic handler for all http requests
         @param cb - function which takes request and should return a promise
         */
        private wrap(cb):express.RequestHandler
        {
            var fn = function (req, res, next)
            {
                // TODO log start
                cb(req, res).then((data)=>
                {
                    // TODO log end
                    res.json(data);
                }).catch(err=>
                {
                    // TODO log error
                    next(err, null);
                });
            };
            return fn;
        }

        constructor(protected cfg:INAuth2Config)
        {
            this.DBController = new DBController(this.cfg.dbConfig);
        }

        protected router:express.IRouter;

        use(app:express.Application)
        {
            var self = this;
            self.router = express.Router();
            self.router.post('/login', self.loginCallback);

            /*

             */
            self.router.post('/register', this.wrap(this.DBController.register));
            self.router.post('/forgotPassword', self.forgotPasswordCallback);
            self.router.post('/changePassword', self.forgotPasswordCallback);

            self.router.get('/users', self.getUserCallback);
            self.router.get('/user', self.getUserCallback);
            self.router.post('/user', self.saveUserCallback);
            self.router.put('/user', self.saveUserCallback);
            self.router.delete('/user', self.deleteUserCallback);

            self.router.get('/roles', self.getUserCallback);
            self.router.get('/role', self.getUserCallback);
            self.router.post('/role', self.getUserCallback);
            self.router.put('/role', self.getUserCallback);
            self.router.delete('/role', self.getUserCallback);

            self.router.get('/domains', self.getUserCallback);
            self.router.get('/domain', self.getUserCallback);
            self.router.post('/domain', self.getUserCallback);
            self.router.put('/domain', self.getUserCallback);
            self.router.delete('/domain', self.getUserCallback);

            self.router.get('/captcha', self.getUserCallback);
        }

        getEmailTemplate()
        {

        }

        sendEmail()
        {

        }

        initDatabase()
        {
            var self = this;
            knex(self.cfg.dbConfig);
        }
    }
}

export = NAuth2;