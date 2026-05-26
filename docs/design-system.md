# Design System — Hazenco Marketplace

Levend document met design tokens, conventies en open TODO's voor UI-werk.
Bron: alle CSS-variabelen staan in [src/app/globals.css](../src/app/globals.css) onder `:root`.

---

## Tokens — huidig

### Layout

| Token | Waarde | Gebruik |
|---|---|---|
| `--max` | `1350px` | Max-width van alle hoofd-containers (header, page wrappers, footer). |
| `--radius` | `8px` | Standaard rounding voor buttons, inputs, kleine cards. |
| `--radius-lg` | `14px` | Grote cards, hero-blokken, prominente containers. |

### Typografie

| Token | Font | Gebruik |
|---|---|---|
| `--font-heading` | **DM Serif Display** (400) | `h1` + hoofdtitels. High-contrast display serif voor impact. |
| `--font-body` | **DM Sans** (variable) | `h2`, `h3`, `h4`, `h5`, `h6`, body en alle UI-tekst. |

**Loading:** beide fonts via `next/font/google` in [src/app/layout.tsx](../src/app/layout.tsx) (self-hosted, geen FOUT, optimaal voor performance).

**Fallback chains** (als de webfont nog niet geladen is):
- Heading → `Georgia`, `"Times New Roman"`, `serif`
- Body → `"Segoe UI"`, `Arial`, `sans-serif`

**Regel:** gebruik nooit hardcoded `font-family` in nieuwe componenten — alleen via deze tokens of via `inherit`.

**Container regel:** elke pagina-wrapper en de header gebruiken `max-width: var(--max)` + `padding: ... 22px` (horizontaal). Zo lijnen alle content-edges 1-op-1 met de header.

**Uitzonderingen (bewuste keuzes, niet aanpassen zonder reden):**
- `.onboarding-page` — `880px` (smal formulier, breder verslechtert UX)
- `.not-found-page` — `1000px` (gecentreerde 404-tekst)
- Typografie-blokken (`max-width: 560-680px`) — leesbare regellengte, niet aanraken

### Kleuren — brand

| Token | Light | Dark | Gebruik |
|---|---|---|---|
| `--green-900` | `#1a3c2e` | `#e9f1ec` | Primary tekst, donker accent in light / wit-achtig in dark |
| `--green-800` | `#163326` | `#d6e2da` | Header BG, prominente donkere vlakken |
| `--green-700` | `#3d5245` | `#b3c7bb` | Secundaire tekst |
| `--green-500` | `#6b8070` | `#7e9388` | Muted tekst, icons |
| `--green-100` | `#e8f0ea` | `#1c3329` | Light accent BG → donker in dark mode |
| `--green-50` | `#f5f7f5` | `#142822` | Page-bg accent |
| `--orange-600` | `#f26b1d` | (zelfde) | **CTA / accent — blijft consistent in beide modes** |
| `--orange-700` | `#c2540e` | (zelfde) | Hover state van oranje CTA |
| `--orange-100` | `#fef0e6` | (zelfde) | Zachte oranje accenten / eyebrows |
| `--blue-700` | `#324a6d` | (zelfde) | Secundair accent (sparingly) |

### Backgrounds & lines

| Token | Light | Dark | Gebruik |
|---|---|---|---|
| `--bg-app` | `#fafdfb` | `#0a1813` | App achtergrond |
| `--bg-surface` | `#ffffff` | `#122520` | Cards, widgets |
| `--bg-elevated` | `#ffffff` | `#15302a` | Hover states, geneste containers |
| `--white` | `#ffffff` | `#0e1f1a` | "Witte" buttons — worden donker in dark mode |
| `--line` | `#dde8df` | `#243d33` | Standaard borders |
| `--line-strong` | `#c8d5dc` | `#2f4e41` | Nadrukkelijke borders |
| `--shadow` | `0 20px 55px rgba(26,60,46,0.12)` | `0 20px 55px rgba(0,0,0,0.55)` | Card shadow groot |
| `--shadow-soft` | `0 12px 32px rgba(26,60,46,0.08)` | `0 12px 32px rgba(0,0,0,0.35)` | Subtiele lift |

---

## Conventies

- **Dark mode** wordt geactiveerd via `[data-theme="dark"]` op het `<html>` element. Toggle staat in [src/components/theme-toggle.tsx](../src/components/theme-toggle.tsx).
- **Geen Tailwind**, geen UI-library — vanilla CSS in [globals.css](../src/app/globals.css).
- **Geen hardcoded hex-codes** in nieuwe componenten — altijd via een token. Als de juiste token nog niet bestaat, eerst toevoegen aan `:root`.

---

## TODO's voor het theming-systeem

Wat we nog niet hebben maar wat we willen toevoegen zodra de bijbehorende design-beslissing speelt:

- [ ] **Typografie schaal** — `--text-xs`, `--text-sm`, ..., `--text-3xl` met line-heights. Nu staan font-sizes overal hardgecodeerd (12px, 14px, 16px, 18px, 24px, 32px, ...).
- [ ] **Spacing schaal** — `--space-1` tm `--space-12` op een ritme van 4px of 8px. Nu lopen waarden door elkaar (6, 7, 11, 13, 14, 22, 24, 32, 42, ...).
- [x] ~~Custom font — gekozen voor DM Serif Display (h1) + DM Sans (rest). Zie Typografie tabel hierboven.~~
- [ ] **Semantische kleurtokens** bovenop brand — `--color-primary`, `--color-cta`, `--color-success`, `--color-warning`, `--color-danger`. Maakt later doorthemen makkelijker zonder per-pagina aanpassingen.
- [ ] **Component tokens** — `--button-radius`, `--input-radius`, `--card-radius` zodat we ze los van algemene `--radius` kunnen stellen.
- [ ] **Logo** — momenteel letter "H" als placeholder. Echte logo (SVG) komt in `public/` + wordt geladen via een `<Logo>` component.
- [ ] **Mobile breakpoints uniformeren** — nu gebruikt CSS losse media queries op `540px`, `720px`, `760px`, `780px`, `820px`, `900px`, `980px`, `1280px`. Naar 3-4 vaste breakpoints: bv. `--bp-sm: 640px`, `--bp-md: 900px`, `--bp-lg: 1200px`.
- [ ] **Audit hardcoded kleurwaardes** — sommige plekken gebruiken nog `rgba(...)` of `#...` direct. Door alles via tokens te laten lopen kunnen we in 1 keer doorthemen.

---

## Beslissingen-log

Korte aantekeningen van design-beslissingen, zodat we later kunnen terugvinden waarom iets is zoals het is.

### 2026-05-26
- **`--max` van 1400 → 1350px.** Reden: gebruiker wilde dat alle pagina-content op één breedte werkt.
- **`.creators-page` en `.creator-public-page` van hardcoded 1200px naar `var(--max)`.** Reden: zorgde voor mismatch met header (header was 1400, content 1200 → cards lijnden niet uit). Nu beide via token.
- **`.onboarding-page` 880px en `.not-found-page` 1000px bewust uitgezonderd.** Reden: respectievelijk smal formulier (breder = slechtere UX) en gecentreerde 404 (breed ziet er gek uit).
- **Fonts: DM Serif Display voor `h1`, DM Sans voor `h2-h6` + body.** Reden: gebruiker wilde een display-serif voor hoofdtitels (impact, premium gevoel) en een neutrale moderne sans voor leesbaarheid. Beide uit dezelfde Google Fonts familie → harmonisch maar duidelijk contrast. Vervangt Space Grotesk dat overal werd gebruikt.
- **`.home-tiles` grid: `auto-fill` → `auto-fit`, min-width 120→140px, gap 10→14px.** Reden: met `auto-fill` bleven lege kolommen rechts over → tegels lijnden niet uit met "Alle categorieën" knop. `auto-fit` vouwt lege tracks op zodat items uitrekken. Algemene les: voor "vul de beschikbare ruimte" gebruik altijd `auto-fit`, niet `auto-fill`.
- **`.branche-pills`: `justify-content: space-between` toegevoegd + 1 branche verwijderd (`construction`).** Reden: pills hadden geen stretch-mechanisme dus zaten links gegroepeerd met witruimte rechts. `space-between` spreidt items over de volle breedte; gaps schalen mee met inhoud. 7 pills (was 8) houden het op één regel. "Alle branches →" link toegevoegd in section-head voor patroon-consistentie met de categorieën-sectie eronder/erboven.
- **Patroon-regel voor "highlight" secties op homepage:** elke section-head met `<eyebrow><h2><p>` krijgt rechts een `.text-action` link "Alle X →" naar de relevante catalogus-filter. Items eronder vullen altijd de volle breedte (via `auto-fit` grid of `space-between` flex). Houdt de homepage scanbaar en uniform.
- **`.home-trust` tiles: titel 26px/weight 900 → 16px/weight 700; min-width 160→200px; gap 14→18px; `.home-trust-item` krijgt eigen flex-column layout.** Reden: titels waren zo zwaar dat "Reviews met moderatie" en "Test demo voor aankoop" wrappten naar 2 regels → uneven kaart-hoogtes. Door titel-grootte halveren én min-width verhogen passen alle titels op 1 regel. Algemene les: titels in kleine tiles/cards verhouden zich tot de tile-grootte, niet tot de pagina-hiërarchie. Voor secundaire content houden we strong-titels rond 14-18px met weight 600-700.

---

## Hoe dit document gebruiken

- **Voor nieuwe styling**: kijk eerst of er een token is. Zo niet en het is brand-niveau → voeg toe aan `:root` + documenteer hier.
- **Voor design wijzigingen**: leg de beslissing kort vast in de log met datum + waarom. Niet alleen wat.
- **Voor refactors**: werk de TODO's stap voor stap weg. Niet alles tegelijk — per token een commit.
