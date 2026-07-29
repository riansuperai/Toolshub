"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe, Sparkles, Workflow, Filter, Wrench } from "lucide-react";
import type { Listing } from "@/lib/types";

type Dienst = "alle" | "webdesign" | "workflow" | "ai" | "tools";

const DIENST_LABEL: Record<Exclude<Dienst, "alle">, string> = {
  webdesign: "Webdesign",
  workflow: "Workflow-automatisering",
  ai: "AI-workflows",
  tools: "Tools"
};

const DIENST_ICON = {
  webdesign: Globe,
  workflow: Workflow,
  ai: Sparkles,
  tools: Wrench
} as const;

const EXPLICIT_MAP: Record<string, Exclude<Dienst, "alle">> = {
  listing_website_laten_maken: "webdesign",
  listing_ai_telefoonassistent: "ai",
  listing_whatsapp_business_chatbot: "ai",
  listing_google_reviews_ai_responder: "ai",
  listing_online_afsprakensysteem: "workflow",
  listing_magento_cart_popup: "workflow",
  listing_magento_tile_calculator: "workflow"
};

/**
 * Bepaal de dienst-categorie voor een listing. Explicit map wint;
 * daarna heuristiek op tags/type; anders "tools" als default voor
 * standalone Hazenco tools (Price Tool, Voorraad, CEP, etc.)
 */
function inferDienst(listing: Listing): Exclude<Dienst, "alle"> {
  if (EXPLICIT_MAP[listing.id]) return EXPLICIT_MAP[listing.id];

  const tags = (listing.tags ?? []).map((t) => t.toLowerCase());
  const tagsBlob = tags.join(" ");

  if (tagsBlob.includes("ai") || tagsBlob.includes("voicebot") || tagsBlob.includes("chatbot")) {
    return "ai";
  }
  if (
    tagsBlob.includes("website") ||
    tagsBlob.includes("webdesign") ||
    tagsBlob.includes("hosting") ||
    listing.slug === "website-laten-maken"
  ) {
    return "webdesign";
  }
  if (listing.listingKind === "service") return "workflow";
  return "tools";
}

function formatSubscriptionPrice(cents: number) {
  return `vanaf € ${Math.round(cents / 100)}/mnd`;
}

function formatOneTimePrice(cents: number) {
  return `€ ${Math.round(cents / 100).toLocaleString("nl-NL")}`;
}

export function OplossingenList({ solutions }: { solutions: Listing[] }) {
  const [filter, setFilter] = useState<Dienst>("alle");

  const enriched = useMemo(() => solutions.map((l) => ({ listing: l, dienst: inferDienst(l) })), [solutions]);

  const filtered = useMemo(() => {
    if (filter === "alle") return enriched;
    return enriched.filter((e) => e.dienst === filter);
  }, [enriched, filter]);

  const counts = useMemo(() => {
    const c: Record<Dienst, number> = {
      alle: enriched.length,
      webdesign: 0,
      workflow: 0,
      ai: 0,
      tools: 0
    };
    enriched.forEach((e) => {
      c[e.dienst]++;
    });
    return c;
  }, [enriched]);

  const tabs: { key: Dienst; label: string }[] = [
    { key: "alle", label: "Alle" },
    { key: "webdesign", label: "Webdesign" },
    { key: "workflow", label: "Workflow-automatisering" },
    { key: "ai", label: "AI-workflows" },
    { key: "tools", label: "Tools" }
  ];

  return (
    <>
      <div className="oplossingen-filter" role="tablist" aria-label="Filter op dienst">
        <span className="oplossingen-filter-label">
          <Filter size={14} /> Filter:
        </span>
        {tabs.map((tab) => {
          const isActive = filter === tab.key;
          const count = counts[tab.key];
          if (count === 0 && tab.key !== "alle") return null;
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
              <span className="oplossingen-filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="oplossingen-grid">
          {filtered.map(({ listing: l, dienst }) => {
            const DienstIcon = DIENST_ICON[dienst];
            const monthly = l.servicePricing?.subscription?.priceCentsPerMonth;
            const priceLabel = monthly
              ? formatSubscriptionPrice(monthly)
              : l.priceCents > 0
              ? formatOneTimePrice(l.priceCents)
              : null;
            const hasDemo = Boolean(l.demo?.url);
            return (
              <Link key={l.id} href={`/oplossingen/${l.slug}`} className="oplossing-card">
                {(() => {
                  const thumb = l.heroImageUrl ?? l.screenshotUrls?.[0];
                  if (!thumb) return null;
                  return (
                    <div className="oplossing-card-media">
                      <Image
                        src={thumb}
                        alt={l.title}
                        width={720}
                        height={452}
                        unoptimized
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                      {hasDemo ? <span className="oplossing-card-demo-badge">Live demo</span> : null}
                    </div>
                  );
                })()}
                <div className="oplossing-card-body">
                  <div className="oplossing-card-head">
                    <span className="oplossing-card-badge">
                      <DienstIcon size={12} /> {DIENST_LABEL[dienst]}
                    </span>
                  </div>
                  <h3>{l.title}</h3>
                  <p>{l.tagline}</p>
                  <div className="oplossing-card-foot">
                    {priceLabel ? <strong>{priceLabel}</strong> : <span />}
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
    </>
  );
}
