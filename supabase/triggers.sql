/*
THIS CODE IS HERE FOR SAVING ONLY.
IT DOES NOT RUN ANYWHERE ON CLIENT/SERVER OF THIS PROJECT.
IT RUNES ON DB.
*/
/*
This function keeps the daily_expenses table in sync
It runs after insert/update/delete on the expenses table
*/
create or replace function update_daily_expenses()
returns trigger
language plpgsql
security definer
as $$
declare
  affected_user uuid;
  affected_date date;
  curr_json jsonb;
  cat_json  jsonb;
begin
  -- determine affected user/date
  if TG_OP = 'DELETE' then
    affected_user := OLD.user_id;
    affected_date := OLD."date"::date;
  else
    affected_user := NEW.user_id;
    affected_date := NEW."date"::date;
  end if;

  -- If there are expenses for that user/date, compute sums and upsert.
  if exists (
    select 1 from expenses
    where user_id = affected_user and "date"::date = affected_date
  ) then

    -- currency sums: { "USD": total, "RSD": total, ... }
    select coalesce(jsonb_object_agg(currency, sum_amount), '{}'::jsonb)
    into curr_json
    from (
      select currency, sum(amount) as sum_amount
      from expenses
      where user_id = affected_user and "date"::date = affected_date
      group by currency
    ) s;

    -- category sums: { "food": total, "delivery": total, ... }
    select coalesce(jsonb_object_agg(category, sum_amount), '{}'::jsonb)
    into cat_json
    from (
      select category, sum(amount) as sum_amount
      from expenses
      where user_id = affected_user and "date"::date = affected_date
      group by category
    ) s2;

    -- insert the summary row
    insert into daily_expenses (user_id, "date", amount, category_sums)
    values (affected_user, affected_date, curr_json, cat_json)
    on conflict (user_id, "date") do update
      set amount = excluded.amount,
          category_sums = excluded.category_sums;

  else
    -- no expenses remain for that user/date -> remove summary row (if any)
    delete from daily_expenses
    where user_id = affected_user and "date" = affected_date;
  end if;

  return null;
end;
$$;

/*
Create triggers for update_daily_expenses function
*/
drop trigger if exists expenses_after_insert on expenses;
drop trigger if exists expenses_after_update on expenses;
drop trigger if exists expenses_after_delete on expenses;

create trigger expenses_after_insert
after insert on expenses
for each row execute function update_daily_expenses();

create trigger expenses_after_update
after update on expenses
for each row execute function update_daily_expenses();

create trigger expenses_after_delete
after delete on expenses
for each row execute function update_daily_expenses();
