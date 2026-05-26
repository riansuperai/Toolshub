"use client";

import Link from "next/link";
import { ArrowRight, Download, Eye, Heart, Plus, Star } from "lucide-react";
import { deliveryModeShort, formatPrice, productTypeLabels } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";
import { LikeButton } from "@/components/like-button";
import type { Listing } from "@/lib/types";

export function ProductCard({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  const { state, activeUser, addToCart, toggleSavedListing } = useMarketplace();
  const category = state.categories.find((item) => item.id === listing.categoryId);
  const seller = state.sellers.find((item) => item.id === listing.sellerId);
  const saved = activeUser.savedListings.includes(listing.id);

  return (
    <article className={`product-card ${compact ? "compact" : ""}`}>
      <div className="product-visual" style={{ "--accent": category?.accent ?? "#F26B1D" } as React.CSSProperties}>
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
      </div>
      <div className="product-content">
        <div className="product-topline">
          <div>
            <span className="badge soft">{productTypeLabels[listing.type]}</span>
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
          <span><Download size={15} /> {listing.downloads}</span>
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
        {!compact && (
          <div className="chip-row">
            {listing.deliveryModes.map((mode) => (
              <span key={mode} className="chip">{deliveryModeShort[mode]}</span>
            ))}
          </div>
        )}
        <div className="product-actions">
          <strong>{formatPrice(listing.priceCents)}</strong>
          <div>
            <button className="icon-button" type="button" onClick={() => toggleSavedListing(listing.id)} title="Bewaren">
              <Heart size={17} fill={saved ? "currentColor" : "none"} />
            </button>
            <button className="icon-button" type="button" onClick={() => addToCart(listing.id)} title="Toevoegen">
              <Plus size={18} />
            </button>
            <Link className="small-link" href={`/tools/${listing.slug}`}>
              <Eye size={16} /> Bekijk <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
