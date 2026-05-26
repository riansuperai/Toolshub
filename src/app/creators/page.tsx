"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Headphones,
  Image as ImageIcon,
  Layers,
  PencilRuler,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  Wallet,
  Zap
} from "lucide-react";
import { Shell } from "@/components/shell";
import { useMarketplace } from "@/lib/marketplace-store";
import { formatPrice } from "@/lib/marketplace-data";

const steps = [
  {
    icon: PencilRuler,
    title: "Maak je creator-profiel",
    description: "Vertel kort wat je bouwt, voor wie en welke ervaring je meebrengt. Een goed profiel verhoogt je conversie.",
    duration: "5 min"
  },
  {
    icon: Upload,
    title: "Upload je eerste tool",
    description: "Voeg je n8n workflow, AI agent, plugin of template toe met screenshots, documentatie en demo-toegang.",
    duration: "10 min"
  },
  {
    icon: ShieldCheck,
    title: "Admin keurt je werk",
    description: "Binnen 48 uur krijg je feedback. Goedgekeurd? Je listing gaat live en je verschijnt in zoekresultaten.",
    duration: "< 48u"
  },
  {
    icon: Rocket,
    title: "Verkopen en uitbetalen",
    description: "Kopers downloaden je tool, jij verdient direct mee. Neem je geld op wanneer jij wilt vanaf €50 saldo.",
    duration: "Doorlopend"
  }
];

const requirements = [
  { icon: BadgeCheck, label: "KvK-nummer of geldig identiteitsbewijs (voor uitbetaling)" },
  { icon: Layers, label: "Minimaal 1 originele tool of template die je zelf hebt gebouwd" },
  { icon: Sparkles, label: "Heldere demo, screenshots en stap-voor-stap documentatie" },
  { icon: Headphones, label: "Bereidheid om binnen 24u op support-vragen te reageren" }
];

const faq = [
  {
    q: "Wat kost het om creator te worden?",
    a: "Nul euro vooraf. Hazenco rekent 10% commissie per verkoop. De rest is voor jou. Geen abonnement, geen verborgen kosten."
  },
  {
    q: "Hoe en wanneer word ik uitbetaald?",
    a: "Je verzamelt je verdiende geld in je 'Nog uit te betalen' saldo. Zodra dat €50 of meer is, kun je het zelf opnemen op de Financiën-pagina. Kies tussen SEPA standaard (gratis, 5 werkdagen) of Instant payout (1,5% fee, binnen 30 min op je IBAN)."
  },
  {
    q: "Welke soort tools mag ik aanbieden?",
    a: "n8n / Make / Zapier workflows, AI agents (LangChain, CrewAI etc.), plugins, browser extensions, Claude skills, themes en templates. Geen pirated content, geen scripts die wetten overtreden."
  },
  {
    q: "Hoe lang duurt de admin-review?",
    a: "Doorgaans binnen 48 uur. Je krijgt feedback per e-mail. Na publicatie ben je direct vindbaar in de catalogus."
  },
  {
    q: "Kan ik prijzen later aanpassen?",
    a: "Ja. Vanuit /seller/listings pas je prijzen, beschrijvingen en bestanden aan. Nieuwe versies worden automatisch zichtbaar voor eerdere kopers."
  },
  {
    q: "Krijg ik analytics?",
    a: "Ja — een uitgebreid dashboard met omzet, downloads, top-tools, koper-feedback en branche-analyses. Filter op vandaag/maand/jaar of klik op een specifieke periode."
  }
];

const screenshots = [
  { title: "Creator dashboard", desc: "Live KPI's, omzetgrafiek, top-tools en koper-feedback." },
  { title: "Listing editor", desc: "Upload bestanden, voeg screenshots toe en stel branches in." },
  { title: "Chat & afspraken", desc: "Communiceer 1-op-1, plan sessies en accepteer of verzet afspraken." },
  { title: "Uitbetalingen", desc: "Komende SEPA-betalingen + historisch overzicht in één blik." }
];

export default function CreatorsLandingPage() {
  const { state, activeUser, setActiveUser } = useMarketplace();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = useMemo(() => {
    const totalGmv = state.orders
      .filter((o) => o.status === "paid")
      .reduce((s, o) => s + o.totalCents, 0);
    return {
      creators: state.sellers.length,
      listings: state.listings.filter((l) => l.status === "published").length,
      gmv: totalGmv,
      avgRating: (() => {
        const published = state.listings.filter((l) => l.status === "published" && l.rating > 0);
        if (published.length === 0) return 0;
        return published.reduce((s, l) => s + l.rating, 0) / published.length;
      })()
    };
  }, [state.orders, state.sellers, state.listings]);

  const ctaHref = activeUser.role === "seller" ? "/seller" : activeUser.role === "seller_pending" ? "/seller" : "/onboarding";
  const ctaLabel = activeUser.role === "seller" ? "Naar je dashboard" : activeUser.role === "seller_pending" ? "Status bekijken" : "Start aanmelding";

  return (
    <Shell>
      <div className="creators-page">
        {/* Hero */}
        <section className="creators-hero">
          <div className="creators-hero-text">
            <span className="creators-eyebrow"><Rocket size={12} /> Voor makers, automatiseerders & studio's</span>
            <h1>Verdien aan jouw <span className="highlight">automatiseringen</span></h1>
            <p>
              Verkoop je n8n workflows, AI agents, plugins en templates aan ondernemers in heel Nederland.
              Hazenco regelt betalingen, hosting en uitbetalingen — jij focust op bouwen.
            </p>
            <div className="creators-hero-cta">
              <Link className="button" href={ctaHref}>
                {ctaLabel} <ArrowRight size={16} />
              </Link>
              {activeUser.role === "visitor" ? (
                <button type="button" className="button secondary" onClick={() => setActiveUser("user_buyer")}>
                  Demo: log in als koper
                </button>
              ) : null}
            </div>
            <div className="creators-trust">
              <span><CheckCircle2 size={13} /> 10% commissie</span>
              <span><CheckCircle2 size={13} /> Zelf opnemen vanaf €50</span>
              <span><CheckCircle2 size={13} /> Geen abonnementskosten</span>
            </div>
          </div>
          <div className="creators-hero-visual">
            <div className="creators-hero-card pulse">
              <span className="eyebrow"><TrendingUp size={11} /> Omzet deze maand</span>
              <strong>€ 2.847</strong>
              <small>+24% t.o.v. vorige maand</small>
            </div>
            <div className="creators-hero-card">
              <span className="eyebrow"><Wallet size={11} /> Komende uitbetaling</span>
              <strong>€ 2.562</strong>
              <small>31 mei via SEPA</small>
            </div>
            <div className="creators-hero-card">
              <span className="eyebrow"><Zap size={11} /> Tools live</span>
              <strong>7</strong>
              <small>156 downloads · ★ 4.8</small>
            </div>
          </div>
        </section>

        {/* Live stats */}
        <section className="creators-stats">
          <div className="creators-stat">
            <strong>{stats.creators}</strong>
            <span>actieve creators</span>
          </div>
          <div className="creators-stat">
            <strong>{stats.listings}</strong>
            <span>live tools</span>
          </div>
          <div className="creators-stat">
            <strong>{formatPrice(stats.gmv)}</strong>
            <span>marketplace omzet</span>
          </div>
          <div className="creators-stat">
            <strong>{stats.avgRating ? stats.avgRating.toFixed(1) : "—"}</strong>
            <span>gem. rating</span>
          </div>
        </section>

        {/* Hoe werkt het */}
        <section className="creators-section">
          <div className="creators-section-head">
            <span className="creators-eyebrow"><Sparkles size={12} /> In 4 stappen live</span>
            <h2>Zo word je Hazenco Creator</h2>
            <p>Van eerste idee tot eerste uitbetaling in een paar dagen.</p>
          </div>
          <div className="creators-steps">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div className="creator-step" key={i}>
                  <div className="creator-step-num">{i + 1}</div>
                  <div className="creator-step-icon"><Icon size={22} /></div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <small><Clock size={11} /> {step.duration}</small>
                </div>
              );
            })}
          </div>
        </section>

        {/* Video walkthrough */}
        <section className="creators-section">
          <div className="creators-section-head">
            <span className="creators-eyebrow"><Play size={12} /> Walkthrough</span>
            <h2>Bekijk hoe creators verkopen</h2>
            <p>2-minuten video die je rondleidt door het creator-dashboard en uploadflow.</p>
          </div>
          <div className="creator-video-card">
            <div className="creator-video-screen">
              <button type="button" className="creator-video-play" aria-label="Video afspelen (mock)">
                <Play size={36} fill="currentColor" />
              </button>
              <div className="creator-video-overlay">
                <small>2:14 · 1080p · Nederlandse voice-over</small>
              </div>
            </div>
            <div className="creator-video-meta">
              <strong>Van idee naar betaalde tool in 4 minuten</strong>
              <small>We laten zien hoe Sarah haar n8n-workflow uploadt, prijzen instelt en haar eerste verkoop binnenhaalt.</small>
            </div>
          </div>
        </section>

        {/* Eisen */}
        <section className="creators-section creators-requirements">
          <div className="creators-section-head">
            <span className="creators-eyebrow"><ShieldCheck size={12} /> Eisen</span>
            <h2>Wat heb je nodig om te starten?</h2>
            <p>We houden de lat laag, maar wel kwalitatief.</p>
          </div>
          <div className="creators-requirements-grid">
            {requirements.map((req, i) => {
              const Icon = req.icon;
              return (
                <div className="creator-requirement" key={i}>
                  <div className="creator-requirement-icon"><Icon size={20} /></div>
                  <p>{req.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Inkomsten & uitbetalingen */}
        <section className="creators-section creators-income">
          <div className="creators-section-head">
            <span className="creators-eyebrow"><Wallet size={12} /> Inkomsten</span>
            <h2>Transparant verdienmodel</h2>
            <p>Eerlijk verdelen — jij behoudt 90% van elke verkoop.</p>
          </div>
          <div className="creators-income-grid">
            <div className="income-card highlight">
              <span className="eyebrow">Per verkoop</span>
              <div className="income-split">
                <div className="income-split-bar">
                  <span style={{ width: "90%" }} />
                </div>
                <div className="income-split-labels">
                  <strong>90% voor jou</strong>
                  <small>10% Hazenco platform-fee</small>
                </div>
              </div>
              <p>Voorbeeld: verkoop je tool voor €99 → ontvang €89,10 netto.</p>
            </div>
            <div className="income-card">
              <span className="eyebrow"><Wallet size={12} /> Uitbetaling</span>
              <strong>Zelf opnemen wanneer je wilt</strong>
              <ul>
                <li>Opname mogelijk vanaf €50 saldo</li>
                <li>SEPA standaard: gratis, 5 werkdagen op je IBAN</li>
                <li>Instant payout: 1,5% fee, binnen 30 min</li>
                <li>Automatische BTW-factuur per opname</li>
              </ul>
            </div>
            <div className="income-card">
              <span className="eyebrow"><TrendingUp size={12} /> Extra inkomsten</span>
              <strong>Setup-services</strong>
              <ul>
                <li>Bied tegen meerprijs installatie aan</li>
                <li>Live 1-op-1 video-sessies inplannen</li>
                <li>Maandelijkse subscription tools (binnenkort)</li>
                <li>Hazenco uitgelichte plekken verdienen</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="creators-section">
          <div className="creators-section-head">
            <span className="creators-eyebrow"><ImageIcon size={12} /> Tooling</span>
            <h2>Krachtig creator-dashboard</h2>
            <p>Alles wat je nodig hebt om te schalen — KPI's, chat, agenda, uitbetalingen en analytics.</p>
          </div>
          <div className="creators-screenshots-grid">
            {screenshots.map((s, i) => (
              <div className="creator-screenshot" key={i}>
                <div className="creator-screenshot-img" aria-hidden>
                  <span className="screenshot-bar bar-1" />
                  <span className="screenshot-bar bar-2" />
                  <span className="screenshot-bar bar-3" />
                  <span className="screenshot-dot" />
                </div>
                <strong>{s.title}</strong>
                <small>{s.desc}</small>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="creators-section creators-faq">
          <div className="creators-section-head">
            <span className="creators-eyebrow">FAQ</span>
            <h2>Veelgestelde vragen</h2>
          </div>
          <div className="creators-faq-list">
            {faq.map((item, i) => (
              <div className={`creator-faq-item${openFaq === i ? " open" : ""}`} key={i}>
                <button type="button" className="creator-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === i ? <p className="creator-faq-a">{item.a}</p> : null}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="creators-final-cta">
          <div>
            <h2>Klaar om jouw eerste tool te verkopen?</h2>
            <p>De aanmelding kost vijf minuten. Admin keurt je profiel binnen 48 uur.</p>
          </div>
          <Link className="button" href={ctaHref}>
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </Shell>
  );
}
