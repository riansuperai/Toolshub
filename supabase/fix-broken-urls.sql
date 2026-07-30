-- ============================================================================
-- Herstel van kapotte URLs in de listings-tabel
--
-- Aanleiding: na de cutover van WordPress naar de Next.js-site (2026-07-29)
-- bestaat de WordPress-mediabibliotheek niet meer. Eén hero-afbeelding wees
-- daar nog naar en gaf 404. Daarnaast bleken drie demo_url-waarden onbruikbaar
-- als href door voorloop-whitespace of een ontbrekend scheme.
--
-- Uitvoeren: Supabase dashboard -> SQL Editor -> query plakken -> Run.
-- Veilig om meerdere keren te draaien (idempotent).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Dode WordPress-afbeelding vervangen door de lokale kopie
--
-- Het origineel is vóór de cutover van de oude host gered en staat nu in de
-- repo onder public/listings/. Een relatief pad is hier bewust: de afbeelding
-- deployt mee met de app, dus geen externe afhankelijkheid meer.
-- ----------------------------------------------------------------------------
UPDATE public.listings
SET hero_image_url = '/listings/website-laten-maken.png'
WHERE slug = 'website-laten-maken'
  AND hero_image_url LIKE '%wp-content%';


-- ----------------------------------------------------------------------------
-- 2. Demo-URLs normaliseren: whitespace weg en scheme aanvullen
--
-- Betrof:
--   hazenco-blog-tool   "demo.blogstudio.hazenco.nl"        (geen https://)
--   hazenco-cep         " https://demo.cep.hazenco.nl"      (voorloopspatie)
--   order-management    "\thttps://demo.backoffice..."      (voorloop-tab)
--
-- Zonder scheme leest de browser de waarde als een pad op het eigen domein,
-- dus die links waren stuk. De WHERE raakt alleen rijen die echt afwijken.
-- ----------------------------------------------------------------------------
UPDATE public.listings
SET demo_url = CASE
      WHEN btrim(demo_url, E' \t\r\n') ~* '^https?://'
        THEN btrim(demo_url, E' \t\r\n')
      ELSE 'https://' || btrim(demo_url, E' \t\r\n')
    END
WHERE demo_url IS NOT NULL
  AND btrim(demo_url, E' \t\r\n') <> ''
  AND (
        demo_url <> btrim(demo_url, E' \t\r\n')
     OR btrim(demo_url, E' \t\r\n') !~* '^https?://'
  );


-- ----------------------------------------------------------------------------
-- 3. Controle: beide queries hieronder horen 0 rijen terug te geven
-- ----------------------------------------------------------------------------

-- Resterende dode WordPress-verwijzingen
SELECT slug, hero_image_url
FROM public.listings
WHERE hero_image_url LIKE '%wp-content%';

-- Resterende onbruikbare demo-URLs
SELECT slug, demo_url
FROM public.listings
WHERE demo_url IS NOT NULL
  AND btrim(demo_url, E' \t\r\n') <> ''
  AND (
        demo_url <> btrim(demo_url, E' \t\r\n')
     OR btrim(demo_url, E' \t\r\n') !~* '^https?://'
  );
