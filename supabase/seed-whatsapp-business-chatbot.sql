-- ============================================================
-- Seed: WhatsApp Business Chatbot service-listing
-- ------------------------------------------------------------
-- Tweede demo-listing batch. Idempotent (delete-then-insert op slug).
-- ============================================================

delete from public.listings where slug = 'whatsapp-business-chatbot';

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
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_whatsapp_business_chatbot'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'WhatsApp Business Chatbot',
  'whatsapp-business-chatbot',
  'Klanten vragen, je bot antwoordt direct — 24/7. Jouw team grijpt alleen in bij wat echt aandacht nodig heeft.',
  E'WhatsApp is voor de meeste Nederlandse MKB-bedrijven het belangrijkste klantkanaal geworden. Het probleem: één persoon kan niet 200 chats per dag bijhouden, zeker niet buiten kantooruren. De gevolgen zien we elke week — trage antwoorden, klanten die afhaken, omzet die naar concurrenten verdwijnt.\n\nDe **WhatsApp Business Chatbot** vangt dat op. Een AI die je producten kent, je orderstatus kan opvragen, retouren kan starten, en bestellingen kan plaatsen — allemaal via een gesprek dat aanvoelt als chatten met een vriendelijke collega.\n\n**Wat de bot daadwerkelijk doet**\n\nNiet alleen FAQ-antwoorden. Bij een vraag "waar is mijn bestelling" haalt ''ie real-time de status uit WooCommerce of Shopify en stuurt direct een track & trace link. Bij "hebben jullie dit ook in zwart" zoekt ''ie in je catalogus en stuurt foto + prijs + URL. Bij "ik wil dit bestellen" maakt ''ie een betaal-link via Mollie. Bij een klacht escaleert ''ie binnen 4 minuten naar je team — met de volledige context erbij.\n\n**Voor wie werkt dit echt**\n\nWebshops met meer dan 10 chats per dag, dienstverleners (kappers, garages, makelaars, klusbedrijven) die veel via WhatsApp werken, en B2B-bedrijven waar klanten complexe vragen via chat stellen. Niet voor pure spam-volume operaties — wel voor bedrijven die elke klant een goed gesprek willen geven, alleen niet de tijd hebben om ''m zelf te voeren.\n\n**Volgens Meta-regels, op je eigen nummer**\n\nWe gebruiken de officiële **WhatsApp Business API** (geen grijze workarounds, geen schorsing-risico). Je bestaande zakelijke nummer wordt verbonden. Klanten zien gewoon jouw bedrijfsnaam, jouw logo. Geen "powered by"-rommel.\n\n**De bot weet niet alles — en dat is goed**\n\nWij stoppen er JOUW kennis in: productcatalogus, openingstijden, verzendkosten, retourbeleid, FAQ. Wat ''ie niet weet vraagt ''ie netjes na of escaleert ''ie. We trainen ''m op jouw toon (formeel/informeel, met of zonder emoji''s) en je merknaam. Het voelt als jouw bedrijf, niet als een generieke bot.\n\n**Setup**\n\nBinnen 7-10 werkdagen ben je live. Eerste week vooral testen met fake chats; tweede week parallel met je huidige flow zodat je kunt vergelijken. We koppelen aan je bestaande webshop (WooCommerce, Shopify, Magento, Lightspeed), betaalprovider (Mollie, Stripe), en CRM (HubSpot, Pipedrive, of gewoon mail/Slack).\n\n**Wat je krijgt naast de bot**\n\nDashboard waarin je elke chat ziet, kunt overnemen, en analytics bekijkt (top vragen, conversie via chat, omzet via chat, klant-tevredenheid). Plus per ochtend een dagrapport in Slack of mail.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten zien hoe het werkt voor een soortgelijke webshop of dienstverlener, je hoort exacte voorbeeldgesprekken, en je krijgt een eerlijke schatting voor jouw situatie. Geen verkooppraatjes — gewoon laten zien wat het doet.',
  'cat_services',
  'service_package',
  array['customer_support', 'ecommerce', 'lead_generation']::text[],
  array['retail', 'professional_services', 'horeca', 'general']::branche[],
  '',
  array[
    '/demo-screenshots/whatsapp-business-chatbot/01-dashboard.png',
    '/demo-screenshots/whatsapp-business-chatbot/02-inbox.png',
    '/demo-screenshots/whatsapp-business-chatbot/03-conversatie.png',
    '/demo-screenshots/whatsapp-business-chatbot/04-flows.png',
    '/demo-screenshots/whatsapp-business-chatbot/05-antwoorden.png',
    '/demo-screenshots/whatsapp-business-chatbot/06-analytics.png'
  ]::text[],
  8900,
  59500,
  'published',
  true,
  array['WhatsApp Business API', 'WooCommerce', 'Shopify', 'Mollie', 'HubSpot', 'Slack']::text[],
  array['WhatsApp', 'Chatbot', 'AI', 'E-commerce', 'Customer Service']::text[],
  array['custom']::delivery_mode[],
  '',
  array[]::text[],
  '',
  '[]'::jsonb,
  '',
  0,
  31,
  4.8,
  14,
  '',
  'Doorlopend, zolang het abonnement loopt',
  now() - interval '55 days',
  now() - interval '2 days',
  'service',
  '[
    "Webshops met meer dan 10 chats per dag (Magento, WooCommerce, Shopify)",
    "Dienstverleners die veel via WhatsApp werken — kappers, garages, klusbedrijven",
    "Makelaars en advocaten met klanten die complexe vragen via chat stellen",
    "B2B-bedrijven die bestaande klanten snel en persoonlijk willen helpen",
    "Iedereen die buiten kantooruren omzet misloopt door late reacties"
  ]'::jsonb,
  '[
    {"icon": "message-circle", "title": "Officiële WhatsApp Business API", "description": "Op je bestaande nummer, met je bedrijfsnaam en groene vinkje. Geen schorsings-risico, volgens Meta-regels."},
    {"icon": "zap", "title": "AI met JOUW kennis", "description": "Kent je productcatalogus, prijzen, openingstijden, retourbeleid. Geen generieke antwoorden."},
    {"icon": "refresh", "title": "Real-time koppelingen", "description": "WooCommerce, Shopify, Mollie, Pipedrive — bot haalt orderstatus en stuurt track & trace direct uit je systeem."},
    {"icon": "users", "title": "Slim overdragen naar mens", "description": "Bij klachten of complexe vragen escaleert de bot naar je team — mét de volledige chat-context erbij."}
  ]'::jsonb,
  '[
    {
      "clientName": "TuinThuis",
      "label": "Webshop · Tuinmeubels",
      "tag": "MKB · E-commerce",
      "tone": "dark",
      "benefit": "Webshop voor tuinmeubels — 3.247 chats per maand waarvan 94% volledig door bot afgehandeld. Bot plaatste 192 bestellingen direct via chat (AOV €149) en bespaarde het team 128 uur per maand.",
      "highlights": ["94% chats zonder mens afgehandeld", "€28.640 maandelijkse omzet via chat", "128u/mnd tijd bespaard"]
    },
    {
      "clientName": "Klusbedrijf De Vakman",
      "label": "Dienstverlening · Bouw",
      "tag": "MKB · Service",
      "tone": "light",
      "benefit": "Voor een klusbedrijf vangt de bot offerte-aanvragen op via WhatsApp, stelt 5 verduidelijkende vragen, en plant direct een opname-afspraak in. Resultaat: 3x meer leads door snellere reactietijd.",
      "highlights": ["Reactietijd van 4 uur → 8 seconden", "3x meer offerte-aanvragen converteren"]
    },
    {
      "clientName": "Makelaardij Vermeer",
      "label": "Vastgoed · Service",
      "tag": "Makelaar · Service",
      "tone": "peach",
      "benefit": "Bot beantwoordt 24/7 vragen over woningen in het bestand, plant bezichtigingen via Calendly, en stuurt brochures direct in de chat. Klanten waarderen vooral de snelheid ''s avonds — meeste interesse komt na 19:00.",
      "highlights": ["Bezichtigingen ingepland ''s avonds: +47%", "Brochures via chat: 78% open-rate"]
    }
  ]'::jsonb,
  '{
    "externalUrl": "https://hazenco.nl/contact/",
    "oneTime": {
      "priceCents": 59500,
      "originalPriceCents": 89500,
      "description": "Eenmalige setup + API-verificatie + integratie met je webshop. Daarna €39/mnd voor hosting, AI-credits (tot 1.000 chats/mnd) en updates."
    },
    "subscription": {
      "priceCentsPerMonth": 8900,
      "originalPriceCentsPerMonth": 12900,
      "minMonths": 6,
      "description": "All-in: setup, hosting, AI-credits (tot 3.000 chats/mnd), webshop-koppeling, dagelijkse rapportages en doorlopende flow-updates."
    },
    "highlight": "subscription",
    "usps": [
      "Live binnen 7-10 werkdagen",
      "Officiële WhatsApp Business API",
      "Op je bestaande nummer",
      "Maandelijks opzegbaar na minimumperiode"
    ]
  }'::jsonb,
  '{"duration": "7-10 werkdagen tot live", "revisions": "Onbeperkt flows bijschaven", "supportPeriod": "Doorlopend zolang abonnement loopt"}'::jsonb
);
