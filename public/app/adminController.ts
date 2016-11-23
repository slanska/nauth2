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

import {ProfileController} from './profileController';
import {DomainController} from './domainController';

export class AdminController
{
    private profileController = new ProfileController();
    private domainController = new DomainController();
}
