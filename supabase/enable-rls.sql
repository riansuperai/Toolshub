-- ============================================================
-- RLS aanzetten op alle public tabellen + lees-policy voor anon
-- ------------------------------------------------------------
-- Reden: Supabase Security Advisor klaagt dat tabellen via
-- PostgREST + anon key beschikbaar zijn zonder Row-Level Security.
-- In theorie kan iemand met de anon key (zit in de frontend) alle
-- rijen lezen, wijzigen of verwijderen.
--
-- Aanpak:
--   1. RLS aanzetten op ELKE public tabel
--   2. Voor tabellen die de website LEEST (catalogus, listings,
--      reviews, etc.) → policy 'public read' voor anon
--   3. Voor user-eigen data (saved_listings, cart, orders) →
--      policy 'eigen rijen' op basis van auth.uid()
--   4. Schrijfacties (insert/update/delete) blijven via service_role
--      (server-side keys, nooit in browser)
--
-- Veilig om opnieuw te draaien — gebruikt 'drop policy if exists'.
-- ============================================================

-- ============== PUBLIEK LEESBAAR (catalogus, marketing) =============
-- Deze tabellen MOETEN door anon te lezen zijn want de site rendert
-- ze server-side (Next.js) maar ook via de browser client.
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'sellers', 'listings', 'listing_files',
    'listing_versions', 'reviews'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public read" on public.%I', t);
    execute format(
      'create policy "Public read" on public.%I for select to anon, authenticated using (true)',
      t
    );
  end loop;
end$$;

-- ============== USER-EIGEN DATA (auth.uid()) =============
-- Tabellen met een user_id kolom — alleen eigen rijen leesbaar/wijzigbaar.
-- (Werkt zodra Supabase Auth aanstaat; tot dan zijn deze tabellen volledig
-- afgesloten voor anon, wat ook het veiligste default is.)
do $$
declare
  t text;
begin
  foreach t in array array[
    'users', 'saved_listings', 'cart_items', 'orders', 'order_items',
    'refunds', 'service_requests', 'service_messages', 'appointments',
    'notifications', 'payouts'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    -- Geen policies = niemand met anon key kan lezen/schrijven.
    -- Voeg later policies toe als 'using (auth.uid() = user_id)' zodra
    -- Auth aanstaat.
  end loop;
end$$;

-- ============== ADMIN / INTERNAL =============
-- Alleen zichtbaar voor service_role. RLS aan, geen policies → dicht.
do $$
declare
  t text;
begin
  foreach t in array array[
    'seller_applications', 'moderation_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end$$;

-- ============== Verificatie =============
-- Run dit handmatig om te zien welke tabellen nog RLS-uit hebben:
-- select schemaname, tablename, rowsecurity
-- from pg_tables
-- where schemaname = 'public'
-- order by tablename;
