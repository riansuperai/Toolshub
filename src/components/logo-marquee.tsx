import Image from "next/image";
import type { Client } from "@/lib/supabase-queries";

/**
 * Doorlopende logo-slider ("vertrouwd door"). Server component: de animatie
 * is pure CSS, er is geen client-side JavaScript voor nodig.
 *
 * Hoe de naadloze lus werkt: de rij logo's wordt precies twee keer gerenderd
 * en de track schuift van 0 naar -50%. Op -50% staat de tweede helft exact
 * waar de eerste begon, dus de sprong terug naar 0 is onzichtbaar.
 *
 * Bij weinig logo's wordt de set eerst herhaald tot een halve track breed
 * genoeg is om een groot scherm te vullen, anders zie je een gat.
 */

/**
 * Eén helft moet minstens zo breed zijn als het scherm, anders valt er op het
 * moment van terugspringen een gat: er is dan simpelweg niets meer om te tonen.
 * Bij 190px per vak dekt 20 vakken (3800px) ook ruime monitoren af. De CSS zet
 * er met min-width: 100vw nog een vangnet onder voor alles daarboven.
 */
const MIN_LOGOS_PER_HELFT = 20;

export function LogoMarquee({
  clients,
  titel = "Vertrouwd door vooruitstrevende bedrijven"
}: {
  clients: Client[];
  titel?: string;
}) {
  // Geen klanten? Dan tonen we de sectie helemaal niet. Liever niets dan een
  // lege of half gevulde balk.
  if (clients.length === 0) return null;

  const herhalingen = Math.max(1, Math.ceil(MIN_LOGOS_PER_HELFT / clients.length));
  const helft: Client[] = [];
  for (let i = 0; i < herhalingen; i++) helft.push(...clients);

  // Constante snelheid ongeacht het aantal logo's: ~4.5 seconde per logo.
  const duurSeconden = Math.round(helft.length * 4.5);

  return (
    <section className="marquee" aria-label={titel}>
      <p className="marquee-titel">{titel}</p>

      <div className="marquee-viewport">
        <div
          className="marquee-track"
          style={{ animationDuration: `${duurSeconden}s` }}
        >
          {/* Twee identieke helften: samen vormen ze de naadloze lus. De
              tweede helft is puur decoratief en wordt door screenreaders
              overgeslagen. */}
          {[0, 1].map((helftIndex) => (
            <div
              className="marquee-helft"
              key={helftIndex}
              aria-hidden={helftIndex === 1 ? true : undefined}
            >
              {helft.map((c, i) => (
                <div className="marquee-item" key={`${helftIndex}-${c.id}-${i}`}>
                  <Image
                    src={c.logoUrl}
                    alt={helftIndex === 0 ? c.naam : ""}
                    width={320}
                    height={120}
                    className="marquee-logo"
                    style={c.scale !== 1 ? { transform: `scale(${c.scale})` } : undefined}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
