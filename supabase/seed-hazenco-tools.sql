-- ============================================================
-- Hazenco Toolshub — seed van Hazenco's eigen 5 hoofd-tools
-- Datum:    2026-05-26
-- Doel:     Voegt Hazenco's eigen tools toe naast de mock-data,
--           zodat de catalogus de echte propositie toont.
--
-- Hoe te runnen:
--   Supabase SQL Editor → New query → plak → Run.
--
-- Idempotent: ON CONFLICT (id) DO NOTHING — kan veilig herhaald.
--
-- Seller: hergebruikt 'seller_hazenco' uit seed.sql (UUID via
--          uuid_generate_v5 met vaste namespace).
-- Status:  published + featured = true zodat ze direct in catalogus
--          en homepage 'Uitgelicht' sectie verschijnen.
-- Prijs:   price_cents = maandtarief, setup_price_cents = eenmalig
--          setup-bedrag (zie design-system.md voor pricing-model).
-- ============================================================

create extension if not exists "uuid-ossp";

-- Vaste namespace (zelfde als seed.sql) zodat UUIDs reproducible zijn
-- en seller_hazenco hier dezelfde id krijgt als in seed.sql.

-- ===== Hazenco Price Tool =====
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  hero_image_url,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_price_tool'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Hazenco Price Tool',
  'hazenco-price-tool',
  'Dynamic pricing en concurrentie-scraper voor je webshop op auto-piloot',
  'Hazenco''s pricing engine scraped continu concurrentprijzen, analyseert je marge en past je webshop-prijzen automatisch aan met regels die jij instelt. Volledig geïntegreerd met Magento, WooCommerce en Shopify. Geen handmatig Excel-werk meer, geen verloren marge door verouderde prijzen.',
  'cat_workflows', 'workflow',
  array['ecommerce','data_integration','analytics'],
  array['retail']::branche[],
  9900, 29900, 'published', true,
  array['Magento','WooCommerce','Shopify','Lightspeed'],
  array['Pricing','Concurrentie','Margin','Automation'],
  array['cloud','custom']::delivery_mode[],
  null,
  array[]::text[],
  'Live scraping van top-3 concurrenten, prijswijziging volgens regels, dagelijkse rapport.',
  '[]'::jsonb,
  'Productlijst uit je webshop catalogus.',
  'https://picsum.photos/seed/hazenco-price/800/450',
  0, 0, 0, 0, '1.2.0', '30 dagen hulp bij installatie + onboarding sessie'
) on conflict (id) do nothing;


-- ===== Hazenco CEP (Customer Engagement Platform) =====
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  hero_image_url,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_cep'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Hazenco CEP',
  'hazenco-cep',
  'Mailchimp-alternatief voor MKB: nieuwsbrieven, reviews én abandoned cart in één',
  'Customer Engagement Platform met campagne-bouwer, automatische abandoned-cart triggers, review-management en lifecycle e-mails. Eén tool ipv vier losse abonnementen. Direct te koppelen aan je webshop en CRM voor segmentatie op aankoopgedrag.',
  'cat_services', 'service_package',
  array['marketing','email_marketing','ecommerce','customer_support','crm'],
  array['retail','professional_services']::branche[],
  7900, 24900, 'published', true,
  array['Magento','WooCommerce','Shopify','HubSpot'],
  array['Email','Marketing','Reviews','Abandoned Cart','SaaS'],
  array['cloud']::delivery_mode[],
  null,
  array[]::text[],
  'Campagne-builder, abandoned cart triggers, review collector, KPI dashboard.',
  '[]'::jsonb,
  'Klantenlijst en abandoned cart data uit je webshop.',
  'https://picsum.photos/seed/hazenco-cep/800/450',
  0, 0, 0, 0, '2.0.0', 'Onbeperkte support tijdens abonnement'
) on conflict (id) do nothing;


-- ===== Hazenco Blog Tool =====
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  hero_image_url,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_blog_tool'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Hazenco Blog Tool',
  'hazenco-blog-tool',
  'AI-blog van idee tot live: onderwerp, schrijven, SEO en publiceren — onbemand',
  'Volledig autonome blog-workflow: AI bedenkt onderwerpen op basis van je SEO-doelen, schrijft het artikel inclusief afbeeldingen, optimaliseert voor zoekmachines en publiceert direct in je CMS. Jij bepaalt de toon en de doelgroep — de AI doet de uren.',
  'cat_agents', 'ai_agent',
  array['marketing'],
  array['general','professional_services','retail']::branche[],
  4900, 14900, 'published', true,
  array['WordPress','Wix','Strapi','Webflow'],
  array['AI','Content','SEO','Blog','Autonomous'],
  array['cloud']::delivery_mode[],
  null,
  array[]::text[],
  'Topic generator, AI writer, SEO optimizer, auto-publisher per CMS.',
  '[]'::jsonb,
  'Je niche + 3 voorbeeld-keywords waar je op wil ranken.',
  'https://picsum.photos/seed/hazenco-blog/800/450',
  0, 0, 0, 0, '1.4.0', '30 dagen hulp + brand voice training inbegrepen'
) on conflict (id) do nothing;


-- ===== Hazenco Voorraad Tool =====
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  hero_image_url,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_voorraad_tool'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Hazenco Voorraad Tool',
  'hazenco-voorraad-tool',
  'Voorraad-sync tussen leveranciers en je webshop, 24/7 zonder handmatig werk',
  'Volledig geautomatiseerde voorraadbeheer-workflow met live API-koppelingen naar leveranciers en Magento, WooCommerce of je CMS. Voorkomt nooit-meer-op-voorraad-verassingen en out-of-sync stocks. Inclusief alerts bij low-stock en automatische backorder flows.',
  'cat_workflows', 'workflow',
  array['data_integration','ecommerce','project_management'],
  array['retail']::branche[],
  14900, 49900, 'published', true,
  array['Magento','WooCommerce','Lightspeed','Exact','SAP'],
  array['Voorraad','Inventory','Sync','API','Leveranciers'],
  array['cloud','custom']::delivery_mode[],
  null,
  array[]::text[],
  'Live sync dashboard, leveranciers-koppelingen, low-stock alerts.',
  '[]'::jsonb,
  'Lijst van je leveranciers + huidige stock per SKU.',
  'https://picsum.photos/seed/hazenco-voorraad/800/450',
  0, 0, 0, 0, '2.1.0', '30 dagen hulp + leveranciers-onboarding'
) on conflict (id) do nothing;


-- ===== Hazenco Product Manager =====
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  hero_image_url,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_product_manager'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Hazenco Product Manager',
  'hazenco-product-manager',
  'Compleet platform: PIM, sales en stock rond je Magento — vanuit één dashboard',
  'Hazenco''s Product Manager is een totaal-platform dat naast Magento (of andere CMS) staat en al je product-, prijs-, voorraad- en sales-data centraliseert. Geen losse PIM, geen losse stock-tool, geen losse sales-rapport — alles in één scherm voor je productmanager. Bespaart een fulltime FTE bij grote catalogi.',
  'cat_services', 'service_package',
  array['ecommerce','data_integration','project_management','analytics'],
  array['retail']::branche[],
  29900, 99900, 'published', true,
  array['Magento','WooCommerce','Shopify','Lightspeed'],
  array['PIM','Sales','Stock','Platform','Enterprise'],
  array['custom']::delivery_mode[],
  null,
  array[]::text[],
  'PIM editor, sales pipeline, stock matrix, KPI dashboards.',
  '[]'::jsonb,
  'Productcatalogus uit je huidige Magento of CMS.',
  'https://picsum.photos/seed/hazenco-product/800/450',
  0, 0, 0, 0, '3.0.0', 'Dedicated account manager + 30 dagen onboarding'
) on conflict (id) do nothing;


-- ============================================================
-- KLAAR — verifieer in Table Editor: er zouden nu 30 listings
-- moeten staan (was 26: 25 published + 1 pending) + 5 nieuwe
-- Hazenco-tools. Op homepage 'Uitgelicht' sectie zie je featured
-- listings inclusief deze 5.
-- ============================================================
