-- ============================================================
-- Audit H2 — looptijd en opzegbaarheid spraken elkaar tegen.
--
-- De site zei door elkaar "vanaf 24 maanden", "minimum 12 maanden" en
-- "Maandelijks opzegbaar". Bevestigde werkelijkheid: ALLE pakketten
-- hebben een minimum van 12 maanden, daarna maandelijks opzegbaar.
--
-- Draaien in: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1. Wat staat er nu?
select slug, 'service_pricing.usps' as veld
from public.listings
where service_pricing::text like '%Maandelijks opzegbaar na minimumperiode%'
union all
select slug, 'description'
from public.listings
where description like '%vanaf 24 maanden%';

-- 2a. USP-regel in service_pricing (3 listings)
update public.listings
set service_pricing = replace(
      service_pricing::text,
      'Maandelijks opzegbaar na minimumperiode',
      'Minimaal 12 maanden, daarna maandelijks opzegbaar'
    )::jsonb,
    updated_at = now()
where service_pricing::text like '%Maandelijks opzegbaar na minimumperiode%';

-- 2b. Verkooptekst van website-laten-maken (24 -> 12 maanden)
update public.listings
set description = replace(
      description,
      'Voor €89 per maand (vanaf 24 maanden)',
      'Voor €89 per maand (minimaal 12 maanden, daarna maandelijks opzegbaar)'
    ),
    updated_at = now()
where slug = 'website-laten-maken';

-- 3. Verifieer (verwacht: 0 rijen)
select slug from public.listings
where service_pricing::text like '%Maandelijks opzegbaar na minimumperiode%'
   or description like '%vanaf 24 maanden%';
