### Embedded website for basic auth functions, user management and domain management

Implements responsive UI design, which adapts to device screen dimension.
Auto detects OS it runs on, for iOS and Safari based browsers uses ios skin,
otherwise uses material design.

Uses the following libraries:
* [Framework7](www.framework7.io) - for UI, web site and mobile friendly
* [Vue.js](vuejs.org) - for custom re-usable components and data binding
* [lodash](lodash.com) - general purpose utilities
* [Feathers JS Client](feathersjs.com) - to communicate with feathers JS backend

Packs sources into few bundles, via webpack.

#### Pages
* layout.html - master page with all dependencies and general page layout. Used
* index.html - entry point for login/register etc.
* admin.html - user and role management

#### Scripts
* userController - implements login, register, password reset, password change, 
other user invitation, user profile edit. Handles login to a specific domain.
* adminController - site and user admin dashboard
* domainController - to manage domains
* profileController - user profile controller. Shared between userController and
adminController (to view/edit users)
* app - shared module. Initializes Framework7+Vue.js app