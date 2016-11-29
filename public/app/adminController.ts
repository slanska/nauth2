/**
 * Created by slanska on 2016-10-29.
 */

/*
 Admin activities
 - user list
 - user profile
 - roles
 - domains
 - domain edit (uses domainController)
 - log

 - create domain
 */

/*
 TODO
 Collapsible sidebar (when shown)
 Back button
 / - menu: [Logoff]
 /admin - menu: [Logoff], * [Domains] - if domains are enabled
 login
 resetPassword
 register (list of controls driven by field names in config)
 Left View -> menu icon, App Title
 Main View -> < Back, Page Title
 if not mobile - show footer with company name, application name
 use icons for sidebar items
 */

import {ProfileController} from './profileController';
import {DomainController} from './domainController';
import _ = require('lodash');
import {initApp} from './app';

export class AdminController
{
    private profileController = new ProfileController();
    private domainController = new DomainController();
}

var adminController = new AdminController();
var app = initApp({}, {});

