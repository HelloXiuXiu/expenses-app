/*
THIS CODE IS HERE FOR SAVING ONLY.
IT DOES NOT RUN ANYWHERE ON CLIENT/SERVER OF THIS PROJECT.
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
begin
  if (TG_OP = 'DELETE') then
    affected_user := OLD.user_id;
    affected_date := OLD."date"::date;
  else
    affected_user := NEW.user_id;
    affected_date := NEW."date"::date;
  end if;

  -- Only perform aggregation if any expenses remain for this user/date
  if exists (
    select 1 from expenses
    where user_id = affected_user
      and "date"::date = affected_date
  ) then
    with
    -- total per currency
    per_currency as (
      select
        user_id,
        "date"::date as "date",
        currency,
        sum(amount) as sum_amount
      from expenses
      where user_id = affected_user
        and "date"::date = affected_date
      group by user_id, "date", currency
    ),
    -- totals per category+currency
    per_category as (
      select
        user_id,
        "date"::date as "date",
        category,
        currency,
        sum(amount) as sum_amount
      from expenses
      where user_id = affected_user
        and "date"::date = affected_date
      group by user_id, "date", category, currency
    ),
    -- build {currency: sum} JSON per category
    category_currency_json as (
      select
        user_id,
        "date",
        category,
        jsonb_object_agg(currency, sum_amount) as currency_sums
      from per_category
      group by user_id, "date", category
    ),
    -- aggregate categories -> {category: {currency: sum}}
    category_sums_json as (
      select
        user_id,
        "date",
        jsonb_object_agg(category, currency_sums) as category_sums
      from category_currency_json
      group by user_id, "date"
    ),
    -- all_expenses array
    all_exp as (
      select
        user_id,
        "date"::date as "date",
        jsonb_agg(
          jsonb_build_object(
            'id', id,
            'category', category,
            'amount', amount,
            'currency', currency,
            'description', description
          ) order by id
        ) as all_expenses
      from expenses
      where user_id = affected_user
        and "date"::date = affected_date
      group by user_id, "date"
    ),
    -- final merge
    final as (
      select
        u.user_id,
        u."date",
        (select jsonb_object_agg(currency, sum_amount)
         from per_currency c
         where c.user_id = u.user_id and c."date" = u."date") as amount,
        cs.category_sums,
        e.all_expenses
      from (select affected_user as user_id, affected_date as "date") u
      left join category_sums_json cs
        on cs.user_id = u.user_id and cs."date" = u."date"
      left join all_exp e
        on e.user_id = u.user_id and e."date" = u."date"
    )
    insert into daily_expenses (user_id, "date", amount, category_sums, all_expenses)
    select user_id, "date", amount, category_sums, all_expenses
    from final
    on conflict (user_id, "date") do update
      set amount = excluded.amount,
          category_sums = excluded.category_sums,
          all_expenses = excluded.all_expenses;
  else
    -- no remaining expenses → delete the summary row
    delete from daily_expenses
    where user_id = affected_user
      and "date" = affected_date;
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
