create trigger if not exists NAuth2_Roles after insert on NAuth2_Roles
/*REFERENCING NEW ROW AS new*/
for each row
begin
    insert into NAuth2_Log () values ();
    update NAuth2_Roles set created_at =  where roleId = new.roleId;
end;

create trigger if not exists NAuth2_Users after insert on NAuth2_Users for each row
begin
end;

// pg
CREATE OR REPLACE FUNCTION rec_insert()
  RETURNS trigger AS
$$
BEGIN
         INSERT INTO emp_log(emp_id,salary,edittime)
         VALUES(NEW.employee_id,NEW.salary,current_date);

    RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';

CREATE TRIGGER ins_same_rec
  AFTER INSERT
  ON emp_details
  FOR EACH ROW
  EXECUTE PROCEDURE rec_insert();

/*
create log entries on:
users
    - create
    - update
    - delete

roles
    - create
    - update
    - delete

domains
    - create
    - update
    - delete

userRoles
    - create
    - update
    - delete

domainUsers
    - create
    - update
    - delete

*/
