-- ============================================================
-- Seed: m² Calculator voor Tegels & Vloeren (Magento) service-listing
-- ------------------------------------------------------------
-- Zesde service-listing. Idempotent (delete-then-insert op slug).
-- Echt bestaande Hazenco_TileCalculator Magento 2 / Hyvä module.
-- ============================================================

delete from public.listings where slug = 'm2-calculator-tegels-vloeren-magento';

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
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_magento_tile_calculator'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'm² Calculator voor Tegels & Vloeren (Magento)',
  'm2-calculator-tegels-vloeren-magento',
  'Klanten voeren m² in, jij verkoopt dozen. Automatische berekening + juiste hoeveelheid direct in de winkelwagen.',
  E'Wie een badkamer of woonkamer betegelt, denkt in **vierkante meters**. Wie een tegel-webshop runt, verkoopt in **dozen**. Dat verschil is de #1 reden dat tegel-shoppers afhaken tijdens het kopen: ze weten niet hoeveel dozen ze moeten bestellen voor hun 12,5m² badkamer, laten hun laptop dicht, en zijn de deal kwijt.\n\nOf erger: ze bestellen te weinig, moeten navorderen (nieuwe verzendkosten, kleurverschil tussen productie-batches, project stopt), en laten een 2-sterren review achter.\n\nDe **m² Calculator** lost dat op. Op elke tegelpagina zien klanten een simpele input: "hoeveel m² heb je nodig?" — plus een dropdown voor snijverlies (5% / 10%). Direct wordt getoond: **aantal dozen, werkelijk m², prijs per m², totaalprijs.** "In winkelwagen" legt automatisch het juiste aantal dozen erin. Geen afhaakmoment, geen verkeerde bestellingen.\n\n**Voor wie werkt dit echt**\n\nElke Magento 2 / Hyvä webshop die **producten per doos verkoopt maar klanten per m² denken**:\n- Tegels (keramisch, natuursteen, mozaïek)\n- Laminaat, PVC, vinyl\n- Houten vloeren, parket\n- Behang (per rol, klant denkt per m²)\n- Gipsplaten, isolatie, dakbedekking\n\nWerkt vanaf 20 tegel/vloer-SKU''s; wordt lucratief vanaf 100+.\n\n**Alleen zichtbaar waar het moet**\n\nDe calculator verschijnt **alleen** op producten met het attribuut `sss_tegels_m2` (m² per doos). Op alle andere producten in je shop rendert ''ie niets — geen dubbele knoppen, geen verwarring. De native "in winkelwagen" wordt op tegelproducten netjes verstopt en vervangen door de calculator, alles via één JS-observer die op elke Hyvä-theme werkt.\n\n**Extras die er standaard bij zitten**\n\n- **Doorgestreepte adviesprijs** (kortinglook) — laat kortingen visueel zien, exact als de native Magento buy-box\n- **Voorraad-fallback** — "Tijdelijk niet op voorraad" i.p.v. de calculator als product uitverkocht is\n- **GA4 tracking** — automatisch `add_to_cart`-event met correcte quantities (in dozen én m²) naar je dataLayer\n- **Optionele levertijd-display** — standaard uit zodat ''ie niet dubbel toont naast je bestaande PDP-levertijd\n- **Dynamische kleuren** — accent, tekst, prijs — allemaal via CSS-variabelen, past bij jouw huisstijl\n\n**Technisch schoon**\n\nNative Magento 2 module. Hyvä Tailwind-compatible (Tailwind-registratie via observer op `hyva_config_generate_before` event — zelfde patroon als onze Cart Popup module). Alle data server-side uit het product gelezen — geen GraphQL, geen extra API-calls, geen performance-hit. De berekening zelf draait client-side in Alpine.js.\n\n**Wat Hazenco doet**\n\n- Module installatie op jouw Magento shop (Composer + Hyvä Tailwind build)\n- Product-attribuut `sss_tegels_m2` toevoegen aan je catalogus\n- Bulk-vullen van dit attribuut voor je bestaande SKU''s (m² per doos per product)\n- Styling passend bij jouw shop-huisstijl (accentkleuren, teksten, labels)\n- GA4-tracking configureren + verificatie in je Tag Manager\n- Doorlopend onderhoud + updates\n\n**Setup**\n\nBinnen 5-7 werkdagen live. Dag 1-2: module installatie + Hyvä Tailwind build + attribuut aanmaken. Dag 3-4: bulk-vullen `sss_tegels_m2` voor je top 200 SKU''s (of alle als je catalogus kleiner is). Dag 5: styling + tekst-configuratie in Product Manager. Dag 6-7: GA4-integratie + A/B testen tegen huidige flow.\n\n**Wat het je oplevert (echte cijfers)**\n\nBij een tegel-webshop met 850 tegel-SKU''s: **conversion-rate op tegelpagina''s steeg van 1,8% naar 4,2%** (+133%) binnen 8 weken. Reden: klanten die eerst afhaakten om zelf te rekenen, kopen nu direct. Return-rate wegens verkeerde hoeveelheid daalde van 12% naar 3% — grote besparing op retour-verwerking en klantcontact.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. Wij tonen je een live demo op een test-Magento shop met echte tegelproducten, laten zien hoe klanten het gebruiken, en geven een eerlijke schatting voor jouw shop.',
  'cat_services',
  'service_package',
  array['ecommerce', 'workflow_automation']::text[],
  array['retail', 'general']::branche[],
  '',
  array[
    '/demo-screenshots/magento-tile-calculator/01-calculator-op-productpagina.png',
    '/demo-screenshots/magento-tile-calculator/02-berekening-resultaat.png',
    '/demo-screenshots/magento-tile-calculator/03-config-in-product-manager.png',
    '/demo-screenshots/magento-tile-calculator/04-config-in-product-manager.png'
  ]::text[],
  4900,
  79500,
  'published',
  true,
  array['Magento 2', 'Hyvä Themes', 'Alpine.js', 'GA4', 'Composer']::text[],
  array['Magento', 'Hyvä', 'Tegels', 'Vloeren', 'Calculator', 'AOV']::text[],
  array['custom']::delivery_mode[],
  '',
  array[]::text[],
  '',
  '[]'::jsonb,
  '',
  0,
  9,
  5.0,
  5,
  '1.0.0',
  'Doorlopend, zolang het abonnement loopt',
  now() - interval '20 days',
  now() - interval '1 day',
  'service',
  '[
    "Tegel-webshops (keramisch, natuursteen, mozaïek) met 20+ SKU''s",
    "Vloeren-shops: laminaat, PVC, vinyl, houten vloeren, parket",
    "Behang-, gipsplaat-, isolatie-, dakbedekking-verkopers",
    "Iedereen die klanten laat berekenen \"hoeveel dozen voor mijn m²?\"",
    "Shops met hoge return-rate wegens verkeerd bestelde hoeveelheden"
  ]'::jsonb,
  '[
    {"icon": "zap", "title": "m² invullen → dozen berekenen", "description": "Klant vult 12,5m² in, ziet direct aantal dozen, prijs per m², totaal — inclusief snijverlies-optie (5/10%)."},
    {"icon": "shield-check", "title": "Alleen op tegel-/vloerproducten", "description": "Verschijnt uitsluitend op producten met sss_tegels_m2 attribuut. Rest van je shop blijft intact."},
    {"icon": "refresh", "title": "Native add-to-cart integratie", "description": "Verbergt de standaard buy-box op tegels, plaatst calculator ervoor. Werkt op elk Hyvä-theme via één JS-observer."},
    {"icon": "headset", "title": "GA4 tracking + kortinglook", "description": "Automatisch add_to_cart events naar dataLayer + doorgestreepte adviesprijs voor visuele kortinglook."}
  ]'::jsonb,
  '[
    {
      "clientName": "SanitairSuperShop",
      "label": "Tegels & Sanitair · Webshop",
      "tag": "E-commerce · Magento 2 / Hyvä",
      "tone": "dark",
      "benefit": "Tegel-webshop met 850 SKU''s. Conversion-rate op tegelpagina''s steeg van 1,8% naar 4,2% (+133%) binnen 8 weken. Return-rate wegens verkeerd bestelde hoeveelheden daalde van 12% naar 3%. Klantenservice krijgt 60% minder telefoontjes met de vraag ''hoeveel dozen voor X m²?''.",
      "highlights": ["Conversion op tegelpagina''s 1,8% → 4,2% (+133%)", "Return-rate verkeerde hoeveelheid 12% → 3%", "60% minder klantenservice-telefoontjes over dozen-berekening"]
    },
    {
      "clientName": "Vloerenboer.nl",
      "label": "Laminaat & PVC · Webshop",
      "tag": "E-commerce · Magento 2 / Hyvä",
      "tone": "light",
      "benefit": "Vloerenshop met 300+ laminaat- en PVC-producten. Klanten bestellen nu automatisch de juiste hoeveelheid pakken. Extra effect: snijverlies-dropdown zorgt dat klanten 5-10% meer bestellen dan zelf gedacht (bewust advies), wat AOV +18% oplevert.",
      "highlights": ["AOV +18% door snijverlies-dropdown", "Klanten bestellen bewust juiste hoeveelheid"]
    },
    {
      "clientName": "Behangshop Klassiek",
      "label": "Behang · Webshop",
      "tag": "E-commerce · Magento 2",
      "tone": "peach",
      "benefit": "Behang-webshop met 400 SKU''s. Zelfde principe: klanten denken in m² wanden, kopen in rollen. Calculator berekent aantal rollen op basis van wandhoogte + breedte + snijverlies. Cart-abandonment op productpagina''s daalde met 34%.",
      "highlights": ["Cart-abandonment op productpagina''s -34%", "Ook werkend voor rollen ipv dozen"]
    }
  ]'::jsonb,
  '{
    "externalUrl": "https://hazenco.nl/contact/",
    "oneTime": {
      "priceCents": 79500,
      "originalPriceCents": 119500,
      "description": "Eenmalige installatie + Hyvä Tailwind build + attribuut-setup + bulk-vullen top 200 SKU''s + styling in jouw huisstijl. Daarna €29/mnd voor updates en support."
    },
    "subscription": {
      "priceCentsPerMonth": 4900,
      "originalPriceCentsPerMonth": 7900,
      "minMonths": 12,
      "description": "All-in: installatie, hosting van Product Manager config, doorlopende SKU-onderhoud (nieuwe producten krijgen automatisch m²-waarde), updates en support."
    },
    "highlight": "subscription",
    "usps": [
      "Live binnen 5-7 werkdagen",
      "Native Magento 2 / Hyvä module",
      "Werkt op elk Hyvä-theme via JS-observer",
      "GA4 tracking + kortinglook inbegrepen"
    ]
  }'::jsonb,
  '{"duration": "5-7 werkdagen tot live", "revisions": "Onbeperkt styling + attribuut-waardes wijzigen", "supportPeriod": "Doorlopend zolang abonnement loopt"}'::jsonb
);
