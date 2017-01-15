/**
 * Created by slanska on 2017-01-15.
 */

import {BaseDBService} from "./basicDBService";
import * as NAuth2 from "../DBController";

export class RoleService extends BaseDBService
{
    constructor(DBController: NAuth2.DBController)
    {
        super(DBController, {name: 'NAuth2_Roles', id: 'roleId'});
    }
}