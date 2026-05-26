"use client";

import Link from "next/link";
import { useMemo } from "react";
import { UserPlus, Users } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { ProductCard } from "@/components/product-card";

export function FollowedCreatorsFeed() {
  const { state, activeUser } = useMarketplace();

  const data = useMemo(() => {
    const myFollows = (state.follows ?? []).filter((f) => f.followerId === activeUser.id);
    const followedSellerIds = new Set(myFollows.map((f) => f.sellerId));
    if (followedSellerIds.size === 0) return { count: 0, recent: [] as typeof state.listings };

    const recent = state.listings
      .filter((l) => l.status === "published" && followedSellerIds.has(l.sellerId))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 3);

    return { count: followedSellerIds.size, recent };
  }, [state.follows, state.listings, activeUser.id]);

  if (data.count === 0) {
    return (
      <section className="section-card" style={{ marginTop: 18 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 12 }}>
          <div>
            <span className="eyebrow"><Users size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Volgend</span>
            <h2>Volg creators voor updates</h2>
          </div>
          <Link className="text-action" href="/catalogus">Ontdek creators</Link>
        </div>
        <p style={{ color: "var(--green-500)", fontSize: 13, margin: 0 }}>
          Klik op <strong>Volg creator</strong> bij een creator-profiel om hier hun nieuwste tools te zien zodra ze gepubliceerd worden.
        </p>
      </section>
    );
  }

  return (
    <section className="section-card" style={{ marginTop: 18 }}>
      <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
        <div>
          <span className="eyebrow"><UserPlus size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Van wie je volgt</span>
          <h2>Nieuwste tools van je {data.count} {data.count === 1 ? "creator" : "creators"}</h2>
        </div>
        <Link className="text-action" href="/catalogus">Bekijk catalogus →</Link>
      </div>
      {data.recent.length > 0 ? (
        <div className="product-grid">
          {data.recent.map((l) => <ProductCard key={l.id} listing={l} compact />)}
        </div>
      ) : (
        <p style={{ color: "var(--green-500)", fontSize: 13 }}>
          Je gevolgde creators hebben nog geen nieuwe tools gepubliceerd.
        </p>
      )}
    </section>
  );
}
