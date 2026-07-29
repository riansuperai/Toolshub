import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Workflow, Sparkles } from "lucide-react";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Hazenco — Wij automatiseren en bouwen wat jouw bedrijf sneller maakt",
  description:
    "Nederlandse B2B-partner voor webdesign, workflow-automatisering en AI-workflows. Klein team, direct contact, done-for-you levering."
};

export default function HomePage() {
  return (
    <Shell>
      <div className="page">
        <header className="section-hero" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <p className="eyebrow">Hazenco</p>
          <h1>Wij automatiseren en bouwen wat jouw bedrijf sneller maakt.</h1>
          <p className="lead">
            Custom software, workflow-automatisering en AI-workflows voor het Nederlandse MKB. Klein team, direct
            contact, done-for-you levering.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            <Link href="/contact" className="button">
              Plan een gesprek <ArrowRight size={15} />
            </Link>
            <Link href="/diensten" className="button secondary">
              Bekijk diensten
            </Link>
          </div>
        </header>

        <div style={{ display: "grid", gap: 20, marginTop: 60, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {[
            {
              icon: Globe,
              href: "/website-laten-maken",
              title: "Webdesign",
              text: "Snelle, conversie-gerichte websites op maat. Hosting + onderhoud inbegrepen."
            },
            {
              icon: Workflow,
              href: "/workflow-automatisering",
              title: "Workflow-automatisering",
              text: "Van handmatig Excel-werk naar systemen die vanzelf lopen."
            },
            {
              icon: Sparkles,
              href: "/ai-workflows",
              title: "AI-workflows & integraties",
              text: "Slimme agents die met jouw klanten praten. Telefoon, WhatsApp, reviews."
            }
          ].map(({ icon: Icon, href, title, text }) => (
            <Link key={href} href={href} className="section-card" style={{ padding: 28, textDecoration: "none", color: "inherit" }}>
              <div
                style={{
                  background: "var(--green-100)",
                  color: "var(--green-800)",
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 16
                }}
              >
                <Icon size={22} />
              </div>
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{title}</h2>
              <p style={{ margin: 0, color: "var(--green-700)" }}>{text}</p>
              <p style={{ margin: "16px 0 0", color: "var(--orange-600)", fontWeight: 500, fontSize: 14 }}>
                Meer weten <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
              </p>
            </Link>
          ))}
        </div>

        <section className="section-card" style={{ marginTop: 60, padding: 40, textAlign: "center" }}>
          <p className="eyebrow">Homepage in aanbouw</p>
          <h2>Volledige agency-homepage komt in de volgende sessie</h2>
          <p style={{ color: "var(--green-700)", margin: "8px auto 20px", maxWidth: 560 }}>
            Voor nu een minimale versie. In sessie 2 bouwen we hero + oplossingen-preview + toolkit-teaser + cases +
            blog + waarom-Hazenco + contact-CTA.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/toolkit" className="button secondary">
              Naar gratis toolkit
            </Link>
            <Link href="/contact" className="button">
              Plan een gesprek <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
