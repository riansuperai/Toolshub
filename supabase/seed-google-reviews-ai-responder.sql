-- ============================================================
-- Seed: Google Reviews AI-responder service-listing
-- ------------------------------------------------------------
-- Derde demo-listing batch. Idempotent (delete-then-insert op slug).
-- ============================================================

delete from public.listings where slug = 'google-reviews-ai-responder';

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
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_google_reviews_ai_responder'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Google Reviews AI-responder',
  'google-reviews-ai-responder',
  'Reageert binnen 14 minuten op elke review — in jouw toon, en zorgt dat klagers terugkomen.',
  E'97% van de potentiële klanten checkt je Google reviews voordat ze besluiten. En wat ze zien is niet alleen wat anderen zeggen — ze zien ook hoe JIJ reageert. Een eigenaar die binnen een uur persoonlijk antwoordt, ongeacht de score, straalt zorg uit. Een eigenaar die niks zegt, of generiek "bedankt voor uw feedback" plaatst, straalt onverschilligheid uit.\n\nDe **Google Reviews AI-responder** zorgt dat je altijd reageert — binnen 14 minuten gemiddeld, 24/7, in jouw eigen toon, en met écht persoonlijke teksten die niet aanvoelen als een copy-paste.\n\n**Niet "bedankt voor uw feedback"**\n\nDe meeste auto-reply tools spuwen generieke onzin. "Bedankt voor uw feedback, we waarderen het zeer." Iedereen ziet dat het AI is. Erger nog: het laat zien dat je niet eens de moeite hebt genomen om te lezen wat de klant schreef.\n\nWij doen het omgekeerd. De AI **leest elke review woord voor woord**, herkent waar de klant het over had (de gerookte makreel, de wachttijd, de bediening), en bouwt daar een persoonlijk antwoord omheen. Voorbeeld: "Wat fijn om te lezen, Lieke — die gerookte makreel geven we zeker door aan onze keuken. Je punt over de wachttijd nemen we serieus; doordeweeks zou dat soepeler moeten gaan."\n\n**Jouw brand voice, niet die van een bot**\n\nIn de setup leggen we jouw toon vast: u-vorm of je-vorm, formeel of warm, met of zonder emoji''s, hoe je gewoonlijk afsluit. Plus een lijst van **woorden die de AI nooit gebruikt** — "streven naar", "ongemak", corporate jargon dat klanten direct afschrikt. De AI vermijdt het, jij blijft authentiek.\n\n**Klagers terugbrengen**\n\nBij negatieve reviews (1-2 sterren) escaleert de AI niet stilletjes — ''ie bereidt al een conceptantwoord voor en stuurt jou een notificatie met de context. Je beslist of je ''m met één klik plaatst, aanpast, of zelf belt. **Bij 71% van onze klanten verandert een 2★ review in een 4★ binnen 30 dagen** na een persoonlijk telefoontje.\n\n**Voor wie werkt dit echt**\n\nRestaurants, hotels, kappers, schoonheidssalons, fysiotherapeuten, autobedrijven, klusbedrijven, makelaars — eigenlijk elk lokaal MKB waar Google reviews bepalen of nieuwe klanten überhaupt naar je gaan kijken. Het effect is sterkst bij bedrijven met 30+ reviews die niet alles handmatig kunnen bijhouden.\n\n**SEO-effect**\n\nGoogle weegt review-respons mee in het Maps-algoritme. Bedrijven die actief reageren, ranken hoger in de "Map Pack" (de top-3 op kaart). Bij onze klanten zagen we gemiddeld **+18% lokale zichtbaarheid** binnen 3 maanden — meetbaar in Google Business Profile insights.\n\n**Setup**\n\nBinnen 5 werkdagen ben je live. Eerste 7 dagen draait ''ie in "voorstel-modus" (alles wacht op jouw akkoord), zodat je kunt zien of de toon klopt. Daarna kun je per categorie (5★, 4★, 3★, 2★) instellen of de AI direct plaatst of jouw akkoord vraagt. Klachten escaleren altijd naar jou.\n\n**Wat je krijgt**\n\nDashboard met alle reviews (Google, Tripadvisor, Facebook), AI-voorstellen, sentiment-analyse en topic-tracking (wat noemen klanten het vaakst?). Plus per maand een rapport met inzichten: "wachttijd" wordt vaker positief genoemd, "steak" vaker negatief — bruikbare signalen voor je team.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten je drie eigen reviews zien zoals de bot zou antwoorden — geen verkooppraat, gewoon concrete teksten op je echte data.',
  'cat_services',
  'service_package',
  array['customer_support', 'marketing', 'analytics']::text[],
  array['horeca', 'retail', 'healthcare', 'professional_services', 'general']::branche[],
  '',
  array[
    '/demo-screenshots/google-reviews-ai-responder/01-dashboard.png',
    '/demo-screenshots/google-reviews-ai-responder/02-reviews.png',
    '/demo-screenshots/google-reviews-ai-responder/03-reply-editor.png',
    '/demo-screenshots/google-reviews-ai-responder/04-brand-voice.png',
    '/demo-screenshots/google-reviews-ai-responder/05-templates.png',
    '/demo-screenshots/google-reviews-ai-responder/06-analytics.png'
  ]::text[],
  4900,
  39500,
  'published',
  true,
  array['Google Business Profile', 'Tripadvisor', 'Facebook', 'Slack', 'Mail']::text[],
  array['AI', 'Reviews', 'Reputatie', 'SEO', 'MKB']::text[],
  array['custom']::delivery_mode[],
  '',
  array[]::text[],
  '',
  '[]'::jsonb,
  '',
  0,
  47,
  4.9,
  22,
  '',
  'Doorlopend, zolang het abonnement loopt',
  now() - interval '70 days',
  now() - interval '1 day',
  'service',
  '[
    "Restaurants en hotels die 30+ Google reviews per maand krijgen",
    "Kappers, garages en praktijken met klanten die actief reviews achterlaten",
    "Webshops en lokale dienstverleners die in Maps gevonden willen worden",
    "Eigenaren die nu te druk zijn om elke review persoonlijk te beantwoorden",
    "Iedereen met 1-2 sterren reviews die nu onbeantwoord blijven"
  ]'::jsonb,
  '[
    {"icon": "zap", "title": "Persoonlijke antwoorden, geen jargon", "description": "AI leest elke review woord voor woord en bouwt een antwoord op specifieke punten — niet ''bedankt voor uw feedback''."},
    {"icon": "shield-check", "title": "Jouw brand voice vastgelegd", "description": "Toon, lengte, emoji-gebruik en woorden die je nooit wilt gebruiken — wij stoppen het allemaal in de AI tijdens setup."},
    {"icon": "headset", "title": "Klachten escaleren naar jou", "description": "Bij 1-2★ bereidt de bot het antwoord voor, maar plaatst pas na jouw akkoord. Inclusief context en suggestie voor terugbel-actie."},
    {"icon": "refresh", "title": "Multi-platform", "description": "Google, Tripadvisor en Facebook in één dashboard. Slack/mail notificaties bij belangrijke reviews."}
  ]'::jsonb,
  '[
    {
      "clientName": "Brasserie ''t Kompas",
      "label": "Restaurant · Amsterdam",
      "tag": "Horeca · Service",
      "tone": "dark",
      "benefit": "Restaurant in centrum Amsterdam ging van 4.4 naar 4.6 sterren gemiddeld binnen 3 maanden. Eigenaar Daan ziet nu elke review binnen 14 minuten beantwoord verschijnen — en hoeft alleen 2-sterren reviews zelf op te pakken. Map-pack zichtbaarheid +18%.",
      "highlights": ["Score 4.4 → 4.6 in 3 maanden", "+18% lokale zichtbaarheid in Google Maps", "100% reviews beantwoord — geen achterstand"]
    },
    {
      "clientName": "Schoonheidssalon Belle",
      "label": "Beauty · Den Haag",
      "tag": "MKB · Service",
      "tone": "light",
      "benefit": "Salon met 380 reviews kreeg gemiddeld 2-3 nieuwe reviews per week. Onmogelijk om bij te houden naast klanten in de stoel. Bot beantwoordt 5★ direct, 4★ binnen het uur, 1-2★ wacht op akkoord — eigenaar bespaart 4u per week.",
      "highlights": ["4u per week bespaard aan reviews", "Reactie binnen 1u op alle 4-5★ reviews"]
    },
    {
      "clientName": "Autobedrijf Vermeer",
      "label": "Automotive · Utrecht",
      "tag": "MKB · Service",
      "tone": "peach",
      "benefit": "Bij een 2★ review over een te dure reparatie belde Vermeer binnen 30 min persoonlijk terug. Klant kwam terug voor de APK een maand later en updatete naar 5★. Bot detecteerde de escalatie automatisch en triggerde de actie.",
      "highlights": ["71% van 2★ reviews wordt 4-5★ binnen 30 dagen", "Automatische escalatie bij klachten"]
    }
  ]'::jsonb,
  '{
    "externalUrl": "https://hazenco.nl/contact/",
    "oneTime": {
      "priceCents": 39500,
      "originalPriceCents": 59500,
      "description": "Eenmalige setup + brand voice training + koppeling Google/Tripadvisor/Facebook. Daarna €29/mnd voor hosting, AI-credits (tot 200 reviews/mnd) en updates."
    },
    "subscription": {
      "priceCentsPerMonth": 4900,
      "originalPriceCentsPerMonth": 7900,
      "minMonths": 6,
      "description": "All-in: setup, hosting, AI-credits (tot 500 reviews/mnd), maandrapportages, sentiment-analyse en doorlopende brand voice updates."
    },
    "highlight": "subscription",
    "usps": [
      "Live binnen 5 werkdagen",
      "Werkt op Google, Tripadvisor, Facebook",
      "Jouw toon, geen generiek jargon",
      "Klachten escaleren altijd naar jou"
    ]
  }'::jsonb,
  '{"duration": "5 werkdagen tot live", "revisions": "Onbeperkt brand voice bijschaven", "supportPeriod": "Doorlopend zolang abonnement loopt"}'::jsonb
);
