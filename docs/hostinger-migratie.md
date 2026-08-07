# Migratie hazenco.nl — TransIP VPS → Hostinger VPS

Verplaatst **alleen de website** `hazenco.nl` (+ `www`) naar de Hostinger-VPS.
Domeinregistratie, DNS-beheer, e-mail en alle andere subdomeinen blijven bij TransIP.

**Status:** ✅ **uitgevoerd op 2026-08-07.** `hazenco.nl` draait op Hostinger.
Alleen het opruimen op TransIP (stap 8) staat nog open — bewust, als rollback-vangnet.

---

## Servers

| | TransIP (oud) | Hostinger (nieuw) |
|---|---|---|
| IP | `149.210.203.88` | `187.77.69.153` |
| SSH | `amiagung@` + sudo | `root@` |
| OS | Ubuntu | Ubuntu 24.04.4 LTS |
| Projectmap | `/opt/hazenco-toolshub` | `/opt/hazenco-toolshub` |
| Container-poort | `127.0.0.1:5056` | `127.0.0.1:5056` |
| Overige diensten | 14 containers | techpanda, hazenco-os, hermes-agent |

## Wat verhuist en wat niet

**Verhuist:** `hazenco.nl` en `www.hazenco.nl` (container `hazenco-toolshub`).

**Blijft op TransIP:**
- Domeinregistratie en DNS-beheer (nameservers `ns0.transip.net` e.a.)
- E-mail — MX wijst naar `mx.transip.email`, **niet aanraken**
- `toolshub.hazenco.nl`, `intake.weboplossingen.hazenco.nl`, en alle overige subdomeinen
- De 13 andere containers (pricetool, voorraad, blog-tool, fellows, cep, ...)

> `hazenco-os` draait al wél op Hostinger (poort 5066) maar de DNS wijst nog naar
> TransIP. Dat is een aparte, nog niet afgeronde cutover — buiten scope van dit
> document. Wordt later gekoppeld als `hazenco-os.hazenco.nl`.

---

## Uitgevoerd (stap 1–5)

Deze stappen zijn **niet zichtbaar voor bezoekers** — DNS wees nog naar TransIP.

### 1. Repo clonen
```bash
git clone https://github.com/riansuperai/Toolshub.git /opt/hazenco-toolshub
```

### 2. Environment-variabelen
Server-naar-server gekopieerd, vier variabelen:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

> ⚠️ `RESEND_API_KEY` ontbreekt nog steeds → contactformulier werkt niet.
> Toevoegen aan `/opt/hazenco-toolshub/.env` + `docker compose up -d --force-recreate`.

### 3. Poort afschermen
De repo-versie van `docker-compose.yml` bindt op `5056:5056` (alle interfaces).
Op beide servers is dat lokaal aangepast naar `127.0.0.1:5056:5056`.

> ⚠️ Deze wijziging staat **niet in git**. Een verse clone verliest hem.
> Overweeg dit alsnog te committen.

### 4. Container bouwen
```bash
cd /opt/hazenco-toolshub && docker compose build && docker compose up -d
```

### 5. SSL + nginx
Certificaat gekopieerd van TransIP in plaats van opnieuw uitgegeven — scheelt een
DNS-01 challenge vóór de switch:
```bash
ssh amiagung@149.210.203.88 "sudo tar -czf - -C /etc/letsencrypt \
  archive/hazenco.nl live/hazenco.nl renewal/hazenco.nl.conf" \
  | ssh root@187.77.69.153 "tar -xzf - -C /etc/letsencrypt"
```
Geldig t/m **2026-10-27**, dekt `hazenco.nl` + `www.hazenco.nl`.
Renewal staat op `authenticator = nginx`, werkt automatisch zodra DNS is omgezet.

Vhost `/etc/nginx/sites-enabled/hazenco.nl` één-op-één overgenomen.

### Verificatie (DNS omzeild via `--resolve`)
```
https://hazenco.nl        200   ssl_verify=0   36ms
https://www.hazenco.nl    301 → https://hazenco.nl/
http://hazenco.nl         301 → https://hazenco.nl/
```
Alle routes 200. Supabase-data identiek aan live (12 oplossingen, 83 afbeeldingen).
`techpanda.nl` op dezelfde server ongemoeid.

---

## Nog te doen

### 6. DNS-switch — bij TransIP, handmatig ✅ gedaan

In het TransIP DNS-paneel voor `hazenco.nl`:

| Type | Naam | Van | Naar |
|---|---|---|---|
| A | `@` (hazenco.nl) | `149.210.203.88` | **`187.77.69.153`** |

**Niet aanraken:** MX-records, `www` (is een CNAME naar de apex en volgt vanzelf),
en alle overige subdomeinen.

**Let op het AAAA-record.** Bij de vorige migratie ging het hier mis: een
achtergebleven IPv6-record zorgde voor half werkende pagina's. Er staat er nu geen
— controleer dat het zo blijft.

Propagatie: 10–60 minuten.

> ⚠️ **Er staat een wildcard-record `*` → `149.210.203.88`.** Die vangt elk
> subdomein op zonder eigen record en stuurt het naar de TransIP-VPS. Niet
> aanraken — anders verhuizen alle overige tools in één klap mee.

### 7. Verifiëren na de switch ✅ gedaan

Resultaat 2026-08-07, direct na de switch (TTL stond op 5 min):

```
DNS bij 8.8.8.8 / 1.1.1.1 / 9.9.9.9   →  187.77.69.153
https://hazenco.nl                        200  ssl_verify=0  192ms
https://www.hazenco.nl                    301 → https://hazenco.nl/
http://hazenco.nl                         301 → https://hazenco.nl/
13 routes getest                          alle 200
Supabase-data                             12 oplossingen, 83 afbeeldingen
toolshub.hazenco.nl                       149.210.203.88, 301 → hazenco.nl
intake.weboplossingen.hazenco.nl          149.210.203.88, 200
MX → mx.transip.email                     ongewijzigd
AAAA-record                               afwezig
```

```bash
dig +short hazenco.nl                      # verwacht 187.77.69.153
curl -sI https://hazenco.nl/ | head -1
curl -s -o /dev/null -w '%{http_code}\n' https://hazenco.nl/oplossingen/
ssh root@187.77.69.153 "certbot renew --dry-run"   # pas ná de switch zinvol
```

### 8. Pas daarna opruimen op TransIP
Niet eerder dan een paar dagen na een probleemloze switch:
```bash
ssh amiagung@149.210.203.88
sudo rm /etc/nginx/sites-enabled/hazenco.nl && sudo systemctl reload nginx
cd /opt/hazenco-toolshub && sudo docker compose down
```

---

## Rollback

A-record terugzetten naar `149.210.203.88`. Zolang stap 8 niet is uitgevoerd,
draait de oude omgeving nog en is de site binnen de propagatietijd weer terug.

## Deploy-flow na de migratie

`deploy.sh` werkt ongewijzigd — het script doet `cd /opt/hazenco-toolshub`, wat op
beide servers klopt. Alleen het SSH-adres verandert:
```bash
ssh root@187.77.69.153
cd /opt/hazenco-toolshub && bash deploy.sh
```

> `deploy.sh` gebruikt `sudo`. Als root werkt dat, maar overweeg een gebruiker
> zonder root-rechten aan te maken, zoals `amiagung` op TransIP.
