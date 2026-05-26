"use client";

import { useState } from "react";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";
import { formatPrice } from "@/lib/marketplace-data";
import type { Listing, PricingPlan } from "@/lib/types";

function cyclesLabel(cycle: PricingPlan["cycle"]): string {
  if (cycle === "monthly") return "/maand";
  if (cycle === "yearly") return "/jaar";
  return "eenmalig";
}

function planIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("enterprise") || lower.includes("ultimate")) return Crown;
  if (lower.includes("pro") || lower.includes("plus")) return Zap;
  return Sparkles;
}

export function PricingPlans({ listing }: { listing: Listing }) {
  const { activeUser, addToCart, startSubscription } = useMarketplace();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const plans = listing.plans ?? [];
  if (plans.length === 0) return null;

  function handleSelect(plan: PricingPlan, withTrial: boolean) {
    if (activeUser.role === "visitor") {
      toast.info("Log in om door te gaan");
      return;
    }
    setBusy(plan.id);
    if (plan.cycle === "one_time") {
      addToCart(listing.id);
      toast.success("Toegevoegd aan winkelwagen");
    } else {
      const subId = startSubscription(listing.id, plan.id, withTrial);
      if (subId) {
        toast.success(
          withTrial ? `Trial gestart` : `Abonnement actief`,
          withTrial ? `Je hebt ${plan.trialDays} dagen gratis toegang.` : `${plan.name} · ${formatPrice(plan.priceCents)}${cyclesLabel(plan.cycle)}`
        );
      }
    }
    setTimeout(() => setBusy(null), 800);
  }

  return (
    <section className="pricing-plans-section">
      <div className="pricing-plans-head">
        <span className="eyebrow">Pricing</span>
        <h2>Kies je plan</h2>
        <p>Alle plannen bevatten directe download, updates en support.</p>
      </div>
      <div className="pricing-plans-grid">
        {plans.map((plan) => {
          const Icon = planIcon(plan.name);
          const isLoading = busy === plan.id;
          return (
            <div className={`pricing-plan${plan.highlight ? " highlight" : ""}`} key={plan.id}>
              {plan.highlight ? <span className="pricing-plan-tag">Meest populair</span> : null}
              <div className="pricing-plan-head">
                <span className="pricing-plan-icon"><Icon size={20} /></span>
                <strong>{plan.name}</strong>
                {plan.tagline ? <small>{plan.tagline}</small> : null}
              </div>
              <div className="pricing-plan-price">
                <strong>{formatPrice(plan.priceCents)}</strong>
                <small>{cyclesLabel(plan.cycle)}</small>
              </div>
              <ul className="pricing-plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}><Check size={13} /> {f}</li>
                ))}
              </ul>
              <div className="pricing-plan-actions">
                <button
                  type="button"
                  className={`button${plan.highlight ? "" : " secondary"}`}
                  onClick={() => handleSelect(plan, false)}
                  disabled={isLoading}
                >
                  {plan.cycle === "one_time" ? "In winkelwagen" : "Start abonnement"}
                </button>
                {plan.trialDays && plan.cycle !== "one_time" ? (
                  <button
                    type="button"
                    className="pricing-plan-trial"
                    onClick={() => handleSelect(plan, true)}
                    disabled={isLoading}
                  >
                    of start {plan.trialDays} dagen gratis trial →
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
