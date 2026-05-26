"use client";

import Link from "next/link";
import {
  ArrowRight,
  Box,
  Calendar,
  Download,
  ExternalLink,
  Heart,
  LifeBuoy,
  Package,
  Receipt,
  Star
} from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useAccountData } from "@/lib/account-data";
import { formatPrice, productTypeLabels } from "@/lib/marketplace-data";
import { UpcomingAppointmentsWidget } from "@/components/upcoming-appointments-widget";
import { RecentlyViewedStrip } from "@/components/recently-viewed-strip";
import { OnboardingTour } from "@/components/onboarding-tour";
import { FollowedCreatorsFeed } from "@/components/followed-creators-feed";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function AccountOverviewPage() {
  const { activeUser } = useMarketplace();
  const { purchasedListings, myOrders, savedListings, openSupport, listingsToReview } = useAccountData();

  if (activeUser.role === "visitor") return null;

  const recentLibrary = purchasedListings.slice(0, 3);
  const recentOrders = [...myOrders]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 3);
  const recentSaved = savedListings.slice(0, 4);

  return (
    <>
      {listingsToReview.length > 0 ? (
        <section className="section-card" style={{ marginTop: 0, borderColor: "var(--orange-600)", background: "linear-gradient(180deg, var(--orange-100), var(--white))" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <span className="eyebrow"><Star size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Reviews wachten</span>
              <h2 style={{ marginTop: 4 }}>{listingsToReview.length} {listingsToReview.length === 1 ? "tool" : "tools"} verdient jouw review</h2>
              <p style={{ margin: "4px 0 0", color: "var(--green-700)" }}>Help andere kopers met je ervaring.</p>
            </div>
            <Link className="button" href="/account/reviews">
              <Star size={16} /> Schrijf reviews
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Package size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Bibliotheek</span>
            <h2>Recent ontgrendelde tools</h2>
          </div>
          <Link className="text-action" href="/account/bibliotheek">Bekijk alle <ArrowRight size={14} /></Link>
        </div>
        {recentLibrary.length ? recentLibrary.map((listing) => (
          <div className="library-row" key={listing.id}>
            <div className="library-row-icon"><Box size={26} /></div>
            <div className="library-row-body">
              <strong>{listing.title}</strong>
              <span className="small">
                {productTypeLabels[listing.type]} · {listing.files.length} {listing.files.length === 1 ? "bestand" : "bestanden"}
              </span>
            </div>
            <div className="library-row-actions">
              <Link className="button secondary" href={`/tools/${listing.slug}`}>
                <ExternalLink size={14} /> Open
              </Link>
              <button className="button" type="button">
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <Package size={28} style={{ color: "var(--green-500)" }} />
            <h2>Nog geen aankopen</h2>
            <p>Doorloop de test checkout om downloads te ontgrendelen.</p>
            <Link className="button" href="/catalogus" style={{ marginTop: 12 }}>Tools bekijken</Link>
          </div>
        )}
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Receipt size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Orders</span>
            <h2>Laatste bestellingen</h2>
          </div>
          <Link className="text-action" href="/account/orders">Bekijk alle <ArrowRight size={14} /></Link>
        </div>
        {recentOrders.length ? recentOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-head">
              <div>
                <strong>Bestelling #{order.id.slice(-8)}</strong>
                <span className="small">
                  <Calendar size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
                  {formatDate(order.createdAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </span>
              </div>
              <span className={`status-badge ${order.status}`}>
                {order.status === "paid" && "Betaald"}
                {order.status === "pending" && "In behandeling"}
                {order.status === "failed" && "Mislukt"}
                {order.status === "cancelled" && "Geannuleerd"}
              </span>
            </div>
            <div className="order-card-body">
              <span>{order.items.map((item) => item.title).join(", ")}</span>
              <strong>{formatPrice(order.totalCents)}</strong>
            </div>
          </div>
        )) : <p>Nog geen orders.</p>}
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Heart size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Bewaard</span>
            <h2>Voor later opgeslagen</h2>
          </div>
          <Link className="text-action" href="/account/bewaard">Bekijk alle <ArrowRight size={14} /></Link>
        </div>
        {recentSaved.length ? (
          <div className="library-row-list">
            {recentSaved.map((listing) => (
              <div className="library-row" key={listing.id}>
                <div className="library-row-icon"><Heart size={22} /></div>
                <div className="library-row-body">
                  <strong>{listing.title}</strong>
                  <span className="small">{productTypeLabels[listing.type]} · {formatPrice(listing.priceCents)}</span>
                </div>
                <Link className="button secondary" href={`/tools/${listing.slug}`}>
                  <ExternalLink size={14} /> Bekijk
                </Link>
              </div>
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

      <FollowedCreatorsFeed />

      <RecentlyViewedStrip />

      <UpcomingAppointmentsWidget perspective="buyer" />

      <OnboardingTour />

      {openSupport.length > 0 ? (
        <section className="section-card">
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow"><LifeBuoy size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Support</span>
              <h2>Open aanvragen</h2>
            </div>
            <Link className="text-action" href="/account/support">Bekijk alle <ArrowRight size={14} /></Link>
          </div>
          {openSupport.slice(0, 2).map((request) => {
            const listing = purchasedListings.find((item) => item.id === request.listingId);
            return (
              <div className="support-row" key={request.id}>
                <div>
                  <strong>{listing?.title ?? "Onbekende tool"}</strong>
                  <p>{request.message}</p>
                </div>
                <span className={`status-badge ${request.status}`}>
                  {request.status === "new" && "Nieuw"}
                  {request.status === "in_progress" && "In behandeling"}
                  {request.status === "waiting_for_buyer" && "Wacht op jou"}
                </span>
              </div>
            );
          })}
        </section>
      ) : null}
    </>
  );
}
