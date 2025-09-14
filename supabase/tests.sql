/*
Tests for expenses table
*/

-- delete expense row based on id
delete from expenses
where id = 358;

-- update expense row based on id
update expenses
set amount = 333, description = 'updated expense'
where id = 358;

-- insert expense row based on user_id (replace with your id)
insert into expenses (user_id, "date", amount, currency, category, description)
values ('test1111', '2025-09-14', 111, 'RSD', 'cat', '');