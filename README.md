# Hazenco Marketplace MVP

Een werkende Next.js MVP voor een Nederlandse marketplace voor digitale tools: workflows, AI agents, plugins, extensies, skills, themes, templates en servicepakketten.

## Wat werkt lokaal

- Koperflow: catalogus, productdetail, demo sandbox, winkelwagen, testbetaling, bibliotheek, downloads, reviews en support.
- Sellerflow: seller aanvraag, listing upload, delivery modes, demo-informatie, orders en service requests.
- Adminflow: seller approval, listing approval, featured beheer, review moderatie en categorieoverzicht.
- Demo data en acties worden lokaal bewaard in `localStorage`.
- Supabase-ready schema staat in `supabase/schema.sql`.

## Starten

```bash
npm install
npm run dev
```

Open daarna de lokale URL die Next.js toont.

## Supabase koppelen

Vul `.env.local` met:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run het SQL schema in Supabase en vervang daarna de lokale store stap voor stap door Supabase queries, auth en storage.
