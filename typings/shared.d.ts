/**
 * Created by slanska on 2016-12-13.
 */

/// <reference path="lodash/lodash.d.ts" />
/// <reference path="bluebird/bluebird-2.0.d.ts" />
/// <reference path="qs/qs.d.ts" />
/// <reference path="moment/moment.d.ts" />

/*

 */
interface IUserRecord
{
    userId: number;
    name: string;
    password: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    firstName?: string;
    lastName?: string;
    extData?: Object;

    /*
     A - Active
     P - Pending confirmation
     D - Deleted
     S - Suspended
     */
    status?: 'A'|'P'|'D'|'S';
    birthData?: Date;
    gender?: string;
    avatar?: string;
    culture?: string;
    maxCreatedDomains?: number;
    changePasswordOnNextLogin?: boolean;
    pwdSalt: string;
    // TODO TBC
}

/*
 Result of POST /auth/login
 */
interface ILoginResponse
{
    navigateTo: string;
    accessToken?: string;
    refreshToken?: string;
    userProfile?: IUserRecord
    message?: string;
    status?: number;
}





