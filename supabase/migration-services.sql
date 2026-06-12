-- ============================================================
-- Migration: Diensten-listings ondersteuning (task #55)
-- ------------------------------------------------------------
-- Voegt kolommen toe aan listings voor het dienst-variant rendering.
-- Veilig om meerdere keren te draaien (IF NOT EXISTS overal).
-- ============================================================

alter table public.listings
  add column if not exists listing_kind text check (listing_kind in ('tool', 'service'));

alter table public.listings
  add column if not exists for_who jsonb;

alter table public.listings
  add column if not exists included jsonb;

alter table public.listings
  add column if not exists cases jsonb;

alter table public.listings
  add column if not exists service_pricing jsonb;

alter table public.listings
  add column if not exists service_meta jsonb;

-- Optioneel: index op listing_kind voor snelle catalog filter
create index if not exists idx_listings_listing_kind on public.listings (listing_kind);

-- ------------------------------------------------------------
-- Seed: "Website laten maken" demo dienst-listing
-- ------------------------------------------------------------
-- Verwijdert bestaande rij met dezelfde slug zodat opnieuw draaien werkt.
delete from public.listings where slug = 'website-laten-maken';

insert into public.listings (
  id, seller_id, title, slug, tagline, description,
  category_id, type, use_cases, branches, hero_image_url, screenshot_urls,
  price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version,
  support_included, created_at, updated_at,
  listing_kind, for_who, included, cases, service_pricing, service_meta
) values (
  'listing_website_laten_maken',
  'seller_hazenco',
  'Website laten maken',
  'website-laten-maken',
  'Professionele website binnen weken, zonder gedoe en zonder verborgen kosten.',
  E'Een website die je bedrijf serieus laat ogen — door Hazenco ontworpen en gebouwd. Conversie-gericht, snel en klaar voor zoekmachines.\n\nGeschikt voor ZZP''ers, MKB-ondernemers en starters die niet zelf willen knutselen met builders, hosting, plugins en SEO.\n\nKies tussen een eenmalige investering of een All-in abonnement waarin alles is geregeld: hosting, updates, backups en support.',
  'cat_services',
  'service_package',
  array['marketing', 'lead_generation']::text[],
  array['general', 'professional_services', 'retail']::text[],
  'https://hazenco.nl/wp-content/uploads/2024/05/website-laten-maken.webp',
  array[]::text[],
  142500,
  0,
  'published',
  true,
  array['WordPress', 'WooCommerce', 'Elementor']::text[],
  array['Website', 'Webdesign', 'Hosting', 'SEO', 'MKB']::text[],
  array['custom']::text[],
  '',
  array[]::text[],
  '',
  '[]'::jsonb,
  '',
  0,
  47,
  4.9,
  18,
  '',
  '30 dagen nazorg + optioneel doorlopend',
  now() - interval '180 days',
  now() - interval '7 days',
  'service',
  '["ZZP''ers die professioneel willen ogen zonder zelf te bouwen", "MKB-ondernemers met een verouderde site die niet meer converteert", "Starters die snel live willen met een geloofwaardige basis"]'::jsonb,
  '[
    {"icon": "shield-check", "title": "Security & SSL", "description": "Veilige hosting met automatische SSL-certificaten."},
    {"icon": "database-export", "title": "Dagelijkse backups", "description": "Automatische backups, herstel binnen enkele klikken."},
    {"icon": "refresh", "title": "Updates & onderhoud", "description": "Plugin- en core-updates worden voor je geregeld."},
    {"icon": "headset", "title": "Direct support", "description": "Eén vast aanspreekpunt, snel antwoord per WhatsApp of mail."}
  ]'::jsonb,
  '[
    {
      "clientName": "Badkamerwandbekleding",
      "label": "Website All-in",
      "tag": "MKB · Website",
      "tone": "dark",
      "benefit": "Stijlvolle website voor een leverancier van wandpanelen. Bezoekers kunnen het volledige assortiment bekijken en direct een afspraak inplannen voor montage aan huis.",
      "highlights": ["Online afspraken inplannen — zonder bellen", "Assortiment volledig zichtbaar op mobiel"],
      "imageUrl": "https://hazenco.nl/wp-content/uploads/2024/05/badkamerwandbekleding.webp",
      "url": "https://badkamerwandbekleding.nl"
    },
    {
      "clientName": "Civitas advies",
      "label": "Website All-in",
      "tag": "MKB · Website",
      "tone": "light",
      "benefit": "Professionele website voor een adviesbureau gespecialiseerd in infrastructuur en openbare ruimte. Van ruimtelijke ontwikkeling tot asset management — alles overzichtelijk gepresenteerd.",
      "highlights": ["Werkgebieden en diensten helder in kaart", "Portfolio direct vindbaar voor opdrachtgevers"],
      "imageUrl": "https://hazenco.nl/wp-content/uploads/2024/05/civitas-advies.webp",
      "url": "https://civitas-advies.nl"
    },
    {
      "clientName": "Magdatwel.nl",
      "label": "Website Blog",
      "tag": "MKB · Website",
      "tone": "peach",
      "benefit": "Juridische blogwebsite waar mensen op een toegankelijke manier leren wat wel en niet mag. Weetjes, nieuws en actuele onderwerpen — begrijpelijk geschreven voor iedereen.",
      "highlights": ["Juridische info zonder vakjargon", "Volledig klaar voor zoekmachines — SEO-proof"],
      "imageUrl": "https://hazenco.nl/wp-content/uploads/2024/05/magdatwel.webp",
      "url": "https://magdatwelonline.nl"
    }
  ]'::jsonb,
  '{
    "externalUrl": "https://hazenco.nl/website-laten-maken/",
    "oneTime": {
      "priceCents": 142500,
      "originalPriceCents": 229500,
      "description": "Eenmalige betaling, oplevering binnen weken. Hosting en onderhoud apart."
    },
    "subscription": {
      "priceCentsPerMonth": 8900,
      "originalPriceCentsPerMonth": 12900,
      "minMonths": 24,
      "description": "Hosting, updates, backups, security en support inbegrepen."
    },
    "highlight": "subscription",
    "usps": ["1 vast aanspreekpunt", "Geen verborgen kosten", "Oplevering binnen enkele weken"]
  }'::jsonb,
  '{"duration": "2–4 weken", "revisions": "3 ontwerprondes", "supportPeriod": "30 dagen nazorg"}'::jsonb
);
