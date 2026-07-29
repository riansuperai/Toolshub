# Prompt voor de Toolshub-chat (nieuwe richting: dit wordt hazenco.nl)

> Plak onderstaande tekst in de chat waar je aan de Toolshub-codebase
> (`hazenco-marktplaats`) werkt.

---

Ik wil de richting van dit project verbreden. Lees eerst het nieuwe document
`docs/hazenco-nl-migratie-plan.md` in deze repo, dat legt de volledige context uit.

Kort het besluit:
- Merksplitsing: **TechPanda = B2C** (IT-webshop + computerhulp aan huis, al live op techpanda.nl). **Hazenco = B2B** (procesautomatisering, AI-workflows, webdesign) plus Toolshub.
- **Deze codebase wordt het fundament van de nieuwe hazenco.nl**, op het hoofddomein (custom Next.js), met de gratis toolkit en een "Oplossingen"-showcase als onderdeel (geen marketplace meer). De huidige WordPress-hazenco.nl wordt uitgefaseerd.
- Waarom: zelfde stack als TechPanda, de inhoud (digitale tools, automatisering, AI) is precies Hazenco's B2B-domein, en een custom site is meteen onze webdesign-showcase. Toolshub is als los product te dun; als onderdeel van de merksite krijgt het context en verkeer.

Wat ik van je wil, in deze volgorde:
1. Bevestig dat je het plan hebt gelezen en geef je beeld: is deze codebase een goed fundament voor hazenco.nl, en wat is grofweg de omvang van de ombouw (welke delen herbruikbaar, welke nieuw)?
2. **Fase 0 is al beslist** (zie plan, sectie 7). Samengevat:
   - Positionering: **dienstenbureau voorop**. Diensten = **webdesign / procesautomatisering / AI-workflows & integraties**.
   - **GEEN marketplace** meer, maar een **"Oplossingen"-showcase**: de bestaande oplossing-kaarten blijven (layout, prijs "vanaf €X/mnd", "boek een gesprek"), maar als portfolio/etalage van wat Hazenco bouwt. De seller/koper/checkout-flow gaat uit de bezoekers-UX.
   - **"Toolshub"-naam vervalt**; de showcase heet **"Oplossingen"**. De **gratis toolkit (`/toolkit`) blijft** als lead magnet.
   - **Homepage = officiële agency-homepage** (services-led), niet de marktplaats-catalogus.
   - Tagline: **"Wij automatiseren en bouwen wat jouw bedrijf sneller maakt."** URL `/workflow-automatisering` behouden.
   
   Bevestig dat je hiermee akkoord bent en scherp aan waar nodig.
3. **Fase 1 — bouwplan:** maak een concreet ombouwplan: nieuwe services-led homepage, `/diensten` + 3 detailpagina's, de Oplossingen-showcase uit de bestaande kaarten, `/cases` (optioneel later), `/contact` (Resend), `/blog`, herwerkte `/over-ons`. Nog niet deployen.

Belangrijke kaders:
- **Timing:** de echte livegang komt ná TechPanda's livegang (leverancier Qwerty + Mollie-betalingen). Nu = verkennen, plannen en bouwen, nog geen cutover.
- **SEO:** behoud van rankings is cruciaal. De redirect-map staat in de TechPanda-repo: `hazenco-shop/docs/hazenco-migratie-redirect-map.md`. Computerhulp verhuist al naar TechPanda (301). B2B-pagina's overzetten met behoud van URL.
- **Deploy:** zelfde TransIP VPS als TechPanda (`149.210.203.88`, user `amiagung`). Zie `docs/hosting-vps.md`. Bij cutover: `toolshub.hazenco.nl` 301 naar hazenco.nl, en de MX/mail-records ongemoeid laten.
- **Backend:** nu grotendeels localStorage; Supabase pas koppelen waar echt nodig. Zie `docs/backend-migration.md`.

Begin met stap 1 en 2. Nog niets deployen en het domein nog niet omzetten.

---
