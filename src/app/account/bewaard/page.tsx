"use client";

import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useMarketplace } from "@/lib/marketplace-store";
import { useAccountData } from "@/lib/account-data";

export default function AccountSavedPage() {
  const { activeUser } = useMarketplace();
  const { savedListings } = useAccountData();

  if (activeUser.role === "visitor") return null;

  return (
    <section className="section-card" style={{ marginTop: 0 }}>
      <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
        <div>
          <span className="eyebrow">Bewaard</span>
          <h2>Tools voor later ({savedListings.length})</h2>
        </div>
      </div>
      {savedListings.length ? (
        <div className="product-grid">
          {savedListings.map((listing) => (
            <ProductCard key={listing.id} listing={listing} compact />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={28} style={{ color: "var(--green-500)" }} />
          <h2>Geen bewaarde tools</h2>
          <p>Klik op het hartje bij een tool om hem voor later op te slaan.</p>
        </div>
      )}
    </section>
  );
}
