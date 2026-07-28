# Migratie & plan: hazenco-marktplaats (Toolshub) wordt de nieuwe hazenco.nl

Opgesteld: 2026-07-28. Strategisch plan om deze codebase te herbestemmen als de
nieuwe, custom hazenco.nl (op de root), met de toolkit en marktplaats als
onderdeel. De huidige WordPress-hazenco.nl wordt uitgefaseerd.

---

## 1. Context & beslissing

**Merksplitsing (besloten):**
- **TechPanda = B2C** — IT-webshop + computerhulp aan huis. Al live op techpanda.nl (custom Next.js + Supabase).
- **Hazenco = B2B** — procesautomatisering, AI-workflows, webdesign, plus Toolshub (toolkit + digitale-tools-marktplaats). Hazenco blijft de koepel; TechPanda is "onderdeel van Hazenco" (optie A).

**Beslissing:** deze codebase (`hazenco-marktplaats` / Toolshub) wordt het **fundament van de nieuwe hazenco.nl**, op het hoofddomein. Toolshub/marktplaats wordt een sectie binnen hazenco.nl, geen los subdomein-product meer.

**Waarom deze codebase, en niet WordPress houden of from scratch:**
- Zelfde stack als TechPanda (Next.js App Router + TypeScript + Supabase + lucide-react) → consistent, één manier van werken, makkelijker te onderhouden.
- De inhoud (digitale tools, workflows, AI-agents, automatisering) is precies Hazenco's B2B-domein. De marktplaats/toolkit is geen zijproject maar de kern van het verhaal.
- Een custom site is meteen de **webdesign-showcase** (geloofwaardigheid: een webdesignbureau met een Elementor-template ondermijnt zichzelf).
- "Toolshub is nog te dun als los product" → door het in de merksite te embedden krijgt het context, verkeer en een plek.

---

## 2. Nulmeting: wat is deze codebase nu

- **Stack:** Next.js 16 (App Router), TypeScript (`lint` = `tsc --noEmit`), Supabase-client aanwezig (`src/lib/supabase.ts`), lucide-react. Tool-libs: pdf-lib/pdfjs (PDF), jszip, qrcode, jspdf, `@huggingface/transformers` (in-browser AI).
- **State:** grotendeels **localStorage** (`useMarketplace` → key `hazenco-marketplace-state-v8`), mock-data in `src/lib/marketplace-data.ts`. Types zijn 1-op-1 mappable naar Postgres. Supabase-schema staat in `supabase/`. Zie [docs/backend-migration.md](backend-migration.md).
- **Routes (bestaand):**
  - Marktplaats: `/catalogus`, `/checkout`, `/winkelwagen`, `/tools/[slug]`, `/creators/[handle]`
  - Seller-platform: `/seller/*` (listings, orders, financien, bundles, broadcasts, import, services, webhooks, profiel)
  - Koper-account: `/account/*` (orders, bibliotheek, subscriptions, giftcards, reviews, bewaard, support)
  - Admin: `/admin/*` (listings, orders, sellers, kopers, reviews, banners, templates, activity)
  - Gratis toolkit: `/toolkit/*` (pdf-samenvoegen/splitsen/comprimeren, btw-calculator, bruto-netto, factuur-generator, iban-checker, qr-code-generator, wachtwoord-generator, achtergrond-verwijderen)
  - Standaardpagina's: `/over-ons`, `/privacy`, `/algemene-voorwaarden`, `/veelgestelde-vragen`, `/onboarding`, homepage
- **Deploy:** dezelfde TransIP VPS als TechPanda (`149.210.203.88`, user `amiagung`), nu op `toolshub.hazenco.nl`. Zie [docs/hosting-vps.md](hosting-vps.md).
- **Design:** [docs/design-system.md](design-system.md).

## 3. Nulmeting: huidige hazenco.nl (te vervangen)

- **WordPress/Elementor** op TransIP-webhosting (IP `85.10.159.84`, ander adres dan de VPS).
- **Computerhulp verhuist al naar TechPanda** (301 via de Redirection-plugin). De volledige redirect-map staat in de TechPanda-repo: `hazenco-shop/docs/hazenco-migratie-redirect-map.md`.
- **B2B-pagina's blijven Hazenco** (o.a. `/website-laten-maken`, `/workflow-automatisering`) → over te zetten naar de nieuwe site met behoud van URL.

---

## 4. Doelplaatje: de nieuwe hazenco.nl

Eén Next.js-app op het hoofddomein die Hazenco als B2B-merk presenteert:

1. **Merk / etalage:** nieuwe homepage, dienstenpagina's (webdesign, procesautomatisering, AI-workflows), cases/portfolio, over-ons, contact (Resend-formulier), blog.
2. **Toolshub-toolkit** als sectie: de gratis tools zijn een lead magnet én sterke SEO-instap.
3. **Digitale-tools-marktplaats** als onderdeel/product (gefaseerd echt live met Supabase).
4. **Cross-links met TechPanda:** "TechPanda is onderdeel van Hazenco" en vice versa.

---

## 5. Migratieplan (gefaseerd)

**Fase 0 — Beslissingen & IA**
- Positionering scherpstellen: wat is Hazenco's B2B-belofte en voor wie.
- Sitemap/IA vastleggen (welke dienstenpagina's, waar landt de toolkit, waar de marktplaats).
- Scope-keuze: lanceer je de marktplaats + seller-flow nu, of eerst alleen **merk + toolkit** en de marktplaats "binnenkort"? (Advies: merk + toolkit eerst.)

**Fase 1 — Marketing-shell bovenop deze codebase**
- Nieuwe homepage + dienstenpagina's + over-ons/contact/blog toevoegen.
- Hazenco-branding (logo, kleuren, tone) doorvoeren; hergebruik het bestaande design-system.

**Fase 2 — Content uit WordPress overzetten**
- B2B-pagina's overnemen met behoud van URL's.
- Redirect-map toepassen (computerhulp → TechPanda is al gedaan; WooCommerce-restanten en rommel afhandelen).

**Fase 3 — Backend waar nodig**
- localStorage → Supabase voor de delen die echt live gaan. De toolkit werkt al client-side; de marktplaats/seller-flow pas wireden zodra je die echt lanceert. Volg [docs/backend-migration.md](backend-migration.md).

**Fase 4 — Domein & deploy**
- App naar **hazenco.nl** (root). DNS A-record → VPS `149.210.203.88`.
- `toolshub.hazenco.nl` **301 →** hazenco.nl (of hazenco.nl/toolshub), zodat bestaande Toolshub-links/rankings niet breken.
- WordPress-hazenco.nl uitfaseren. **MX/mail-records ongemoeid laten** (e-mail blijft werken).

**Fase 5 — SEO & nazorg**
- Sitemap indienen, Search Console, 404-monitoring, 6-8 weken rankings volgen.

---

## 6. Aandachtspunten & open vragen

- **Timing:** dit ná TechPanda-livegang (leverancier Qwerty + Mollie live). TechPanda = de omzetmotor; eerst dat afmaken.
- **Marktplaats nu of later:** merk + toolkit eerst live, marktplaats gefaseerd, voorkomt dat je op een half-lege marktplaats lanceert.
- **Merknaam-afbakening:** blijft "Toolshub" de naam van de toolkit/marktplaats-sectie binnen hazenco.nl? Vastleggen.
- **Auth-afbakening:** publieke marketing + ingelogde app (seller/account) in één Next.js-app is prima; let op nette scheiding van routes/middleware.
- **Onderhoud:** twee custom Next.js-sites (TechPanda + Hazenco). Acceptabel door de gedeelde stack; overweeg gedeelde componenten/patronen.

## 7. Verwijzingen

- Redirect-map (WordPress → nieuw): `hazenco-shop/docs/hazenco-migratie-redirect-map.md`
- Backend-migratie (localStorage → Supabase): [docs/backend-migration.md](backend-migration.md)
- Deploy/hosting: [docs/hosting-vps.md](hosting-vps.md)
- Design system: [docs/design-system.md](design-system.md)
