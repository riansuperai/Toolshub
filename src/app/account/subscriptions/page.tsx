"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Calendar, ExternalLink, Pause, Play, Repeat, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import { formatPrice } from "@/lib/marketplace-data";

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function cycleLabel(cycle: "one_time" | "monthly" | "yearly"): string {
  if (cycle === "monthly") return "Maandelijks";
  if (cycle === "yearly") return "Jaarlijks";
  return "Eenmalig";
}

export default function AccountSubscriptionsPage() {
  const { state, activeUser, cancelSubscription, pauseSubscription, resumeSubscription } = useMarketplace();
  const toast = useToast();

  const subs = useMemo(
    () => (state.subscriptions ?? [])
      .filter((s) => s.buyerId === activeUser.id)
      .sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt)),
    [state.subscriptions, activeUser.id]
  );

  if (activeUser.role === "visitor") return null;

  const active = subs.filter((s) => s.status === "active" || s.status === "trialing");
  const inactive = subs.filter((s) => s.status === "cancelled" || s.status === "paused");
  const totalMonthly = active.reduce((sum, s) => {
    const listing = state.listings.find((l) => l.id === s.listingId);
    const plan = listing?.plans?.find((p) => p.id === s.planId);
    if (!plan) return sum;
    return sum + (plan.cycle === "yearly" ? plan.priceCents / 12 : plan.priceCents);
  }, 0);

  return (
    <>
      {active.length > 0 ? (
        <section className="section-card" style={{ marginTop: 0 }}>
          <div className="subs-summary">
            <div>
              <span className="eyebrow">Maandelijkse uitgaven</span>
              <strong>{formatPrice(Math.round(totalMonthly))}/maand</strong>
              <small>{active.length} actief{active.length === 1 ? "" : "e"} abonnement{active.length === 1 ? "" : "en"}</small>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-card" style={{ marginTop: 18 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Repeat size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Abonnementen</span>
            <h2>Actieve abonnementen ({active.length})</h2>
          </div>
        </div>

        {active.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="Nog geen abonnementen"
            description="Sommige tools bieden een maand- of jaarabonnement met doorlopende updates. Bekijk de catalogus voor tools met flexibele pricing."
            action={<Link className="button" href="/catalogus">Bekijk catalogus</Link>}
          />
        ) : active.map((sub) => {
          const listing = state.listings.find((l) => l.id === sub.listingId);
          const plan = listing?.plans?.find((p) => p.id === sub.planId);
          const seller = state.sellers.find((s) => s.id === listing?.sellerId);
          if (!listing || !plan) return null;
          return (
            <div className="subscription-row" key={sub.id}>
              <div className="subscription-info">
                <strong>{listing.title}</strong>
                <small>
                  {seller?.name} · <strong>{plan.name}</strong> · {formatPrice(plan.priceCents)}/{plan.cycle === "yearly" ? "jaar" : "maand"}
                </small>
                <div className="subscription-meta">
                  <span className={`status-badge ${sub.status === "trialing" ? "pending" : "paid"}`}>
                    {sub.status === "trialing" ? "Trial actief" : "Actief"}
                  </span>
                  {sub.status === "trialing" && sub.trialEndsAt ? (
                    <small><Calendar size={11} /> Trial eindigt {formatDate(sub.trialEndsAt)}</small>
                  ) : sub.nextBillingAt ? (
                    <small><Calendar size={11} /> Volgende afschrijving: {formatDate(sub.nextBillingAt)}</small>
                  ) : null}
                </div>
              </div>
              <div className="subscription-actions">
                <Link className="button secondary" href={`/tools/${listing.slug}`}>
                  <ExternalLink size={13} /> Open
                </Link>
                {sub.status === "active" ? (
                  <button type="button" className="button secondary" onClick={() => { pauseSubscription(sub.id); toast.info("Abonnement gepauzeerd"); }}>
                    <Pause size={13} /> Pauzeer
                  </button>
                ) : null}
                <button type="button" className="button secondary" onClick={() => {
                  if (confirm(`Weet je zeker dat je '${listing.title}' wil opzeggen?`)) {
                    cancelSubscription(sub.id);
                    toast.info("Abonnement opgezegd", "Je hebt toegang tot het einde van de huidige periode.");
                  }
                }}>
                  <X size={13} /> Opzeggen
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {inactive.length > 0 ? (
        <section className="section-card" style={{ marginTop: 18 }}>
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow">Historie</span>
              <h2>Opgezegd of gepauzeerd ({inactive.length})</h2>
            </div>
          </div>
          {inactive.map((sub) => {
            const listing = state.listings.find((l) => l.id === sub.listingId);
            const plan = listing?.plans?.find((p) => p.id === sub.planId);
            if (!listing || !plan) return null;
            return (
              <div className="subscription-row" key={sub.id} style={{ opacity: 0.65 }}>
                <div className="subscription-info">
                  <strong>{listing.title}</strong>
                  <small>{plan.name} · Opgezegd op {formatDate(sub.cancelledAt)}</small>
                </div>
                <div className="subscription-actions">
                  {sub.status === "paused" ? (
                    <button type="button" className="button secondary" onClick={() => { resumeSubscription(sub.id); toast.success("Abonnement hervat"); }}>
                      <Play size={13} /> Hervat
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </section>
      ) : null}
    </>
  );
}
