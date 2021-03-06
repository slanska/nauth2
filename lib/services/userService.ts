/**
 * Created by slanska on 2017-01-12.
 */

import {BaseDBService} from "./basicDBService";
import * as NAuth2 from "../DBController";

export class UserService extends BaseDBService
{
    constructor(DBController: NAuth2.DBController)
    {
        super(DBController, {name: 'NAuth2_Users', id: 'userId'})
    }
}