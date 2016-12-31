## nauth2
**Node.js server library for handling authentication and authorization in multi-tenant, multi-domain environment**
  
## Status: early development  
  
### What its name stands for?
  
Node.js + Authentication + Authorization -> N+Auth+Auth -> NAuth2

### What does it do?
NAuth2 is a library, not a framework. It runs as a package on top of Express.js/feathers.js
application or service and needs to be activated (see example below). 
It implements set of REST API for full stack of user management.
It provides simple, basic and flexible options for configuring different aspects
of user management. It is designed to be extendable in mind, 
and at the same time, to provide all its features out of box with minimum efforts.

### Features

* Library to be used in [feathers.js](https://github.com/feathersjs/feathers)-based 
applications as a middleware for general purpose user management
* Light alternative to [Stormpath](https://stormpath.com), [Forgerock](https://www.forgerock.com)
or [Loopback Authorization](http://loopback.io/doc/en/lb2/Authentication-authorization-and-permissions.html)   
* REST API for user registration, login, forgot password, change password and other typical 
tasks related to user management
* Stores all user information in a relational database (PostgreSQL, MySQL/MariaDB, Sqlite3, Oracle), 
hosted by you (uses [Knex](http://knexjs.org) for database access)
* Email notification for registration completion, forgotten passwords etc. 
(uses [nodemailer](https://nodemailer.com) for email sending), using customizable HTML templates
* Implements concept of domains. Every user can be associated with number of
domains and have separately defined rules for accessing them (see details [here](#domains)). 
* Captcha support (generate image and code to be used on client)
* Written in TypeScript

### Install and configuration

```
npm install nauth2 --save
```




### Token management
NAuth2 uses JWT (JavaScript Tokens) for authentication. Result of login is token
that should be kept on client side and passed with every call. 

### Domains explained

NAuth2 introduces concept of **domains**, areas that need to be controlled individually for every user.
Domains can be applications in multi-tenant environment, or geographical locations (stores/branches)
in a large corporation/chain store. Using domains is optional. 
Though NAuth2 does not have specific requirements for domain internal processing, it is normally
expected that domain is specified in REST URL, like _website.address/**domain**_ 
or _**domain**.website.address_. Domain determines context of request being processed. 
A user may have different roles assigned depending on domain. NAuth2 provides 
concise way to deal with multi-domain model. 

### How to use

``` javascript
var express = require('express');
app = express();

var nauth2 = require('nauth2');

var cfg = {
    /*
    Connection string for auth database.
    Check Knex documentation for details.
    By default: sqlite3 database
    */
    dbConnection:
    {
    client: 'sqlite3',
    file: ''
    },
    
    /*
    If true, NAuth2 will register Express middleware function to process domain as a part of
    all coming requests. This middleware will add domain info to the request
    (request.Domain)
    Example of url in multiDomains mode:
    example.com/domainA/auth/login
    */
    multiDomains: false,
    
    /*
    Router base path. 
    Used as a base path for other API calls
    By default: '/auth'
    Example of login call: example.com/auth/login
    */
    path: '/auth',
    
    /*
    Configuration used for sending email.
    Check nodemailer documentation for details
    */
     emailConfig:
     {},
     
     /*
     if true, NAuth2 will check if database is initialized with necessary tables
     and if not, it will first create all tables and set initial data
     */
     autoInitDatabase: true,
     
     /*
     If true, existing users can invite new prospective users by entering their email address
     */
     inviteEnabled: false,
     
     /*
     Determines how new users proceed with registration
     Values:
     'confirmByEmail' - user starts registration, and then completes it 
     by clicking on link in the received email
     'auto' - user gets registered immediately once /register request is handled
     'confirmByAdmin' - user admin will receive notification email about
     new user pending confirmation, and once link in the email clicked, user's
     registration will be completed and he/she will receive confirmation email
     'byAdmin' - new users can be created by user admin only. Admin will enter some user
     information (email address is bare minimum), and then invitation email will be sent to the 
     prospective user
     
     By default: 'confirmByEmail'
     */
     registrationMode: 'confirmByEmail', 'auto', 'confirmByAdmin', 'byAdmin',
     
     /*
     Roles assigned to the newly registered user
     */
     defaultRoles: [],
     
     /*
     Cache configuration. Refer to hapi.js Catbox for details.
     By default, it is a memory cache
     */
     cacheConfig: {},
     
     /*
     Path to where email templates are placed
     */
     templatePath: ''
};
var router = new nauth2.Router(cfg);
router.use(app);

```

### API

All REST API use base **path** passed to the router.
 
#### POST /register 
Payload with user information. Response: confirmation
Email get sent to complete registration.

#### POST /login

#### /forgotPassword
Will send email with temporary link to reset his/her password

#### POST /changePassword

#### GET /users?query

query has:
offset
limit
where clause
order by


#### GET /user/:userID

#### PUT /user/:userID

Updates user information

#### DEL /user/:userID

#### POST /user

Adds a new user

#### GET /captcha

#### GET /roles

#### POST /role

#### PUT /role/:roleID

#### DEL /role/:roleID

#### POST /fakedata

### User Registration

Following user registration mode are supported:
* Auto (same as By Admin Only) - only admin or user admin can create a new user. User will be immediately activated. This is default mode.
* Self confirm. Guests can register themselves. New user account is in pending state until user activated it by clicking link in confirmation email
* Self and approve. Guests can register, but they have to be approved by admin or user admin (who will receive notification email with link to proceed)
* Self and start. Guests can register and become active users immediately, no confirmation via email is required.

### Email templates

NAuth2 uses [ECT.js](http://ectjs.com) template engine to generate emails. 
Here is the list of templates needed for 
different stages of flow:
* Confirm email
* Registration completed
* Password reset requested
* Password changed
* Invitation
* Password will expire in N days

### Internals. Database structure
NAuth2 stores user data in the relational database. The following tables
are used:


#### NAuth2_Domains
#### NAuth2_Users
#### NAuth2_Roles
#### NAuth2_DomainUsers
#### NAuth2_UserRoles
#### NAuth2_Log
#### NAuth2_RefreshTokens

### Internals. Caching
For the sake of performance NAuth2 keeps most frequently used information in the cache.
This includes domains, roles, currently active users (with their tokens etc.)
For caching NAuth2 uses [hapi catbox](https://github.com/hapijs/catbox) and by
default keeps cached data in memory. In more advanced scenarios distributed cache
may need to be deployed (for example, Redis or Aerospike)

### Developer mode
When running in developer mode NAuth2 enables feature to generate fake users,
for load tests

### Dependencies

Many thanks to the wonderful tools and libraries used in this project:
feathers.js
Express.js
lodash
knex
nodemailer
ect.js
Framework7
vue.js
mocha & chai
captchapng
accesscontrol
jsonwebtoken
object-hash
bcryptjs
wildcard-subdomains
webix
pureCSS

### License

Most of project is MIT licensed.
Stuff under **/public** is GPL licensed (due to licensing policy of [Webix](www.webix.com) library)