-- Crew Manifest — Supabase / Postgres schema.
-- Run this ONCE in the Supabase SQL Editor (Dashboard → SQL → New query → Run).
-- The app talks to Supabase with the service-role key (server-side only), which
-- bypasses RLS, so no policies are needed; RLS is enabled to deny anon access.

create table if not exists crew_signup (
  id          uuid primary key default gen_random_uuid(),
  leg_id      text not null,
  name        text not null,
  contact     text not null,
  note        text,
  created_at  timestamptz not null default now()
);

-- One sign-up per contact per leg (case-insensitive).
create unique index if not exists ux_leg_contact
  on crew_signup (leg_id, lower(contact));

alter table crew_signup enable row level security;

-- Atomic, race-safe sign-up. A per-leg advisory lock serialises concurrent
-- writers so the 3-crew cap can never be exceeded. Returns one row:
--   result = 'ok' | 'duplicate' | 'full' (with id/created_at set when 'ok').
-- NOTE: the cap (3) is duplicated from CREW_CAPACITY in lib/crew/legs.ts — keep
-- them in sync if you ever change it.
create or replace function signup_for_leg(
  p_leg text, p_name text, p_contact text, p_note text
) returns table (result text, id uuid, created_at timestamptz)
language plpgsql
as $$
declare
  v_id uuid;
  v_now timestamptz := now();
  v_count int;
begin
  perform pg_advisory_xact_lock(hashtext(p_leg));

  if exists (
    select 1 from crew_signup s
    where s.leg_id = p_leg and lower(s.contact) = lower(p_contact)
  ) then
    return query select 'duplicate'::text, null::uuid, null::timestamptz;
    return;
  end if;

  select count(*) into v_count from crew_signup s where s.leg_id = p_leg;
  if v_count >= 3 then
    return query select 'full'::text, null::uuid, null::timestamptz;
    return;
  end if;

  v_id := gen_random_uuid();
  insert into crew_signup (id, leg_id, name, contact, note, created_at)
  values (v_id, p_leg, p_name, p_contact, p_note, v_now);

  return query select 'ok'::text, v_id, v_now;
end;
$$;
