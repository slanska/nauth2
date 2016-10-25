/*
Roles
*/
create trigger if not exists NAuth2_Roles_After_Insert after insert on NAuth2_Roles
/*REFERENCING NEW ROW AS new*/
for each row
begin
    insert into NAuth2_Log (roleId, op) values (new.roleId, 'Role:C');
end;

create trigger if not exists NAuth2_Roles_After_Update after update  on NAuth2_Roles
/*REFERENCING NEW ROW AS new*/
/*REFERENCING OLD ROW AS old*/
for each row
begin
    update NAuth2_Roles set updated_at = '/*now*/' where roleId = new.roleId;
    insert into NAuth2_Log (roleId, op) values (new.roleId, 'Role:U');
end;

create trigger if not exists NAuth2_Roles_After_Delete after delete on NAuth2_Roles
/*REFERENCING OLD ROW AS old*/
for each row
begin
    insert into NAuth2_Log (roleId, op) values (old.roleId, 'Role:D');
end;

/*
Users
*/
create trigger if not exists NAuth2_Users_After_Insert after insert on NAuth2_Users
/*REFERENCING NEW ROW AS new*/
for each row
begin
    insert into NAuth2_Log (userId, op) values (new.userId, 'User:C');
end;

create trigger if not exists NAuth2_Users_After_Insert_Name after insert on NAuth2_Users
/*REFERENCING NEW ROW AS new*/
for each row
when new.userName is not null
begin
    insert into NAuth2_UserNames (userId, userName) values (new.userId, new.userName);
end;

create trigger if not exists NAuth2_Users_After_Update after update on NAuth2_Users
/*REFERENCING NEW ROW AS new*/
/*REFERENCING OLD ROW AS old*/
for each row
begin
    update NAuth2_Users set updated_at = '/*now*/' where userId = new.userId;
    insert into NAuth2_Log (userId, op) values (new.userId, 'User:U');
end;

create trigger if not exists NAuth2_Users_After_Update_Name after update of userName on NAuth2_Users
/*REFERENCING NEW ROW AS new*/
/*REFERENCING OLD ROW AS old*/
for each row
when new.userName is not null or old.userName is not null
begin
    delete from NAuth2_UserNames where userId = old.userId;
    insert into NAuth2_UserNames (userId, userName) values (new.userId, new.userName);
end;

create trigger if not exists NAuth2_Users_After_Delete after delete on NAuth2_Users
/*REFERENCING OLD ROW AS old*/
for each row
begin
    insert into NAuth2_Log (userId, op) values (old.userId, 'User:D');
end;

/*
Domains
*/
create trigger if not exists NAuth2_Domains_After_Insert after insert on NAuth2_Domains
/*REFERENCING NEW ROW AS new*/
for each row
begin
    insert into NAuth2_Log (domainId, op) values (new.domainId, 'Domain:C');
end;

create trigger if not exists NAuth2_Domains_After_Update after update on NAuth2_Domains
/*REFERENCING NEW ROW AS new*/
/*REFERENCING OLD ROW AS old*/
for each row
begin
    update NAuth2_Domains set updated_at = '/*now*/' where domainId = new.domainId;
    insert into NAuth2_Log (domainId, op) values (new.domainId, 'Domain:U');
end;

create trigger if not exists NAuth2_Domains_After_Delete after delete on NAuth2_Domains
/*REFERENCING OLD ROW AS old*/
for each row
begin
    insert into NAuth2_Log (domainId, op) values (old.domainId, 'Domain:D');
end;

/*
UserRoles
*/
create trigger if not exists NAuth2_UserRoles_After_Insert after insert on NAuth2_UserRoles
/*REFERENCING NEW ROW AS new*/
for each row
begin
    insert into NAuth2_Log (roleId, userId, op) values (new.roleId, new.userId, 'UserRole:C');
end;

create trigger if not exists NAuth2_UserRoles_After_Delete after delete on NAuth2_UserRoles
/*REFERENCING OLD ROW AS old*/
for each row
begin
    insert into NAuth2_Log (roleId, userId, op) values (old.roleId, old.userId, 'UserRole:D');
end;

/*
DomainUsers
*/
create trigger if not exists NAuth2_DomainUsers_After_Insert after insert on NAuth2_DomainUsers
/*REFERENCING NEW ROW AS new*/
for each row
begin
    insert into NAuth2_Log (domainId, userId, op) values (new.domainId, new.userId, 'DomainUser:C');
end;

create trigger if not exists NAuth2_DomainUsers_After_Delete after delete on NAuth2_DomainUsers
/*REFERENCING OLD ROW AS old*/
for each row
begin
    insert into NAuth2_Log (domainId, userId, op) values (old.domainId, old.userId, 'DomainUser:D');
end;


