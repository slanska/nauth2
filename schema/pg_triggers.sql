create or replace function NAuth2_Log_append(op text, domainId int, userId int, roleId int)
returns void
as
 $$
 begin
    insert into NAuth2_Log (created_at, domainId, op, roleId, userId)
        values (current_timestamp, domainId, op, roleId, userId);
 end;
 $$
 language 'plpgsql';

/*
Users
*/
/*
Insert/Update
*/
 create or replace function NAuth2_Users_after_upsert_Log_append() returns trigger
 as
 $$
  declare op text = 'C'
 begin
    if (old.userId) then
        set text := 'U';
    end if;
    execute NAuth2_Log_append(op, null, new.userID, null);
    return new;
 end;
 $$
 language 'plpgsql';

 /*
 Delete
 */
 create or replace function NAuth2_Users_after_delete_Log_append() returns trigger
 as
 $$
 begin
    execute NAuth2_Log_append('D', null, old.userID, null);
    return old;
 end;
 $$
 language 'plpgsql';

create trigger NAuth2_Users_after_insert after insert on "NAuth2_Users" for each row
    execute procedure NAuth2_Users_after_upsert_Log_append();
create trigger NAuth2_Users_after_update after update on "NAuth2_Users" for each row
    execute procedure NAuth2_Users_after_upsert_Log_append();
create trigger NAuth2_Users_after_delete after delete on "NAuth2_Users" for each row
    execute procedure NAuth2_Users_after_delete_Log_append();

/*
Roles
*/
/*
Insert/Update
*/
create or replace function NAuth2_Roles_after_upsert_Log_append() returns trigger
 as
 $$
 begin
    execute NAuth2_Log_append('C', null, null, new.roleId);
    return new;
 end;
 $$
 language 'plpgsql';

/*
Delete
*/
create or replace function NAuth2_Roles_after_delete_Log_append() returns trigger
as
$$
begin
    execute NAuth2_Log_append('C', null, null, old.roleId);
    return old;
end;
$$
language 'plpgsql';

create trigger NAuth2_Roles_after_insert after insert on "NAuth2_Roles" for each row
    execute procedure NAuth2_Roles_after_upsert_Log_append();
create trigger NAuth2_Roles_after_update after update on "NAuth2_Roles" for each row
    execute procedure NAuth2_Roles_after_upsert_Log_append();
create trigger NAuth2_Roles_after_delete after delete on "NAuth2_Roles" for each row
    execute procedure NAuth2_Roles_after_delete_Log_append();

 /*
 Domains
 */
 /*
 Insert/Update
 */
 create or replace function NAuth2_Domains_after_upsert_Log_append() returns trigger
 as
 $$
 declare op text
 begin
    if (old.domainId)
        set text := 'U';
    else
        set text := 'C';
    end if;
    execute NAuth2_Log_append(op, new.domainId, null, null);
    return new;
 end;
 $$
 language 'plpgsql';

/*
 Delete
 */
 create or replace function NAuth2_Domains_after_delete_Log_append() returns trigger
 as
 $$
 begin
    execute NAuth2_Log_append('D', old.domainId, null, null);
    return new;
 end;
 $$
 language 'plpgsql';

