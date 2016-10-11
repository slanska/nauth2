/**
 * Created by slanska on 2016-10-09.
 */
"use strict";
var Emailer = require('../Emailer');
function sendEmail(app, cfg, templateName, emailField) {
    if (emailField === void 0) { emailField = 'email'; }
    var emailer = new Emailer(app, cfg);
    var result = function (p) {
        // TODO get list of users
        return emailer.send([], templateName, p);
    };
    return result;
}
module.exports = sendEmail;
//# sourceMappingURL=sendEmailToUser.js.map