import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Shell } from "@/components/shell";

export type ServicePageData = {
  eyebrow: string;
  title: string;
  lead: string;
  intro: string;
  wat: {
    heading: string;
    items: { title: string; text: string }[];
  };
  proces: {
    heading: string;
    steps: { title: string; text: string }[];
  };
  prijs: {
    heading: string;
    lead: string;
    packages: { name: string; price: string; period?: string; text: string; primary?: boolean }[];
    note?: string;
  };
  cases: {
    heading: string;
    items: { title: string; result: string; text: string }[];
  };
  faq?: { q: string; a: string }[];
};

export function ServicePage({ data, icon: Icon }: { data: ServicePageData; icon: LucideIcon }) {
  return (
    <Shell>
      <section className="hazenco-hero">
        <div className="page">
          <div className="hazenco-hero-inner">
            <div className="service-hero-icon">
              <Icon size={26} />
            </div>
            <p className="eyebrow">{data.eyebrow}</p>
            <h1>{data.title}</h1>
            <p className="lead">{data.lead}</p>
            <div className="hazenco-hero-cta">
              <Link href="/contact" className="button">
                Plan een gesprek van 15 minuten <ArrowRight size={15} />
              </Link>
              <Link href="#prijs" className="button secondary">
                Bekijk pakketten
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page">
        {/* INTRO */}
        <section className="hazenco-section service-intro">
          <p>{data.intro}</p>
        </section>

        {/* WAT JE KRIJGT */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Wat je krijgt</p>
            <h2>{data.wat.heading}</h2>
          </header>
          <div className="service-wat-grid">
            {data.wat.items.map((item) => (
              <article key={item.title} className="service-wat-card">
                <div className="service-wat-check">
                  <Check size={16} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PROCES */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Proces</p>
            <h2>{data.proces.heading}</h2>
          </header>
          <ol className="service-proces-list">
            {data.proces.steps.map((step, i) => (
              <li key={step.title}>
                <span className="service-proces-num">{i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* PRIJS */}
        <section id="prijs" className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Investering</p>
            <h2>{data.prijs.heading}</h2>
            <p className="hazenco-section-sub">{data.prijs.lead}</p>
          </header>
          <div className="service-prijs-grid">
            {data.prijs.packages.map((p) => (
              <article key={p.name} className={`service-prijs-card${p.primary ? " primary" : ""}`}>
                {p.primary ? <span className="service-prijs-badge">Meest gekozen</span> : null}
                <h3>{p.name}</h3>
                <div className="service-prijs-price">
                  <strong>{p.price}</strong>
                  {p.period ? <span>{p.period}</span> : null}
                </div>
                <p>{p.text}</p>
                <Link href="/contact" className={`button${p.primary ? "" : " secondary"}`}>
                  Plan een gesprek <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
          {data.prijs.note ? <p className="service-prijs-note">{data.prijs.note}</p> : null}
        </section>

        {/* CASES */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Voorbeelden</p>
            <h2>{data.cases.heading}</h2>
          </header>
          <div className="service-cases-grid">
            {data.cases.items.map((c) => (
              <article key={c.title} className="service-case-card">
                <div className="service-case-result">{c.result}</div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {data.faq && data.faq.length > 0 ? (
          <section className="hazenco-section">
            <header className="hazenco-section-head">
              <p className="eyebrow">Vragen</p>
              <h2>Wat we het vaakst horen</h2>
            </header>
            <div className="service-faq-list">
              {data.faq.map((f) => (
                <details key={f.q} className="service-faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {/* CONTACT CTA */}
        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Klaar om te beginnen?</h2>
            <p>
              Plan een vrijblijvend gesprek van 15 minuten. Wij luisteren naar wat je zoekt, en zeggen eerlijk of we
              een fit zijn. Geen verkoopgesprek.
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
