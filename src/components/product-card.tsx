"use client";

import Link from "next/link";
import { ArrowRight, Download, ExternalLink, Eye, Plus, Sparkles, Star } from "lucide-react";
import { formatPrice, productTypeLabels } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";
import { LikeButton } from "@/components/like-button";
import type { Listing } from "@/lib/types";

function servicePriceLabel(listing: Listing): { label: string; suffix?: string } | null {
  const sp = listing.servicePricing;
  if (!sp) return null;
  if (sp.subscription) {
    return { label: `Vanaf ${formatPrice(sp.subscription.priceCentsPerMonth)}`, suffix: "/mnd" };
  }
  if (sp.oneTime) {
    return { label: `Eenmalig ${formatPrice(sp.oneTime.priceCents)}` };
  }
  return null;
}

export function ProductCard({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const { state, addToCart } = useMarketplace();
  const category = state.categories.find((item) => item.id === listing.categoryId);
  const seller = state.sellers.find((item) => item.id === listing.sellerId);
  const isService = listing.listingKind === "service";
  const serviceLabel = isService ? servicePriceLabel(listing) : null;

  return (
    <article className={`product-card${compact ? " compact" : ""}${isService ? " service" : ""}`}>
      <div className="product-visual" style={{ "--accent": category?.accent ?? "#F26B1D" } as React.CSSProperties}>
        {listing.heroImageUrl ? (
          <img className="visual-image" src={listing.heroImageUrl} alt={listing.title} loading="lazy" />
        ) : (
          <>
            <div className="visual-toolbar">
              <span />
              <span />
              <span />
            </div>
            <div className="visual-line wide" />
            <div className="visual-line" />
            <div className="visual-grid">
              <span />
              <span />
              <span />
              <span />
            </div>
          </>
        )}
      </div>
      <div className="product-content">
        <div className="product-topline">
          <div className="product-badges">
            {isService ? (
              <span className="badge service-chip"><Sparkles size={12} /> Dienst</span>
            ) : (
              <span className="badge soft">{productTypeLabels[listing.type]}</span>
            )}
            {listing.featured && <span className="badge orange">Uitgelicht</span>}
          </div>
          <LikeButton listingId={listing.id} size="sm" />
        </div>
        <Link className="product-title" href={`/tools/${listing.slug}`}>
          {listing.title}
        </Link>
        <p>{listing.tagline}</p>
        <div className="meta-row">
          <span><Star size={15} fill="currentColor" /> {listing.rating ? listing.rating.toFixed(1) : "Nieuw"}</span>
          {!isService && <span><Download size={15} /> {listing.downloads}</span>}
          {seller ? (
            <Link
              href={`/creators/${seller.handle}`}
              className="product-card-creator"
              onClick={(e) => e.stopPropagation()}
            >
              {seller.name}
            </Link>
          ) : null}
        </div>
        <div className="product-actions">
          {isService && serviceLabel ? (
            <strong className="service-price">
              {serviceLabel.label}
              {serviceLabel.suffix ? <span>{serviceLabel.suffix}</span> : null}
            </strong>
          ) : (
            <strong>{formatPrice(listing.priceCents)}</strong>
          )}
          <div>
            {!isService && (
              <button className="icon-button" type="button" onClick={() => addToCart(listing.id)} title="Toevoegen aan winkelwagen">
                <Plus size={18} />
              </button>
            )}
            <Link className="small-link" href={`/tools/${listing.slug}`}>
              {isService ? (
                <><ExternalLink size={16} /> Bekijk <ArrowRight size={14} /></>
              ) : (
                <><Eye size={16} /> Bekijk <ArrowRight size={14} /></>
              )}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
