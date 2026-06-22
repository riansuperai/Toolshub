"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DatabaseBackup,
  ExternalLink,
  Headphones,
  Heart,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  Zap
} from "lucide-react";
import { useEffect } from "react";
import { Shell } from "@/components/shell";
import { ExpandableText } from "@/components/expandable-text";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { useMarketplace } from "@/lib/marketplace-store";
import { formatPrice, useCaseLabels } from "@/lib/marketplace-data";
import { trackView } from "@/lib/recently-viewed";
import { trackFunnel } from "@/lib/funnel-tracking";
import { trackEvent } from "@/lib/analytics";
import type { Listing, ServiceIncludedItem } from "@/lib/types";

// Vaste WhatsApp van Hazenco — alleen cijfers, country code voorop.
const HAZENCO_WHATSAPP = "31643074303";

/**
 * Tabler-achtige iconmap die we direct ondersteunen voor "Wat is inbegrepen".
 * Andere icon-strings vallen terug op CheckCircle2. Bewust geen dynamische
 * lookup naar het Tabler font want hier zit React-icons inline al ingebakken.
 */
function IncludedIcon({ name, size = 22 }: { name: string; size?: number }) {
  switch (name) {
    case "shield-check":
      return <ShieldCheck size={size} />;
    case "database-export":
    case "database-backup":
      return <DatabaseBackup size={size} />;
    case "refresh":
      return <RefreshCw size={size} />;
    case "headset":
    case "headphones":
      return <Headphones size={size} />;
    case "users":
      return <Users size={size} />;
    case "clock":
      return <Clock size={size} />;
    case "life-buoy":
      return <LifeBuoy size={size} />;
    case "phone":
      return <Phone size={size} />;
    case "calendar":
      return <Calendar size={size} />;
    case "mail":
      return <Mail size={size} />;
    case "zap":
      return <Zap size={size} />;
    case "message-circle":
      return <MessageCircle size={size} />;
    default:
      return <CheckCircle2 size={size} />;
  }
}

function PricingPackageCard({
  listing,
  variant
}: {
  listing: Listing;
  variant: "oneTime" | "subscription";
}) {
  const sp = listing.servicePricing!;
  const isHighlight = sp.highlight === variant;
  const ext = sp.externalUrl;

  function handleClick() {
    trackEvent("service_package_click", {
      tool_slug: listing.slug,
      tool_title: listing.title,
      package: variant,
      destination: ext
    });
  }

  if (variant === "oneTime" && sp.oneTime) {
    const { priceCents, originalPriceCents, description } = sp.oneTime;
    return (
      <div className={`service-package${isHighlight ? " highlight" : ""}`}>
        {isHighlight ? <span className="package-tag">Populair</span> : null}
        <p className="package-name">Eenmalig</p>
        <div className="package-price">
          <span className="amount">{formatPrice(priceCents)}</span>
          {originalPriceCents ? (
            <span className="original">{formatPrice(originalPriceCents)}</span>
          ) : null}
        </div>
        <p className="package-desc">{description}</p>
        <a
          className="button"
          href={ext}
          target="_blank"
          rel="noreferrer"
          onClick={handleClick}
        >
          Plan een gesprek <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  if (variant === "subscription" && sp.subscription) {
    const { priceCentsPerMonth, originalPriceCentsPerMonth, minMonths, description } = sp.subscription;
    return (
      <div className={`service-package${isHighlight ? " highlight" : ""}`}>
        {isHighlight ? <span className="package-tag">Populair</span> : null}
        <p className="package-name">All-in abonnement</p>
        <div className="package-price">
          <span className="amount">{formatPrice(priceCentsPerMonth)}</span>
          <span className="cycle">/maand</span>
          {originalPriceCentsPerMonth ? (
            <span className="original">{formatPrice(originalPriceCentsPerMonth)}</span>
          ) : null}
        </div>
        <p className="package-meta">vanaf {minMonths} maanden</p>
        <p className="package-desc">{description}</p>
        <a
          className="button"
          href={ext}
          target="_blank"
          rel="noreferrer"
          onClick={handleClick}
        >
          Plan een gesprek <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  return null;
}

export function ServiceDetailClient({ listing }: { listing: Listing }) {
  const { state, toggleSavedListing, activeUser } = useMarketplace();
  const seller = state.sellers.find((item) => item.id === listing.sellerId);
  const category = state.categories.find((item) => item.id === listing.categoryId);
  const saved = activeUser?.savedListings?.includes(listing.id) ?? false;
  const sp = listing.servicePricing;
  const meta = listing.serviceMeta;

  useEffect(() => {
    trackView(listing.id);
    trackFunnel(listing.id, "view");
  }, [listing.id]);

  const orderedPackages: Array<"oneTime" | "subscription"> =
    sp?.highlight === "oneTime" ? ["oneTime", "subscription"] : ["subscription", "oneTime"];

  return (
    <Shell>
      <div className="page">
        <Link className="detail-back" href="/catalogus">
          <ArrowLeft size={15} /> Terug naar catalogus
        </Link>

        <div className="detail-layout" style={{ marginTop: 12 }}>
          <div className="stack">
            <section className="detail-hero-card">
              <div className="detail-hero-top">
                <span className="badge service-chip">
                  <Sparkles size={12} /> Dienst
                </span>
                {category ? <span className="badge soft">{category.name}</span> : null}
                {listing.featured ? <span className="badge dark">Hazenco selectie</span> : null}
                {listing.useCases?.slice(0, 2).map((useCase) => (
                  <span className="badge soft" key={useCase}>{useCaseLabels[useCase]}</span>
                ))}
              </div>
              <h1>{listing.title}</h1>
              <p className="lead">{listing.tagline}</p>

              {listing.heroImageUrl ? (
                <div className="detail-hero-standalone-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="detail-hero-standalone"
                    src={listing.heroImageUrl}
                    alt={listing.title}
                  />
                </div>
              ) : null}

              <div className="detail-hero-actions">
                <span />
                <div className="detail-gallery-cta-row">
                  {(listing.screenshotUrls?.length ?? 0) > 0 ? (
                    <a className="button secondary" href="#screenshots">
                      Bekijk demo
                    </a>
                  ) : null}
                  {listing.cases && listing.cases.length > 0 ? (
                    <a className="button secondary" href="#cases">
                      Bekijk portfolio
                    </a>
                  ) : null}
                </div>
              </div>
            </section>

            {(listing.screenshotUrls?.length ?? 0) > 0 ? (
              <ScreenshotGallery
                screenshots={listing.screenshotUrls ?? []}
                toolTitle={listing.title}
              />
            ) : null}

            {listing.forWho && listing.forWho.length > 0 ? (
              <section className="section-card">
                <h2>Voor wie is dit?</h2>
                <ul className="for-who-list">
                  {listing.forWho.map((entry, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={17} /> {entry}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="section-card">
              <h2>Wat doet deze dienst?</h2>
              <ExpandableText text={listing.description} />
            </section>

            {listing.included && listing.included.length > 0 ? (
              <section className="section-card">
                <h2>Wat is inbegrepen</h2>
                <div className="included-grid">
                  {listing.included.map((item: ServiceIncludedItem, idx) => (
                    <div key={idx} className="included-card">
                      <div className="included-icon">
                        <IncludedIcon name={item.icon} />
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {listing.cases && listing.cases.length > 0 ? (
              <section id="cases" className="section-card">
                <h2>Recente cases</h2>
                <div className="cases-grid">
                  {listing.cases.map((c, idx) => (
                    <article
                      key={idx}
                      className={`case-card tone-${c.tone ?? "dark"}`}
                    >
                      {c.imageUrl ? (
                        <div className="case-image">
                          <img src={c.imageUrl} alt={c.clientName} loading="lazy" />
                        </div>
                      ) : null}
                      <div className="case-band">
                        {c.label ? <span className="case-label">{c.label}</span> : null}
                        <strong className="case-title">{c.clientName}</strong>
                        {c.tag ? <span className="case-tag">{c.tag}</span> : null}
                      </div>
                      <div className="case-body">
                        <p>{c.benefit}</p>
                        {c.highlights && c.highlights.length > 0 ? (
                          <ul className="case-highlights">
                            {c.highlights.map((h, i) => (
                              <li key={i}>
                                <CheckCircle2 size={15} /> {h}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {c.url ? (
                          <a
                            className="case-cta"
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Bekijk project <ExternalLink size={13} />
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {meta ? (
              <section className="section-card">
                <h2>Specificaties</h2>
                <div className="service-meta-grid">
                  {meta.duration ? (
                    <div className="service-meta-item">
                      <Clock size={18} />
                      <div>
                        <strong>Doorlooptijd</strong>
                        <p>{meta.duration}</p>
                      </div>
                    </div>
                  ) : null}
                  {meta.revisions ? (
                    <div className="service-meta-item">
                      <RotateCcw size={18} />
                      <div>
                        <strong>Revisies</strong>
                        <p>{meta.revisions}</p>
                      </div>
                    </div>
                  ) : null}
                  {meta.supportPeriod || listing.supportIncluded ? (
                    <div className="service-meta-item">
                      <LifeBuoy size={18} />
                      <div>
                        <strong>Support</strong>
                        <p>{meta.supportPeriod || listing.supportIncluded}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="detail-sidebar">
            <div className="service-pricing-box">
              <p className="pricing-label">Kies een pakket</p>
              {sp
                ? orderedPackages.map((variant) => (
                    <PricingPackageCard
                      key={variant}
                      listing={listing}
                      variant={variant}
                    />
                  ))
                : null}

              {sp?.usps && sp.usps.length > 0 ? (
                <ul className="pricing-usps">
                  {sp.usps.map((usp, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={14} /> {usp}
                    </li>
                  ))}
                </ul>
              ) : null}

              <button
                className={`save-toggle${saved ? " saved" : ""}`}
                type="button"
                onClick={() => toggleSavedListing(listing.id)}
                aria-label={saved ? "Verwijder uit bewaarde" : "Bewaar dienst"}
              >
                <Heart size={15} fill={saved ? "currentColor" : "none"} />
                {saved ? "Opgeslagen" : "Bewaar deze dienst"}
              </button>
            </div>

            <div className="contact-box">
              <h3>Niet helemaal zeker?</h3>
              <p>Of wilt u eerst overleggen? Neem contact met ons op — we helpen graag.</p>
              <div className="contact-box-actions">
                <a
                  className="contact-link whatsapp"
                  href={`https://wa.me/${HAZENCO_WHATSAPP}?text=${encodeURIComponent(
                    `Hallo Hazenco, ik heb interesse in "${listing.title}" en wil graag advies over de aanpak.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", {
                      tool_slug: listing.slug,
                      tool_title: listing.title,
                      source: "service_detail_sidebar"
                    })
                  }
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <Link className="contact-link" href="/contact">
                  Contactpagina <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {seller ? (
              <div className="seller-mini">
                <p className="seller-mini-label">Gebouwd door</p>
                <Link href={`/creators/${seller.handle}`}>{seller.name}</Link>
              </div>
            ) : null}
          </aside>
        </div>

        {sp ? (
          <div className="mobile-cta">
            <div className="mobile-cta-meta">
              <strong>
                {sp.subscription
                  ? `Vanaf ${formatPrice(sp.subscription.priceCentsPerMonth)}/mnd`
                  : sp.oneTime
                  ? formatPrice(sp.oneTime.priceCents)
                  : ""}
              </strong>
              <span>{listing.title}</span>
            </div>
            <a
              className="button"
              href={sp.externalUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackEvent("service_mobile_cta_click", {
                  tool_slug: listing.slug,
                  tool_title: listing.title
                })
              }
            >
              Plan een gesprek <ExternalLink size={14} />
            </a>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}
