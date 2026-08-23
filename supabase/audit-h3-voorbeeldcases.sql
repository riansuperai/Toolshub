-- ============================================================
-- Audit H3/H1 — verzonnen bedrijfsnamen als klantcase.
--
-- 16 cases droegen een verzonnen bedrijfsnaam ("Kapsalon Knip & Co",
-- "Vloerenboer.nl") met concrete resultaten eronder. Dat leest als een
-- echte klantreferentie. Ze staan bovendien op dezelfde pagina's als
-- ECHTE klanten (SanitairSuperShop), dus labelen moet per kaart.
--
-- Echte klanten blijven ongemoeid:
--   SanitairSuperShop, Civitas advies, Badkamerwandbekleding, Magdatwel.nl
--
-- Draaien in: Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- 1. Tel vooraf (verwacht: 8 listings)
select slug from public.listings
where cases::text like '%Kapsalon Knip%' or cases::text like '%Vloerenboer%'
   or cases::text like '%TuinThuis%'     or cases::text like '%Fysio Vital%'
   or cases::text like '%Elektro Van der Berg%';

-- 2. Verzonnen bedrijfsnamen -> expliciet voorbeeldlabel
update public.listings
set cases = replace(replace(replace(replace(replace(replace(replace(replace(
            replace(replace(replace(replace(replace(replace(replace(replace(
            cases::text,
  '"Kapsalon Knip & Co"',         '"Voorbeeld: kapsalon"'),
  '"Garage Westerveld"',          '"Voorbeeld: autogarage"'),
  '"Tandartspraktijk DentaalNL"', '"Voorbeeld: tandartspraktijk"'),
  '"TuinThuis"',                  '"Voorbeeld: webshop tuinmeubels"'),
  '"Klusbedrijf De Vakman"',      '"Voorbeeld: klusbedrijf"'),
  '"Makelaardij Vermeer"',        '"Voorbeeld: makelaardij"'),
  '"Brasserie ''t Kompas"',       '"Voorbeeld: restaurant"'),
  '"Schoonheidssalon Belle"',     '"Voorbeeld: schoonheidssalon"'),
  '"Autobedrijf Vermeer"',        '"Voorbeeld: autobedrijf"'),
  '"Fysio Vital"',                '"Voorbeeld: fysiotherapiepraktijk"'),
  '"Kapsalon Lumière"',           '"Voorbeeld: kapsalon"'),
  '"Sport-coach Vincent Hooft"',  '"Voorbeeld: zzp-coach"'),
  '"Elektro Van der Berg"',       '"Voorbeeld: elektro-webshop"'),
  '"Tuin & Meer"',                '"Voorbeeld: tuinwebshop"'),
  '"Vloerenboer.nl"',             '"Voorbeeld: vloerenwebshop"'),
  '"Behangshop Klassiek"',        '"Voorbeeld: behangwebshop"'
  )::jsonb,
  updated_at = now()
where cases is not null;

-- 3. Nep-steden uit de labels halen (suggereren een specifiek bedrijf)
update public.listings
set cases = replace(replace(replace(replace(replace(replace(
            cases::text,
  '"Restaurant · Amsterdam"',     '"Restaurant"'),
  '"Beauty · Den Haag"',          '"Beauty"'),
  '"Automotive · Utrecht"',       '"Automotive"'),
  '"Fysiotherapie · Utrecht"',    '"Fysiotherapie"'),
  '"Beauty · Amsterdam"',         '"Beauty"'),
  '"Coaching · Eindhoven"',       '"Coaching"'
  )::jsonb,
  updated_at = now()
where cases is not null;

-- 4. Verifieer: geen verzonnen namen meer (verwacht: 0 rijen)
select slug from public.listings
where cases::text like '%Kapsalon Knip%'  or cases::text like '%Vloerenboer%'
   or cases::text like '%TuinThuis%'      or cases::text like '%Fysio Vital%'
   or cases::text like '%Elektro Van der Berg%' or cases::text like '%Behangshop%'
   or cases::text like '%Westerveld%'     or cases::text like '%DentaalNL%'
   or cases::text like '%De Vakman%'      or cases::text like '%Makelaardij Vermeer%'
   or cases::text like '%Kompas%'         or cases::text like '%Belle%'
   or cases::text like '%Autobedrijf Vermeer%'  or cases::text like '%Lumière%'
   or cases::text like '%Vincent Hooft%'  or cases::text like '%Tuin & Meer%';

-- 5. Controle: echte klanten nog intact (verwacht: 5 rijen)
select slug, jsonb_array_elements(cases)->>'clientName' as klant
from public.listings
where cases::text like '%SanitairSuperShop%' or cases::text like '%Civitas%'
   or cases::text like '%Badkamerwand%'      or cases::text like '%Magdatwel%';
