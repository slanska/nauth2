/**
 * Created by slanska on 2016-10-02.
 */

module NAuth2
{
    export module Tables
    {
        export const Domains = 'NAuth2_Domains';
        export const Users = 'NAuth2_Users';
        export const DomainUsers = 'NAuth2_DomainUsers';
        export const Roles = 'NAuth2_Roles';
        export const UserRoles = 'NAuth2_UserRoles';
        export const Log = 'NAuth2_Log';
        export const Config = 'NAuth2_Config';

    }

    export module Users
    {
        export const Email = 'email';
        export const Salt = 'salt';

    }

    export module Domains
    {
        export const DomainID = 'DomainID';
        
    }


}

export = NAuth2;