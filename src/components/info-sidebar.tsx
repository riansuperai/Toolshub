"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageCircle, Rocket } from "lucide-react";

/** Hazenco WhatsApp — alleen cijfers, country code voorop. */
const HAZENCO_WHATSAPP = "31643074303";

type InfoLink = {
  href: string;
  label: string;
};

const INFO_LINKS: InfoLink[] = [
  { href: "/over-ons", label: "Over ons" },
  { href: "/veelgestelde-vragen", label: "Veelgestelde vragen" },
  { href: "/privacy", label: "Privacy & cookies" },
  { href: "/algemene-voorwaarden", label: "Algemene voorwaarden" }
];

/**
 * Sidebar voor info-pages (over-ons, FAQ, privacy, algemene voorwaarden).
 * Bevat een nav naar de andere info-pages plus twee CTA-boxes — geeft
 * de pagina visueel gewicht en stuurt bezoekers door naar relevante
 * vervolgstappen in plaats van een dood einde.
 */
export function InfoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="info-sidebar">
      <nav className="info-nav" aria-label="Meer informatie">
        <h3>Meer info</h3>
        <ul>
          {INFO_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname === `${link.href}/`;
            return (
              <li key={link.href}>
                <Link href={link.href} className={isActive ? "active" : ""}>
                  {link.label}
                  {!isActive ? <ArrowRight size={13} /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="info-help-box">
        <h3>Vragen?</h3>
        <p>Stuur ons een WhatsApp — we reageren meestal binnen één werkdag.</p>
        <a
          className="info-help-cta"
          href={`https://wa.me/${HAZENCO_WHATSAPP}?text=${encodeURIComponent(
            "Hallo Hazenco, ik heb een vraag over Toolshub."
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={15} /> WhatsApp
        </a>
      </div>

      <div className="info-creator-box">
        <h3>Zelf bouwen?</h3>
        <p>Word creator op Toolshub en bereik Nederlandse ondernemers met je tools en diensten.</p>
        <Link className="info-creator-cta" href="/creators">
          <Rocket size={15} /> Creator worden?
        </Link>
      </div>
    </aside>
  );
}
