### What are Domains?

In Nauth2, **domain** define a specific generic context,
with its own users, permissions, REST end points and other properties.

In practical scenarios domains can be used for:

 * User groups or teams. Every user may be a member of many user groups,
 having different roles and permission in each group
 * User accounts. In real life it is practical to separate user entity from
 their account entity, as one user may have multiple accounts and the same
 account may be shared between few users (for example, family members)
 * Stores, locations, departments. Big corporations or institutions
 have complex structure, often organized in hierarchy. Examples: chain stores,
 region/city/location for car rental company, or municipality/school for school board

### Features of domains

* Domain has unique name, which may include alphanumeric, underscore and dash characters.
  Here are examples of valid domain names: 'johndoeblog', 'dept1122', 'school-14',
  'west_end_store'. Case is ignored. so 'johndoeblog' and 'JohnDoeBlog' are treated the same
* Domains support hierarchy, i.e. domains may have child- or sub-domains
* Child domains are separated by dot (.), parent domains on left.
Example: 'province.city.store'
* Domains can be of different predefined types (for example, a database, may
have separate types for 'Social User Groups', 'User Accounts', 'Resellers', 'Stores' etc.)
* Domains have their own dedicated REST end-points. If subdomain URLs are
allowed in configuration, domain context will be accessible via:
**subdomain1.yourwebsite.com**
* Domain end-point is the same as its name, by default. If reverse url flag is
set, domain's end point gets reverted, i.e. country.region.city will be accessible
 as city.region.country.mywebsite.com

### Domain authentication and authorization

### Access rules defined at parent level are applied to all child levels


