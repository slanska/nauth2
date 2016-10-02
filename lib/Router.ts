/**
 * Created by slanska on 2016-10-01.
 */

///<reference path="../typings/tsd.d.ts"/>

import express = require('express');
import knex = require('knex');
import Nodemailer = require('nodemailer');
import NodemailerSmtpTransport = require('nodemailer-smtp-transport');
var HapiCatBox = require('catbox');
var HapiCatBoxMem = require('catbox-memory');
// import Passport = require('passport');
import Promise = require('bluebird');
import {DBInit} from './DBInit';
import {Emailer} from './Emailer';
import {DBController} from './DBController';
import * as Types from './Types';

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

        constructor(protected cfg:Types.INAuth2Config)
        {
            this.DBController = new DBController(this.cfg.dbConfig);
        }

        protected router:express.IRouter;

        use(app:express.Application)
        {
            var self = this;
            self.router = express.Router();
            this.router.post('/login', this.wrap(this.DBController.login));

            /*

             */
            self.router.post('/register', this.wrap(this.DBController.register));
            self.router.post('/forgotPassword', this.wrap(this.DBController.forgotPassword));
            self.router.post('/changePassword', this.wrap(this.DBController.changePassword));

            self.router.get('/users', this.wrap(this.DBController.getUser));
            self.router.get('/user', this.wrap(this.DBController.getUser));
            self.router.post('/user', this.wrap(this.DBController.saveUser));
            self.router.put('/user', this.wrap(this.DBController.saveUser));
            self.router.delete('/user', this.wrap(this.DBController.deleteUser));

            self.router.get('/roles', this.wrap(this.DBController.getRole));
            self.router.get('/role', this.wrap(this.DBController.getRole));
            self.router.post('/role', this.wrap(this.DBController.saveRole));
            self.router.put('/role', this.wrap(this.DBController.saveRole));
            self.router.delete('/role', this.wrap(this.DBController.deleteRole));

            self.router.get('/domains', this.wrap(this.DBController.getDomain));
            self.router.get('/domain', this.wrap(this.DBController.getDomain));
            self.router.post('/domain', this.wrap(this.DBController.saveDomain));
            self.router.put('/domain', this.wrap(this.DBController.saveDomain));
            self.router.delete('/domain', this.wrap(this.DBController.deleteDomain));

            // TODO use captcha API
            // self.router.get('/captcha', self.getUserCallback);
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