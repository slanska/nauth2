* Database create
* Set default roles:
    System Admin
    System User Admin
    Can Create Domain
    Domain Admin
    Domain User Admin
    Can Invite
    Member
    Domain Member
    Guest
* use https://github.com/BryanDonovan/node-cache-manager for caching
* /register
    mustBe.notAuthenticated
* /login
    mustBe.notAuthenticated
* POST /user
    mustBe.userAdmin | systemAdmin | domainAdmin | domainUserAdmin
* PUT /user
* DEL /user
* GET /user
* /captcha

* User group: dot separated tag, which groups people together
for every group there is an user record created automatically

* Role has code: 'orders:browse'

Check for http://shiro.apache.org/permissions.html and 
https://www.npmjs.com/package/express-authorization permission authorization

Permissions:

actions: view,edit,delete,add
Example: 
'user:view,edit,delete,add,invite'
'user:edit,view,delete:1178'

User group:
'IT.Technicians'
'IT.Managers'
