import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Workflow, Sparkles, Check } from "lucide-react";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Diensten, maatwerk weboplossingen, workflow-automatisering, AI-workflows",
  description:
    "Hazenco bouwt websites op maat, automatiseert bedrijfsprocessen en levert AI-workflows voor het Nederlandse MKB. Done-for-you levering, klein team, direct contact."
};

const diensten = [
  {
    icon: Globe,
    slug: "/website-laten-maken",
    label: "Maatwerk weboplossingen",
    tagline:
      "Custom Next.js sites die snel laden en converteren. Wij bouwen, hosten en onderhouden.",
    features: [
      "Volledig op maat, geen builders of templates",
      "Sub-100ms pagina-laden op mobiel én desktop",
      "Hosting, SSL en onderhoud inbegrepen",
      "SEO-fundament op orde vanaf dag 1"
    ]
  },
  {
    icon: Workflow,
    slug: "/workflow-automatisering",
    label: "Workflow-automatisering",
    tagline:
      "Van handmatig Excel-werk naar systemen die vanzelf lopen, meetbare tijdwinst.",
    features: [
      "Analyse van je huidige processen",
      "Custom tools (product-manager, sync, calculators)",
      "Integreert met bestaande stack (Magento, WordPress, Google, etc)",
      "Onderhoud + doorontwikkeling inbegrepen"
    ]
  },
  {
    icon: Sparkles,
    slug: "/ai-workflows",
    label: "AI-workflows & integraties",
    tagline:
      "Slimme agents die met jouw klanten praten, telefoon, WhatsApp, reviews.",
    features: [
      "Nederlandstalig, in jouw toon-of-voice",
      "24/7 aan, escalatie naar mens waar nodig",
      "Werkt met bestaande nummer of Google-account",
      "Volledig getraind op jouw shop/dienst"
    ]
  }
];

export default function DienstenPage() {
  return (
    <Shell>
      <section className="hazenco-hero">
        <div className="page">
          <div className="hazenco-hero-inner">
            <p className="eyebrow">Diensten</p>
            <h1>Zo helpen we bedrijven groeien.</h1>
            <p className="lead">
              Custom software, procesautomatisering of AI-workflows. Elke dienst is done-for-you: wij regelen
              installatie, integratie en onderhoud, jij plukt de vruchten.
            </p>
            <div className="hazenco-hero-cta">
              <Link href="/contact" className="button">
                Plan een gesprek <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page">
        <section className="hazenco-section">
          <div className="diensten-detail-list">
            {diensten.map(({ icon: Icon, slug, label, tagline, features }) => (
              <article key={slug} className="dienst-detail-card">
                <div className="dienst-detail-head">
                  <div className="hazenco-dienst-icon">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h2>{label}</h2>
                    <p className="dienst-detail-tagline">{tagline}</p>
                  </div>
                </div>
                <ul className="dienst-detail-features">
                  {features.map((f) => (
                    <li key={f}>
                      <Check size={15} /> {f}
                    </li>
                  ))}
                </ul>
                <div className="dienst-detail-cta">
                  <Link href={slug} className="button secondary">
                    Meer over {label.toLowerCase()} <ArrowRight size={15} />
                  </Link>
                  <Link href="/contact" className="button">
                    Plan gesprek
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Niet gevonden wat je zoekt?</h2>
            <p>
              Elke dienst is uiteindelijk maatwerk. Vertel wat je zoekt in 15 minuten, dan hoor je of we een fit
              zijn en wat het grofweg kost.
            </p>
            <div className="hazenco-contact-cta">
              <Link href="/contact" className="button">
                Plan een gesprek <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
