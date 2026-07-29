"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe, Sparkles, Workflow, Filter } from "lucide-react";
import { Shell } from "@/components/shell";
import { listings } from "@/lib/marketplace-data";

type Dienst = "alle" | "webdesign" | "workflow" | "ai";

const DIENST_MAP: Record<string, Exclude<Dienst, "alle">> = {
  listing_website_laten_maken: "webdesign",
  listing_ai_telefoonassistent: "ai",
  listing_whatsapp_business_chatbot: "ai",
  listing_google_reviews_ai_responder: "ai",
  listing_online_afsprakensysteem: "workflow",
  listing_magento_cart_popup: "workflow",
  listing_magento_tile_calculator: "workflow"
};

const DIENST_LABEL: Record<Exclude<Dienst, "alle">, string> = {
  webdesign: "Webdesign",
  workflow: "Workflow-automatisering",
  ai: "AI-workflows"
};

const DIENST_ICON = {
  webdesign: Globe,
  workflow: Workflow,
  ai: Sparkles
} as const;

function formatSubscriptionPrice(cents: number) {
  return `vanaf € ${Math.round(cents / 100)}/mnd`;
}

export default function OplossingenPage() {
  const [filter, setFilter] = useState<Dienst>("alle");

  const solutions = useMemo(
    () => listings.filter((l) => l.listingKind === "service"),
    []
  );

  const filtered = useMemo(() => {
    if (filter === "alle") return solutions;
    return solutions.filter((l) => DIENST_MAP[l.id] === filter);
  }, [solutions, filter]);

  const counts = useMemo(() => {
    const c: Record<Dienst, number> = { alle: solutions.length, webdesign: 0, workflow: 0, ai: 0 };
    solutions.forEach((l) => {
      const d = DIENST_MAP[l.id];
      if (d) c[d]++;
    });
    return c;
  }, [solutions]);

  const tabs: { key: Dienst; label: string }[] = [
    { key: "alle", label: "Alle" },
    { key: "webdesign", label: "Webdesign" },
    { key: "workflow", label: "Workflow-automatisering" },
    { key: "ai", label: "AI-workflows" }
  ];

  return (
    <Shell>
      <section className="hazenco-hero">
        <div className="page">
          <div className="hazenco-hero-inner">
            <p className="eyebrow">Oplossingen</p>
            <h1>Wat we voor klanten hebben gebouwd.</h1>
            <p className="lead">
              Productized oplossingen op basis van onze drie diensten. Klaar om af te nemen — of als startpunt voor
              iets op maat. Alle prijzen zijn indicatief en all-in.
            </p>
            <div className="hazenco-hero-cta">
              <Link href="/contact" className="button">
                Plan een gesprek <ArrowRight size={15} />
              </Link>
              <Link href="/diensten" className="button secondary">
                Bekijk diensten
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page">
        <section className="hazenco-section" style={{ paddingTop: 40 }}>
          <div className="oplossingen-filter" role="tablist" aria-label="Filter op dienst">
            <span className="oplossingen-filter-label">
              <Filter size={14} /> Filter:
            </span>
            {tabs.map((tab) => {
              const isActive = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`oplossingen-filter-btn${isActive ? " active" : ""}`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                  <span className="oplossingen-filter-count">{counts[tab.key]}</span>
                </button>
              );
            })}
          </div>

          {filtered.length > 0 ? (
            <div className="oplossingen-grid">
              {filtered.map((l) => {
                const dienst = DIENST_MAP[l.id];
                const DienstIcon = dienst ? DIENST_ICON[dienst] : Sparkles;
                const monthly = l.servicePricing?.subscription?.priceCentsPerMonth;
                return (
                  <Link key={l.id} href={`/oplossingen/${l.slug}`} className="oplossing-card">
                    {l.screenshotUrls?.[0] ? (
                      <div className="oplossing-card-media">
                        <Image
                          src={l.screenshotUrls[0]}
                          alt={l.title}
                          width={720}
                          height={452}
                          style={{ width: "100%", height: "auto", display: "block" }}
                        />
                      </div>
                    ) : null}
                    <div className="oplossing-card-body">
                      <div className="oplossing-card-head">
                        {dienst ? (
                          <span className="oplossing-card-badge">
                            <DienstIcon size={12} /> {DIENST_LABEL[dienst]}
                          </span>
                        ) : null}
                      </div>
                      <h3>{l.title}</h3>
                      <p>{l.tagline}</p>
                      <div className="oplossing-card-foot">
                        {monthly ? <strong>{formatSubscriptionPrice(monthly)}</strong> : <span />}
                        <span className="oplossing-card-cta">
                          Meer weten <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="oplossingen-empty">
              <p>Geen oplossingen in deze categorie.</p>
            </div>
          )}
        </section>

        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Iets anders voor ogen?</h2>
            <p>
              Alles wat je hier ziet is een startpunt — geen keurslijf. Vertel wat je zoekt en we bekijken samen of
              een van deze oplossingen past, of dat we iets op maat bouwen.
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
