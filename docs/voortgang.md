# Voortgang — hazenco.nl rebuild (Fase 1)

> Levend document. Bij elke sessie bijwerken zodat je kunt zien waar we staan
> en waar we door moeten. Laatste update: **2026-07-28**.

## Waar staan we

- Branch: **`hazenco-b2b-rebuild`** — alle rebuild-werk staat hier
- `main` = huidige productie (Toolshub op toolshub.hazenco.nl), onaangeroerd
- Fundament + nav + placeholder-routes staan; homepage en dienstenpagina's zijn de volgende stap

## Fase 1 taken

| # | Taak | Status |
|---|------|--------|
| 1 | Git-branch aanmaken: `hazenco-b2b-rebuild` | ✅ done |
| 2 | Nieuwe navigatie-structuur (Home/Diensten/Cases/Toolkit/Blog/Contact) | ✅ done |
| 3 | Nieuwe homepage voor Hazenco B2B | ⏳ open — needs user input |
| 4 | Diensten-index + 3 detail-pagina's (behoud oude URLs) | ⏳ open |
| 5 | Cases index + detail template | ⏳ open |
| 6 | Blog infrastructuur (routes + markdown-loader) | ⏳ open |
| 7 | Contact-pagina met Resend-formulier | ⏳ open (placeholder werkt al) |
| 8 | Copy-audit: over-ons + Toolshub-reframing | ⏳ open |
| 9 | Marketplace-routes verstoppen tot fase 2 | ⏳ open (nav al aangepast, code nog niet opgeschoond) |
| 10 | WordPress-content overzetten + redirect-map | ⏳ open |
| 11 | SEO-metadata + sitemap update | ⏳ open |
| 12 | Fase 1 launch-check + cutover-voorbereiding | ⏳ open |

## Wat er nu live is op de branch

- Nieuwe nav-items: Home, Diensten, Cases, Toolkit, Blog, Contact
- `/diensten` — hub met 3 dienst-cards die doorlinken naar detail-slugs (die moeten nog gebouwd worden op de eigen route)
- `/cases`, `/blog` — placeholder-pages in juiste toon, "in aanbouw" met cross-links
- `/contact` — WhatsApp + mail direct werkend, formulier komt in taak #7

Bestaande code (`/catalogus`, `/tools/[slug]`, `/checkout`, `/winkelwagen`, `/seller/*`, `/admin/*`) is
**niet aangeraakt** — de pages werken nog, alleen niet meer in de nav.

## Open vragen voor de user (blockeren #3 en verder)

1. **B2B-belofte in 1 zin** — hero-boodschap voor de nieuwe homepage
2. **Doelgroep-scherpte** — MKB 5-50? Specifieke branches? Breed?
3. **Cases-strategie** — fictieve demo-cases openlijk tonen of alleen échte klantcases?
4. **"Toolshub" naming** — houden als sub-brand voor toolkit + marktplaats-sectie, of drop en gewoon "Toolkit" gebruiken?
5. **Blog content** — welke 2-3 startposts wil je als eerste hebben?

## Thuis verder gaan

```bash
# Als je nog niet lokaal hebt gepulled:
cd "D:/sanitairsupershop Dropbox/Ami Agung/Agents/hazenco-marktplaats"
git fetch origin
git checkout hazenco-b2b-rebuild
git pull

# Preview draaien:
npm run dev
# → http://localhost:3000

# Nieuwe pages checken:
# http://localhost:3000/diensten
# http://localhost:3000/cases
# http://localhost:3000/blog
# http://localhost:3000/contact
```

## Volgende sessie: pak dit prompt

```
Ik ga verder met de hazenco.nl rebuild op branch hazenco-b2b-rebuild.
Lees eerst docs/voortgang.md om te zien waar we staan.

Antwoorden op de open vragen:
1. B2B-belofte: [...]
2. Doelgroep: [...]
3. Cases-strategie: [...]
4. Toolshub-naming: [...]
5. Blog content: [...]

Ga daarna door met taak #3 (nieuwe homepage voor Hazenco B2B).
```

## Belangrijke kaders (niet vergeten)

- **Timing**: cutover pas ná TechPanda-livegang. Nu = alleen bouwen op branch.
- **SEO**: behoud oude URLs (`/website-laten-maken`, `/procesautomatisering`, `/ai-workflows`).
- **Deploy**: TransIP VPS `149.210.203.88`, user `amiagung`. Zie `docs/hosting-vps.md`.
- **Backend**: localStorage nu, Supabase pas waar echt nodig. Zie `docs/backend-migration.md`.
- **Redirect-map**: staat in TechPanda-repo: `hazenco-shop/docs/hazenco-migratie-redirect-map.md`.

## Verwijzingen

- Strategisch plan: [hazenco-nl-migratie-plan.md](hazenco-nl-migratie-plan.md)
- Start-prompt: [hazenco-nl-migratie-prompt.md](hazenco-nl-migratie-prompt.md)
- Backend-migratie: [backend-migration.md](backend-migration.md)
- Hosting: [hosting-vps.md](hosting-vps.md)
- Design system: [design-system.md](design-system.md)
