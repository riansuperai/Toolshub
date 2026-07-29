# Archief oude WordPress-site hazenco.nl

Gemaakt op **2026-07-29**, vlak vóór de migratie naar de Next.js-site.
Snapshot van de volledige WordPress-site zoals die op dat moment live stond.

## Wat hier staat

**`wordpress-archief.md`** (333 KB) — tekst-extract van alle 77 pagina's.
Per pagina: titel, originele URL, koppenstructuur en de volledige tekst.
Doorzoekbaar met Ctrl-F of grep:

```bash
grep -i -A5 "tarieven" docs/archief/wordpress-archief.md
```

## Wat hier NIET staat

Het volledige archief met HTML-opmaak en 96 afbeeldingen (12 MB ingepakt) is
bewust buiten de repo gehouden — dat hoort niet in de git-geschiedenis van een
applicatie. Rian heeft dat bestand apart ontvangen:
`hazenco-wordpress-archief-2026-07-29.tar.gz`.

Uitpakken en lokaal bekijken:

```bash
tar xzf hazenco-wordpress-archief-2026-07-29.tar.gz
# open site/index.html in je browser — interne links werken offline
```

## Waarom dit bestaat

De WordPress-hosting blijft na de cutover nog een paar weken staan als
rollback-vangnet, maar wordt daarna opgezegd. Vanaf dat moment is dit archief
de enige plek waar de oude teksten en pagina-structuur nog te vinden zijn.

Zie ook [`../redirect-audit.md`](../redirect-audit.md) voor welke van deze
URLs waar naartoe redirecten.
