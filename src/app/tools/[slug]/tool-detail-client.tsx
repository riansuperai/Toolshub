"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { trackView } from "@/lib/recently-viewed";
import { trackFunnel } from "@/lib/funnel-tracking";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Cloud,
  Download,
  ExternalLink,
  FileText,
  Heart,
  LifeBuoy,
  MessageCircle,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Star,
  Store,
  TrendingUp,
  Wrench,
  Zap
} from "lucide-react";
import { Shell } from "@/components/shell";
import { ProductCard } from "@/components/product-card";
import { ToolQA } from "@/components/tool-qa";
import { PricingPlans } from "@/components/pricing-plans";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { ExpandableText } from "@/components/expandable-text";
import { ServiceDetailClient } from "./service-detail-client";
import {
  brancheLabels,
  deliveryModeLabels,
  formatPrice,
  productTypeLabels,
  useCaseLabels
} from "@/lib/marketplace-data";
import { useMarketplace, userHasPurchased } from "@/lib/marketplace-store";
import type { DeliveryMode } from "@/lib/types";

// Hazenco WhatsApp Business — +31 6 43 07 43 03
// Format: alleen cijfers, country code voorop, geen +, geen spaties.
const HAZENCO_WHATSAPP = "31643074303";

const deliveryDescription: Record<DeliveryMode, string> = {
  download: "Private bestanden en documentatie worden direct vrijgegeven na betaling.",
  cloud: "Gehoste oplossing: meteen toegang via de cloud, niets te installeren.",
  custom: "De seller verzorgt de setup voor je. Snel live zonder zelf te knutselen."
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function MockScreen({ variant, primary = false }: { variant: number; primary?: boolean }) {
  const pattern = variant % 5;
  if (pattern === 0) {
    return (
      <div className="mock-screen">
        <div className="mock-cols">
          <div className="mock-sidebar">
            <div className="mock-bar full" />
            <div className="mock-bar mid" />
            <div className="mock-bar mid" />
            <div className="mock-bar long" />
            {primary ? (
              <>
                <div className="mock-bar mid" />
                <div className="mock-bar long" />
              </>
            ) : null}
          </div>
          <div className="mock-main">
            <div className="mock-row"><div className="mock-bar mid" /></div>
            <div className="mock-cluster">
              <div className="mock-block" />
              <div className="mock-block accent" />
              <div className="mock-block" />
            </div>
            {primary ? (
              <>
                <div className="mock-row"><div className="mock-bar long" /></div>
                <div className="mock-row"><div className="mock-bar mid" /></div>
                <div className="mock-row"><div className="mock-bar long" /></div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
  if (pattern === 1) {
    return (
      <div className="mock-screen">
        <div className="mock-row"><span className="dot" /><div className="grow" /></div>
        <div className="mock-row"><span className="dot" /><div className="grow" /></div>
        <div className="mock-row"><span className="dot" /><div className="grow" /></div>
        {primary ? (
          <>
            <div className="mock-row"><span className="dot" /><div className="grow" /></div>
            <div className="mock-row"><span className="dot" /><div className="grow" /></div>
          </>
        ) : null}
      </div>
    );
  }
  if (pattern === 2) {
    return (
      <div className="mock-screen">
        <div className="mock-bar long" />
        <div className="mock-cluster">
          <div className="mock-block" />
          <div className="mock-block" />
        </div>
        <div className="mock-cluster">
          <div className="mock-block accent" />
          <div className="mock-block" />
        </div>
      </div>
    );
  }
  if (pattern === 3) {
    return (
      <div className="mock-screen">
        <div className="mock-row"><div className="mock-bar mid" /></div>
        <div className="mock-chart">
          <span style={{ height: "40%" }} />
          <span style={{ height: "70%" }} />
          <span style={{ height: "55%" }} />
          <span style={{ height: "85%" }} />
          <span style={{ height: "60%" }} />
          {primary ? <span style={{ height: "92%" }} /> : null}
        </div>
      </div>
    );
  }
  return (
    <div className="mock-screen">
      <div className="mock-cluster">
        <div className="mock-block accent" style={{ flex: 0.4 }} />
        <div className="mock-bar long" style={{ alignSelf: "center" }} />
      </div>
      <div className="mock-bar long" />
      <div className="mock-bar mid" />
      {primary ? (
        <>
          <div className="mock-bar long" />
          <div className="mock-bar short" />
        </>
      ) : null}
    </div>
  );
}

function StarRow({ value, size = 14 }: { value: number; size?: number }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="review-stars" aria-label={`${value} van 5 sterren`}>
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= Math.round(value) ? "currentColor" : "none"}
          strokeWidth={2}
        />
      ))}
    </span>
  );
}

export function ToolDetailClient() {
  const params = useParams<{ slug: string }>();
  const { state, activeUser, addToCart, toggleSavedListing, createServiceRequest } = useMarketplace();
  const listing = state.listings.find((item) => item.slug === params.slug);
  const [withSetup, setWithSetup] = useState(false);

  useEffect(() => {
    if (listing) {
      trackView(listing.id);
      trackFunnel(listing.id, "view");
    }
  }, [listing]);

  if (!listing) {
    return (
      <Shell>
        <div className="page">
          <div className="empty-state">
            <h1>Tool niet gevonden</h1>
            <p>Deze listing bestaat niet of is nog niet gepubliceerd.</p>
            <Link className="button" href="/catalogus">Terug naar catalogus</Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (listing.listingKind === "service") {
    return <ServiceDetailClient listing={listing} />;
  }

  const category = state.categories.find((item) => item.id === listing.categoryId);
  const seller = state.sellers.find((item) => item.id === listing.sellerId);
  const saved = activeUser.savedListings.includes(listing.id);
  const purchased = userHasPurchased(state, activeUser.id, listing.id);
  const related = state.listings
    .filter((item) => item.status === "published" && item.id !== listing.id && item.categoryId === listing.categoryId)
    .slice(0, 2);
  const allReviews = state.reviews.filter((review) => review.listingId === listing.id && review.approved);
  const reviewCount = allReviews.length;
  const averageRating = reviewCount
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : listing.rating;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((review) => review.rating === star).length
  }));
  const maxBucket = Math.max(1, ...distribution.map((row) => row.count));

  const sellerSales = seller?.sales ?? 0;
  const sellerSold = state.listings
    .filter((item) => item.sellerId === seller?.id && item.id !== listing.id && item.status === "published")
    .length;

  const screenshots = listing.demo.screenshots.slice(0, 5);
  const totalPrice = withSetup ? listing.priceCents + listing.setupPriceCents : listing.priceCents;
  const canSetup = listing.deliveryModes.includes("custom") && listing.setupPriceCents > 0;

  const demoHost = (() => {
    try {
      return new URL(listing.demo.url).host.replace("www.", "");
    } catch {
      return "demo.hazenco.nl";
    }
  })();

  function handleAddToCart() {
    addToCart(listing!.id, withSetup);
    trackFunnel(listing!.id, "cart_add");
    trackEvent("add_to_cart", {
      tool_slug: listing!.slug,
      tool_title: listing!.title,
      with_setup: withSetup,
      value: totalPrice,
      currency: "EUR"
    });
  }

  return (
    <Shell>
      <div className="page">
        <Link className="detail-back" href="/catalogus"><ArrowLeft size={15} /> Terug naar catalogus</Link>

        <div className="detail-layout" style={{ marginTop: 12 }}>
          <div className="stack">
            <section className="detail-hero-card">
              <div className="detail-hero-top">
                <span className="badge orange">{productTypeLabels[listing.type]}</span>
                {category ? <span className="badge soft">{category.name}</span> : null}
                {listing.featured ? <span className="badge dark">Hazenco selectie</span> : null}
                {listing.useCases?.slice(0, 2).map((useCase) => (
                  <span className="badge soft" key={useCase}>{useCaseLabels[useCase]}</span>
                ))}
              </div>
              <h1>{listing.title}</h1>
              <p className="lead">{listing.tagline}</p>
              <div className="detail-hero-meta">
                <span className="stat">
                  <Star size={15} fill="currentColor" />
                  <strong>{averageRating ? averageRating.toFixed(1) : "Nieuw"}</strong>
                  {reviewCount ? `(${reviewCount} ${reviewCount === 1 ? "review" : "reviews"})` : "nog geen reviews"}
                </span>
                <span className="stat"><Download size={15} /> <strong>{listing.downloads}</strong> downloads</span>
                <span className="stat"><TrendingUp size={15} /> <strong>{listing.sales}</strong> verkocht</span>
                <span className="stat"><RefreshCw size={15} /> Versie <strong>{listing.version}</strong></span>
                <span className="stat"><CalendarClock size={15} /> Bijgewerkt {formatDate(listing.updatedAt)}</span>
              </div>

              {listing.heroImageUrl ? (
                /* Hero image standalone: geen panel, geen browser-chrome, alleen de afbeelding */
                <div className="detail-hero-standalone-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="detail-hero-standalone"
                    src={listing.heroImageUrl}
                    alt={listing.title}
                  />
                </div>
              ) : (
                /* Fallback voor tools zonder hero image: oud panel met mock + sub-tiles */
                <div className="detail-gallery" data-count={screenshots.length || 1}>
                  <div className="detail-gallery-tile primary">
                    <div className="detail-gallery-window">
                      <div className="dots"><span /><span /><span /></div>
                      <span className="url">{demoHost}</span>
                    </div>
                    <span className="eyebrow">Demo sandbox · scherm 1</span>
                    <h3>{screenshots[0] ?? "Live voorbeeld"}</h3>
                    <MockScreen variant={0} primary />
                  </div>
                  {screenshots.slice(1).map((shot, index) => (
                    <div className="detail-gallery-tile" key={shot + index}>
                      <div className="detail-gallery-window">
                        <div className="dots"><span /><span /><span /></div>
                      </div>
                      <h3>{shot}</h3>
                      <MockScreen variant={index + 1} />
                      <div className="detail-gallery-tile-foot">
                        <span className="small">Onderdeel van de demo flow</span>
                        <span className="detail-gallery-tile-step">{index + 2}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions row — altijd zichtbaar onder de afbeelding/mock */}
              <div className="detail-hero-actions">
                {listing.demo.instructions ? (
                  <p className="small">{listing.demo.instructions}</p>
                ) : <span />}
                <div className="detail-gallery-cta-row">
                  {(listing.screenshotUrls?.length ?? 0) > 0 ? (
                    <a
                      className="button secondary"
                      href="#screenshots"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("screenshots")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start"
                        });
                      }}
                    >
                      Bekijk screenshots
                    </a>
                  ) : null}
                  <a
                    className="button secondary"
                    href={listing.demo.url || "#"}
                    target={listing.demo.url ? "_blank" : undefined}
                    rel={listing.demo.url ? "noreferrer" : undefined}
                    aria-disabled={!listing.demo.url}
                    onClick={(e) => {
                      if (!listing.demo.url) {
                        e.preventDefault();
                        return;
                      }
                      trackEvent("demo_click", {
                        tool_slug: listing.slug,
                        tool_title: listing.title,
                        demo_url: listing.demo.url
                      });
                    }}
                  >
                    Bekijk demo <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </section>

            <section className="section-card">
              <h2>Wat doet deze tool?</h2>
              <ExpandableText text={listing.description} />
              <div className="chip-row" style={{ marginTop: 14 }}>
                {listing.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}
              </div>
            </section>

            <section className="section-card deliverables-card">
              <h2>Wat krijg je</h2>
              <p style={{ marginTop: -4 }}>Zo wordt de tool geleverd en welke bestanden je daarbij ontvangt.</p>
              <div className="delivery-grid" style={{ marginTop: 14 }}>
                {listing.deliveryModes.map((mode) => {
                  const Icon = mode === "download" ? Download : mode === "cloud" ? Cloud : Wrench;
                  return (
                    <div className="delivery-card" key={mode}>
                      <Icon size={22} />
                      <h3>{deliveryModeLabels[mode]}</h3>
                      <p>{deliveryDescription[mode]}</p>
                    </div>
                  );
                })}
              </div>
              {listing.files.length > 0 ? (
                <div className="section-card-foot">
                  <h3>
                    <Package size={13} /> Bestanden
                    <span className="count-pill">{listing.files.length}</span>
                  </h3>
                  {listing.files.map((file) => (
                    <div className="file-row" key={file.id}>
                      <div className="file-row-icon"><FileText size={18} /></div>
                      <div className="file-row-body">
                        <strong>{file.name}</strong>
                        <span className="small">{file.kind} · {file.sizeLabel}</span>
                      </div>
                      {purchased ? (
                        <button className="button secondary" type="button" style={{ minHeight: 36, padding: "0 14px", fontSize: 13 }}>
                          <Download size={14} /> Download
                        </button>
                      ) : (
                        <span className="badge soft">Na aankoop</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="section-card">
              <h2>Specificaties</h2>
              <div className="specs-strip">
                <div>
                  <span className="eyebrow">Versie</span>
                  <strong>{listing.version}</strong>
                  <div className="specs-strip-meta"><RefreshCw size={11} /> Update beschikbaar</div>
                </div>
                <div>
                  <span className="eyebrow">Laatst bijgewerkt</span>
                  <strong>{formatDate(listing.updatedAt)}</strong>
                  <div className="specs-strip-meta"><CalendarClock size={11} /> Door creator</div>
                </div>
                <div>
                  <span className="eyebrow">Support</span>
                  <strong>{listing.supportIncluded}</strong>
                  <div className="specs-strip-meta"><LifeBuoy size={11} /> Inbegrepen</div>
                </div>
                <div>
                  <span className="eyebrow">Bestanden</span>
                  <strong>{listing.files.length} {listing.files.length === 1 ? "asset" : "assets"}</strong>
                  <div className="specs-strip-meta"><Package size={11} /> Klaar na aankoop</div>
                </div>
              </div>
              {(listing.branches?.length || listing.compatibility?.length) ? (
                <div className="specs-info-section">
                  {listing.branches?.length ? (
                    <div>
                      <h3>Geschikt voor</h3>
                      <div className="compat-row">
                        {listing.branches.map((branche) => (
                          <span className="compat-badge" key={branche}>{brancheLabels[branche]}</span>
                        ))}
                      </div>
                    </div>
                  ) : <div />}
                  {listing.compatibility?.length ? (
                    <div>
                      <h3>Werkt samen met</h3>
                      <div className="compat-row">
                        {listing.compatibility.map((tool) => (
                          <span className="compat-badge" key={tool}>{tool}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>

            <ScreenshotGallery
              screenshots={listing.screenshotUrls ?? []}
              toolTitle={listing.title}
            />

            {seller ? (
              <section className="section-card">
                <div className="seller-card-large">
                  <div className="seller-avatar">{seller.name.slice(0, 1).toUpperCase()}</div>
                  <div className="seller-meta">
                    <strong>{seller.name}</strong>
                    <span className="small">{seller.specialty} · {seller.location}</span>
                    <div className="seller-stats">
                      <span><Star size={13} fill="currentColor" /> {seller.rating.toFixed(1)} rating</span>
                      <span><TrendingUp size={13} /> {sellerSales} verkocht</span>
                      <span><Zap size={13} /> {seller.responseTime}</span>
                      {seller.verified ? <span><ShieldCheck size={13} /> Geverifieerd</span> : null}
                    </div>
                  </div>
                  <Link className="button secondary" href={`/catalogus?sellerId=${seller.id}`}>
                    <Store size={16} /> {sellerSold > 0 ? `Bekijk ${sellerSold} andere tools` : "Bekijk profiel"}
                  </Link>
                </div>
              </section>
            ) : null}

            <section className="section-card">
              <h2>Reviews</h2>
              {reviewCount ? (
                <>
                  <div className="reviews-summary">
                    <div className="reviews-summary-score">
                      <span className="big">{averageRating.toFixed(1)}</span>
                      <StarRow value={averageRating} size={18} />
                      <span className="small">Gebaseerd op {reviewCount} {reviewCount === 1 ? "review" : "reviews"}</span>
                    </div>
                    <div className="reviews-distribution">
                      {distribution.map((row) => (
                        <div className="reviews-row" key={row.star}>
                          <span>{row.star}★</span>
                          <span className="reviews-row-bar">
                            <span style={{ width: `${(row.count / maxBucket) * 100}%` }} />
                          </span>
                          <span>{row.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {allReviews.map((review) => (
                    <div className="review-item" key={review.id}>
                      <div className="review-head">
                        <strong>{review.buyerName}</strong>
                        <span className="review-date">{formatDate(review.createdAt)}</span>
                      </div>
                      <StarRow value={review.rating} />
                      <p style={{ marginTop: 6 }}>{review.comment}</p>
                      {review.screenshots && review.screenshots.length > 0 ? (
                        <div className="review-shots">
                          {review.screenshots.map((src, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="review-shot-link">
                              <img src={src} alt={`Review screenshot ${i + 1}`} />
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </>
              ) : (
                <p>Deze tool heeft nog geen goedgekeurde reviews. Wees de eerste na je aankoop.</p>
              )}
            </section>

            <PricingPlans listing={listing} />

            <ToolQA listingId={listing.id} sellerId={listing.sellerId} />

            {related.length > 0 ? (
              <section style={{ marginTop: 44 }}>
                <h2>Vergelijkbare tools</h2>
                <div className="related-grid" style={{ marginTop: 16 }}>
                  {related.map((item) => <ProductCard key={item.id} listing={item} />)}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="detail-sidebar">
            <div className="price-box">
            <span className="eyebrow">Prijs</span>
            <div className="price-row">
              <span className="price">{formatPrice(totalPrice)}</span>
              <span className="price-suffix">excl. btw</span>
            </div>
            <p className="lead-sm">{listing.supportIncluded}</p>

            {canSetup ? (
              <label className={`addon-toggle${withSetup ? " checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={withSetup}
                  onChange={(event) => setWithSetup(event.target.checked)}
                />
                <span>
                  <span className="label">Setup-service door creator</span>
                  <span className="small">
                    + <strong>{formatPrice(listing.setupPriceCents)}</strong> · meteen live, zonder zelf te knutselen
                  </span>
                </span>
              </label>
            ) : null}

            <div className="actions">
              <div className="action-row">
                <button className="button" type="button" onClick={handleAddToCart}>
                  <Plus size={17} /> In winkelwagen
                </button>
                <button
                  className={`icon-only-button${saved ? " saved" : ""}`}
                  type="button"
                  onClick={() => toggleSavedListing(listing.id)}
                  aria-label={saved ? "Verwijder uit bewaarde" : "Bewaar tool"}
                >
                  <Heart size={17} fill={saved ? "currentColor" : "none"} />
                </button>
              </div>
              <Link className="button secondary" href="/winkelwagen">
                Direct afrekenen
              </Link>
              {purchased ? (
                <button
                  className="button dark"
                  type="button"
                  onClick={() =>
                    createServiceRequest({
                      listingId: listing.id,
                      sellerId: listing.sellerId,
                      scope: "Extra support aanvraag",
                      message: `Ik wil extra hulp met ${listing.title}.`
                    })
                  }
                >
                  <LifeBuoy size={16} /> Vraag support aan
                </button>
              ) : null}
            </div>

            <ul className="trust-list">
              <li><CheckCircle2 size={17} /> Demo zonder account, koop pas als je zeker bent</li>
              <li><CheckCircle2 size={17} /> Bestanden direct na betaling beschikbaar</li>
              <li><CheckCircle2 size={17} /> {listing.supportIncluded}</li>
              <li><CheckCircle2 size={17} /> Geverifieerde seller met reviews</li>
            </ul>
            </div>

            <div className="contact-box">
              <h3>Niet helemaal zeker?</h3>
              <p>Of wilt u maatwerk? Neem contact met ons op — we helpen graag.</p>
              <div className="contact-box-actions">
                <a
                  className="contact-link whatsapp"
                  href={`https://wa.me/${HAZENCO_WHATSAPP}?text=${encodeURIComponent(
                    `Hallo Hazenco, ik heb interesse in "${listing.title}" en wil graag advies over maatwerk.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", {
                      tool_slug: listing.slug,
                      tool_title: listing.title,
                      source: "tool_detail_sidebar"
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
          </aside>
        </div>

        <div className="mobile-cta">
          <div className="mobile-cta-meta">
            <strong>{formatPrice(totalPrice)}</strong>
            <span>{listing.title}</span>
          </div>
          <button className="button" type="button" onClick={handleAddToCart}>
            <Plus size={17} /> In winkelwagen
          </button>
        </div>
      </div>
    </Shell>
  );
}
