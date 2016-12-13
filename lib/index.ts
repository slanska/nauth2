/**
 * Created by slanska on 2016-10-04.
 */

import Types = require("./Types");
import Nodemailer = require('nodemailer');
import NodemailerSmtpTransport = require('nodemailer-smtp-transport');
import Promise = require('bluebird');
import {DBController} from './DBController';
import feathers = require("feathers");
var wildcardSubdomains = require('wildcard-subdomains');
import path = require('path');
import Emailer = require("./Emailer");
import authentication = require('feathers-authentication');
import Captcha = require('./Captcha');
import initRuntimeCfg = require('./middleware/initRuntimeConfig');
import _ = require('lodash');

// Services
import {ChangePasswordService} from './services/changePasswordService';
import {LoginService} from './services/loginService';

/*
 index:
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
 -  typed interfaces for payloads etc.

 */

/*

 */
class Controller implements Types.INAuth2Controller
{
    public DBController: DBController;
    public Emailer: Emailer;

    public AuthConfig: authentication.AuthConfig = {} as authentication.AuthConfig;

    constructor(protected app: feathers.Application, public cfg: Types.INAuth2Config = {} as Types.INAuth2Config)
    {
        app.use(initRuntimeCfg(this));

        app.configure(authentication(this.AuthConfig));

        app.use('/ui', feathers.static(path.join(__dirname, 'public')));

        if (this.cfg.subDomains)
        {
            this.app.use(wildcardSubdomains(cfg.subDomains));
        }

        // Register services
        this.DBController = new DBController(this.app, this.cfg, this.AuthConfig);
        this.Emailer = new Emailer(this.app, this.cfg);

        var captchaPath = `${this.cfg.basePath}/captcha`;
        Captcha.init(this.app, captchaPath, this.cfg.debug);

        this.initRoutes();
    }

    public initRoutes()
    {
        /*
         POST /changePassword
         Payload:
         @param password - current password
         @param newPassword  - new password
         @param confirmPassword - confirm new password (should be the same as 'newPassword')
         'token' - could be either:
         @param token - could be either:
         a) regular accessToken
         b) special 'change_password' token (valid for change password only)
         */
        this.app.use(`${this.cfg.basePath}/changePassword`, new ChangePasswordService(this.DBController));

        // register

        // login
        this.app.use(`${this.cfg.basePath}/login`, new LoginService(this.DBController));

        // logout
        // resetPassword
        // invite
        // mergeDomains
        // splitDomains
        // renewToken

        // revokeToken

    }
}

export = (app: feathers.Application, cfg: Types.INAuth2Config) =>
{
    return function ()
    {
        return new Controller(app, cfg);
    }
};