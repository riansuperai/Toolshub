# Redirect-audit — WordPress hazenco.nl → Next.js

> Uitgevoerd: **2026-07-29** (Fase B, vóór DNS-cutover).
> Bron: `https://hazenco.nl/sitemap.xml` (Rank Math), volledig uitgelezen.
> Alle redirects staan in `next.config.ts`.

## Kritieke bevinding

De WordPress-site draait een **Redirection-plugin** die `/computerhulp/*` naar
TechPanda stuurt. Die plugin **stopt te bestaan op het moment van de DNS-switch**.

Bovendien bleek de plugin-configuratie **incompleet**: van de ~35 computerhulp-URLs
redirectte er bij de audit maar één (`/computerhulp/printer-diensten/`). De rest gaf
gewoon 200. Zonder deze audit waren al die URLs na cutover een harde 404.

Geverifieerd: TechPanda spiegelt de **volledige** `/computerhulp/` boom, dus een
wildcard-redirect dekt alles in één regel.

## Inventaris

| Bron (WordPress) | Aantal | Bestemming | Type |
|---|---|---|---|
| `/computerhulp/**` | ~35 | `techpanda.nl/computerhulp/**` | wildcard, cross-domain |
| `/hulp-op-afstand/`, `/maak-afspraak-2/`, `/tarieven/`, `/pricing-plan/` | 4 | `techpanda.nl/computerhulp/` | cross-domain |
| `/shop/`, `/winkel/`, `/winkelwagen/`, `/afrekenen/`, `/mijn-account/` | 5 | `techpanda.nl/catalogus` | cross-domain |
| Blog-posts (Engelse theme-demo content) | 7 | `/blog` | intern |
| `/category/:slug` | 5 | `/blog` | intern |
| `/author/:slug` | 1 | `/over-ons` | intern |
| Theme-restanten (`/team/`, `/project/`, `/testimonials/`, `/coming-soon/`, `/sample-page/`, `/civiele-engineering/`, `/team-details/`, `/test-pagina-hazenco/`, `/404-error/`) | 9 | `/over-ons`, `/cases` of `/` | intern |

## Blijft bestaan (geen redirect nodig)

Deze WordPress-URLs hebben een gelijknamige pagina op de nieuwe site — SEO-waarde
blijft op dezelfde URL staan:

- `/` (home)
- `/website-laten-maken/`
- `/workflow-automatisering/`
- `/over-ons/`
- `/contact/`
- `/veelgestelde-vragen/`
- `/blog/`

## Detail: trailing slash

De site draait op `trailingSlash: true`, TechPanda ook. Daarom krijgt de
computerhulp-wildcard een expliciete slash in de destination
(`:path*/`) — zonder die slash ontstaat een keten van 2 redirects
(hazenco 308 → techpanda 308 → 200) in plaats van 1.

## Verificatie na cutover

Draai dit tegen de live site zodra DNS staat:

```bash
for p in /computerhulp/ /computerhulp/printer-diensten/ /hulp-op-afstand/ \
         /shop/ /winkelwagen/ /hello-world/ /category/business/ /team/; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' https://hazenco.nl$p)"
done
```

Verwacht: allemaal `308` met een correcte `redirect_url`. En deze moeten `200` geven:

```bash
for p in / /website-laten-maken/ /workflow-automatisering/ /over-ons/ \
         /contact/ /veelgestelde-vragen/ /blog/ /oplossingen/ /diensten/; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' https://hazenco.nl$p)"
done
```

## Nog te doen (buiten deze audit)

- Search Console-export van top-pages vóór cutover, om na 2 weken te vergelijken
- Na cutover: 404-log monitoren op URLs die niet in de sitemap stonden
  (bijv. oude campagne-links, PDF's, media-bestanden onder `/wp-content/`)
