import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Cases, wat we voor klanten hebben gebouwd",
  description:
    "Wat Hazenco in de praktijk heeft opgeleverd: workflow-automatisering voor SanitairSuperShop en vijf eigen tools die je live kunt uitproberen."
};

/**
 * Deze pagina noemt bewust alleen werk dat we kunnen aanwijzen: de projecten
 * bij SanitairSuperShop en de tools met een publieke demo. Geen verzonnen
 * branchecases; wat er niet is, staat er niet.
 */
const gebouwd = [
  {
    klant: "SanitairSuperShop",
    titel: "m²-calculator voor tegels en vloeren",
    tekst:
      "Klanten voeren hun oppervlakte in, het systeem rekent dozen en prijs uit en zet het in de winkelwagen. Scheelde de klantenservice merkbaar in het aantal 'hoeveel dozen heb ik nodig?'-telefoontjes.",
    href: "/oplossingen/m2-calculator-tegels-vloeren-magento"
  },
  {
    klant: "SanitairSuperShop",
    titel: "Cross-sell popup voor Magento",
    tekst:
      "Slimme add-to-cart popup met passende aanvullingen. Gemiddelde orderwaarde ging van €167 naar €221 in de zes weken na livegang, bij gelijkblijvende bezoekersaantallen.",
    href: "/oplossingen/verzending-cross-sell-popup-magento"
  },
  {
    klant: "SanitairSuperShop",
    titel: "Product Management back-office",
    tekst:
      "Eén omgeving voor productbeheer, orderverwerking en sales rond Magento. Scheelt dagelijks handwerk in Excel en kopiëren en plakken tussen systemen.",
    href: "/oplossingen/hazenco-product-manager"
  }
];

export default function CasesPage() {
  return (
    <Shell>
      <div className="page">
        <header className="section-hero">
          <p className="eyebrow">Cases</p>
          <h1>Wat we bouwden. Wat het opleverde.</h1>
          <p className="lead">
            We zijn een jong bureau, dus we houden deze pagina eerlijk: hieronder staat alleen werk dat echt draait.
            Uitgebreide case-studies met cijfers per project volgen zodra we die met de klant kunnen delen.
          </p>
        </header>

        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">In productie</p>
            <h2>Workflow-automatisering voor SanitairSuperShop</h2>
            <p className="hazenco-section-sub">
              Drie systemen die dagelijks draaien in een Magento-webshop met een paar duizend artikelen.
            </p>
          </header>
          <div className="hazenco-oplossingen-grid">
            {gebouwd.map((c) => (
              <article key={c.titel} className="hazenco-oplossing-card">
                <div className="hazenco-oplossing-body">
                  <p className="eyebrow">{c.klant}</p>
                  <h3>{c.titel}</h3>
                  <p>{c.tekst}</p>
                  <div className="hazenco-oplossing-meta">
                    <span />
                    <Link href={c.href} className="hazenco-oplossing-cta">
                      Bekijk de oplossing <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Liever zelf uitproberen dan een verhaal lezen?</h2>
            <p>
              Vijf van onze tools hebben een live demo die je zonder account kunt openen. Dat zegt meer dan een
              case-studie die wij zelf hebben geschreven.
            </p>
            <div className="hazenco-contact-cta">
              <Link href="/oplossingen" className="button">
                Bekijk de demo&apos;s <ExternalLink size={14} />
              </Link>
              <Link href="/contact" className="button secondary">
                Plan een gesprek
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
