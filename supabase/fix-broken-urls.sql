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
-- 1. Dode WordPress-afbeelding vervangen
--
-- De afbeelding is opnieuw geupload naar de publieke Storage-bucket
-- `listing-screenshots` (2026-07-29). Storage in plaats van een lokaal pad,
-- zodat dit consistent is met de andere listings.
--
-- Er staat ook een geredde kopie in de repo onder public/listings/, die dient
-- als hero voor de mock-fallback wanneer Supabase onbereikbaar is.
-- ----------------------------------------------------------------------------
UPDATE public.listings
SET hero_image_url = 'https://itqanbhecghinccgyeyf.supabase.co/storage/v1/object/public/listing-screenshots/website-laten-maken.png'
WHERE slug = 'website-laten-maken';


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
