-- ============================================================================
-- Tabel voor de klantlogo-slider op de homepage
--
-- Waarom een tabel en niet gewoon de bucket uitlezen: de publieke sleutel van
-- de site mag losse bestanden uit een bucket ophalen, maar de inhoud van een
-- bucket niet opvragen (RLS op storage.objects). De site kan dus niet zelf
-- ontdekken welke logo's er staan. Met deze tabel houd je bovendien controle
-- over volgorde en zichtbaarheid.
--
-- Uitvoeren: Supabase dashboard -> SQL Editor -> plakken -> Run.
-- Project: itqanbhecghinccgyeyf
-- ============================================================================

create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  naam        text not null,
  logo_url    text not null,
  -- Optische correctie. Een breed woordmerk oogt op dezelfde hoogte kleiner
  -- dan een vierkant beeldmerk; dat is optiek, geen wiskunde. Staat standaard
  -- op 1.0; zet 'm op bijv. 1.25 als een logo te klein oogt, of 0.85 als het
  -- te veel domineert.
  scale       numeric(3,2) not null default 1.0,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.clients is
  'Klantlogo''s voor de "vertrouwd door"-slider op de homepage.';
comment on column public.clients.scale is
  'Optische schaalcorrectie, 1.0 = standaard. Alleen aanpassen als een logo te groot of te klein oogt.';

-- Sorteren op volgorde, dan naam
create index if not exists clients_sort_idx
  on public.clients (active, sort_order, naam);

-- ----------------------------------------------------------------------------
-- RLS: iedereen mag actieve klanten lezen (ze staan toch publiek op de site).
-- Schrijven kan alleen via het dashboard of een service-role sleutel.
-- ----------------------------------------------------------------------------
alter table public.clients enable row level security;

drop policy if exists "clients zijn publiek leesbaar" on public.clients;
create policy "clients zijn publiek leesbaar"
  on public.clients
  for select
  using (active = true);


-- ----------------------------------------------------------------------------
-- Voorbeeld van hoe je een klant toevoegt. Vervang naam en URL.
--
-- Upload het logo eerst naar de bucket `listing-screenshots` (of maak een
-- aparte bucket `client-logos` aan) en plak de publieke URL hieronder.
--
-- BELANGRIJK: gebruik PNG of SVG met transparante achtergrond. Een JPG met
-- witte achtergrond wordt een wit blok op de donkere sectie.
-- ----------------------------------------------------------------------------
-- insert into public.clients (naam, logo_url, sort_order) values
--   ('Voorbeeld BV',
--    'https://itqanbhecghinccgyeyf.supabase.co/storage/v1/object/public/client-logos/voorbeeld.png',
--    10);


-- ----------------------------------------------------------------------------
-- Controle
-- ----------------------------------------------------------------------------
select naam, scale, sort_order, active
from public.clients
order by sort_order, naam;
