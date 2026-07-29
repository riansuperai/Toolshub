# Cutover-runbook — hazenco.nl livegang

> **Wanneer uitvoeren:** zodra Fase 1 acceptatie op staging (`toolshub.hazenco.nl`) is
> afgerond. TechPanda-livegang is losgekoppeld van deze migratie.
>
> Deze runbook is de checklist voor de daadwerkelijke domein-switch van
> WordPress hazenco.nl naar de nieuwe Next.js site.
>
> **Beslissingen (2026-07-29):**
> - `toolshub.hazenco.nl` wordt **retired** — 301-redirect all-paths naar `hazenco.nl`
> - Merge-flow: PR `hazenco-b2b-rebuild` → `main` → deploy vanaf `main`
> - `toolshub.hazenco.nl` fungeert als **staging-preview** tot en met de dag van cutover

---

## Vooraf (dagen vóór cutover)

### 1. Fase 1 launch-check afronden

Loop deze acceptatie-lijst door op `hazenco-b2b-rebuild` branch:

- [ ] Alle publieke routes returnen HTTP 200
  - `/`, `/diensten`, `/website-laten-maken`, `/workflow-automatisering`, `/ai-workflows`
  - `/oplossingen`, `/oplossingen/[slug]` (alle 7 slugs)
  - `/toolkit`, `/toolkit/*` (alle 11 mini-tools)
  - `/blog`, `/blog/[slug]` (alle posts)
  - `/cases`, `/contact`, `/over-ons`, `/privacy`, `/algemene-voorwaarden`, `/veelgestelde-vragen`
- [ ] Contact-formulier verstuurt echt via Resend (test-mail naar eigen adres)
- [ ] Sitemap.xml en robots.txt kloppen (`/sitemap.xml`, `/robots.txt`)
- [ ] Cookie-consent + GA4 werken op alle pagina's
- [ ] 404-pagina rendert netjes (test met `/bestaat-niet`)
- [ ] Mobiel-responsive gecheckt op iPhone SE / iPad / desktop
- [ ] Dark mode werkt op alle pages
- [ ] 301-redirects werken: `/tools/x/`, `/catalogus/`, `/checkout/`, `/seller/`, `/account/`, `/admin/`, `/onboarding/`, `/creators/`, `/winkelwagen/`
- [ ] Alle links in nav + footer werken (geen 404s)

### 2. Environment-variabelen op VPS klaarzetten

```env
NEXT_PUBLIC_SITE_URL=https://hazenco.nl
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX     # bestaande GA4 property
RESEND_API_KEY=re_xxxxxxxxx                     # nieuwe key voor hazenco.nl
RESEND_FROM=Hazenco Contact <info@hazenco.nl>
RESEND_TO=info@hazenco.nl
```

### 3. WordPress-content backup

- [ ] Volledige export van huidige WordPress-hazenco.nl (via TransIP-webhosting backup-tool)
- [ ] Screenshot alle bestaande B2B-pagina's voor referentie
- [ ] Exporteer Google Search Console data (top-pages, top-queries) voor pre/post-migratie vergelijking

### 4. Redirect-map dubbelchecken — ✅ AFGEROND 2026-07-29

Volledige audit uitgevoerd op de WordPress-sitemap. Zie **`docs/redirect-audit.md`**
voor de complete inventaris en verificatie-commando's.

Alle redirects staan in `next.config.ts` en zijn live geverifieerd op staging.

> ⚠️ **Belangrijk om te weten:** de `/computerhulp/*` → TechPanda redirects draaiden
> op de WordPress Redirection-plugin. Die verdwijnt bij de DNS-switch. De
> plugin-config bleek bovendien incompleet (1 van ~35 URLs redirectte echt).
> Alles is nu overgezet naar `next.config.ts` als wildcard.

---

## Op de dag van cutover

### 5. Merge naar main

```bash
git checkout main
git merge hazenco-b2b-rebuild --no-ff -m "Merge: hazenco.nl B2B rebuild Fase 1 live"
git push origin main
```

### 6. Deploy naar VPS

```bash
ssh amiagung@149.210.203.88
cd /opt/hazenco-toolshub

# Env-vars bijwerken
sudo nano .env
# vul RESEND_API_KEY, RESEND_FROM, RESEND_TO in

# Pull + build + restart
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d

# Check container health
docker compose ps
docker compose logs -f web
# Ctrl-C wanneer je stable output ziet
```

Test lokaal op VPS: `curl -s http://localhost:5056/ | head`

### 7. Nginx-vhost aanpassen naar hazenco.nl

Op VPS:

```bash
sudo nano /etc/nginx/sites-available/hazenco-toolshub
```

Vervang `server_name toolshub.hazenco.nl;` met `server_name hazenco.nl www.hazenco.nl;`

```bash
sudo nginx -t
sudo systemctl reload nginx

# SSL-certificaat voor hazenco.nl
sudo certbot --nginx -d hazenco.nl -d www.hazenco.nl --non-interactive --redirect
```

### 8. DNS-switch bij TransIP

**A-records:**
- `hazenco.nl` → `149.210.203.88` (van huidige webhosting-IP `85.10.159.84`)
- `www.hazenco.nl` → `149.210.203.88` (of CNAME naar `hazenco.nl`)

**MX-records:**
- **NIET AANRAKEN** — e-mail via `@hazenco.nl` moet blijven werken via bestaande mail-provider

**Sub-domein:**
- `toolshub.hazenco.nl` → laten wijzen naar VPS (of A-record wijzigen om ook naar `149.210.203.88`) — de Next.js server serveert daar dan de 301-redirect naar `hazenco.nl`

DNS-propagatie duurt meestal 10-60 minuten. Check met:
```bash
dig hazenco.nl
dig www.hazenco.nl
```

### 9. Nginx voor toolshub-redirect

Op VPS: voeg een vhost toe die alle toolshub-verkeer 301-redirect:

```nginx
server {
  listen 80;
  server_name toolshub.hazenco.nl;
  return 301 https://hazenco.nl$request_uri;
}
```

(HTTPS-variant via bestaande cert, of nieuwe certbot).

### 10. WordPress site uitfaseren

**Optie A — direct uit (aanbevolen):**
- Log in op TransIP-webhosting control panel
- Zet WordPress-site op maintenance of verwijder de bestand-serving
- MX/mail-records blijven onaangeroerd

**Optie B — parallel houden (safer):**
- Laat WordPress even staan, verplaats DNS
- Na 2 weken zonder issues → WordPress uitzetten

### 11. Google Search Console update

- [ ] `hazenco.nl` domain-property behouden (of aanmaken als nieuw)
- [ ] Nieuwe sitemap indienen: `https://hazenco.nl/sitemap.xml`
- [ ] Change of Address tool niet nodig (zelfde domein)
- [ ] Coverage-rapport monitoren voor 404-spikes eerste 2 weken

---

## Na cutover — nazorg (6-8 weken)

### 12. Monitoring

- [ ] Dagelijks 404-log checken (VPS: `docker compose logs web | grep 404`)
- [ ] Wekelijks Search Console rankings + coverage
- [ ] Wekelijks Google Analytics: verkeer per pagina, drop-offs
- [ ] Contact-formulier submissions volgen (spam / bugs / echte leads)

### 13. Vaak-voorkomende issues

- **404 op oude URL** → toevoegen aan `next.config.ts` redirects en redeploy
- **Formulier komt niet aan** → check Resend dashboard, check spam-folder
- **Trage pagina** → check `docker compose logs web` op errors
- **SSL-fout** → `sudo certbot renew`

### 14. Volgende fases plannen

Na Fase 1 stabiel draait (~4-6 weken na cutover), verkennen:
- Cases-content uitbreiden met echte klantverhalen
- Blog uitbreiden (1-2 posts per maand)
- Toolkit uitbreiden op basis van user-requests
- SEO-content voor de dienstenpagina's dieper (long-tail keywords)

---

## Snelle rollback (indien nodig)

Als er iets kritisch stuk gaat na cutover:

```bash
# Op VPS
cd /opt/hazenco-toolshub
git checkout <vorige-commit-hash>
docker compose build --no-cache
docker compose up -d
```

DNS-rollback (WordPress terug):
- Bij TransIP: A-record hazenco.nl terug naar `85.10.159.84`
- Duurt weer 10-60 min propagatie

Rollback-verantwoordelijke: **Rian** (contact via WhatsApp of directe SSH-toegang).

---

## Contact bij livegang

- **VPS-toegang:** amiagung@149.210.203.88 (SSH key)
- **DNS + hosting:** TransIP account
- **Domein-eigenaar:** Rian
- **Resend account:** info@hazenco.nl
- **Google Search Console:** info@hazenco.nl
