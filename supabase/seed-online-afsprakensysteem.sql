-- ============================================================
-- Seed: Online Afsprakensysteem service-listing
-- ------------------------------------------------------------
-- Vierde demo-listing. Idempotent (delete-then-insert op slug).
-- Done-for-you booking system (Amelia/Salonized-achtig pattern).
-- ============================================================

delete from public.listings where slug = 'online-afsprakensysteem';

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
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_online_afsprakensysteem'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'Online Afsprakensysteem',
  'online-afsprakensysteem',
  'Klanten boeken zelf 24/7, jij houdt focus op het werk. Geen gemiste afspraken, geen heen-en-weer mailtjes meer.',
  E'Telefoonafspraken maken is anno 2026 het grootste obstakel tussen jouw klant en de boeking. 67% van de Nederlandse consumenten geeft aan dat ze liever een dienst overslaan dan een telefoontje plegen — vooral ''s avonds en in het weekend. En jij ondertussen: bellen, mailen, opnieuw bellen, no-shows, dubbel-boekingen.\n\nHet **Online Afsprakensysteem** lost dat op. Klanten zien jouw beschikbaarheid 24/7 op je website, kiezen de dienst + tijd + medewerker, betalen direct, en krijgen automatische bevestiging + herinnering. Jij ziet alles overzichtelijk in één dashboard.\n\n**Niet "nog een agenda-plugin"**\n\nEr zijn genoeg tools die dit kunnen — Amelia, Calendly, Salonized, Trafft. Het probleem: jij moet ze zelf installeren, koppelen aan je website, integreren met Mollie, e-mail templates schrijven, openingstijden + lunchpauzes invoeren per medewerker, no-show beleid instellen, GDPR-compliant maken. Voor de meeste MKB-ers is dat 2-3 dagen werk waar ze nooit aan toekomen.\n\n**Wij doen het, jij gebruikt het**\n\nHazenco zet alles voor je op binnen 5 werkdagen. Volledig op maat: jouw kleuren, jouw merknaam, jouw diensten, jouw medewerkers, jouw werktijden. Wij koppelen aan Mollie (of een andere betaalprovider naar keuze), Google Calendar, je bestaande website, en de WhatsApp Business Chatbot of AI Telefoonassistent als je die ook hebt.\n\n**Wat je krijgt**\n\nEen volwaardig boekingsplatform: agenda (week/maand/dag), klantbeheer, diensten met prijs + duur + buffer, medewerkers met eigen rooster, betaal-integratie, automatische SMS/mail bevestiging + herinnering, no-show systeem met aanbetaling-vereisten, reactivering-flow voor inactieve klanten. Plus een dashboard met de cijfers die er toe doen: bezetting per medewerker, no-show ratio, omzet via online boekingen.\n\n**No-show op 2,4% in plaats van 18%**\n\nDe combinatie van vooraf-betalen + 24u SMS-herinnering + verzet-link (klant kan zelf kosteloos verzetten tot 4u vooraf) brengt no-shows in onze klantenbestand gemiddeld terug van 18% naar 2,4%. Bij een fysiopraktijk met 200 afspraken per week scheelt dat 30+ afspraken per week aan verloren omzet.\n\n**Voor wie werkt dit echt**\n\nFysiotherapeuten, tandartsen, huisartsen-praktijken, kappers, schoonheidssalons, sport-coaches, klusbedrijven, advocaten, consultants — eigenlijk elk MKB waar klanten afspraken maken. Werkt voor 1 ZZP''er tot teams van 30+ medewerkers.\n\n**Werkt samen met onze andere tools**\n\nHeb je de **AI Telefoonassistent**? Die plant automatisch in dit systeem zolang er beschikbaarheid is. **WhatsApp Chatbot**? Die kan ook afspraken plaatsen via chat. **Google Reviews AI-responder**? Die stuurt na elke afspraak een mail-vraag om een review. Alle Hazenco-tools praten met elkaar.\n\n**Setup**\n\nDag 1-2: intake + opzet diensten/medewerkers/tijden. Dag 3-4: koppeling betaal + agenda, testen. Dag 5: live, met jou meekijken bij eerste echte boekingen. Daarna doorlopend: nieuwe diensten toevoegen, prijzen aanpassen, medewerkers in/uit — wij doen het of leren je het in 10 minuten.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten je het systeem zien zoals het zou werken voor jouw zaak — met jouw diensten en jouw scenario. Geen verkoopgesprek, gewoon laten zien wat het doet.',
  'cat_services',
  'service_package',
  array['workflow_automation', 'customer_support', 'payment_processing']::text[],
  array['healthcare', 'professional_services', 'retail', 'horeca', 'general']::branche[],
  '',
  array[
    '/demo-screenshots/online-afsprakensysteem/01-dashboard.png',
    '/demo-screenshots/online-afsprakensysteem/02-agenda.png',
    '/demo-screenshots/online-afsprakensysteem/03-diensten.png',
    '/demo-screenshots/online-afsprakensysteem/04-bookingflow.png',
    '/demo-screenshots/online-afsprakensysteem/05-medewerkers.png',
    '/demo-screenshots/online-afsprakensysteem/06-notificaties.png'
  ]::text[],
  7900,
  79500,
  'published',
  true,
  array['Mollie', 'Stripe', 'Google Calendar', 'Outlook', 'WordPress', 'WhatsApp Business']::text[],
  array['Bookings', 'Afspraken', 'SaaS', 'MKB', 'Healthcare']::text[],
  array['custom']::delivery_mode[],
  '',
  array[]::text[],
  '',
  '[]'::jsonb,
  '',
  0,
  19,
  4.9,
  8,
  '',
  'Doorlopend, zolang het abonnement loopt',
  now() - interval '25 days',
  now() - interval '1 day',
  'service',
  '[
    "Praktijken (fysio, tandarts, huisarts) waar elke gemiste afspraak omzet kost",
    "Kappers en salons die avond/weekend boekingen willen vangen zonder telefoon",
    "Sport-coaches, klusbedrijven en consultants met 1-op-1 afspraken",
    "Eigenaren die nu vooraan in de zaak staan, niet bij de telefoon",
    "Iedereen met een no-show ratio die pijn doet (>5%)"
  ]'::jsonb,
  '[
    {"icon": "calendar", "title": "Volledig op maat ingericht", "description": "Jouw diensten, prijzen, medewerkers en werktijden. Wij setupen alles binnen 5 werkdagen, jij hoeft alleen mee te kijken."},
    {"icon": "zap", "title": "Vooraf betalen + auto-herinnering", "description": "Klanten betalen via Mollie of iDEAL bij de boeking, krijgen SMS-herinnering 24u vooraf. No-shows van 18% naar 2,4%."},
    {"icon": "users", "title": "Per-medewerker beschikbaarheid", "description": "Iedere therapeut/medewerker eigen rooster, eigen diensten, eigen pauzes. Klanten zien alleen écht vrije slots."},
    {"icon": "refresh", "title": "Praat met andere Hazenco-tools", "description": "Integreert met AI Telefoonassistent, WhatsApp Chatbot en Google Reviews. Eén klant-flow, alle kanalen."}
  ]'::jsonb,
  '[
    {
      "clientName": "Fysio Vital",
      "label": "Fysiotherapie · Utrecht",
      "tag": "Healthcare · Service",
      "tone": "dark",
      "benefit": "Fysiopraktijk met 5 therapeuten en 200 afspraken per week. Eigenaresse Sara zag no-show ratio dalen van 18% naar 2,4% binnen 2 maanden. 7 nieuwe klanten per week komen nu binnen via de online bookingflow — vooral ''s avonds geboekt.",
      "highlights": ["No-show ratio 18% → 2,4%", "7 nieuwe klanten per week via website", "87% van alle bookings vooraf betaald"]
    },
    {
      "clientName": "Kapsalon Lumière",
      "label": "Beauty · Amsterdam",
      "tag": "MKB · Service",
      "tone": "light",
      "benefit": "Kapsalon met 3 stoelen. Sinds online boekingen: 40% van alle boekingen komt ''s avonds binnen, ergo telefoongesprekken halveren. Eigenaresse kan zich focussen op haar klanten ipv telefoon opnemen.",
      "highlights": ["40% van bookings buiten kantooruren", "Telefoontijd halved"]
    },
    {
      "clientName": "Sport-coach Vincent Hooft",
      "label": "Coaching · Eindhoven",
      "tag": "ZZP · Service",
      "tone": "peach",
      "benefit": "1-op-1 personal trainer. Klanten boeken zelf hun PT-sessie via gepersonaliseerde booking-pagina, betalen direct, krijgen 24u vooraf reminder. Vincent bespaart 6u per week aan plan-administratie.",
      "highlights": ["6u per week bespaard aan admin", "100% vooraf betaald — geen facturatie-werk"]
    }
  ]'::jsonb,
  '{
    "externalUrl": "https://hazenco.nl/contact/",
    "oneTime": {
      "priceCents": 79500,
      "originalPriceCents": 119500,
      "description": "Eenmalige setup + integratie met website + Mollie + Google Calendar. Daarna €39/mnd voor hosting, updates en backups."
    },
    "subscription": {
      "priceCentsPerMonth": 7900,
      "originalPriceCentsPerMonth": 11900,
      "minMonths": 12,
      "description": "All-in: setup, hosting, onbeperkt boekingen, alle integraties, SMS-credits (tot 500/mnd), maandelijkse rapportages en wijzigingen."
    },
    "highlight": "subscription",
    "usps": [
      "Live binnen 5 werkdagen",
      "Onbeperkt boekingen",
      "Werkt met Mollie, iDEAL, Stripe",
      "Maandelijks opzegbaar na minimumperiode"
    ]
  }'::jsonb,
  '{"duration": "5 werkdagen tot live", "revisions": "Onbeperkt diensten/medewerkers wijzigen", "supportPeriod": "Doorlopend zolang abonnement loopt"}'::jsonb
);
