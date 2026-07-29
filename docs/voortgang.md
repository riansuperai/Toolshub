# Voortgang — hazenco.nl rebuild (Fase 1)

> Levend document. Bij elke sessie bijwerken zodat je kunt zien waar we staan
> en waar we door moeten. Laatste update: **2026-07-29 (sessies 1 t/m 3d afgerond)**.

## Waar staan we

- Branch: **`hazenco-b2b-rebuild`** — alle rebuild-werk staat hier
- `main` = huidige productie (Toolshub op toolshub.hazenco.nl), onaangeroerd
- **7 van 12 sessies afgerond** — de agency-shell staat, homepage en alle 3 diensten-detailpagina's zijn live-klaar.
- Volgende: sessie 4a (`/oplossingen` showcase)

## Fase 1 taken

| # | Sessie | Taak | Status |
|---|---|------|--------|
| 1 | — | Git-branch aanmaken: `hazenco-b2b-rebuild` | ✅ done |
| 2 | — | Nieuwe navigatie-structuur | ✅ done |
| 13 | 1 | Marketplace + app-routes volledig verwijderen | ✅ done |
| 14 | 2a | Nieuwe services-led homepage | ✅ done |
| 15 | 2b | Copy-audit Toolshub-referenties | ✅ done |
| 16 | 3a | `/diensten` hub-pagina verfijnen | ✅ done |
| 17 | 3b | `/website-laten-maken` detail-pagina | ✅ done |
| 18 | 3c | `/workflow-automatisering` detail-pagina | ✅ done |
| 19 | 3d | `/ai-workflows` detail-pagina | ✅ done |
| 20 | 4a | `/oplossingen` index-pagina (showcase) | ⏳ next |
| 21 | 4b | `/oplossingen/[slug]` detail + route-verhuizing | ⏳ open |
| 22 | 5a | `/contact` met Resend-formulier | ⏳ open |
| 23 | 5b | `/blog` infrastructure + 2-3 startposts | ⏳ open |
| 24 | 6a | `/over-ons` volledig herschrijven (deels al gedaan) | ⏳ open |
| 25 | 6b | SEO-metadata + sitemap update | ⏳ open |
| 26 | 7 | Fase 1 launch-check + cutover-runbook | ⏳ open |

## Wat er nu live is op de branch

**Publieke routes (allemaal HTTP 200):**
- `/` — volwaardige services-led homepage (hero + 3 diensten + 3 oplossingen + toolkit-band + waarom-hazenco + blog-teaser + contact-band)
- `/diensten` — hub met 3 dienst-cards, features en dubbele CTA per card
- `/website-laten-maken` — volledige detail-pagina (hero + intro + wat je krijgt + proces + prijs + cases + FAQ + CTA)
- `/workflow-automatisering` — idem
- `/ai-workflows` — idem
- `/cases`, `/blog` — placeholder "in aanbouw"
- `/contact` — WhatsApp + mail direct werkend
- `/toolkit` + 11 sub-tools — behouden en werkend
- `/over-ons`, `/privacy`, `/algemene-voorwaarden`, `/veelgestelde-vragen` — Toolshub-refs weg, Hazenco-toon in

**Shell + branding:**
- Brand: alleen "Hazenco." (geen Toolshub)
- Nav: Home / Diensten / Cases / Toolkit / Blog / Contact
- Header-CTA: "Plan een gesprek" (peach, prominent)
- Footer: 4 kolommen agency-stijl + link naar TechPanda
- Metadata: title/OG/twitter allemaal Hazenco (metadataBase = hazenco.nl)

**Weg (bevestigd verwijderd):**
- Alle marketplace/checkout/seller/account/admin routes en componenten
- Alle "Toolshub"-tekst uit UI (nog wel als product-code in commits/comments)

## Nieuwe herbruikbare bouwstenen

- `src/components/service-page.tsx` — shared template voor dienst-detail-pagina's. Elke pagina levert een `ServicePageData` object met hero + intro + wat/proces/prijs/cases/FAQ. Consistent uiterlijk over de 3 diensten.
- `src/components/brand-mark.tsx` — Hazenco 4-blokken logo + HubGlyph (nog steeds bruikbaar in Toolkit-context)
- Homepage CSS-klassen `.hazenco-*` — herbruikbaar voor andere landing-pages

## Nog te doen in sessies 4a-4b (oplossingen showcase)

- `/oplossingen` index — hergebruik 6 `service_package`-cards uit `marketplace-data.ts`
- `/oplossingen/[slug]` detail — herwerk bestaande service-detail-view
- 301-redirects `/tools/[slug]` → `/oplossingen/[slug]` in next.config
- Homepage CTA "Alle oplossingen" moet naar `/oplossingen` gaan (nu naar `/diensten`)

## Thuis verder gaan

```bash
cd "D:/sanitairsupershop Dropbox/Ami Agung/Agents/hazenco-marktplaats"
git fetch origin
git checkout hazenco-b2b-rebuild
git pull

npm run dev
# → http://localhost:3000
```

## Volgende sessie: pak dit prompt

```
Ik ga verder met sessie 4a (/oplossingen showcase-index) van de
hazenco.nl rebuild op branch hazenco-b2b-rebuild.

Lees eerst docs/voortgang.md om te zien waar we staan.

Bouw /oplossingen als index-pagina die de 6 service_package-listings
uit src/lib/marketplace-data.ts hergebruikt. Elke card: titel + tagline
+ hero-screenshot + 'vanaf €X/mnd' + 'plan een gesprek'-CTA. Optioneel
filter op dienst-categorie (webdesign / workflow / AI).

Daarna sessie 4b: /oplossingen/[slug] detail-template + 301-redirects
van /tools/[slug] in next.config.
```

## Belangrijke kaders (niet vergeten)

- **Timing**: cutover pas ná TechPanda-livegang. Nu = alleen bouwen op branch.
- **SEO**: oude WP-URLs behouden (`/website-laten-maken`, `/workflow-automatisering`).
- **Deploy**: TransIP VPS `149.210.203.88`, user `amiagung`. Zie `docs/hosting-vps.md`.
- **Resend voor contact-formulier**: sessie 5a — heeft RESEND_API_KEY nodig in .env
- **Redirect-map**: staat in TechPanda-repo: `hazenco-shop/docs/hazenco-migratie-redirect-map.md`.

## Verwijzingen

- Strategisch plan: [hazenco-nl-migratie-plan.md](hazenco-nl-migratie-plan.md)
- Start-prompt: [hazenco-nl-migratie-prompt.md](hazenco-nl-migratie-prompt.md)
- Backend-migratie: [backend-migration.md](backend-migration.md)
- Hosting: [hosting-vps.md](hosting-vps.md)
- Design system: [design-system.md](design-system.md)
