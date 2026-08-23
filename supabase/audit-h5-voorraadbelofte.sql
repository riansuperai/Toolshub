-- ============================================================
-- Audit H5 — "Voorkomt nooit meer voorraadverrassingen" is een
-- dubbele ontkenning: "voorkomt" en "nooit meer" doen hetzelfde werk.
-- Meteen ook "out-of-sync stocks" vernederlandst.
--
-- Draaien in: Supabase Dashboard -> SQL Editor -> New query
-- De pagina ververst binnen 5 minuten (revalidate = 300).
-- ============================================================

-- 1. Controleer eerst wat er nu staat
select slug,
       position('Voorkomt nooit meer' in coalesce(description, '')) as in_description,
       position('Voorkomt nooit meer' in coalesce(tagline, ''))     as in_tagline
from public.listings
where slug = 'hazenco-voorraad-tool';

-- 2. Vervang de zin
update public.listings
set
  description = replace(
    description,
    'Voorkomt nooit meer voorraadverrassingen en out-of-sync stocks.',
    'Voorkomt voorraadverrassingen en niet-kloppende voorraadstanden.'
  ),
  tagline = replace(
    coalesce(tagline, ''),
    'Voorkomt nooit meer voorraadverrassingen en out-of-sync stocks.',
    'Voorkomt voorraadverrassingen en niet-kloppende voorraadstanden.'
  ),
  updated_at = now()
where slug = 'hazenco-voorraad-tool';

-- 3. Verifieer dat de oude zin weg is (verwacht: 0 rijen)
select slug
from public.listings
where description like '%Voorkomt nooit meer%'
   or tagline like '%Voorkomt nooit meer%';
