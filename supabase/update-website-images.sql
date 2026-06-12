-- ============================================================
-- Update: echte afbeelding-URLs voor "Website laten maken"
-- ------------------------------------------------------------
-- Update alleen hero + cases. Voor draaiers die al de migration
-- hebben gerund met de placeholder-URLs.
-- ============================================================

update public.listings
set
  hero_image_url = 'https://hazenco.nl/wp-content/uploads/2026/02/Website-laten-maken.png',
  cases = '[
    {
      "clientName": "Badkamerwandbekleding",
      "label": "Website All-in",
      "tag": "MKB · Website",
      "tone": "dark",
      "benefit": "Stijlvolle website voor een leverancier van wandpanelen. Bezoekers kunnen het volledige assortiment bekijken en direct een afspraak inplannen voor montage aan huis.",
      "highlights": ["Online afspraken inplannen — zonder bellen", "Assortiment volledig zichtbaar op mobiel"],
      "imageUrl": "https://hazenco.nl/wp-content/uploads/2026/03/Oppervlakten-768x358.webp",
      "url": "https://badkamerwandbekleding.nl"
    },
    {
      "clientName": "Civitas advies",
      "label": "Website All-in",
      "tag": "MKB · Website",
      "tone": "light",
      "benefit": "Professionele website voor een adviesbureau gespecialiseerd in infrastructuur en openbare ruimte. Van ruimtelijke ontwikkeling tot asset management — alles overzichtelijk gepresenteerd.",
      "highlights": ["Werkgebieden en diensten helder in kaart", "Portfolio direct vindbaar voor opdrachtgevers"],
      "imageUrl": "https://hazenco.nl/wp-content/uploads/2026/03/infrastructure-urbaine-genie-routier-768x768.jpg.webp",
      "url": "https://civitas-advies.nl"
    },
    {
      "clientName": "Magdatwel.nl",
      "label": "Website Blog",
      "tag": "MKB · Website",
      "tone": "peach",
      "benefit": "Juridische blogwebsite waar mensen op een toegankelijke manier leren wat wel en niet mag. Weetjes, nieuws en actuele onderwerpen — begrijpelijk geschreven voor iedereen.",
      "highlights": ["Juridische info zonder vakjargon", "Volledig klaar voor zoekmachines — SEO-proof"],
      "imageUrl": "https://hazenco.nl/wp-content/uploads/2026/03/Screenshot-2026-03-21-190124-768x568.png.webp",
      "url": "https://magdatwelonline.nl"
    }
  ]'::jsonb,
  updated_at = now()
where slug = 'website-laten-maken';
