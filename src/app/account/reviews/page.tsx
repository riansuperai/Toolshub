"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useAccountData } from "@/lib/account-data";
import { ReviewForm } from "@/components/review-form";

export default function AccountReviewsPage() {
  const { activeUser } = useMarketplace();
  const { listingsToReview } = useAccountData();
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  if (activeUser.role === "visitor") return null;

  return (
    <section className="section-card" style={{ marginTop: 0 }}>
      <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
        <div>
          <span className="eyebrow">Reviews</span>
          <h2>Help andere kopers</h2>
        </div>
      </div>
      <p style={{ marginTop: 0, color: "var(--green-700)" }}>
        Schrijf een review over je gekochte tools. Na moderatie staan ze op de detailpagina.
      </p>
      {listingsToReview.length === 0 ? (
        <div className="empty-state">
          <Star size={28} style={{ color: "var(--green-500)" }} />
          <h2>Alles up-to-date</h2>
          <p>Je hebt voor al je aankopen een review geschreven. Dank je wel!</p>
          <Link className="button secondary" href="/account/bibliotheek" style={{ marginTop: 12 }}>
            Bekijk bibliotheek
          </Link>
        </div>
      ) : (
        <div className="stack" style={{ gap: 10 }}>
          {listingsToReview.map((listing) => (
            <div key={listing.id}>
              {activeReviewId === listing.id ? (
                <div className="section-card" style={{ margin: 0, padding: 20 }}>
                  <strong style={{ display: "block", color: "var(--green-900)", marginBottom: 12, fontSize: 16 }}>
                    Review voor {listing.title}
                  </strong>
                  <ReviewForm
                    listingId={listing.id}
                    onSubmitted={() => setActiveReviewId(null)}
                  />
                  <div style={{ marginTop: 12 }}>
                    <button className="button secondary" type="button" onClick={() => setActiveReviewId(null)}>
                      Sluiten
                    </button>
                  </div>
                </div>
              ) : (
                <div className="review-prompt">
                  <div>
                    <strong>{listing.title}</strong>
                    <span className="small">Je hebt deze tool gekocht. Schrijf een review om anderen te helpen.</span>
                  </div>
                  <button
                    className="button"
                    type="button"
                    onClick={() => setActiveReviewId(listing.id)}
                  >
                    <Star size={15} /> Schrijf review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
