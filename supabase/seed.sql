-- ============================================================
-- Hazenco Marketplace — Supabase seed data
-- Datum:   2026-05-26
-- Doel:    Vult de catalogus met de demo-data uit
--          src/lib/marketplace-data.ts zodat de marketplace
--          out-of-the-box bruikbare content toont.
--
-- Hoe te runnen:
--   1) Via Supabase SQL Editor:
--        Plak dit bestand in de SQL Editor en klik "Run".
--   2) Via psql:
--        psql "$DATABASE_URL" -f supabase/seed.sql
--
-- Idempotent: alle INSERTs gebruiken ON CONFLICT (...) DO NOTHING,
-- dus het bestand mag meerdere keren gerund worden zonder errors.
--
-- Volgorde:
--   1) categories
--   2) users   (demo accounts, auth_user_id NULL — koppel later
--               handmatig aan een echte Supabase Auth user als nodig)
--   3) sellers
--   4) listings
--   5) listing_versions  (één version per listing = current)
--
-- Deterministische UUIDs:
--   Alle UUIDs worden afgeleid via uuid_generate_v5() op een vaste
--   namespace + de oorspronkelijke string-ID uit de TypeScript-data,
--   zodat herhaalde runs identieke IDs opleveren en cross-references
--   (seller_id, listing_id) stabiel blijven.
-- ============================================================

create extension if not exists "uuid-ossp";

-- Vaste namespace voor alle Hazenco seed UUIDs (zelf gegenereerde v4 UUID,
-- gefixeerd zodat v5-afleidingen reproduceerbaar zijn).
-- d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44
do $$ begin
  perform set_config('hazenco.seed_namespace', 'd5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44', true);
end $$;


-- ===== Categories =====
-- categories.id is TEXT (geen UUID), dus we behouden de originele IDs.

insert into public.categories (id, name, description, type, accent) values
  ('cat_workflows',  'Workflows',       'Kant-en-klare n8n, Make en Zapier flows voor dagelijkse processen.', 'workflow',        '#F26B1D'),
  ('cat_agents',     'AI agents',       'Slimme agents voor support, sales, data en documenttaken.',          'ai_agent',        '#324A6D'),
  ('cat_plugins',    'Plugins',         'Uitbreidingen voor CMS, webshop en bedrijfssoftware.',               'plugin',          '#3D8B5F'),
  ('cat_extensions', 'Extensies',       'Browser-, platform- en workflow-extensies voor teams.',              'extension',       '#1A3C2E'),
  ('cat_skills',     'Skills',          'Herbruikbare AI- en automation skills voor moderne teams.',          'skill',           '#C2540E'),
  ('cat_themes',     'Themes',          'Professionele themes voor webshops, portals en dashboards.',         'theme',           '#6B8070'),
  ('cat_templates',  'Templates',       'Notion, Airtable, dashboard en documenttemplates.',                  'template',        '#FA893D'),
  ('cat_services',   'Servicepakketten','Setup, optimalisatie en onderhoud door geverifieerde builders.',     'service_package', '#1C244B')
on conflict (id) do nothing;


-- ===== Users =====
-- Demo-accounts zonder auth_user_id (NULL = nog niet gekoppeld aan
-- Supabase Auth). De applicatie kan deze later linken via een admin
-- flow of via een trigger op auth.users.
-- We seeden alleen de users die ook een seller-rij krijgen, plus de
-- buyer en admin demo-accounts.

insert into public.users (id, auth_user_id, email, name, role, phone, company, vat_number, billing_street, billing_postal_code, billing_city, billing_country, language, newsletter)
values
  (
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'user_buyer'),
    null,
    'koper@hazenco.nl',
    'Nudi Buyer',
    'buyer',
    '+31 6 12 34 56 78',
    'Nudi Zaken',
    'NL123456789B01',
    'Spuistraat 12',
    '1012 AB',
    'Amsterdam',
    'Nederland',
    'nl',
    true
  ),
  (
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'user_seller'),
    null,
    'seller@hazenco.nl',
    'Hazenco Studio',
    'seller',
    '+31 20 555 12 34',
    'Hazenco Studio B.V.',
    'NL987654321B01',
    'Keizersgracht 88',
    '1015 CV',
    'Amsterdam',
    'Nederland',
    'nl',
    true
  ),
  (
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'user_seller_dataflow'),
    null,
    'hello@dataflow-noord.nl',
    'Dataflow Noord',
    'seller',
    null,
    'Dataflow Noord B.V.',
    null,
    null, null, null, 'Nederland',
    'nl',
    false
  ),
  (
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'user_seller_frontkit'),
    null,
    'hello@frontkit.eu',
    'FrontKit EU',
    'seller',
    null,
    'FrontKit BV',
    null,
    null, null, null, 'Belgie',
    'nl',
    false
  ),
  (
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'user_admin'),
    null,
    'admin@hazenco.nl',
    'Hazenco Admin',
    'admin',
    '+31 20 555 99 00',
    null, null,
    null, null, null, 'Nederland',
    'nl',
    false
  )
on conflict (id) do nothing;


-- ===== Sellers =====

insert into public.sellers (id, user_id, name, handle, status, specialty, bio, location, rating, sales, response_time, verified, website, support_email, vat_number, payout_method)
values
  (
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'user_seller'),
    'Hazenco Studio',
    'hazenco-studio',
    'approved',
    'Procesautomatisering en webshops',
    'Een klein Nederlands team dat automatiseringen begrijpelijk, veilig en onderhoudbaar maakt.',
    'Amsterdam, Nederland',
    4.9,
    148,
    'Binnen 4 uur',
    true,
    'https://hazenco.nl',
    'support@hazenco.nl',
    'NL987654321B01',
    'SEPA · NL12 RABO 0123 4567 89'
  ),
  (
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'user_seller_dataflow'),
    'Dataflow Noord',
    'dataflow-noord',
    'approved',
    'Data, reporting en finance automations',
    'Bouwt betrouwbare datakoppelingen voor mkb-bedrijven met veel losse systemen.',
    'Groningen, Nederland',
    4.7,
    89,
    'Binnen 1 werkdag',
    true,
    'https://dataflow-noord.nl',
    'hello@dataflow-noord.nl',
    null,
    'SEPA'
  ),
  (
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_frontkit'),
    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'user_seller_frontkit'),
    'FrontKit EU',
    'frontkit-eu',
    'approved',
    'Themes, portals en component packs',
    'Maakt rustige, snelle UI-pakketten voor portals, SaaS en servicebedrijven.',
    'Gent, Belgie',
    4.8,
    112,
    'Binnen 6 uur',
    true,
    'https://frontkit.eu',
    'hello@frontkit.eu',
    null,
    'SEPA'
  )
on conflict (id) do nothing;


-- ===== Listings =====
-- Eén INSERT per listing voor leesbaarheid. UUIDs zijn v5-afgeleid van
-- de originele string-ID, zodat referenties (seller_id) stabiel zijn.
-- Arrays gebruiken Postgres array-literal syntax met expliciete casts
-- naar de juiste enum-arrays (delivery_mode[], branche[]).
-- demo_credentials wordt als jsonb opgeslagen.

-- listing_invoice_agent
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_invoice_agent'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Factuur AI Verwerker',
  'factuur-ai-verwerker',
  'Laat inkomende facturen automatisch lezen, controleren en klaarzetten.',
  'Een AI-agent workflow die inkomende facturen uit mailboxen haalt, kerngegevens controleert, afwijkingen markeert en alles overzichtelijk naar je boekhoudproces doorzet.',
  'cat_agents', 'ai_agent',
  array['workflow_automation','data_integration','email_marketing'],
  array['financial','professional_services','general']::branche[],
  14900, 24900, 'published', true,
  array['n8n','Gmail','Outlook','Google Drive','Moneybird'],
  array['Finance','Documenten','OCR','MKB'],
  array['download','cloud','custom']::delivery_mode[],
  'https://demo.hazenco.nl/factuur-ai',
  array['Inbox check','Factuur extractie','Controle dashboard'],
  'Gebruik de voorbeeldfactuur en bekijk hoe velden, fouten en exports worden gevuld.',
  '[{"label":"Demo login","value":"demo@hazenco.nl"},{"label":"Wachtwoord","value":"hazenco-demo"}]'::jsonb,
  'PDF factuur met leverancier, totaalbedrag, btw en IBAN.',
  1280, 214, 4.9, 38, '1.6.0', '30 dagen hulp bij installatie'
) on conflict (id) do nothing;

-- listing_bol_sync
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_bol_sync'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Bol.com Order Sync',
  'bol-order-sync',
  'Synchroniseer Bol.com orders met Sheets, Slack en je fulfilmentproces.',
  'Een automation pack voor Nederlandse webshops die Bol.com orders willen volgen, verrijken en doorzetten zonder handwerk.',
  'cat_workflows', 'workflow',
  array['ecommerce','workflow_automation','inventory'],
  array['retail','logistics']::branche[],
  9900, 19900, 'published', true,
  array['Make','Bol.com','Google Sheets','Slack','Webhook'],
  array['E-commerce','Orders','Bol.com','Fulfilment'],
  array['download','cloud','custom']::delivery_mode[],
  'https://demo.hazenco.nl/bol-sync',
  array['Order import overzicht','Make scenario flow','Status mapping configuratie','Slack melding preview','Foutlog & monitoring'],
  'Bekijk een order die automatisch door de controles loopt en in de juiste status eindigt.',
  '[{"label":"Demo workspace","value":"Alleen lezen"}]'::jsonb,
  'Bol.com order webhook met verzendstatus en klantreferentie.',
  934, 176, 4.8, 29, '2.1.3', '14 dagen support'
) on conflict (id) do nothing;

-- listing_wp_speed_plugin
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_wp_speed_plugin'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
  'WP Speed Check Plugin',
  'wp-speed-check-plugin',
  'Monitor WordPress performance en krijg praktische optimalisatie-acties.',
  'Een lichtgewicht plugin die periodiek snelheid, cache-status en zware scripts controleert en concrete verbeterpunten toont.',
  'cat_plugins', 'plugin',
  array['analytics','ecommerce'],
  array['retail','marketing_media','ict']::branche[],
  5900, 12900, 'published', false,
  array['WordPress','WooCommerce','PHP 8+'],
  array['WordPress','Performance','Monitoring'],
  array['download','custom']::delivery_mode[],
  'https://demo.hazenco.nl/wp-speed',
  array['Score overzicht','Script analyse','Advieslijst'],
  'Klik door de rapportage en bekijk de prioriteitenlijst voor een testsite.',
  '[{"label":"Demo modus","value":"Geen login nodig"}]'::jsonb,
  'WordPress site URL met WooCommerce checkout.',
  522, 94, 4.6, 14, '1.2.0', '7 dagen installatievragen'
) on conflict (id) do nothing;

-- listing_support_skill
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_support_skill'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Klantenservice Triage Skill',
  'klantenservice-triage-skill',
  'Classificeer vragen, prioriteiten en conceptantwoorden in duidelijke taal.',
  'Een herbruikbare skill pack voor AI-assistenten die supportmails samenvat, prioriteert en een nette conceptherhaling opstelt.',
  'cat_skills', 'skill',
  array['customer_support','chatbot','email_marketing'],
  array['general','ict','professional_services']::branche[],
  7900, 14900, 'published', false,
  array['OpenAI','Claude','Gmail','Zendesk','Freshdesk'],
  array['Support','AI','E-mail','SLA'],
  array['download','cloud']::delivery_mode[],
  'https://demo.hazenco.nl/support-skill',
  array['Inbox triage','SLA label','Antwoord concept'],
  'Plak een voorbeeldmail en bekijk hoe prioriteit, toon en actiepunten worden bepaald.',
  '[{"label":"Demo","value":"Voorbeelddata inbegrepen"}]'::jsonb,
  'Klantmail met klacht, ordernummer en urgent verzoek.',
  418, 73, 4.7, 11, '1.4.1', '30 dagen prompt-afstemming'
) on conflict (id) do nothing;

-- listing_portal_theme
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_portal_theme'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_frontkit'),
  'Service Portal Theme',
  'service-portal-theme',
  'Een rustige portal theme voor support, downloads en klantomgevingen.',
  'Een moderne theme set met dashboard, ticketlijst, bestandenbibliotheek en statuspagina. Gericht op servicebedrijven in Europa.',
  'cat_themes', 'theme',
  array['customer_support','crm'],
  array['professional_services','ict']::branche[],
  8900, 18900, 'published', true,
  array['Next.js','Tailwind','React','Supabase'],
  array['Portal','Theme','Dashboard','Support'],
  array['download','custom']::delivery_mode[],
  'https://demo.hazenco.nl/service-portal',
  array['Klantdashboard','Tickets','Bestanden'],
  'Loop door de klantportal met voorbeeldtickets en een downloadbibliotheek.',
  '[{"label":"Demo login","value":"portal@demo.nl"},{"label":"Wachtwoord","value":"portal-demo"}]'::jsonb,
  'Klantaccount met drie open tickets en twee contractdocumenten.',
  803, 121, 4.8, 22, '3.0.0', '14 dagen theme support'
) on conflict (id) do nothing;

-- listing_meeting_template
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_meeting_template'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
  'Meeting naar Actielijst Template',
  'meeting-naar-actielijst-template',
  'Van transcript naar besluiten, taken en opvolgmail in een paar minuten.',
  'Een template pack voor teams die vergadernotities automatisch willen omzetten naar taken, besluiten en nette follow-ups.',
  'cat_templates', 'template',
  array['project_management','workflow_automation'],
  array['general','professional_services','education']::branche[],
  3900, 9900, 'published', false,
  array['Notion','Google Docs','Teams','Zoom','OpenAI'],
  array['Productiviteit','Meeting','Notion','Teams'],
  array['download','cloud']::delivery_mode[],
  'https://demo.hazenco.nl/meeting-template',
  array['Transcript input','Actielijst','Follow-up mail'],
  'Gebruik het voorbeeldtranscript en bekijk de gegenereerde actielijst.',
  '[{"label":"Demo","value":"Voorbeeld transcript inbegrepen"}]'::jsonb,
  'Meeting transcript met besluiten, acties en eigenaren.',
  612, 158, 4.5, 17, '1.1.0', '7 dagen vragen over gebruik'
) on conflict (id) do nothing;

-- listing_browser_extension
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_browser_extension'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_frontkit'),
  'CRM Quick Note Extensie',
  'crm-quick-note-extensie',
  'Maak vanuit je browser direct CRM-notities met context en follow-up.',
  'Een browserextensie die geselecteerde tekst omzet naar nette CRM-notities, inclusief follow-updatum en samenvatting.',
  'cat_extensions', 'extension',
  array['crm','lead_generation'],
  array['professional_services','marketing_media']::branche[],
  6900, 14900, 'pending', false,
  array['Chrome','Edge','HubSpot','Pipedrive'],
  array['CRM','Browser','Sales'],
  array['download','custom']::delivery_mode[],
  'https://demo.hazenco.nl/crm-note',
  array['Contextmenu','CRM veldmapping','Follow-up'],
  'Selecteer tekst in het voorbeeldscherm en bekijk de notitie-preview.',
  '[{"label":"Demo","value":"Geen login nodig"}]'::jsonb,
  'Geselecteerde tekst uit LinkedIn of e-mail.',
  0, 0, 0, 0, '0.9.0', '14 dagen support na publicatie'
) on conflict (id) do nothing;

-- listing_horeca_reservation_bot
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_horeca_reservation_bot'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Horeca Reservering AI Bot',
  'horeca-reservering-ai-bot',
  'AI-bot die reserveringsvragen 24/7 beantwoordt en boekingen synchroniseert.',
  'Een meertalige AI-assistent voor restaurants en hotels die reserveringsvragen via WhatsApp en mail oppakt en direct in je agenda zet.',
  'cat_agents', 'ai_agent',
  array['chatbot','customer_support'],
  array['horeca']::branche[],
  12900, 24900, 'published', true,
  array['OpenAI','WhatsApp','Google Calendar','Resengo'],
  array['Horeca','Reserveringen','AI','Chatbot'],
  array['cloud','custom']::delivery_mode[],
  'https://demo.hazenco.nl/horeca-bot',
  array['WhatsApp gesprek','Agenda sync','Talen'],
  'Stuur een reservering naar de demo en bekijk hoe de bot bevestigt.',
  '[{"label":"Demo nummer","value":"+31 6 00 00 00 00"}]'::jsonb,
  'Klant vraagt om tafel voor 4 personen vrijdag 19:30.',
  312, 87, 4.8, 13, '1.3.0', '30 dagen support'
) on conflict (id) do nothing;

-- listing_notion_crm_pack
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_notion_crm_pack'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_frontkit'),
  'Notion CRM Template Pack',
  'notion-crm-template-pack',
  'Een lichtgewicht CRM in Notion met pipeline, contacten en follow-ups.',
  'Een uitgebreid Notion-template pakket voor mkb-teams die een eenvoudige CRM willen zonder dure tools.',
  'cat_templates', 'template',
  array['crm','lead_generation'],
  array['professional_services','general']::branche[],
  2900, 7900, 'published', false,
  array['Notion'],
  array['CRM','Notion','MKB','Pipeline'],
  array['download']::delivery_mode[],
  'https://demo.hazenco.nl/notion-crm',
  array['Pipeline','Contacten','Follow-up'],
  'Duplicate het Notion template en vul je eerste deals in.',
  '[{"label":"Demo","value":"Read-only Notion link"}]'::jsonb,
  'Voorbeelddeals en contactgegevens.',
  720, 198, 4.6, 24, '2.0.0', '7 dagen vragen'
) on conflict (id) do nothing;

-- listing_healthcare_agenda_sync
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_healthcare_agenda_sync'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
  'Zorg Agenda Sync Workflow',
  'zorg-agenda-sync-workflow',
  'Synchroniseer behandelagenda''s tussen praktijksoftware en patiëntportaal.',
  'Een Make-scenario voor zorginstellingen dat agenda''s, afspraken en herinneringen netjes synchroniseert volgens AVG-richtlijnen.',
  'cat_workflows', 'workflow',
  array['workflow_automation','data_integration'],
  array['healthcare']::branche[],
  14900, 29900, 'published', false,
  array['Make','Google Calendar','Outlook','Webhook'],
  array['Zorg','Agenda','AVG','Synchronisatie'],
  array['download','custom']::delivery_mode[],
  'https://demo.hazenco.nl/zorg-agenda',
  array['Sync flow','Patient view','Audit log'],
  'Bekijk hoe een afspraak van praktijksysteem naar patiëntenportaal stroomt.',
  '[{"label":"Demo","value":"Read-only voorbeelddata"}]'::jsonb,
  'Nieuwe afspraak in praktijksysteem.',
  184, 42, 4.7, 8, '1.0.2', '14 dagen support'
) on conflict (id) do nothing;

-- listing_woocommerce_cross_sell
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_woocommerce_cross_sell'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'WooCommerce Cross-Sell Plugin',
  'woocommerce-cross-sell-plugin',
  'Automatisch passende producten tonen bij de checkout om je AOV te verhogen.',
  'Een lichtgewicht plugin die op basis van bestelhistorie en producteigenschappen relevante aanvullende producten suggereert.',
  'cat_plugins', 'plugin',
  array['ecommerce','marketing'],
  array['retail']::branche[],
  4900, 11900, 'published', true,
  array['WordPress','WooCommerce','PHP 8+'],
  array['WooCommerce','Cross-sell','Conversie'],
  array['download','cloud']::delivery_mode[],
  'https://demo.hazenco.nl/woo-cross-sell',
  array['Productpagina','Checkout block','Rapportage'],
  'Bekijk hoe het algoritme producten kiest op basis van wagencombinaties.',
  '[{"label":"Demo","value":"Geen login nodig"}]'::jsonb,
  'Winkelmand met twee producten.',
  1042, 263, 4.7, 31, '2.4.1', '30 dagen plugin support'
) on conflict (id) do nothing;

-- listing_bouw_offerte_ai
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_bouw_offerte_ai'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Bouw Offerte Generator AI',
  'bouw-offerte-generator-ai',
  'Snelle, professionele offertes voor aannemers op basis van werkomschrijving.',
  'Een AI-agent voor bouw- en installatiebedrijven die uit een korte projectbeschrijving een nette offerte met posten en kosten opstelt.',
  'cat_agents', 'ai_agent',
  array['form_builder','workflow_automation'],
  array['construction']::branche[],
  19900, 39900, 'published', true,
  array['OpenAI','Word','Google Docs','Exact'],
  array['Bouw','Offertes','AI','MKB'],
  array['cloud','custom']::delivery_mode[],
  'https://demo.hazenco.nl/bouw-offerte',
  array['Project input','Offerte preview','Posten lijst'],
  'Geef een korte werkbeschrijving en zie hoe de offerte wordt opgebouwd.',
  '[{"label":"Demo","value":"Voorbeeldproject inbegrepen"}]'::jsonb,
  'Renovatie badkamer 8m² met sanitair en tegelwerk.',
  246, 64, 4.8, 11, '1.2.0', '30 dagen support + 1 maatwerksessie'
) on conflict (id) do nothing;

-- listing_mollie_status_workflow
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_mollie_status_workflow'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
  'Mollie Payment Status Workflow',
  'mollie-payment-status-workflow',
  'Houd je teams direct op de hoogte van betaalstatussen in Slack of Teams.',
  'Een gratis n8n workflow die Mollie webhooks vertaalt naar overzichtelijke meldingen in Slack of Microsoft Teams.',
  'cat_workflows', 'workflow',
  array['payment_processing','workflow_automation'],
  array['general','retail']::branche[],
  0, 5900, 'published', false,
  array['n8n','Mollie','Slack','Microsoft Teams'],
  array['Betalingen','Mollie','Gratis','Notificaties'],
  array['download']::delivery_mode[],
  'https://demo.hazenco.nl/mollie-status',
  array['Webhook ontvangst','Slack melding','Statusbord'],
  'Trigger een test-betaalstatus en zie de melding verschijnen.',
  '[{"label":"Demo","value":"Geen login nodig"}]'::jsonb,
  'Mollie webhook met betaalstatus ''paid''.',
  2410, 0, 4.5, 42, '1.4.0', 'Community support'
) on conflict (id) do nothing;

-- listing_marketing_dashboard
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_marketing_dashboard'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
  'Marketing Performance Dashboard',
  'marketing-performance-dashboard',
  'Eén dashboard met je belangrijkste marketingmetrieken uit alle kanalen.',
  'Een Looker Studio template dat data uit Google Ads, Meta, LinkedIn en GA4 samenvoegt tot een overzichtelijk weekrapport.',
  'cat_templates', 'template',
  array['analytics','marketing'],
  array['marketing_media','retail']::branche[],
  7900, 16900, 'published', false,
  array['Looker Studio','Google Ads','Meta','LinkedIn Ads','GA4'],
  array['Marketing','Dashboard','Reporting','Looker'],
  array['download','custom']::delivery_mode[],
  'https://demo.hazenco.nl/marketing-dashboard',
  array['Overzicht','Channel breakdown','Trend grafieken'],
  'Open het dashboard en wissel tussen kanalen en periodes.',
  '[{"label":"Demo","value":"Read-only Looker link"}]'::jsonb,
  'Verbonden marketing accounts met 90 dagen data.',
  530, 142, 4.6, 19, '3.1.0', '14 dagen support'
) on conflict (id) do nothing;

-- listing_shopify_inventory_sync
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_shopify_inventory_sync'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Shopify Inventory Sync',
  'shopify-inventory-sync',
  'Houd voorraden in Shopify gelijk met je magazijn en marketplaces.',
  'Een Make-scenario dat voorraadwijzigingen vanuit Shopify doorzet naar Bol.com, Amazon en je magazijnsysteem.',
  'cat_workflows', 'workflow',
  array['inventory','ecommerce'],
  array['retail','logistics']::branche[],
  11900, 22900, 'published', false,
  array['Make','Shopify','Bol.com','Amazon','Picqer'],
  array['Shopify','Voorraad','E-commerce','Marketplace'],
  array['download','cloud','custom']::delivery_mode[],
  'https://demo.hazenco.nl/shopify-inventory',
  array['Sync overzicht','Marketplace status','Foutlog'],
  'Pas een voorraad aan in de demo Shopify en zie de sync.',
  '[{"label":"Demo","value":"Voorbeeld winkel"}]'::jsonb,
  'Voorraadwijziging op productvariant.',
  612, 138, 4.7, 21, '1.5.0', '21 dagen support'
) on conflict (id) do nothing;

-- listing_education_quiz_builder
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_education_quiz_builder'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_frontkit'),
  'Education Quiz Builder',
  'education-quiz-builder',
  'Snel interactieve toetsen bouwen voor klas of online lesomgeving.',
  'Een lichte React-toepassing voor docenten om quizzen, automatische nakijking en feedback per leerling te beheren.',
  'cat_templates', 'template',
  array['form_builder','other'],
  array['education']::branche[],
  1900, 4900, 'published', false,
  array['React','Next.js','Supabase'],
  array['Onderwijs','Quiz','Toetsing'],
  array['download','cloud']::delivery_mode[],
  'https://demo.hazenco.nl/quiz-builder',
  array['Quiz aanmaken','Resultatenview','Feedback'],
  'Maak een quiz en speel hem af in de demo.',
  '[{"label":"Demo docent","value":"demo@school.nl"}]'::jsonb,
  'Quiz met 10 meerkeuzevragen.',
  388, 96, 4.5, 14, '1.1.0', '14 dagen support'
) on conflict (id) do nothing;

-- listing_feedback_survey_ai
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_feedback_survey_ai'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Klantfeedback Samenvatting AI',
  'klantfeedback-samenvatting-ai',
  'Vat duizenden reviews en surveys samen tot actiepunten.',
  'Een AI-agent die ongestructureerde klantfeedback uit Typeform, Trustpilot en Google reviews verwerkt tot thema''s en aanbevelingen.',
  'cat_agents', 'ai_agent',
  array['customer_support','analytics'],
  array['general','retail']::branche[],
  9900, 18900, 'published', false,
  array['OpenAI','Typeform','Trustpilot','Google Business'],
  array['Feedback','AI','Reviews','Survey'],
  array['cloud','custom']::delivery_mode[],
  'https://demo.hazenco.nl/feedback-ai',
  array['Bronselectie','Thema''s','Actielijst'],
  'Laad een sample dataset en bekijk de gegenereerde thema''s.',
  '[{"label":"Demo","value":"Voorbeelddata inbegrepen"}]'::jsonb,
  '500 mixed reviews uit 3 bronnen.',
  462, 108, 4.6, 16, '2.0.0', '21 dagen support'
) on conflict (id) do nothing;

-- listing_linkedin_outreach_skill
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_linkedin_outreach_skill'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
  'LinkedIn Outreach Skill',
  'linkedin-outreach-skill',
  'Persoonlijke connectieverzoeken en follow-ups voor sales teams.',
  'Een AI skill pack die op basis van LinkedIn-profielen relevante openers en opvolgberichten schrijft, afgestemd op je tone of voice.',
  'cat_skills', 'skill',
  array['lead_generation','social_media'],
  array['marketing_media','professional_services']::branche[],
  5900, 11900, 'published', false,
  array['OpenAI','Claude','LinkedIn','HubSpot'],
  array['LinkedIn','Sales','Outreach','AI'],
  array['download','cloud']::delivery_mode[],
  'https://demo.hazenco.nl/linkedin-outreach',
  array['Profiel input','Concept message','Follow-up reeks'],
  'Plak een LinkedIn URL en bekijk de gegenereerde openers.',
  '[{"label":"Demo","value":"Geen login nodig"}]'::jsonb,
  'LinkedIn profiel URL van prospect.',
  794, 187, 4.7, 28, '1.6.2', '14 dagen support'
) on conflict (id) do nothing;

-- listing_whatsapp_chatbot
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_whatsapp_chatbot'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'WhatsApp Business Chatbot',
  'whatsapp-business-chatbot',
  'AI-chatbot die WhatsApp-vragen 24/7 oppakt en sales doorzet.',
  'Een complete WhatsApp Business chatbot die FAQ''s beantwoordt, leads kwalificeert en sales handover naar je team doet.',
  'cat_agents', 'ai_agent',
  array['chatbot','customer_support','lead_generation'],
  array['retail','general','horeca']::branche[],
  14900, 29900, 'published', true,
  array['WhatsApp Business','OpenAI','HubSpot','Pipedrive'],
  array['WhatsApp','Chatbot','AI','Sales'],
  array['cloud','custom']::delivery_mode[],
  'https://demo.hazenco.nl/whatsapp-bot',
  array['WhatsApp UI','Intent flow','Handover'],
  'Stuur een bericht naar het demo nummer en doorloop een scenario.',
  '[{"label":"Demo nummer","value":"+31 6 12 34 56 78"}]'::jsonb,
  'Klantvraag over openingstijden en levertijd.',
  1180, 224, 4.9, 36, '2.3.0', '30 dagen support'
) on conflict (id) do nothing;

-- listing_logistics_track_trace
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_logistics_track_trace'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_frontkit'),
  'Track & Trace Klantpagina',
  'track-trace-klantpagina',
  'Witlabel track & trace pagina voor logistieke partners.',
  'Een Next.js theme met een complete track & trace ervaring die meerdere koeriers koppelt en alerts naar klanten stuurt.',
  'cat_themes', 'theme',
  array['other','ecommerce'],
  array['logistics','retail']::branche[],
  10900, 22900, 'published', false,
  array['Next.js','Tailwind','PostNL','DHL','DPD'],
  array['Logistiek','Track & Trace','Theme','Klantenportaal'],
  array['download','custom']::delivery_mode[],
  'https://demo.hazenco.nl/track-trace',
  array['Klantweergave','Koppelingen','Mail alerts'],
  'Voer een voorbeeld trackingnummer in en bekijk de updates.',
  '[{"label":"Demo","value":"Geen login"}]'::jsonb,
  'PostNL tracking nummer.',
  318, 71, 4.5, 10, '1.0.4', '14 dagen theme support'
) on conflict (id) do nothing;

-- listing_govt_procurement_template
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_govt_procurement_template'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
  'Aanbesteding Tracking Template',
  'aanbesteding-tracking-template',
  'Volg openbare aanbestedingen overzichtelijk in een Airtable-base.',
  'Een Airtable template voor overheids- en non-profitteams die meerdere aanbestedingen tegelijk willen volgen met deadlines en taakverdeling.',
  'cat_templates', 'template',
  array['project_management','other'],
  array['government','professional_services']::branche[],
  3900, 8900, 'published', false,
  array['Airtable','Google Drive'],
  array['Overheid','Aanbesteding','Tracking','Project'],
  array['download']::delivery_mode[],
  'https://demo.hazenco.nl/aanbesteding',
  array['Overzicht','Detail aanbesteding','Deadlines'],
  'Bekijk een base met 5 lopende aanbestedingen.',
  '[{"label":"Demo","value":"Read-only Airtable link"}]'::jsonb,
  'Lijst met aanbestedingen uit TenderNed.',
  168, 44, 4.4, 7, '1.0.0', '7 dagen support'
) on conflict (id) do nothing;

-- listing_ict_onboarding_service
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_ict_onboarding_service'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'ICT Onboarding Service Pack',
  'ict-onboarding-service-pack',
  'Begeleidde IT-onboarding voor nieuwe medewerkers bij scale-ups.',
  'Een maatwerkpakket voor IT-teams: accountprovisioning, hardware setup checklist en eerste-week handover, uitgevoerd door onze consultants.',
  'cat_services', 'service_package',
  array['project_management','customer_support'],
  array['ict','general']::branche[],
  49900, 0, 'published', false,
  array['Google Workspace','Microsoft 365','Okta','Jamf'],
  array['IT','Onboarding','Servicepakket'],
  array['custom']::delivery_mode[],
  'https://demo.hazenco.nl/ict-onboarding',
  array['Playbook','Checklist','Tooling overzicht'],
  'Bekijk het playbook en het tooling-overzicht voor scale-ups.',
  '[{"label":"Demo","value":"PDF preview"}]'::jsonb,
  'Team van 10 nieuwe medewerkers.',
  92, 28, 4.9, 6, '1.0.0', 'Inclusief 3 sessies van 1 uur'
) on conflict (id) do nothing;

-- listing_email_marketing_skill
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_email_marketing_skill'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_dataflow'),
  'Email Marketing AI Schrijver',
  'email-marketing-ai-schrijver',
  'Variantrijke campagne-emails met juiste tone-of-voice.',
  'Een AI skill pack die op basis van je merkrichtlijnen en campagnedoel meerdere e-mailvarianten met onderwerpregels schrijft.',
  'cat_skills', 'skill',
  array['email_marketing','marketing'],
  array['marketing_media','retail']::branche[],
  4900, 9900, 'published', false,
  array['OpenAI','Claude','Mailchimp','Klaviyo','Brevo'],
  array['E-mail','Marketing','AI','Copy'],
  array['download','cloud']::delivery_mode[],
  'https://demo.hazenco.nl/email-skill',
  array['Brief input','Mailvarianten','Subject lines'],
  'Geef een briefing en bekijk 5 mailvarianten.',
  '[{"label":"Demo","value":"Voorbeeld merkrichtlijnen"}]'::jsonb,
  'Black Friday promotie 30% korting.',
  982, 241, 4.7, 33, '1.8.0', '14 dagen support'
) on conflict (id) do nothing;

-- listing_real_estate_lead_form
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_real_estate_lead_form'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_frontkit'),
  'Makelaar Lead Form Extensie',
  'makelaar-lead-form-extensie',
  'Slimme contactformulieren voor makelaars met automatische lead scoring.',
  'Een browserextensie die op makelaarsites slimme lead formulieren injecteert met directe doorzetting naar je CRM en lead-score.',
  'cat_extensions', 'extension',
  array['lead_generation','form_builder'],
  array['professional_services']::branche[],
  7900, 14900, 'published', false,
  array['Chrome','Edge','Pipedrive','HubSpot'],
  array['Makelaar','Leads','Form'],
  array['download','custom']::delivery_mode[],
  'https://demo.hazenco.nl/makelaar-form',
  array['Formulier injectie','CRM mapping','Lead score'],
  'Open de demo makelaarsite en vul een lead in.',
  '[{"label":"Demo","value":"Voorbeeldsite ingebed"}]'::jsonb,
  'Bezoeker vraagt bezichtiging aan.',
  264, 58, 4.5, 9, '1.1.1', '14 dagen support'
) on conflict (id) do nothing;

-- listing_stripe_dashboard_theme
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_stripe_dashboard_theme'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_frontkit'),
  'Stripe Payments Dashboard Theme',
  'stripe-payments-dashboard-theme',
  'Een rustig financieel dashboard voor Stripe-data, klaar voor klanten.',
  'Een Next.js theme met Stripe-koppeling voor SaaS bedrijven: omzet, MRR, churn en grafieken met een professionele look.',
  'cat_themes', 'theme',
  array['payment_processing','analytics'],
  array['financial','ict']::branche[],
  12900, 24900, 'published', true,
  array['Next.js','Tailwind','Stripe','Supabase'],
  array['Stripe','Dashboard','SaaS','Finance'],
  array['download','custom']::delivery_mode[],
  'https://demo.hazenco.nl/stripe-dashboard',
  array['MRR overzicht','Customer view','Churn analyse'],
  'Klik door het dashboard met voorbeelddata.',
  '[{"label":"Demo login","value":"demo@saas.nl"}]'::jsonb,
  'SaaS met 200 betalende klanten.',
  596, 134, 4.8, 22, '2.0.1', '21 dagen theme support'
) on conflict (id) do nothing;

-- listing_restaurant_menu_social
insert into public.listings (
  id, seller_id, title, slug, tagline, description, category_id, type,
  use_cases, branches, price_cents, setup_price_cents, status, featured,
  compatibility, tags, delivery_modes,
  demo_url, demo_screenshots, demo_instructions, demo_credentials, demo_sample_input,
  downloads, sales, rating, review_count, version, support_included
) values (
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_restaurant_menu_social'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Restaurant Menu Social Workflow',
  'restaurant-menu-social-workflow',
  'Eén menu-update, automatisch overal: site, Instagram en Facebook.',
  'Een Zapier-workflow voor restaurants die menukaarten centraal beheert en alle online kanalen ineens bijwerkt.',
  'cat_workflows', 'workflow',
  array['social_media','marketing'],
  array['horeca']::branche[],
  0, 6900, 'published', false,
  array['Zapier','Airtable','Instagram','Facebook','Webflow'],
  array['Horeca','Menu','Social','Gratis'],
  array['download','cloud']::delivery_mode[],
  'https://demo.hazenco.nl/restaurant-menu',
  array['Menu basis','Social posts','Site update'],
  'Pas een menu-item aan en zie hoe alle kanalen meegaan.',
  '[{"label":"Demo","value":"Voorbeeldrestaurant"}]'::jsonb,
  'Nieuwe specialiteit toegevoegd aan menu.',
  1820, 0, 4.6, 51, '1.2.0', 'Community support'
) on conflict (id) do nothing;


-- ===== Listing versions =====
-- Eén "current" version-rij per listing (= het versienummer dat ook
-- in listings.version staat). De unique constraint (listing_id,
-- version) zorgt dat herhaalde runs geen duplicaten genereren —
-- ON CONFLICT op id zou hetzelfde id eisen, dus we vangen ook
-- op de unique key af voor extra robuustheid.

insert into public.listing_versions (id, listing_id, version, changelog, breaking) values
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_invoice_agent'),            uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_invoice_agent'),            '1.6.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_bol_sync'),                 uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_bol_sync'),                 '2.1.3', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_wp_speed_plugin'),          uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_wp_speed_plugin'),          '1.2.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_support_skill'),            uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_support_skill'),            '1.4.1', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_portal_theme'),             uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_portal_theme'),             '3.0.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_meeting_template'),         uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_meeting_template'),         '1.1.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_browser_extension'),        uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_browser_extension'),        '0.9.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_horeca_reservation_bot'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_horeca_reservation_bot'),   '1.3.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_notion_crm_pack'),          uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_notion_crm_pack'),          '2.0.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_healthcare_agenda_sync'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_healthcare_agenda_sync'),   '1.0.2', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_woocommerce_cross_sell'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_woocommerce_cross_sell'),   '2.4.1', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_bouw_offerte_ai'),          uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_bouw_offerte_ai'),          '1.2.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_mollie_status_workflow'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_mollie_status_workflow'),   '1.4.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_marketing_dashboard'),      uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_marketing_dashboard'),      '3.1.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_shopify_inventory_sync'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_shopify_inventory_sync'),   '1.5.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_education_quiz_builder'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_education_quiz_builder'),   '1.1.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_feedback_survey_ai'),       uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_feedback_survey_ai'),       '2.0.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_linkedin_outreach_skill'),  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_linkedin_outreach_skill'),  '1.6.2', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_whatsapp_chatbot'),         uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_whatsapp_chatbot'),         '2.3.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_logistics_track_trace'),    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_logistics_track_trace'),    '1.0.4', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_govt_procurement_template'),uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_govt_procurement_template'),'1.0.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_ict_onboarding_service'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_ict_onboarding_service'),   '1.0.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_email_marketing_skill'),    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_email_marketing_skill'),    '1.8.0', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_real_estate_lead_form'),    uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_real_estate_lead_form'),    '1.1.1', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_stripe_dashboard_theme'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_stripe_dashboard_theme'),   '2.0.1', 'Initial seeded release.', false),
  (uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'version_listing_restaurant_menu_social'),   uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'listing_restaurant_menu_social'),   '1.2.0', 'Initial seeded release.', false)
on conflict (id) do nothing;


-- ============================================================
-- Klaar.
-- Verwacht resultaat (eerste run):
--   categories       : 8 rijen
--   users            : 5 rijen
--   sellers          : 3 rijen
--   listings         : 26 rijen
--   listing_versions : 26 rijen
-- ============================================================
