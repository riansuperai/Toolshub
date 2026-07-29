import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ExternalLink, Sparkles, Wrench, Globe, Workflow } from "lucide-react";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Over Hazenco",
  description:
    "Wie zit er achter Hazenco? Een klein Nederlands B2B-team dat custom software, workflow-automatisering en AI-workflows bouwt voor het MKB."
};

const principes = [
  {
    title: "Klein team, direct contact",
    text: "Je spreekt altijd direct met iemand die weet waar 'ie het over heeft — geen account-managers of tussenlagen. Meestal binnen 1 werkdag antwoord."
  },
  {
    title: "Done-for-you, niet DIY-consulting",
    text: "We leveren werkende dingen op. Geen powerpoint-strategieën, geen 'we begeleiden je in het proces'. Wij bouwen, jij gebruikt."
  },
  {
    title: "Vaste prijzen, geen lock-in",
    text: "Onze prijzen zijn transparant. Geen verrassingsfacturen, geen contracten van 3 jaar. Als je wilt stoppen, kun je stoppen."
  },
  {
    title: "Wij gebruiken wat we bouwen",
    text: "Onze eigen webshop TechPanda draait op dezelfde stack. Onze toolkit gebruiken we intern. Deze site is een showcase. Dogfooding is niet een marketing-term voor ons."
  }
];

const eigenBouw = [
  {
    icon: Globe,
    href: "https://techpanda.nl",
    label: "TechPanda",
    text: "Onze B2C IT-webshop en computerhulp aan huis. Complete e-commerce build op Next.js + Supabase + Mollie.",
    external: true
  },
  {
    icon: Sparkles,
    href: "/",
    label: "Deze site (hazenco.nl)",
    text: "Custom Next.js 16, dark mode, mobiel-first, sub-100ms pagina-laden. Wat je hier ziet is wat je kunt krijgen.",
    external: false
  },
  {
    icon: Workflow,
    href: "/toolkit",
    label: "Hazenco Toolkit",
    text: "11 gratis mini-tools ontstaan uit ons eigen dagelijkse werk — factuur-generator, PDF-tools, achtergrond-verwijderaar.",
    external: false
  }
];

export default function OverOnsPage() {
  return (
    <Shell>
      <section className="hazenco-hero">
        <div className="page">
          <div className="hazenco-hero-inner">
            <p className="eyebrow">Over ons</p>
            <h1>We bouwen wat we ook zelf gebruiken.</h1>
            <p className="lead">
              Hazenco is een klein Nederlands B2B-team dat custom software, workflow-automatisering en AI-workflows
              bouwt voor het MKB. Klein team, direct contact, done-for-you levering.
            </p>
          </div>
        </div>
      </section>

      <div className="page">
        {/* WAT WE DOEN */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Wat we doen</p>
            <h2>Drie dingen — en niks anders</h2>
            <p className="hazenco-section-sub">
              We bouwen websites op maat, we automatiseren processen die nu handmatig lopen, en we zetten AI-workflows
              op waar je klanten dagelijks mee praten. Alles done-for-you: wij regelen installatie, integratie en
              onderhoud.
            </p>
          </header>
        </section>

        {/* HOE WE WERKEN */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Hoe we werken</p>
            <h2>Vier principes die alles sturen</h2>
          </header>
          <div className="over-ons-principes">
            {principes.map((p) => (
              <article key={p.title} className="over-ons-principe">
                <div className="over-ons-principe-icon">
                  <Check size={16} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* WAAROM DOGFOODING */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Bewijs, geen praatjes</p>
            <h2>Wat we voor onszelf hebben gebouwd</h2>
            <p className="hazenco-section-sub">
              Geen theoretische adviezen: alles wat we voor klanten bouwen, draait ook bij onszelf. Dat is de reden
              dat we weten wat werkt en wat het écht kost om te onderhouden.
            </p>
          </header>
          <div className="over-ons-bouw-grid">
            {eigenBouw.map(({ icon: Icon, href, label, text, external }) => {
              const link = external ? (
                <a href={href} target="_blank" rel="noreferrer" className="over-ons-bouw-link">
                  {label} <ExternalLink size={13} />
                </a>
              ) : (
                <Link href={href} className="over-ons-bouw-link">
                  {label} <ArrowRight size={13} />
                </Link>
              );
              return (
                <article key={label} className="over-ons-bouw-card">
                  <div className="over-ons-bouw-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{label}</h3>
                  <p>{text}</p>
                  <div>{link}</div>
                </article>
              );
            })}
          </div>
        </section>

        {/* VOOR WIE */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Voor wie</p>
            <h2>MKB dat resultaat wil, geen powerpoint</h2>
            <p className="hazenco-section-sub">
              Onze klanten zijn MKB-ondernemers die tijd willen besparen (automatisering), online willen groeien
              (webdesign) of AI willen inzetten zonder er zelf een developer voor te worden. Van ZZP'er met één
              specifiek pijnpunt tot teams van 50 medewerkers met meerdere systemen.
            </p>
          </header>
        </section>

        {/* TECHPANDA */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Ook TechPanda</p>
            <h2>Onze B2C-tak</h2>
            <p className="hazenco-section-sub">
              Naast Hazenco runnen we TechPanda — onze IT-webshop en computerhulp aan huis. Zelfde stack, ander merk,
              andere doelgroep. Handig om te weten: als je in Hazenco investeert, krijg je een partij die zelf ook
              e-commerce en klantenservice draait. Wat we leren bij TechPanda, komt terug in wat we voor klanten
              bouwen.
            </p>
          </header>
          <div className="hazenco-section-foot">
            <a href="https://techpanda.nl" target="_blank" rel="noreferrer" className="button secondary">
              Bekijk techpanda.nl <ExternalLink size={15} />
            </a>
          </div>
        </section>

        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Zullen we eens praten?</h2>
            <p>
              Vertel wat je zoekt — dan hoor je binnen 1 werkdag of we een fit zijn. Geen verkoopgesprek, geen
              verplichtingen.
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
