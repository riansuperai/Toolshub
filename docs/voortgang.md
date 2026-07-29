# Voortgang — hazenco.nl rebuild (Fase 1)

> Levend document. Bij elke sessie bijwerken zodat je kunt zien waar we staan
> en waar we door moeten. Laatste update: **2026-07-29 (sessie 1 afgerond)**.

## Waar staan we

- Branch: **`hazenco-b2b-rebuild`** — alle rebuild-werk staat hier
- `main` = huidige productie (Toolshub op toolshub.hazenco.nl), onaangeroerd
- **Sessie 1 (opschoning) afgerond**: alle marketplace/checkout/seller/account/admin routes + bijbehorende componenten weg. Codebase is nu een agency-shell met toolkit.
- Volgende: sessie 2a (nieuwe services-led homepage)

## Fase 1 taken

| # | Sessie | Taak | Status |
|---|---|------|--------|
| 1 | — | Git-branch aanmaken: `hazenco-b2b-rebuild` | ✅ done |
| 2 | — | Nieuwe navigatie-structuur (Home/Diensten/Cases/Toolkit/Blog/Contact) | ✅ done |
| 13 | 1 | Marketplace + app-routes volledig verwijderen | ✅ done |
| 14 | 2a | Nieuwe services-led homepage | ⏳ next |
| 15 | 2b | Footer herwerken + copy-audit Toolshub-referenties | ⏳ open |
| 16 | 3a | `/diensten` hub-pagina verfijnen | ⏳ open |
| 17 | 3b | `/website-laten-maken` detail-pagina | ⏳ open |
| 18 | 3c | `/workflow-automatisering` detail-pagina | ⏳ open |
| 19 | 3d | `/ai-workflows` detail-pagina (nieuw) | ⏳ open |
| 20 | 4a | `/oplossingen` index-pagina (showcase) | ⏳ open |
| 21 | 4b | `/oplossingen/[slug]` detail + route-verhuizing | ⏳ open |
| 22 | 5a | `/contact` met Resend-formulier | ⏳ open |
| 23 | 5b | `/blog` infrastructure + 2-3 startposts | ⏳ open |
| 24 | 6a | `/over-ons` volledig herschrijven | ⏳ open |
| 25 | 6b | SEO-metadata + sitemap update | ⏳ open |
| 26 | 7 | Fase 1 launch-check + cutover-runbook | ⏳ open |

## Wat er nu live is op de branch

**Publieke routes (allemaal HTTP 200):**
- `/` — minimale placeholder-homepage (hero + 3 dienst-cards + placeholder-note). Wordt in sessie 2a echte agency-homepage.
- `/diensten` — hub met 3 dienst-cards, doorlink naar detail-slugs
- `/cases`, `/blog` — placeholder "in aanbouw"
- `/contact` — WhatsApp + mail direct werkend
- `/toolkit` + 11 sub-tools — 100% behouden en werkend
- `/over-ons`, `/privacy`, `/algemene-voorwaarden`, `/veelgestelde-vragen` — bestaand, worden herwerkt in sessie 6a

**Shell:**
- Header: brand "Hazenco." (geen Toolshub-tekst meer) + nav (Home/Diensten/Cases/Toolkit/Blog/Contact) + ThemeToggle + primary CTA "Plan een gesprek"
- Footer: 4 kolommen (brand-tekst / Diensten / Informatie / Contact) + link naar techpanda.nl

**Weg (bevestigd verwijderd):**
- Alle marketplace routes: `/catalogus`, `/tools/[slug]`, `/checkout`, `/winkelwagen`, `/creators/[handle]`
- Alle app routes: `/seller/*`, `/account/*`, `/admin/*`, `/onboarding`
- 30+ marketplace/seller/account componenten
- 10+ lib-files (marketplace-store, account-data, seller-data, notifications, etc.)
- 95 files changed: -17.5k regels, +238 regels netto

## Nog te doen in sessies 4a-4b (oplossingen showcase)

- `/oplossingen` index bouwen die de bestaande 6 `service_package`-cards uit `marketplace-data.ts` hergebruikt (AI Telefoonassistent, WhatsApp Chatbot, Reviews Responder, Bookings, Cart Popup, Tile Calculator)
- `/oplossingen/[slug]` detail-template met "plan een gesprek" CTA (geen cart/checkout meer)
- 301-redirects van `/tools/[slug]` → `/oplossingen/[slug]` in next.config voor SEO-behoud

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
Ik ga verder met sessie 2a (nieuwe services-led homepage) van de
hazenco.nl rebuild op branch hazenco-b2b-rebuild.

Lees eerst docs/voortgang.md om te zien waar we staan.

Bouw de nieuwe homepage volgens de opbouw uit docs/hazenco-nl-migratie-plan.md
(sectie 7 "Homepage-opbouw"):
  1. Hero: tagline + primary CTA "plan een gesprek" + secundaire
     "bekijk diensten"
  2. Diensten-blok: 3 kaarten (webdesign, workflow-automatisering,
     AI-workflows)
  3. Oplossingen-teaser: preview van 3 uitgelichte oplossingen
  4. Toolkit-teaser: "Probeer onze gratis tools"
  5. Waarom Hazenco / bewijs: dogfooding (TechPanda + toolkit)
  6. Blog-teaser
  7. Contact-CTA
```

## Belangrijke kaders (niet vergeten)

- **Timing**: cutover pas ná TechPanda-livegang. Nu = alleen bouwen op branch.
- **SEO**: behoud oude URLs (`/website-laten-maken`, `/workflow-automatisering`).
- **"Oplossingen" (niet "Toolshub")**: showcase-sectie heet Oplossingen. "Toolshub" als naam vervalt.
- **Geen marketplace**: showcase is portfolio-etalage, geen koop-marktplaats. Alle cart/checkout/seller-flow is verwijderd.
- **Deploy**: TransIP VPS `149.210.203.88`, user `amiagung`. Zie `docs/hosting-vps.md`.
- **Redirect-map**: staat in TechPanda-repo: `hazenco-shop/docs/hazenco-migratie-redirect-map.md`.

## Verwijzingen

- Strategisch plan: [hazenco-nl-migratie-plan.md](hazenco-nl-migratie-plan.md)
- Start-prompt: [hazenco-nl-migratie-prompt.md](hazenco-nl-migratie-prompt.md)
- Backend-migratie (later relevant): [backend-migration.md](backend-migration.md)
- Hosting: [hosting-vps.md](hosting-vps.md)
- Design system: [design-system.md](design-system.md)
