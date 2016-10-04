/**
 * Created by slanska on 2016-10-02.
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var NAuth2;
    (function (NAuth2) {
        var Tables;
        (function (Tables) {
            Tables.Domains = 'NAuth2_Domains';
            Tables.Users = 'NAuth2_Users';
            Tables.DomainUsers = 'NAuth2_DomainUsers';
            Tables.Roles = 'NAuth2_Roles';
            Tables.UserRoles = 'NAuth2_UserRoles';
            Tables.Log = 'NAuth2_Log';
            Tables.Config = 'NAuth2_Config';
        })(Tables = NAuth2.Tables || (NAuth2.Tables = {}));
        var Users;
        (function (Users) {
            Users.Email = 'email';
            Users.Salt = 'salt';
        })(Users = NAuth2.Users || (NAuth2.Users = {}));
        var Domains;
        (function (Domains) {
            Domains.DomainID = 'DomainID';
            Domains.Active = 'Active';
            Domains.Name = 'Name';
            Domains.Domain = 'Domain';
            Domains.Description = 'Description';
            Domains.FavIconLink = 'FavIconLink';
            Domains.Title = 'Title';
            Domains.Created = 'Created';
            Domains.MaxPageCount = 'MaxPageAccount';
            Domains.DBServer = 'DBServer';
            Domains.DBFileName = 'DBFileName';
            Domains.UserCreateMode = 'UserCreateNode';
            Domains.MembershipID = 'MembershipID';
        })(Domains = NAuth2.Domains || (NAuth2.Domains = {}));
    })(NAuth2 || (NAuth2 = {}));
    return NAuth2;
});
//# sourceMappingURL=Consts.js.map