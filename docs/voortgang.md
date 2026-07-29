# Voortgang — hazenco.nl rebuild (Fase 1)

> Levend document. Bij elke sessie bijwerken zodat je kunt zien waar we staan
> en waar we door moeten. Laatste update: **2026-07-29 (Fase 1 volledig afgerond)**.

## 🎉 Fase 1 klaar

Alle 12 sessies afgerond in één sprint. Volledige agency-site staat live-klaar op branch
**`hazenco-b2b-rebuild`** — wachtend op cutover ná TechPanda-livegang.

## Fase 1 taken

| # | Sessie | Taak | Status |
|---|---|------|--------|
| 1 | — | Git-branch aanmaken | ✅ done |
| 2 | — | Nieuwe navigatie-structuur | ✅ done |
| 13 | 1 | Marketplace + app-routes volledig verwijderen | ✅ done |
| 14 | 2a | Nieuwe services-led homepage | ✅ done |
| 15 | 2b | Copy-audit Toolshub-referenties | ✅ done |
| 16 | 3a | `/diensten` hub-pagina verfijnen | ✅ done |
| 17 | 3b | `/website-laten-maken` detail-pagina | ✅ done |
| 18 | 3c | `/workflow-automatisering` detail-pagina | ✅ done |
| 19 | 3d | `/ai-workflows` detail-pagina | ✅ done |
| 20 | 4a | `/oplossingen` index-pagina | ✅ done |
| 21 | 4b | `/oplossingen/[slug]` detail + 301-redirects | ✅ done |
| 22 | 5a | `/contact` met Resend-formulier | ✅ done |
| 23 | 5b | `/blog` infrastructure + 3 startposts | ✅ done |
| 24 | 6a | `/over-ons` volledig herschrijven | ✅ done |
| 25 | 6b | SEO-metadata + sitemap update | ✅ done |
| 26 | 7 | Cutover-runbook | ✅ done |

## Wat er nu live is op de branch

**35 URLs in sitemap.xml:**
- 14 statische pages (home, diensten hub, 3 dienst-details, oplossingen, toolkit, cases, blog, contact, over-ons, privacy, AV, FAQ)
- 11 toolkit-subpages
- 7 oplossing-detail-pages
- 3 blog-posts

**Alle pages returnen HTTP 200 + typecheck clean.**

### Publiek

- `/` — volledige services-led homepage (7 secties)
- `/diensten` — hub met 3 dienst-cards + features
- `/website-laten-maken`, `/workflow-automatisering`, `/ai-workflows` — volledige detail-pages (hero + intro + wat + proces + prijs + cases + FAQ + CTA)
- `/oplossingen` — showcase-index met filter-tabs
- `/oplossingen/[slug]` — 7 detail-pages op basis van bestaande service_package listings
- `/toolkit` + 11 sub-tools — behouden
- `/blog`, `/blog/[slug]` — markdown-based blog met 3 startposts
- `/contact` — werkend Resend-formulier + directe kanalen
- `/over-ons` — uitgebreide Hazenco B2B verhaal (principes + dogfooding + TechPanda)
- `/cases` — placeholder in Hazenco-toon
- Static: `/privacy`, `/algemene-voorwaarden`, `/veelgestelde-vragen`

### 301-redirects (SEO-safe)

Alle oude marketplace URLs redirecten naar de nieuwe agency-structuur:
- `/catalogus`, `/tools`, `/tools/:slug` → `/oplossingen(/:slug)`
- `/winkelwagen`, `/checkout` → `/oplossingen`, `/contact`
- `/creators`, `/creators/:handle` → `/over-ons`, `/oplossingen`
- `/account/*`, `/seller/*`, `/admin/*`, `/onboarding` → `/contact`

### Weg

- Volledige marketplace/checkout/seller/account/admin code
- Alle "Toolshub"-tekst uit UI (brand is nu alleen "Hazenco.")
- ~17.500 regels code opgeruimd

## Nieuwe herbruikbare bouwstenen

- `src/components/service-page.tsx` — shared template voor dienst-detail-pagina's
- `src/lib/blog.ts` — markdown-loader met gray-matter + remark
- `src/app/contact/actions.ts` — Resend-integratie met rate-limit + honeypot

## Environment-vars voor productie

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM=Hazenco Contact <hallo@hazenco.nl>
RESEND_TO=hallo@hazenco.nl
```

## Thuis verder gaan

```bash
cd "D:/sanitairsupershop Dropbox/Ami Agung/Agents/hazenco-marktplaats"
git fetch origin
git checkout hazenco-b2b-rebuild
git pull

npm run dev
# → http://localhost:3000
```

## Volgende stappen (post-Fase 1)

**Vóór cutover:**
1. Fase 1 launch-check afwerken (checklist in [cutover-runbook.md](cutover-runbook.md))
2. Content/copy reviewen — is de tone-of-voice goed? Prijsindicaties kloppen?
3. Contact-formulier E2E testen met echte Resend-key
4. Screenshots/OG-images per pagina waar nodig
5. Wachten op TechPanda live

**Cutover-dag:**
Volg [cutover-runbook.md](cutover-runbook.md) stap voor stap. Belangrijkste:
- Merge branch → main
- Deploy op VPS
- Nginx vhost `toolshub` → `hazenco.nl`
- DNS switch bij TransIP (MX-records ONAANGEROERD)
- SSL via certbot voor hazenco.nl
- WordPress uitfaseren
- Nieuwe sitemap indienen in Search Console

**Fase 2 (later):**
- Real cases toevoegen (echte klantverhalen)
- Blog uitbreiden (1-2 posts/maand)
- Toolkit uitbreiden op basis van user-requests
- SEO-content voor dienst-pages verder verdiepen

## Belangrijke kaders

- **Timing**: cutover pas ná TechPanda-livegang.
- **SEO**: `/website-laten-maken` en `/workflow-automatisering` behouden hun oude WP-URLs.
- **Deploy**: TransIP VPS `149.210.203.88`. Zie [hosting-vps.md](hosting-vps.md).
- **Runbook**: [cutover-runbook.md](cutover-runbook.md) voor exacte livegang-stappen.
- **Redirect-map** (buiten deze repo): `hazenco-shop/docs/hazenco-migratie-redirect-map.md` in TechPanda-repo.

## Verwijzingen

- Strategisch plan: [hazenco-nl-migratie-plan.md](hazenco-nl-migratie-plan.md)
- Start-prompt: [hazenco-nl-migratie-prompt.md](hazenco-nl-migratie-prompt.md)
- **Cutover-runbook**: [cutover-runbook.md](cutover-runbook.md) ⭐ nieuw
- Backend-migratie: [backend-migration.md](backend-migration.md)
- Hosting: [hosting-vps.md](hosting-vps.md)
- Design system: [design-system.md](design-system.md)
