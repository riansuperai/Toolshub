# Backend migration — van localStorage demo naar Supabase production

Dit document beschrijft hoe je de huidige client-side prototype omzet naar een echte productie-stack op **Supabase**.

## Wat heb je nu

- Volledige UI in Next.js 16 App Router
- Alle state in `useMarketplace` hook → localStorage onder key `hazenco-marketplace-state-v8`
- Types in `src/lib/types.ts` zijn 1-op-1 mappable naar Postgres-tabellen
- Mock-data in `src/lib/marketplace-data.ts` (seed data)

## Wat je nodig hebt

| Component | Waarom | Aanbevolen |
|---|---|---|
| Postgres database | Persistent storage | **Supabase** (gratis tier ruim genoeg voor MVP) |
| Auth | Login / sessions / passwords | **Supabase Auth** — email + Google/Apple OAuth |
| File storage | Tool downloads, screenshots, BTW-facturen | **Supabase Storage** (S3-compatible) |
| Betalingen | iDEAL, SEPA, CC | **Mollie** (Nederlands, geen vendor lock-in) |
| E-mail | Order-bevestigingen, notificaties | **Resend** (DKIM, EU-server) |
| Hosting | Next.js zelf draaien | VPS (zie `docs/hosting-transip.md`) of Vercel |

## Stappenplan

### Stap 1 — Supabase project aanmaken

1. Maak account op [supabase.com](https://supabase.com/)
2. New project → kies regio **eu-central-1** (Frankfurt) of **eu-west-1** (Ireland) voor AVG
3. Sterk DB password kiezen (bewaar in 1Password)
4. Wachten ~2 min tot project klaar is

### Stap 2 — Schema deployen

```bash
# In Supabase Dashboard → SQL Editor → New query
# Plak inhoud van supabase/schema.sql
# Klik "Run"
```

Of via CLI:
```bash
npx supabase login
npx supabase link --project-ref <your-ref>
npx supabase db push
```

### Stap 3 — Environment variables

Maak `.env.local` in je project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-uit-dashboard>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-NIET-publiek>

# Mollie (voor productie)
MOLLIE_API_KEY=test_xxxxxxxxxxxx
MOLLIE_WEBHOOK_SECRET=random-secret-string

# Resend
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=Hazenco <noreply@hazenco.nl>
```

Voeg toe aan VPS / Vercel via hun secret-manager.

### Stap 4 — Supabase client installeren

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Maak `src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

Maak `src/lib/supabase/server.ts` voor server components:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      }
    }
  );
}
```

### Stap 5 — `useMarketplace` vervangen

De huidige hook is een grote client-side store. Migratie-strategie:

**Optie A (snel)** — houd hook in stand, vervang elke `mutate()`-call door een API-call die Supabase update + lokale state ook update voor optimistic UI.

**Optie B (clean)** — vervang hook door React Query hooks per entity:

```ts
// src/lib/queries/listings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("listings")
        .select("*, seller:sellers(name, handle), versions:listing_versions(*)")
        .eq("status", "published")
        .order("featured", { ascending: false });
      return data ?? [];
    }
  });
}

export function useApproveListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listings").update({ status: "published" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] })
  });
}
```

**Aanbeveling:** Begin met Optie A om snel live te gaan, refactor later naar Optie B.

### Stap 6 — Auth aansluiten

Vervang `setActiveUser` demo-switcher door echte Supabase Auth:

```tsx
// src/app/account/page.tsx
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");

// Login flow:
await supabase.auth.signInWithOtp({ email });  // magic link
// of
await supabase.auth.signInWithOAuth({ provider: "google" });
```

De trigger in `schema.sql` (`handle_new_auth_user`) maakt automatisch een `users`-record bij signup. Demo `RoleSwitcher` component **verwijderen** voor productie.

### Stap 7 — File uploads naar Supabase Storage

In Supabase Dashboard → Storage → New bucket:
- `listing-files` (private) — voor tool-downloads
- `review-screenshots` (public) — voor review-foto's
- `creator-avatars` (public)

Aanpassen file-dropzone om naar Supabase te uploaden in plaats van localStorage:

```ts
const { data, error } = await supabase.storage
  .from("listing-files")
  .upload(`${listingId}/${file.name}`, file);
```

### Stap 8 — Mollie integreren voor betalingen

```ts
// src/app/api/checkout/route.ts
import createMollieClient from "@mollie/api-client";

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

export async function POST(req: Request) {
  const { orderId, totalCents } = await req.json();
  const payment = await mollie.payments.create({
    amount: { currency: "EUR", value: (totalCents / 100).toFixed(2) },
    description: `Hazenco bestelling #${orderId}`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?id=${orderId}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mollie/webhook`,
    metadata: { orderId }
  });
  return Response.json({ checkoutUrl: payment.getCheckoutUrl() });
}
```

Webhook (`src/app/api/mollie/webhook/route.ts`) update `orders.status` op basis van `payment.status`.

### Stap 9 — E-mail templates aansluiten

De UI op `/admin/templates` slaat templates op in localStorage — verplaats naar Supabase:

```sql
create table public.email_templates (
  id        text primary key,
  name      text not null,
  trigger   text not null,
  subject   text not null,
  body      text not null,
  variables text[] not null,
  updated_at timestamptz default now(),
  updated_by uuid references public.users (id)
);
```

Verstuur via Resend:

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY!);

async function sendOrderConfirmation(order, buyer) {
  const tpl = await getTemplate("order_confirmation");
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: buyer.email,
    subject: fillTemplate(tpl.subject, { orderId: order.id, ... }),
    html: fillTemplate(tpl.body, { firstName: buyer.name.split(" ")[0], ... })
  });
}
```

### Stap 10 — Notifications echt persisteren

Huidige `deriveNotifications()` werkt client-side. In productie:

1. Database triggers schrijven notifications direct in `notifications` tabel:
   ```sql
   create function notify_on_paid_order() returns trigger as $$
   begin
     -- Insert "Aankoop bevestigd" voor buyer
     insert into public.notifications (user_id, kind, title, body, link)
     values (new.buyer_id, 'order_paid', 'Aankoop bevestigd', 'Je bestelling is verwerkt.', '/account/orders');
     -- Insert "Nieuwe verkoop" per seller_item
     ...
     return new;
   end;
   $$ language plpgsql;

   create trigger orders_paid_notify after update of status on public.orders
     for each row when (old.status != 'paid' and new.status = 'paid')
     execute function notify_on_paid_order();
   ```

2. Realtime subscriptions op de client:
   ```ts
   supabase.channel('notifications')
     .on('postgres_changes', { event: 'INSERT', table: 'notifications', filter: `user_id=eq.${userId}` },
         (payload) => addNotification(payload.new))
     .subscribe();
   ```

## Wat je behoudt zonder wijzigingen

✓ Hele UI / componenten
✓ CSS / dark mode
✓ Routing
✓ Type-definitions (worden bron-van-waarheid)
✓ Helpers in `marketplace-data.ts` (productTypeLabels, brancheLabels etc.)

## Wat opnieuw moet

- `useMarketplace` hook → React Query hooks per entity
- `RoleSwitcher` → echte login + role-detection uit `auth.users`
- LocalStorage persistence → Supabase queries
- `createId()` → database-side `gen_random_uuid()`
- Mock screenshots → echte uploads naar Storage

## Geschatte tijd

| Fase | Wat | Geschatte tijd |
|---|---|---|
| 1 | Supabase project + schema deploy | 30 min |
| 2 | Auth basics (login/signup/RLS) | 4-8 uur |
| 3 | Data migratie (entities één voor één) | 2-3 dagen |
| 4 | Mollie checkout end-to-end | 1 dag |
| 5 | Storage + file-uploads | 4 uur |
| 6 | Resend + email triggers | 1 dag |
| 7 | Notifications + realtime | 4-8 uur |
| 8 | QA + edge cases | 2-3 dagen |

**Totaal:** 1,5 tot 2 weken voor een solo-developer om volledig te migreren.

## Validatie checklist voor productie

- [ ] AVG: Privacy-statement gepubliceerd
- [ ] Cookie-banner met opt-in
- [ ] BTW-instellingen kloppen (10% commissie + 21% BTW)
- [ ] KvK + BTW-nummer in footer
- [ ] Mollie account geverifieerd
- [ ] Test-betalingen werken met test-modus
- [ ] Webhook-handler is idempotent
- [ ] RLS policies getest met verschillende rollen
- [ ] Backup-strategie: dagelijkse pg_dump in S3
- [ ] Rate limiting op auth endpoints
- [ ] Sentry of vergelijkbare error tracking
- [ ] Domein heeft DKIM + SPF voor e-mail
- [ ] SSL certificaat actief (Let's Encrypt auto-renew)

## Referenties

- [Supabase docs](https://supabase.com/docs)
- [Mollie API docs](https://docs.mollie.com/)
- [Resend Next.js guide](https://resend.com/docs/send-with-nextjs)
- [Next.js + Supabase auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
