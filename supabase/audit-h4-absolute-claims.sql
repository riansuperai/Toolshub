-- ============================================================
-- Audit H4 — absolute technische claims kwalificeren.
--
-- Waarom: "geen performance-hit", "GDPR-safe" en "foutloos" zijn
-- onvoorwaardelijke beloftes zonder testcondities of uitzonderingen.
-- Ze zijn niet te bewijzen en verhogen het risico bij een klacht.
-- We vervangen ze door wat structureel waar is en controleerbaar blijft.
--
-- Draaien in: Supabase Dashboard -> SQL Editor -> New query
-- Pagina's verversen binnen 5 minuten (revalidate = 300); vraag de
-- pagina daarna een keer op, dan regenereert Next.js hem.
-- ============================================================

-- 1. Wat staat er nu? (verwacht: 4 treffers over 3 listings)
select slug,
       (length(description) - length(replace(description, 'performance-hit', ''))) / 15   as performance_hit,
       (length(description) - length(replace(description, 'GDPR-safe', ''))) / 9         as gdpr_safe,
       (length(description) - length(replace(description, 'foutloos en continu', ''))) / 19 as foutloos
from public.listings
where description like '%performance-hit%'
   or description like '%GDPR-safe%'
   or description like '%foutloos en continu%';

-- 2a. Cross-sell popup: performance-claim -> ontwerpfeit
update public.listings
set description = replace(
      description,
      'Storefront leest config lokaal — geen runtime API-calls, geen performance-hit',
      'Storefront leest config lokaal — ontworpen zonder runtime API-calls'
    ),
    updated_at = now()
where slug = 'verzending-cross-sell-popup-magento';

-- 2b. Cross-sell popup: juridisch label -> technische feiten.
--     "GDPR-safe" is een juridische conclusie die wij niet kunnen geven;
--     de onderliggende feiten mogen we wel noemen.
update public.listings
set description = replace(
      description,
      'GDPR-safe (geen tracking, geen third party)',
      'Geen tracking en geen third-party scripts'
    ),
    updated_at = now()
where slug = 'verzending-cross-sell-popup-magento';

-- 2c. m2-calculator: conclusie schrappen, de feiten ervoor volstaan
update public.listings
set description = replace(
      description,
      'geen GraphQL, geen extra API-calls, geen performance-hit.',
      'geen GraphQL, geen extra API-calls.'
    ),
    updated_at = now()
where slug = 'm2-calculator-tegels-vloeren-magento';

-- 2d. Voorraad-tool: "foutloos" -> wat de tool structureel wegneemt
update public.listings
set description = replace(
      description,
      'Dat werk doet de tool, foutloos en continu.',
      'Dat werk doet de tool, continu en zonder overtikfouten.'
    ),
    updated_at = now()
where slug = 'hazenco-voorraad-tool';

-- 3. Verifieer dat alles weg is (verwacht: 0 rijen)
select slug
from public.listings
where description like '%performance-hit%'
   or description like '%GDPR-safe%'
   or description like '%foutloos en continu%';
