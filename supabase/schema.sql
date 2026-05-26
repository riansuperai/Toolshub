-- ============================================================
-- Hazenco Marketplace — Supabase Postgres schema
-- Mirrors src/lib/types.ts. Run met:
--   psql -d hazenco -f supabase/schema.sql
-- of via Supabase SQL Editor.
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ============================================================
-- Enums
-- ============================================================

create type user_role          as enum ('visitor', 'buyer', 'seller_pending', 'seller', 'admin');
create type product_type       as enum ('workflow', 'ai_agent', 'plugin', 'extension', 'skill', 'theme', 'template', 'service_package');
create type listing_status     as enum ('draft', 'pending', 'published', 'rejected');
create type seller_status      as enum ('pending', 'approved', 'rejected');
create type delivery_mode      as enum ('download', 'cloud', 'custom');
create type branche            as enum ('general', 'retail', 'horeca', 'construction', 'healthcare', 'financial', 'marketing_media', 'ict', 'logistics', 'professional_services', 'education', 'government');
create type order_status       as enum ('pending', 'paid', 'failed', 'cancelled', 'refunded');
create type service_status     as enum ('new', 'in_progress', 'waiting_for_buyer', 'completed');
create type appointment_status as enum ('proposed', 'approved', 'rejected', 'cancelled', 'completed');
create type sender_kind        as enum ('buyer', 'seller');

-- ============================================================
-- Users (gekoppeld aan Supabase Auth)
-- ============================================================

create table public.users (
  id              uuid primary key default uuid_generate_v4(),
  auth_user_id    uuid unique references auth.users (id) on delete cascade,
  email           text not null unique,
  name            text not null,
  role            user_role not null default 'buyer',
  phone           text,
  company         text,
  vat_number      text,
  language        text default 'nl' check (language in ('nl', 'en')),
  newsletter      boolean default false,
  billing_street      text,
  billing_postal_code text,
  billing_city        text,
  billing_country     text default 'Nederland',
  joined_at       timestamptz default now()
);

create index users_role_idx on public.users (role);

create table public.saved_listings (
  user_id    uuid references public.users (id) on delete cascade,
  listing_id uuid not null,
  created_at timestamptz default now(),
  primary key (user_id, listing_id)
);

-- ============================================================
-- Sellers (creators)
-- ============================================================

create table public.sellers (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.users (id) on delete cascade,
  name           text not null,
  handle         text not null unique,
  status         seller_status not null default 'pending',
  specialty      text,
  bio            text,
  location       text,
  rating         numeric(3, 2) default 0,
  sales          integer default 0,
  response_time  text,
  verified       boolean default false,
  website        text,
  support_email  text,
  vat_number     text,
  payout_method  text,
  iban           text, -- encrypted at rest via pgsodium
  availability   jsonb default '{}'::jsonb,
  joined_at      timestamptz default now()
);

create index sellers_user_idx on public.sellers (user_id);
create index sellers_handle_idx on public.sellers (handle);

create table public.seller_applications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users (id) on delete cascade,
  name        text not null,
  email       text not null,
  business    text,
  experience  text,
  status      seller_status not null default 'pending',
  notes       text,
  created_at  timestamptz default now()
);

-- ============================================================
-- Categories + Listings + Versions
-- ============================================================

create table public.categories (
  id           text primary key,
  name         text not null,
  description  text,
  type         product_type not null,
  accent       text
);

create table public.listings (
  id                  uuid primary key default uuid_generate_v4(),
  seller_id           uuid not null references public.sellers (id) on delete cascade,
  title               text not null,
  slug                text not null unique,
  tagline             text,
  description         text,
  category_id         text references public.categories (id),
  type                product_type not null,
  use_cases           text[] default '{}',
  branches            branche[] default '{}',
  price_cents         integer not null check (price_cents >= 0),
  setup_price_cents   integer default 0,
  status              listing_status not null default 'draft',
  featured            boolean default false,
  compatibility       text[] default '{}',
  tags                text[] default '{}',
  delivery_modes      delivery_mode[] default '{}',
  demo_url            text,
  demo_screenshots    text[] default '{}',
  demo_instructions   text,
  demo_credentials    jsonb default '[]'::jsonb,
  demo_sample_input   text,
  downloads           integer default 0,
  sales               integer default 0,
  rating              numeric(3, 2) default 0,
  review_count        integer default 0,
  version             text not null default '1.0.0',
  support_included    text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index listings_seller_idx on public.listings (seller_id);
create index listings_status_idx on public.listings (status);
create index listings_slug_idx   on public.listings (slug);
create index listings_search_idx on public.listings using gin (
  to_tsvector('dutch', coalesce(title, '') || ' ' || coalesce(tagline, '') || ' ' || coalesce(description, ''))
);

create table public.listing_files (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings (id) on delete cascade,
  name        text not null,
  kind        text not null,
  size_label  text,
  storage_path text not null,
  is_private  boolean default true,
  created_at  timestamptz default now()
);

create table public.listing_versions (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings (id) on delete cascade,
  version     text not null,
  changelog   text,
  breaking    boolean default false,
  released_at timestamptz default now(),
  unique (listing_id, version)
);

-- ============================================================
-- Cart, Orders, OrderItems, Refunds
-- ============================================================

create table public.cart_items (
  user_id        uuid references public.users (id) on delete cascade,
  listing_id     uuid references public.listings (id) on delete cascade,
  quantity       integer default 1,
  service_addon  boolean default false,
  added_at       timestamptz default now(),
  primary key (user_id, listing_id)
);

create table public.orders (
  id                 uuid primary key default uuid_generate_v4(),
  buyer_id           uuid not null references public.users (id),
  status             order_status not null default 'pending',
  total_cents        integer not null,
  payment_provider   text default 'mollie',
  payment_intent_id  text,
  download_unlocked  boolean default false,
  created_at         timestamptz default now()
);

create index orders_buyer_idx on public.orders (buyer_id);
create index orders_status_idx on public.orders (status);

create table public.order_items (
  id                          uuid primary key default uuid_generate_v4(),
  order_id                    uuid not null references public.orders (id) on delete cascade,
  listing_id                  uuid not null references public.listings (id),
  seller_id                   uuid not null references public.sellers (id),
  title                       text not null,
  quantity                    integer not null default 1,
  price_cents                 integer not null,
  service_addon               boolean default false,
  service_addon_price_cents   integer default 0,
  version_at_purchase         text,
  created_at                  timestamptz default now()
);

create index order_items_seller_idx on public.order_items (seller_id);
create index order_items_listing_idx on public.order_items (listing_id);

create table public.refunds (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references public.orders (id),
  amount_cents  integer not null,
  reason        text,
  refunded_by   uuid not null references public.users (id),
  created_at    timestamptz default now()
);

-- ============================================================
-- Reviews
-- ============================================================

create table public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings (id) on delete cascade,
  buyer_id    uuid not null references public.users (id),
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  screenshots text[] default '{}',
  approved    boolean default false,
  created_at  timestamptz default now()
);

create index reviews_listing_idx on public.reviews (listing_id);
create index reviews_approved_idx on public.reviews (approved);

-- ============================================================
-- Service requests + Messages + Appointments
-- ============================================================

create table public.service_requests (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings (id),
  buyer_id    uuid not null references public.users (id),
  seller_id   uuid not null references public.sellers (id),
  order_id    uuid references public.orders (id),
  status      service_status not null default 'new',
  scope       text,
  message     text,
  created_at  timestamptz default now()
);

create index service_requests_seller_idx on public.service_requests (seller_id);
create index service_requests_buyer_idx  on public.service_requests (buyer_id);

create table public.service_messages (
  id          uuid primary key default uuid_generate_v4(),
  request_id  uuid not null references public.service_requests (id) on delete cascade,
  sender      sender_kind not null,
  text        text not null,
  created_at  timestamptz default now()
);

create index service_messages_request_idx on public.service_messages (request_id, created_at);

create table public.appointments (
  id              uuid primary key default uuid_generate_v4(),
  request_id      uuid not null references public.service_requests (id) on delete cascade,
  proposed_by     sender_kind not null,
  starts_at       timestamptz not null,
  duration_minutes integer not null default 30,
  status          appointment_status not null default 'proposed',
  note            text,
  created_at      timestamptz default now()
);

create index appointments_request_idx on public.appointments (request_id);
create index appointments_status_idx  on public.appointments (status, starts_at);

-- ============================================================
-- Payouts
-- ============================================================

create table public.payouts (
  id           uuid primary key default uuid_generate_v4(),
  seller_id    uuid not null references public.sellers (id) on delete cascade,
  amount_cents integer not null,
  net_cents    integer not null,
  status       text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  method       text default 'sepa' check (method in ('sepa', 'instant')),
  iban_last4   text,
  requested_at timestamptz default now(),
  paid_at      timestamptz
);

create index payouts_seller_idx on public.payouts (seller_id, status);

-- ============================================================
-- Notifications + Audit log
-- ============================================================

create table public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.users (id) on delete cascade,
  kind        text not null,
  title       text not null,
  body        text,
  link        text,
  read_at     timestamptz,
  created_at  timestamptz default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_unread_idx on public.notifications (user_id) where read_at is null;

create table public.moderation_logs (
  id         uuid primary key default uuid_generate_v4(),
  actor_id   uuid not null references public.users (id),
  action     text not null,
  entity     text not null,
  entity_id  text not null,
  meta       jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index moderation_logs_created_idx on public.moderation_logs (created_at desc);
create index moderation_logs_entity_idx on public.moderation_logs (entity, entity_id);

-- ============================================================
-- Row Level Security helpers
-- ============================================================

create or replace function public.current_user_id() returns uuid as $$
  select id from public.users where auth_user_id = auth.uid();
$$ language sql stable security definer;

create or replace function public.is_admin() returns boolean as $$
  select exists (
    select 1 from public.users
    where auth_user_id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- Enable RLS
alter table public.users               enable row level security;
alter table public.saved_listings      enable row level security;
alter table public.sellers             enable row level security;
alter table public.seller_applications enable row level security;
alter table public.listings            enable row level security;
alter table public.listing_files       enable row level security;
alter table public.listing_versions    enable row level security;
alter table public.cart_items          enable row level security;
alter table public.orders              enable row level security;
alter table public.order_items         enable row level security;
alter table public.refunds             enable row level security;
alter table public.reviews             enable row level security;
alter table public.service_requests    enable row level security;
alter table public.service_messages    enable row level security;
alter table public.appointments        enable row level security;
alter table public.payouts             enable row level security;
alter table public.notifications       enable row level security;
alter table public.moderation_logs     enable row level security;

-- Basis policies (exemplaar — uitbreiden per tabel)
create policy "Users select own profile"   on public.users   for select using (auth_user_id = auth.uid() or public.is_admin());
create policy "Users update own profile"   on public.users   for update using (auth_user_id = auth.uid());

create policy "Anyone reads published"     on public.listings for select using (status = 'published' or public.is_admin());
create policy "Creators write own"         on public.listings for all    using (
  seller_id in (select id from public.sellers where user_id = public.current_user_id())
  or public.is_admin()
);

create policy "Buyers see own orders"      on public.orders for select using (buyer_id = public.current_user_id() or public.is_admin());
create policy "Creators see own sales"     on public.order_items for select using (
  seller_id in (select id from public.sellers where user_id = public.current_user_id())
  or order_id in (select id from public.orders where buyer_id = public.current_user_id())
  or public.is_admin()
);

create policy "Approved reviews public"    on public.reviews for select using (approved or buyer_id = public.current_user_id() or public.is_admin());
create policy "Buyers submit reviews"      on public.reviews for insert with check (buyer_id = public.current_user_id());

create policy "Users see own notifications" on public.notifications for select using (user_id = public.current_user_id());
create policy "Users mark own read"        on public.notifications for update using (user_id = public.current_user_id());

-- ============================================================
-- Triggers
-- ============================================================

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

-- Auto-create user-row na auth signup
create or replace function public.handle_new_auth_user() returns trigger as $$
begin
  insert into public.users (auth_user_id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', new.email), 'buyer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
