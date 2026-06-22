-- ============================================================
-- Seed: AI Telefoonassistent service-listing
-- ------------------------------------------------------------
-- Eerste van de demo-listings batch (zonder echte tool, alleen
-- screenshots + service-listing pattern, Optie B met planner-CTA).
-- Veilig om opnieuw te draaien (delete-then-insert op slug).
-- ============================================================

delete from public.listings where slug = 'ai-telefoonassistent';

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
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'hazenco_ai_telefoonassistent'),
  uuid_generate_v5('d5b9f8a4-1c2e-4b3a-9f7d-6c0a8e1d2f44'::uuid, 'seller_hazenco'),
  'AI Telefoonassistent',
  'ai-telefoonassistent',
  'Mis nooit meer een klant. AI belt terug binnen 30 seconden en plant direct afspraken in.',
  E'Een gemiste telefoon is een gemiste klant. En als kapper, garagehouder, tandarts of klusbedrijf weet je dat 30 tot 40% van inkomende calls onbeantwoord blijft — simpelweg omdat je handen vol zitten. De meeste van die mensen bellen geen tweede keer. Ze kiezen je concurrent.\n\nDe **AI Telefoonassistent** vangt dat op. Geen voicemail die niemand afluistert, geen receptionist die je 500 euro per maand kost. Een natuurlijk klinkende Nederlandstalige AI die binnen 30 seconden terugbelt, het probleem begrijpt, en direct een afspraak in je agenda zet.\n\n**Hoe het werkt**\n\nWe verbinden onze AI met je bestaande telefoonnummer (geen nieuw nummer, geen overschakeling voor jouw klanten). Mis je een oproep? Binnen 30 seconden belt de AI de beller terug, stelt zich voor namens jouw bedrijf, vraagt waar ''ie mee kan helpen, en plant direct in. Heeft ''ie geen ruimte in de agenda? Dan biedt ''ie 2-3 alternatieven aan. Wil de klant terugbel-verzoek? Dan zet ''ie dat in je systeem en stuurt je een Slack of WhatsApp-notificatie.\n\n**Voor wie werkt dit echt**\n\nKappers en schoonheidssalons, garages, tandartsen, fysiotherapeuten, schoonmaakbedrijven, klusbedrijven, advocatenkantoren — eigenlijk elk MKB waar de telefoon een verkoopkanaal is maar waar mensen al druk zijn met klanten in de zaak. Het breekpunt voor ROI ligt op zo''n 5 gemiste calls per week — daarboven verdien je ''m in de eerste maand terug.\n\n**Wat onze AI niet probeert**\n\nWe doen niet alsof het een mens is. Aan het begin van het gesprek zegt ''ie netjes: "Hoi, je spreekt met de digitale assistent van Kapsalon X. Hoe kan ik je helpen?" Klanten waarderen dat eerlijker dan iemand die doet alsof. En als de vraag te complex wordt (klacht, juridisch, gevoelig) escaleert de AI direct naar een echte terugbel-flow.\n\n**Setup en integratie**\n\nWij regelen alles. Binnen 5-7 werkdagen ben je live. We koppelen aan je telefoonprovider, leren de AI jouw bedrijfstoon, vullen ''m met jouw diensten + prijzen + openingstijden, en testen samen voordat ''ie écht klanten gaat woord-staan. Daarna doorlopend onderhoud: nieuwe diensten toevoegen, prijzen aanpassen, scripts bijschaven — allemaal zonder dat jij iets hoeft te doen.\n\n**Wat je krijgt naast de bot zelf**\n\nElke ochtend een dagrapport in je mail of Slack: wie belde, wat ze wilden, welke afspraken zijn ingepland, welke klachten escaleerden. Plus een dashboard waar je real-time kan zien wat er gebeurt. En een transcript per gesprek, mocht je iets willen nalezen.\n\n**Ook in andere talen**\n\nNederlands is standaard, maar Engels, Duits en Frans kunnen we erbij activeren als je internationale klanten hebt — €25/mnd per extra taal.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. Wij laten zien hoe het werkt, je hoort een echte voorbeeldgesprek (geen demo-acteur), en je krijgt een concrete inschatting van wat het voor jouw situatie betekent. Geen verkoopgesprek — gewoon laten zien wat het doet en jou laten beslissen.',
  'cat_services',
  'service_package',
  array['customer_support', 'lead_generation', 'workflow_automation']::text[],
  array['healthcare', 'professional_services', 'retail', 'horeca', 'general']::branche[],
  '',
  array[
    '/demo-screenshots/ai-telefoonassistent/01-dashboard.png',
    '/demo-screenshots/ai-telefoonassistent/02-gesprekken.png',
    '/demo-screenshots/ai-telefoonassistent/03-transcript.png',
    '/demo-screenshots/ai-telefoonassistent/04-agenda.png',
    '/demo-screenshots/ai-telefoonassistent/05-kennisbank.png',
    '/demo-screenshots/ai-telefoonassistent/06-inzichten.png'
  ]::text[],
  14900,
  99500,
  'published',
  true,
  array['Google Calendar', 'Outlook', 'Microsoft Teams', 'Slack', 'WhatsApp']::text[],
  array['AI', 'Telefoon', 'Voicebot', 'Customer Service', 'MKB']::text[],
  array['custom']::delivery_mode[],
  '',
  array[]::text[],
  '',
  '[]'::jsonb,
  '',
  0,
  23,
  4.9,
  9,
  '',
  'Doorlopend, zolang het abonnement loopt',
  now() - interval '40 days',
  now() - interval '3 days',
  'service',
  '[
    "Kappers en schoonheidssalons die in de behandeling staan en niet kunnen opnemen",
    "Garages waar monteurs onder de auto liggen en de receptie vol is",
    "Praktijken (tandarts, fysio, huisarts) waar de receptie patiënten heeft staan",
    "Klusbedrijven en ZZP''ers die op de bouw of bij de klant zitten",
    "Iedereen die meer dan 5 calls per week mist — daar verdient ''ie zichzelf terug"
  ]'::jsonb,
  '[
    {"icon": "phone", "title": "Automatisch terugbellen", "description": "Gemiste oproep? Onze AI belt binnen 30 seconden terug — 24/7, ook ''s avonds en in het weekend."},
    {"icon": "headset", "title": "Nederlandstalig en natuurlijk", "description": "Natuurlijke stem, herkent dialecten en accenten, vraagt door waar nodig. Wel eerlijk: ''je spreekt met de digitale assistent''."},
    {"icon": "calendar", "title": "Direct in je agenda", "description": "Koppelt aan Google Calendar, Outlook of jouw boekingssysteem. Afspraken staan meteen op de juiste plek."},
    {"icon": "mail", "title": "Dagelijks transcript", "description": "Elke ochtend in je mail of Slack: wie belde, wat ze wilden, welke afspraken zijn gemaakt."}
  ]'::jsonb,
  '[
    {
      "clientName": "Kapsalon Knip & Co",
      "label": "Beauty & Wellness",
      "tag": "MKB · Service",
      "tone": "dark",
      "benefit": "Verloor 12 calls per week voordat de AI live ging. Nu zijn dat er 0. Eigenares Suzanne berekende dat het zo''n €1.800 extra omzet per maand oplevert uit teruggewonnen afspraken.",
      "highlights": ["12 → 0 gemiste calls per week", "+€1.800 omzet per maand uit teruggewonnen leads"]
    },
    {
      "clientName": "Garage Westerveld",
      "label": "Automotive",
      "tag": "MKB · Service",
      "tone": "light",
      "benefit": "Monteurs hoeven niet meer hun handen af te wassen voor elke telefoon. AI plant inspecties en onderhoud direct in, en stuurt de eigenaar een dagrapport per WhatsApp.",
      "highlights": ["Monteurs kunnen onafgebroken doorwerken", "Afsprakenboek 30% voller binnen 2 maanden"]
    },
    {
      "clientName": "Tandartspraktijk DentaalNL",
      "label": "Healthcare",
      "tag": "Praktijk · Service",
      "tone": "peach",
      "benefit": "Receptie kan focus houden op patiënten in de praktijk. AI vangt alle inkomende calls op en belt actief terug bij no-shows met een nieuw voorstel. Resultaat: agenda-bezetting van 78% naar 95%.",
      "highlights": ["Bezetting agenda 78% → 95%", "Receptie beschikbaar voor patiënten in de wachtruimte"]
    }
  ]'::jsonb,
  '{
    "externalUrl": "https://hazenco.nl/contact/",
    "oneTime": {
      "priceCents": 99500,
      "originalPriceCents": 149500,
      "description": "Eenmalige setup + integratie met je bestaande nummer. Daarna €49/mnd voor hosting, AI-credits (tot 200 calls/mnd) en updates."
    },
    "subscription": {
      "priceCentsPerMonth": 14900,
      "originalPriceCentsPerMonth": 19900,
      "minMonths": 12,
      "description": "All-in: setup, hosting, AI-credits (tot 500 calls/mnd), agenda-koppeling, dagelijkse rapportages en doorlopende script-updates."
    },
    "highlight": "subscription",
    "usps": [
      "Live binnen 5-7 werkdagen",
      "Geen technische kennis nodig",
      "Maandelijks opzegbaar na minimumperiode",
      "Eerlijk: AI noemt zich digitale assistent"
    ]
  }'::jsonb,
  '{"duration": "5-7 werkdagen tot live", "revisions": "Onbeperkt scripts bijschaven", "supportPeriod": "Doorlopend zolang abonnement loopt"}'::jsonb
);
