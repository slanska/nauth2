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

/*

 */
class Controller implements Types.INAuth2Controller
{
    public DBController:DBController;
    public Emailer:Emailer;

    public Paths:{};

    public Services:{};

    public AuthConfig:authentication.AuthConfig = {} as authentication.AuthConfig;

    constructor(protected app:feathers.Application, public cfg:Types.INAuth2Config = {} as Types.INAuth2Config)
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
    }
}

export = (app:feathers.Application, cfg:Types.INAuth2Config)=>
{
    return function ()
    {
        return new Controller(app, cfg);
    }
};