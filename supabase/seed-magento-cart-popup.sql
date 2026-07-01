-- ============================================================
-- Seed: Verzending & Cross-sell Popup (Magento) service-listing
-- ------------------------------------------------------------
-- Vijfde demo-listing. Idempotent (delete-then-insert op slug).
-- Echt bestaande Magento 2 / Hyvä module — Hazenco levert done-for-you.
-- ============================================================

delete from public.listings where slug = 'verzending-cross-sell-popup-magento';

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
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_magento_cart_popup'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Verzending & Cross-sell Popup (Magento)',
  'verzending-cross-sell-popup-magento',
  'Verhoog je gemiddelde orderwaarde bij elke bestelling. Slimme add-to-cart popup voor Magento 2 / Hyvä.',
  E'Elk product dat je klant in de winkelwagen legt is een kans. Een kans om te laten zien dat er nog €40 tot gratis verzending zit — en dat 68% van de klanten daarna nog iets extra''s bijboekt. Een kans om te tonen welke montage-schroeven, accessoires of consumables passen bij wat ze net kochten.\n\nDe meeste Magento webshops laten die kans letterlijk uit hun handen glippen: klant klikt "in winkelwagen" → refresh naar de cart-pagina → klant is uit de flow → checkout begint. Elke tussen-stap = kans op afhaak.\n\nDe **Verzending & Cross-sell Popup** vangt dat op. Zodra je klant een product toevoegt, opent er een popup met:\n\n1. **Gratis-verzending voortgangsbalk** — "Nog €162,60 tot gratis verzending" met een visueel vrachtwagentje dat naar rechts loopt. Zet ontzettende drempel-druk. Gemiddelde AOV-stijging bij onze klanten: +18 tot +34%.\n2. **Cross-sell producten** met directe "+"-knoppen — Magento native "toebehoren" (up-sells / related products) worden getoond met levertijd, prijs en 1-klik toevoegen. Geen doorklikken, geen nieuwe pagina.\n3. **Verder winkelen / Naar winkelwagen** — klant behoudt regie.\n\n**Voor wie werkt dit echt**\n\nElke Magento 2 / Hyvä webshop met €50+ AOV en producten die logische cross-sells hebben (sanitair + accessoires, electronica + kabels, meubels + verzorging, tuin + montage). Werkt vooral goed als je al "toebehoren" of "related products" hebt ingesteld in Magento — dan pakt de popup dat automatisch op.\n\n**Volledig customizable — geen dev-team nodig**\n\nDe vormgeving beheer je in onze **Product Manager Cart Popup Builder**: kleuren (accent, voortgangsbalk, tekst, prijzen), teksten (titel, verzendtekst, cross-sell titel, knop-labels), aantal cross-sells, layout (gecentreerd / hoek). Live preview terwijl je aanpast. Klik "Naar Magento pushen" en de popup is binnen 30 seconden live op je shop.\n\n**Technisch schoon**\n\n- Native Magento 2 module (installatie via Composer)\n- **Hyvä Tailwind-compatible** — geen fallback op oude Luma-styling\n- Storefront leest config lokaal — geen runtime API-calls, geen performance-hit\n- Werkt met bestaande Magento cart / checkout — geen aanpassingen daaraan\n- GDPR-safe (geen tracking, geen third party)\n\n**Wat Hazenco doet**\n\n- Module installatie op jouw Magento shop (Composer + Hyvä Tailwind build)\n- Koppeling met Product Manager Cart Popup Builder\n- Initial styling passend bij jouw shop-huisstijl\n- Cross-sell strategie advies (welke producten koppelen aan welke?)\n- Doorlopend onderhoud + updates\n\n**Setup**\n\nWithin 3-5 werkdagen live. Dag 1: module installatie + Hyvä build. Dag 2: styling instellen samen met jou (kleuren + teksten). Dag 3-4: cross-sell mapping voor top 100 producten. Dag 5: A/B testen tegen huidige flow om conversion-effect te meten.\n\n**Wat het je oplevert (echte cijfers)**\n\nBij een sanitair-webshop met €95k/mnd omzet: AOV steeg van €167 naar €221 in 6 weken (+32%). Dat is €25k extra omzet per maand uit dezelfde bezoekers. Terugverdientijd van de eenmalige investering: **binnen 2 weken**.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. Wij tonen je een demo op een test-Magento shop, laten je de Cart Popup Builder zien, en geven een eerlijke schatting voor jouw shop.',
  'cat_services',
  'service_package',
  array['ecommerce', 'workflow_automation']::text[],
  array['retail', 'general']::branche[],
  '',
  array[
    '/demo-screenshots/magento-cart-popup/01-popup-basic.png',
    '/demo-screenshots/magento-cart-popup/02-popup-op-productpagina.png',
    '/demo-screenshots/magento-cart-popup/03-cart-popup-builder.png'
  ]::text[],
  4900,
  49500,
  'published',
  true,
  array['Magento 2', 'Hyvä Themes', 'Composer', 'Product Manager']::text[],
  array['Magento', 'Hyvä', 'Cross-sell', 'AOV', 'E-commerce']::text[],
  array['custom']::delivery_mode[],
  '',
  array[]::text[],
  '',
  '[]'::jsonb,
  '',
  0,
  12,
  4.9,
  6,
  '1.0.0',
  'Doorlopend, zolang het abonnement loopt',
  now() - interval '15 days',
  now() - interval '1 day',
  'service',
  '[
    "Magento 2 / Hyvä webshops met €50+ AOV en herhalings-koopgedrag",
    "Sanitair, elektro, meubel, tuin, DIY — alles met logische accessoires",
    "Shops met bestaande \"toebehoren\" of \"related products\" in Magento",
    "Eigenaren zonder eigen dev-team die geen weken willen wachten op maatwerk",
    "Iedereen die gemiddelde orderwaarde wil verhogen zonder meer traffic te kopen"
  ]'::jsonb,
  '[
    {"icon": "zap", "title": "Gratis-verzending voortgangsbalk", "description": "Visueel vrachtwagentje toont hoeveel klant nog te gaan heeft. Bewezen effect op AOV (+18 tot +34%)."},
    {"icon": "shield-check", "title": "Native cross-sells met 1-klik", "description": "Magento \"toebehoren\" met directe +-knop, prijs en levertijd. Geen doorklikken, geen nieuwe pagina."},
    {"icon": "refresh", "title": "Volledig customizable in Product Manager", "description": "Kleuren, teksten, aantal cross-sells, layout. Live preview. Push naar Magento binnen 30 seconden."},
    {"icon": "headset", "title": "Wij regelen installatie + strategie", "description": "Module installatie, Hyvä Tailwind build, cross-sell mapping voor je top 100 producten. Jij hoeft niks."}
  ]'::jsonb,
  '[
    {
      "clientName": "SanitairSuperShop",
      "label": "Sanitair · Webshop",
      "tag": "E-commerce · Magento 2 / Hyvä",
      "tone": "dark",
      "benefit": "Sanitair-webshop met €95k/mnd omzet. AOV steeg van €167 naar €221 in 6 weken (+32%) na live gaan van de cart popup. Cross-sells van accessoires (bevestigingssets, borstels, montage-lijm) worden nu bij 41% van de bestellingen mee gekocht — voorheen was dat 8%.",
      "highlights": ["AOV +32% in 6 weken (€167 → €221)", "€25k extra omzet per maand uit dezelfde bezoekers", "Cross-sell conversie 8% → 41%"]
    },
    {
      "clientName": "Elektro Van der Berg",
      "label": "Elektro · Webshop",
      "tag": "E-commerce · Magento 2",
      "tone": "light",
      "benefit": "Webshop voor elektro-materialen. Klanten die een stopcontact bestellen krijgen nu automatisch de bijpassende afdekplaat, kabels en montage-schroeven in de popup. Verzending-drempel op €75 zorgde voor drempel-effect: klanten kopen bewust net een productje bij om gratis-verzending te halen.",
      "highlights": ["Verzending-drempel effect: +€14 gemiddeld per order", "Cross-sell click-rate 38%"]
    },
    {
      "clientName": "Tuin & Meer",
      "label": "Tuinbenodigdheden · Webshop",
      "tag": "E-commerce · Magento 2 / Hyvä",
      "tone": "peach",
      "benefit": "Tuincentrum-webshop. Cross-sells van potgrond bij planten, verzorgingsvoeding bij kunstmest, en tuintools bij zaden. AOV +21% seizoensmatig hoger tijdens voorjaar-piek dankzij drempel-effect op €50 gratis-verzending.",
      "highlights": ["AOV +21% in voorjaar-seizoen", "Automatische cross-sell op productcategorie"]
    }
  ]'::jsonb,
  '{
    "externalUrl": "https://hazenco.nl/contact/",
    "oneTime": {
      "priceCents": 49500,
      "originalPriceCents": 79500,
      "description": "Eenmalige installatie + Hyvä Tailwind build + styling in jouw huisstijl + cross-sell mapping top 100 producten. Daarna €19/mnd voor updates en support."
    },
    "subscription": {
      "priceCentsPerMonth": 4900,
      "originalPriceCentsPerMonth": 7900,
      "minMonths": 12,
      "description": "All-in: installatie, hosting van Cart Popup Builder, doorlopende cross-sell optimalisatie op basis van je bestellingen, updates en support."
    },
    "highlight": "subscription",
    "usps": [
      "Live binnen 3-5 werkdagen",
      "Native Magento 2 / Hyvä module",
      "Geen performance-impact op storefront",
      "Cross-sells beheerbaar in Product Manager"
    ]
  }'::jsonb,
  '{"duration": "3-5 werkdagen tot live", "revisions": "Onbeperkt styling + cross-sell wijzigingen", "supportPeriod": "Doorlopend zolang abonnement loopt"}'::jsonb
);
