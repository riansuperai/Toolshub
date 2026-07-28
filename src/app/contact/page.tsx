import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, ArrowRight } from "lucide-react";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Contact — Hazenco",
  description:
    "Neem contact op met Hazenco. Plan een gesprek van 15 minuten of stuur direct een WhatsApp / e-mail."
};

const HAZENCO_WHATSAPP = "31643074303";
const HAZENCO_EMAIL = "hallo@hazenco.nl";

export default function ContactPage() {
  return (
    <Shell>
      <div className="page">
        <header className="section-hero">
          <p className="eyebrow">Contact</p>
          <h1>Kort gesprek, concrete inschatting.</h1>
          <p className="lead">
            Vertel wat je zoekt — dan hoor je binnen 1 werkdag of we een fit zijn en wat het grofweg kost.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            marginTop: 40
          }}
        >
          <a
            href={`https://wa.me/${HAZENCO_WHATSAPP}?text=${encodeURIComponent(
              "Hallo Hazenco, ik heb een vraag."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="section-card"
            style={{ padding: 28, textDecoration: "none", color: "inherit" }}
          >
            <MessageCircle size={26} style={{ color: "var(--green-700)" }} />
            <h2 style={{ margin: "14px 0 6px" }}>WhatsApp</h2>
            <p style={{ color: "var(--green-700)", margin: 0 }}>
              Snelste route. Meestal binnen een uur antwoord tijdens werkdagen.
            </p>
          </a>

          <a
            href={`mailto:${HAZENCO_EMAIL}`}
            className="section-card"
            style={{ padding: 28, textDecoration: "none", color: "inherit" }}
          >
            <Mail size={26} style={{ color: "var(--green-700)" }} />
            <h2 style={{ margin: "14px 0 6px" }}>E-mail</h2>
            <p style={{ color: "var(--green-700)", margin: 0 }}>
              {HAZENCO_EMAIL} — voor uitgebreidere vragen of documenten.
            </p>
          </a>
        </div>

        <section className="section-card" style={{ marginTop: 24, padding: 40 }}>
          <h2>Contactformulier komt binnenkort</h2>
          <p style={{ color: "var(--green-700)", margin: "8px 0 20px" }}>
            We werken aan een uitgebreid formulier waarin je je situatie kunt beschrijven. Tot dan: gebruik WhatsApp of
            e-mail hierboven.
          </p>
          <Link href="/diensten" className="button">
            Bekijk eerst onze diensten <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </Shell>
  );
}
