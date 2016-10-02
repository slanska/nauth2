## nauth2
**Node.js server library for handling authentication and authorization in multi-tenant, multi-domain environment**
  
## Status: early development  
  
### What its name stands for?
  
Node.js AUTHentication/AUTHorization (double 'auth')

### What does it do?
NAuth2 is a library, not a framework. It runs as a package on top of Express.js
application or service and needs to be activated (see example below). 
It implements set of REST API for full stack of user management.
It provides simple, basic and flexible options for configuring different aspects
of user management. It is designed to be extendable in mind, 
and at the same time, to provide all its features out of box with minimum efforts.

### Features

* Library to be used in Express.js applications as a middleware for general purpose user management
* Light alternative to [Stormpath](https://stormpath.com), [Forgerock](https://www.forgerock.com)
or [Loopback](https://loopback.io)
* Uses [Passport](http://passportjs.org/) for  
* REST API for user registration, login, forgot password, change password and other typical 
tasks related to user management
* Stores all user information in a relational database (PostgreSQL, MySQL/MariaDB, Sqlite3, Oracle), 
hosted by you (uses [Knex](http://knexjs.org) for database access)
* Email notification for registration completion, forgotten passwords etc. 
(uses [nodemailer](https://nodemailer.com) for email sending)
* Implements concept of domains. Every user can be associated with number of
domains and have separately defined rules for accesing them. 
* Captcha support (generate image and code to be used on client)
* Written in TypeScript

### Token management
NAuth2 uses JWT (JavaScript Tokens) for authentication. Result of login is token
that should be kept on client side and passed with every call. 

### Domains explained

NAuth2 introduces concept of **domains**, areas that need to be controlled individually for every user.
Domains can be applications, or features, or geographical locations. Though NAuth2
does not have specific requirements for domain internal processing, it is normally
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

### Email templates

NAuth2 uses templates to generate emails. Here is the list of templates needed for 
different stages of flow:
* Complete registration
* Registration done
* Forgot password
* Password changed
* Invitation
* Password will expire

### Internals. Database structure
NAuth2 stores user data in the relational database. The following tables
are used:


#### NAuth2_Domains
#### NAuth2_Users
#### NAuth2_Roles
#### NAuth2_DomainUsers
#### NAuth2_UserRoles
#### NAuth2_Log
#### NAuth2_Config

### Internals. Caching
For the sake of performance NAuth2 keeps most frequently used information in the cache.
This includes domains, roles, currently active users (with their tokens etc.)
For caching NAuth2 uses [hapi catbox](https://github.com/hapijs/catbox) and by
default keeps cached data in memory. In more advanced scenarios distributed cache
may need to be deployed (for example, Redis or Aerospike)

### Developer mode
When running in developer mode NAuth2 enables feature to generate fake users,
for load tests
