# Hosting op TransIP VPS — toolshub.hazenco.nl

Stappenplan om Hazenco Marktplaats live te zetten op `https://toolshub.hazenco.nl`.
Volgt hetzelfde patroon als [hazenco-voorraad-tool](../../hazenco-voorraad-tool/).

> **Tijd:** ~30-45 min als je voor het eerst doet. ~5 min voor latere updates.

---

## Overzicht

- **VPS:** TransIP (`149.210.203.88`), Ubuntu, user `amiagung`
- **Locatie op VPS:** `/opt/hazenco-toolshub/`
- **Container poort:** 5056 (intern), proxied via Nginx
- **URL:** `https://toolshub.hazenco.nl`
- **Deploy-flow:** GitHub → `git pull` op VPS → `docker compose build` → restart

---

## Fase 1 — Lokaal: git + GitHub repo

Doe dit op je Windows-machine (PowerShell), in deze project-map.

### 1.1 Git initialiseren

```powershell
cd "D:\sanitairsupershop Dropbox\Ami Agung\Agents\hazenco-marktplaats"
git init -b main
git add .
git commit -m "Initial commit: Hazenco Marktplaats MVP"
```

### 1.2 GitHub repo aanmaken

**Optie A — via `gh` CLI (snelst):**
```powershell
gh auth login   # eenmalig, als je nog niet ingelogd bent
gh repo create hazenco-marktplaats --private --source=. --remote=origin --push
```

**Optie B — via browser:**
1. Ga naar https://github.com/new
2. Repo-naam: `hazenco-marktplaats`, **Private**, geen README/license toevoegen
3. Klik "Create repository"
4. Volg de instructies onder "...or push an existing repository":
   ```powershell
   git remote add origin https://github.com/<JOUW-USERNAME>/hazenco-marktplaats.git
   git push -u origin main
   ```

> **Tip:** Gebruik de GitHub Personal Access Token uit `Handige plakcodes.txt` als je naar wachtwoord wordt gevraagd.

---

## Fase 2 — VPS: Docker + container draaien

### 2.1 SSH inloggen

```bash
ssh amiagung@149.210.203.88
```
(wachtwoord uit `Handige plakcodes.txt`)

### 2.2 Project klonen

```bash
sudo mkdir -p /opt/hazenco-toolshub
sudo chown amiagung:amiagung /opt/hazenco-toolshub
cd /opt
git clone https://github.com/<JOUW-USERNAME>/hazenco-marktplaats.git hazenco-toolshub
cd hazenco-toolshub
```

> Voor private repo: gebruik je GitHub PAT als wachtwoord, of zet een deploy-key.

### 2.3 `.env` bestand aanmaken

```bash
nano .env
```

Plak dit erin (zelfde keys als je lokale `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://itqanbhecghinccgyeyf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_L7SWq-GVx1my4S3dCBPqhA_prAw26ZS
```

Opslaan: `Ctrl+O`, `Enter`, `Ctrl+X`.

### 2.4 Container bouwen en starten

```bash
sudo docker compose build --no-cache
sudo docker compose up -d
sudo docker compose logs --tail=30
```

Controleer dat de container draait:
```bash
sudo docker compose ps
curl http://localhost:5056/health
# verwacht: {"status":"ok","service":"hazenco-toolshub","timestamp":"..."}
```

---

## Fase 3 — Nginx + SSL

### 3.1 DNS instellen

In TransIP DNS-paneel voor `hazenco.nl`:

| Type | Naam | Waarde | TTL |
|---|---|---|---|
| A | toolshub | 149.210.203.88 | 3600 |

Wachten ~5-15 min tot DNS propageert. Test:
```bash
dig +short toolshub.hazenco.nl
# verwacht: 149.210.203.88
```

### 3.2 Nginx config

Op de VPS:

```bash
sudo nano /etc/nginx/sites-available/toolshub.hazenco.nl
```

Plak:

```nginx
server {
    listen 80;
    server_name toolshub.hazenco.nl;

    # Vergroot upload-limiet voor seller-uploads (screenshots etc)
    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:5056;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
```

Activeren:
```bash
sudo ln -s /etc/nginx/sites-available/toolshub.hazenco.nl /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Test (zonder SSL nog):
```bash
curl -I http://toolshub.hazenco.nl/health
# verwacht: HTTP/1.1 200 OK
```

### 3.3 SSL via Let's Encrypt

```bash
sudo certbot --nginx -d toolshub.hazenco.nl
```

Volg de prompts: e-mailadres, akkoord met TOS, kies redirect HTTP→HTTPS (optie 2).

Certbot past je Nginx-config automatisch aan en stelt auto-renewal in.

### 3.4 Live check

Open https://toolshub.hazenco.nl in je browser. Je zou de catalogus moeten zien zoals lokaal.

Health endpoint: https://toolshub.hazenco.nl/health

---

## Fase 4 — Latere updates

### Wanneer wel/niet deployen

| Type wijziging | Deploy nodig? | Welk script |
|---|---|---|
| Foto's, prijzen, tool-info via Supabase dashboard | ❌ nee | browser refresh |
| Code: components, CSS, pages | ✅ ja | `bash deploy.sh` (snel, cached) |
| package.json / Dockerfile / vreemd gedrag | ✅ ja | `bash deploy-fresh.sh` (volledig opnieuw) |

### Normale code-update workflow

Op je lokale machine:
```powershell
cd "D:\sanitairsupershop Dropbox\Ami Agung\Agents\hazenco-marktplaats"
# ...wijzigingen maken...
git add .
git commit -m "Beschrijving van de wijziging"
git push
```

Op de VPS:
```bash
ssh amiagung@149.210.203.88
cd /opt/hazenco-toolshub
bash deploy.sh        # ~10-30 sec, gebruikt Docker cache
```

Dit doet: `git pull` → `docker compose build` (cached) → `up -d` → healthcheck → `nginx reload`.

### Volledige rebuild (als iets niet klopt)

```bash
bash deploy-fresh.sh  # ~80 sec, geen cache
```

Gebruik dit als:
- `bash deploy.sh` iets vreemds geeft (cache-corruptie)
- `package.json` of `Dockerfile` is gewijzigd
- Je wil zeker weten dat alles vers gebouwd is

---

## Troubleshooting

### Container start niet

```bash
sudo docker compose logs --tail=100
```

Veelvoorkomende oorzaken:
- `.env` mist of bevat verkeerde Supabase keys → check `cat .env`
- Poort 5056 al in gebruik → `sudo lsof -i :5056` of `sudo netstat -tlnp | grep 5056`

### "502 Bad Gateway" via Nginx

Container draait niet. Check stap 2.4. Of: container draait wel maar op andere poort.

### Build mislukt: "out of memory"

Op een 1GB-VPS kan `next build` krap zitten. Tijdelijke swap aanmaken:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Supabase calls werken niet vanaf live URL

Check in Supabase dashboard → Authentication → URL Configuration:
- Voeg `https://toolshub.hazenco.nl` toe aan **Site URL** en **Redirect URLs**

Anders blokkeert Supabase CORS / OAuth-redirects.

---

## Veiligheid checklist (voor productie)

- [ ] `.env` op VPS is `chmod 600`: `chmod 600 /opt/hazenco-toolshub/.env`
- [ ] Firewall: `ufw allow 22,80,443/tcp` en blok 5056 van extern (alleen via Nginx)
- [ ] Supabase RLS-policies getest met live data (zie `supabase/schema.sql`)
- [ ] Backup-strategie voor Supabase (Supabase doet automatisch dagelijks op betaalde tier)
- [ ] Monitoring: in elk geval `docker compose ps` periodiek of een healthcheck-monitor (UptimeRobot is gratis)

---

## Referenties

- Identiek patroon: [hazenco-voorraad-tool/deploy.sh](../../hazenco-voorraad-tool/deploy.sh)
- Volgende stap data-migratie: [docs/backend-migration.md](backend-migration.md)
- Credentials VPS/GitHub: `D:\sanitairsupershop Dropbox\Ami Agung\Agents\Handige plakcodes.txt`
