"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Clock,
  Coffee,
  Download,
  Globe,
  Heart,
  MapPin,
  MessageSquare,
  Package,
  Star,
  TrendingUp
} from "lucide-react";
import { Shell } from "@/components/shell";
import { ProductCard } from "@/components/product-card";
import { useMarketplace } from "@/lib/marketplace-store";
import { formatPrice } from "@/lib/marketplace-data";
import { FollowButton } from "@/components/follow-button";
import { TipModal } from "@/components/tip-modal";
import { computeAchievements } from "@/lib/achievements";

function formatNumber(value: number) {
  return value.toLocaleString("nl-NL");
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { year: "numeric", month: "long" });
  } catch {
    return iso;
  }
}

export function CreatorPublicProfile() {
  const params = useParams();
  const handle = (params?.handle as string)?.toLowerCase();
  const { state } = useMarketplace();
  const [tipping, setTipping] = useState(false);

  const seller = state.sellers.find((s) => s.handle.toLowerCase() === handle);

  const listings = useMemo(
    () => state.listings.filter((l) => l.sellerId === seller?.id && l.status === "published"),
    [state.listings, seller?.id]
  );

  const stats = useMemo(() => {
    if (!seller) return null;
    const paidOrders = state.orders.filter((o) => o.status === "paid");
    let revenue = 0;
    let salesCount = 0;
    for (const o of paidOrders) {
      for (const item of o.items) {
        if (item.sellerId !== seller.id) continue;
        revenue += item.priceCents * item.quantity;
        salesCount += item.quantity;
      }
    }
    const downloads = listings.reduce((s, l) => s + l.downloads, 0);
    const avgRating = listings.length > 0
      ? listings.reduce((s, l) => s + (l.rating || 0), 0) / listings.filter((l) => l.rating > 0).length || 0
      : 0;
    const reviews = state.reviews.filter((r) => r.approved && listings.some((l) => l.id === r.listingId)).length;
    const followers = (state.follows ?? []).filter((f) => f.sellerId === seller.id).length;
    const tipsTotal = (state.tips ?? []).filter((t) => t.sellerId === seller.id).reduce((s, t) => s + t.amountCents, 0);
    return { revenue, salesCount, downloads, avgRating, reviews, followers, tipsTotal };
  }, [seller, listings, state.orders, state.reviews, state.follows, state.tips]);

  const achievements = useMemo(() => seller ? computeAchievements(state, seller.id) : [], [seller, state]);

  if (!seller) {
    return (
      <Shell>
        <div style={{ maxWidth: 600, margin: "60px auto", padding: 40, textAlign: "center" }}>
          <h1>Creator niet gevonden</h1>
          <p>Deze creator bestaat niet of is niet langer actief.</p>
          <Link className="button" href="/catalogus" style={{ marginTop: 12 }}>
            <ArrowLeft size={14} /> Naar de catalogus
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="creator-public-page">
        <Link href="/catalogus" className="creator-public-back">
          <ArrowLeft size={14} /> Terug naar catalogus
        </Link>

        {/* Hero */}
        <section className="creator-public-hero">
          <div className="creator-public-avatar">
            {seller.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="creator-public-info">
            <div className="creator-public-name">
              <h1>{seller.name}</h1>
              {seller.verified ? (
                <span className="creator-public-verified" title="Geverifieerde creator">
                  <BadgeCheck size={18} /> Geverifieerd
                </span>
              ) : null}
            </div>
            <span className="creator-public-handle">@{seller.handle}</span>
            <p className="creator-public-specialty">{seller.specialty}</p>
            {seller.bio ? <p className="creator-public-bio">{seller.bio}</p> : null}
            <div className="creator-public-meta">
              {seller.location ? <span><MapPin size={13} /> {seller.location}</span> : null}
              {seller.website ? (
                <a href={seller.website} target="_blank" rel="noopener noreferrer">
                  <Globe size={13} /> Website
                </a>
              ) : null}
              {seller.joinedAt ? <span><Clock size={13} /> Lid sinds {formatDate(seller.joinedAt)}</span> : null}
              <span><MessageSquare size={13} /> Reactie binnen {seller.responseTime ?? "24u"}</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <FollowButton sellerId={seller.id} sellerName={seller.name} />
              <button type="button" className="button secondary" onClick={() => setTipping(true)}>
                <Coffee size={14} /> Tip de creator
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        {stats ? (
          <section className="creator-public-stats">
            <div className="creator-public-stat">
              <Package size={18} />
              <div>
                <strong>{listings.length}</strong>
                <small>{listings.length === 1 ? "Tool live" : "Tools live"}</small>
              </div>
            </div>
            <div className="creator-public-stat">
              <Download size={18} />
              <div>
                <strong>{formatNumber(stats.downloads)}</strong>
                <small>Downloads</small>
              </div>
            </div>
            <div className="creator-public-stat">
              <TrendingUp size={18} />
              <div>
                <strong>{formatNumber(stats.salesCount)}</strong>
                <small>{stats.salesCount === 1 ? "Verkoop" : "Verkopen"}</small>
              </div>
            </div>
            <div className="creator-public-stat">
              <Star size={18} fill="currentColor" style={{ color: "#f59e0b" }} />
              <div>
                <strong>{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}</strong>
                <small>{stats.reviews} reviews</small>
              </div>
            </div>
            <div className="creator-public-stat highlight">
              <div>
                <strong>{formatPrice(stats.revenue)}</strong>
                <small>Totale omzet</small>
              </div>
            </div>
          </section>
        ) : null}

        {/* Achievements */}
        {achievements.length > 0 ? (
          <section className="creator-achievements">
            <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
              <div>
                <span className="eyebrow"><Award size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Achievements</span>
                <h2>{achievements.length} badges verdiend</h2>
              </div>
              {stats && stats.followers > 0 ? (
                <small style={{ color: "var(--green-500)", fontSize: 12, fontWeight: 700 }}>
                  <Heart size={11} fill="currentColor" style={{ color: "var(--orange-600)", verticalAlign: -1, marginRight: 3 }} />
                  {stats.followers} {stats.followers === 1 ? "volger" : "volgers"}
                  {stats.tipsTotal > 0 ? ` · ${formatPrice(stats.tipsTotal)} aan tips` : ""}
                </small>
              ) : null}
            </div>
            <div className="achievement-grid">
              {achievements.map((a) => (
                <div className={`achievement-badge tier-${a.tier}`} key={a.id} title={a.description}>
                  <span className="achievement-icon"><a.icon size={20} /></span>
                  <strong>{a.label}</strong>
                  <small>{a.description}</small>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Listings */}
        <section className="creator-public-listings">
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow"><Package size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Tools van {seller.name.split(" ")[0]}</span>
              <h2>{listings.length} {listings.length === 1 ? "tool" : "tools"} in de catalogus</h2>
            </div>
          </div>
          {listings.length > 0 ? (
            <div className="product-grid">
              {listings.map((l) => <ProductCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="empty-state">
              <Package size={28} style={{ color: "var(--green-500)" }} />
              <h3>Nog geen tools live</h3>
              <p>Deze creator heeft nog geen gepubliceerde tools.</p>
            </div>
          )}
        </section>
      </div>

      {tipping ? (
        <TipModal sellerId={seller.id} sellerName={seller.name} onClose={() => setTipping(false)} />
      ) : null}
    </Shell>
  );
}
