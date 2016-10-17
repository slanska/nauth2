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

 create or replace function NAuth2_Users_after_insert_Log_append() returns trigger
 as
 $$
 begin
    execute NAuth2_Log_append('C', null, new.userID, null);
    return new;
 end;
 $$
 language 'plpgsql';

 create or replace function NAuth2_Roles_after_insert_Log_append() returns trigger
 as
 $$
 begin
    execute NAuth2_Log_append('C', null, null, new.roleId);
    return new;
 end;
 $$
 language 'plpgsql';

 create or replace function NAuth2_Domains_after_insert_Log_append() returns trigger
 as
 $$
 begin
    execute NAuth2_Log_append('C', new.domainId, null, null);
    return new;
 end;
 $$
 language 'plpgsql';

 create trigger NAuth2_Users_after_insert after insert on "NAuth2_Users" for each row
    execute procedure NAuth2_Users_after_insert_Log_append();