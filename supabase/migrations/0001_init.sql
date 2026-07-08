-- 댓글이벤트 진행 어시스턴트 - initial schema
-- All tables are accessed exclusively through Next.js server routes using the
-- Supabase service-role key, which bypasses RLS. RLS is enabled with no
-- policies so anon/authenticated clients can never read or write directly.

create extension if not exists "pgcrypto";

-- 뮤즈바이가 브랜드별로 발급한 코드
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  created_at timestamptz not null default now()
);

do $$ begin
  create type contact_type as enum ('email', 'address');
exception
  when duplicate_object then null;
end $$;

-- 브랜드가 생성한 댓글이벤트 (= 당첨자 정보 입력 폼)
create table if not exists comment_events (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  campaign_name text not null,
  prize text not null,
  winner_count integer not null check (winner_count > 0),
  final_upload_date date not null,
  contact_type contact_type not null,
  notice text,
  form_slug text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists comment_events_brand_id_idx on comment_events (brand_id);

-- 인플루언서(당첨자)가 폼을 통해 제출한 정보
create table if not exists winners (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references comment_events(id) on delete cascade,
  channel_name text not null,
  name text not null,
  phone text not null,
  email text,
  address text,
  postal_code text,
  consent boolean not null default false,
  delivered boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists winners_event_id_idx on winners (event_id);

alter table brands enable row level security;
alter table comment_events enable row level security;
alter table winners enable row level security;

-- No policies are defined on purpose: only the service-role key (used
-- server-side only) can read/write these tables.
