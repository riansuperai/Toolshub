import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { Shell } from "@/components/shell";
import { listings } from "@/lib/marketplace-data";
import type { Listing, ServiceCase, ServiceIncludedItem } from "@/lib/types";

export async function generateStaticParams() {
  return listings
    .filter((l) => l.listingKind === "service")
    .map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = listings.find((l) => l.slug === slug && l.listingKind === "service");
  if (!listing) return { title: "Oplossing niet gevonden" };
  return {
    title: `${listing.title} — Hazenco`,
    description: listing.tagline
  };
}

function formatEuro(cents: number) {
  return `€ ${cents / 100 % 1 === 0 ? Math.round(cents / 100).toLocaleString("nl-NL") : (cents / 100).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`;
}

function ForWhoList({ items }: { items: string[] }) {
  return (
    <ul className="oplossing-forwho-list">
      {items.map((entry, idx) => (
        <li key={idx}>
          <CheckCircle2 size={16} /> {entry}
        </li>
      ))}
    </ul>
  );
}

function IncludedGrid({ items }: { items: ServiceIncludedItem[] }) {
  return (
    <div className="oplossing-included-grid">
      {items.map((item, idx) => (
        <article key={idx} className="oplossing-included-card">
          <div className="oplossing-included-icon">
            <Check size={16} />
          </div>
          <strong>{item.title}</strong>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}

function CasesSection({ items }: { items: ServiceCase[] }) {
  return (
    <div className="oplossing-cases-grid">
      {items.map((c, idx) => (
        <article key={idx} className={`oplossing-case-card tone-${c.tone}`}>
          <p className="oplossing-case-tag">{c.tag}</p>
          <h3>{c.clientName}</h3>
          <p className="oplossing-case-label">{c.label}</p>
          <p className="oplossing-case-benefit">{c.benefit}</p>
          {c.highlights && c.highlights.length > 0 ? (
            <ul className="oplossing-case-highlights">
              {c.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function ScreenshotsGallery({ screenshots, title }: { screenshots: string[]; title: string }) {
  if (screenshots.length === 0) return null;
  return (
    <div className="oplossing-screenshots">
      {screenshots.map((src, idx) => (
        <div key={idx} className="oplossing-screenshot">
          <Image
            src={src}
            alt={`${title} — screenshot ${idx + 1}`}
            width={1440}
            height={900}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      ))}
    </div>
  );
}

function PricingBlock({ listing }: { listing: Listing }) {
  const sp = listing.servicePricing;
  if (!sp) return null;
  return (
    <div className="oplossing-pricing">
      {sp.oneTime ? (
        <div className={`oplossing-pricing-card${sp.highlight === "oneTime" ? " primary" : ""}`}>
          {sp.highlight === "oneTime" ? <span className="oplossing-pricing-badge">Meest gekozen</span> : null}
          <p className="oplossing-pricing-label">Eenmalig</p>
          <div className="oplossing-pricing-price">
            <strong>{formatEuro(sp.oneTime.priceCents)}</strong>
            {sp.oneTime.originalPriceCents ? (
              <span className="oplossing-pricing-original">{formatEuro(sp.oneTime.originalPriceCents)}</span>
            ) : null}
          </div>
          <p>{sp.oneTime.description}</p>
        </div>
      ) : null}
      {sp.subscription ? (
        <div className={`oplossing-pricing-card${sp.highlight === "subscription" ? " primary" : ""}`}>
          {sp.highlight === "subscription" ? <span className="oplossing-pricing-badge">Meest gekozen</span> : null}
          <p className="oplossing-pricing-label">All-in abonnement</p>
          <div className="oplossing-pricing-price">
            <strong>{formatEuro(sp.subscription.priceCentsPerMonth)}</strong>
            <span className="oplossing-pricing-cycle">/mnd</span>
            {sp.subscription.originalPriceCentsPerMonth ? (
              <span className="oplossing-pricing-original">
                {formatEuro(sp.subscription.originalPriceCentsPerMonth)}
              </span>
            ) : null}
          </div>
          <p className="oplossing-pricing-meta">vanaf {sp.subscription.minMonths} maanden</p>
          <p>{sp.subscription.description}</p>
        </div>
      ) : null}
      {sp.usps && sp.usps.length > 0 ? (
        <ul className="oplossing-pricing-usps">
          {sp.usps.map((usp, idx) => (
            <li key={idx}>
              <CheckCircle2 size={14} /> {usp}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default async function OplossingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = listings.find((l) => l.slug === slug && l.listingKind === "service");
  if (!listing) notFound();

  return (
    <Shell>
      <div className="page">
        <Link className="oplossing-back-link" href="/oplossingen">
          <ArrowLeft size={14} /> Terug naar oplossingen
        </Link>

        <div className="oplossing-detail-layout">
          <div className="oplossing-detail-main">
            <p className="eyebrow">Oplossing</p>
            <h1>{listing.title}</h1>
            <p className="oplossing-detail-lead">{listing.tagline}</p>

            <ScreenshotsGallery screenshots={listing.screenshotUrls ?? []} title={listing.title} />

            {listing.forWho && listing.forWho.length > 0 ? (
              <section className="oplossing-detail-section">
                <h2>Voor wie is dit?</h2>
                <ForWhoList items={listing.forWho} />
              </section>
            ) : null}

            <section className="oplossing-detail-section">
              <h2>Wat doet deze oplossing?</h2>
              <div className="oplossing-detail-prose">
                {listing.description.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para.replace(/\*\*(.+?)\*\*/g, "$1")}</p>
                ))}
              </div>
            </section>

            {listing.included && listing.included.length > 0 ? (
              <section className="oplossing-detail-section">
                <h2>Wat is inbegrepen</h2>
                <IncludedGrid items={listing.included} />
              </section>
            ) : null}

            {listing.cases && listing.cases.length > 0 ? (
              <section className="oplossing-detail-section">
                <h2>Voorbeelden</h2>
                <CasesSection items={listing.cases} />
              </section>
            ) : null}
          </div>

          <aside className="oplossing-detail-sidebar">
            <div className="oplossing-detail-sidebar-inner">
              <p className="oplossing-sidebar-eyebrow">Kies een pakket</p>
              <PricingBlock listing={listing} />

              <div className="oplossing-cta-stack">
                <Link href="/contact" className="button">
                  Plan een gesprek <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="button secondary">
                  Plan een demo
                </Link>
              </div>

              {listing.serviceMeta ? (
                <ul className="oplossing-meta-list">
                  {listing.serviceMeta.duration ? (
                    <li>
                      <span>Doorlooptijd</span>
                      <strong>{listing.serviceMeta.duration}</strong>
                    </li>
                  ) : null}
                  {listing.serviceMeta.revisions ? (
                    <li>
                      <span>Revisies</span>
                      <strong>{listing.serviceMeta.revisions}</strong>
                    </li>
                  ) : null}
                  {listing.serviceMeta.supportPeriod ? (
                    <li>
                      <span>Support</span>
                      <strong>{listing.serviceMeta.supportPeriod}</strong>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          </aside>
        </div>

        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Vragen over deze oplossing?</h2>
            <p>Plan een kort gesprek. We laten zien hoe het werkt en of het past bij jouw situatie.</p>
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
