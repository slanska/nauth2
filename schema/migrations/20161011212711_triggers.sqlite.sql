create trigger if not exists NAuth2_Roles after insert on NAuth2_Roles for each row
begin
    insert into NAuth2_Log () values ();
    update NAuth2_Roles set created_at =  where roleId = new.roleId;
end;

create trigger if not exists NAuth2_Users after insert on NAuth2_Users for each row
begin
end;