-- Run this once in the Supabase SQL Editor for the deal-hunter cron.
-- It's separate from schema.sql (crew manifest tables) to keep concerns clear.

create table if not exists deal_price_history (
  id          uuid primary key default gen_random_uuid(),
  item_id     text        not null,
  price       numeric     not null,
  retailer    text        not null,
  source      text        not null check (source in ('serpapi')),
  brand       text,
  checked_at  timestamptz not null default now()
);

-- Migration for databases created before `brand` existed — safe to re-run.
-- `brand` is the watched brand the price is for. Rows without one were the
-- cheapest result of ANY brand and are ignored by the 12-month comparison.
alter table deal_price_history add column if not exists brand text;

create index if not exists idx_dph_item_checked
  on deal_price_history (item_id, checked_at desc);

create table if not exists deal_confirmed (
  id               uuid primary key default gen_random_uuid(),
  item_id          text        not null,
  item_label       text        not null,
  brand            text        not null,
  current_price    numeric     not null,
  twelve_mo_min    numeric     not null,
  pct_saving       numeric     not null,
  retailer         text        not null,
  buy_url          text,
  approval_source  text        not null,
  confirmed_at     timestamptz not null default now()
);

-- RLS on: the service-role key used by the cron bypasses it.
alter table deal_price_history enable row level security;
alter table deal_confirmed     enable row level security;
