/**
 * Created by slanska on 2016-12-13.
 */


/*
 Result of POST /auth/login
 */
declare interface ILoginResponse
{
    navigateTo: string;
    accessToken?: string;
    refreshToken?: string;
    userProfile?: any; // TODO Types.IUserRecord
    message?: string;
}