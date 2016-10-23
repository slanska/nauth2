/**
 * Created by slanska on 2016-10-01.
 */

import Nodemailer = require('nodemailer');
import NodemailerSmtpTransport = require('nodemailer-smtp-transport');
import Promise = require('bluebird');
import {DBController} from './DBController';
import feathers = require("feathers");
var wildcardSubdomains = require('wildcard-subdomains');
import path = require('path');
import * as Types from "./Types";
import Emailer = require("./Emailer");
import authentication = require('feathers-authentication');
import Captcha = require('./Captcha');
import initRuntimeCfg = require('./middleware/initRuntimeConfig');

var config = require('./config');

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
class Router
{
    protected DBController:DBController;
    protected Emailer:Emailer;

    public AuthConfig:authentication.AuthConfig = {} as authentication.AuthConfig;

    constructor(protected app:feathers.Application, protected cfg:Types.INAuth2Config = {} as Types.INAuth2Config)
    {
        app.use(initRuntimeCfg(cfg));

        // this.AuthConfig.token = {expiresIn: '1d'} as any;
        this.AuthConfig.idField = 'userId';
        this.AuthConfig.userEndpoint = `/${cfg.basePath}/users`;
        app.configure(authentication(this.AuthConfig));

        app.use('/ui', feathers.static(path.join(__dirname, 'piblic')));

        this.cfg.basePath = this.cfg.basePath || '/auth';
        this.cfg.newMemberRoles = this.cfg.newMemberRoles || [];
        this.cfg.userCreateMode = this.cfg.userCreateMode || Types.UserCreateMode.ByAdminOnly;
        this.cfg.templatePath = this.cfg.templatePath || path.join(__dirname, '../templates');
        this.cfg.passwordRules = new RegExp(this.cfg.passwordRules as any || '(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$');
        this.cfg.companyName = this.cfg.companyName || 'YOUR_COMPANY_NAME';

        if (this.cfg.subDomains)
        {
            this.cfg.subDomains.namespace = this.cfg.subDomains.namespace || '_sub';
            // This will add new parameter to request - :subdomain
            this.app.use(wildcardSubdomains(cfg.subDomains));
        }

        // Register services
        this.DBController = new DBController(this.app, this.cfg, this.AuthConfig);
        this.Emailer = new Emailer(this.app, this.cfg);

        var captchaPath = `${this.cfg.basePath}/captcha`;
        Captcha.init(this.app, captchaPath, process.env.NODE_ENV || 'development');
    }
}

export = Router;