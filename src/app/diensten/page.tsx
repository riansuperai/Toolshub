import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Workflow, Sparkles } from "lucide-react";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Diensten — webdesign, procesautomatisering, AI-workflows",
  description:
    "Hazenco bouwt websites, automatiseert bedrijfsprocessen en levert AI-workflows voor het Nederlandse MKB. Done-for-you: wij regelen het, jij plukt de vruchten."
};

const diensten = [
  {
    icon: Globe,
    slug: "/website-laten-maken",
    title: "Webdesign",
    lead:
      "Snelle, conversie-gerichte websites op maat. Wij ontwerpen, bouwen, hosten en onderhouden — geen bouwers, geen plugin-drama.",
    highlights: ["Vanaf 2 weken live", "Hosting + onderhoud inbegrepen", "Volledig op maat"]
  },
  {
    icon: Workflow,
    slug: "/procesautomatisering",
    title: "Procesautomatisering",
    lead:
      "Van handmatig Excel-werk naar systemen die vanzelf lopen. Product Manager, cross-sell popups, calculators — wij bouwen wat jouw team dagelijks tijd bespaart.",
    highlights: ["Meetbare tijdwinst", "Integreert met bestaande stack", "Onderhoud + ondersteuning"]
  },
  {
    icon: Sparkles,
    slug: "/ai-workflows",
    title: "AI-workflows",
    lead:
      "Slimme agents die met jouw klanten praten. Telefoonassistent, WhatsApp-chatbot, review-responder — in jouw tone-of-voice, 24/7 aan.",
    highlights: ["Nederlandstalig", "Werkt met je bestaande nummer", "Escalatie naar mens waar nodig"]
  }
];

export default function DienstenPage() {
  return (
    <Shell>
      <div className="page">
        <header className="section-hero">
          <p className="eyebrow">Diensten</p>
          <h1>Wij bouwen wat je zelf niet aan toekomt.</h1>
          <p className="lead">
            Hazenco is een Nederlandse B2B-partner voor webdesign, procesautomatisering en AI-workflows. Klein team,
            direct contact, done-for-you levering.
          </p>
        </header>

        <div className="diensten-grid" style={{ display: "grid", gap: 20, marginTop: 40 }}>
          {diensten.map(({ icon: Icon, slug, title, lead, highlights }) => (
            <article key={slug} className="section-card" style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                <div
                  style={{
                    background: "var(--green-100)",
                    color: "var(--green-800)",
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0
                  }}
                >
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 8px" }}>{title}</h2>
                  <p style={{ margin: "0 0 14px", color: "var(--green-700)" }}>{lead}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {highlights.map((h) => (
                      <li key={h} className="badge soft" style={{ fontSize: 12.5 }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Link href={slug} className="button">
                    Meer over {title.toLowerCase()} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="section-card" style={{ marginTop: 40, textAlign: "center", padding: 40 }}>
          <h2>Niet gevonden wat je zoekt?</h2>
          <p style={{ color: "var(--green-700)", margin: "8px auto 20px", maxWidth: 560 }}>
            Elke dienst is maatwerk. Plan een gesprek van 15 minuten — dan bespreken we jouw situatie en of we een fit
            zijn.
          </p>
          <Link href="/contact" className="button">
            Plan een gesprek <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </Shell>
  );
}
