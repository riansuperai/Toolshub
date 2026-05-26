"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  XCircle
} from "lucide-react";
import { Shell } from "@/components/shell";
import { formatPrice } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";
import { validateCoupon, type Coupon } from "@/lib/coupons";
import { Check, Tag, X } from "lucide-react";

type PaymentId = "test" | "ideal" | "card";

const paymentMethods: { id: PaymentId; label: string; small: string; badge?: string }[] = [
  { id: "test", label: "Hazenco Test Pay", small: "Veilige sandbox checkout, geen echte afschrijving", badge: "Aanbevolen" },
  { id: "ideal", label: "iDEAL", small: "Snelle betaling via je bank" },
  { id: "card", label: "Creditcard", small: "Visa of Mastercard, internationaal" }
];

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutFallback() {
  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Afrekenen</span>
        <h1>Checkout laden.</h1>
      </div>
    </Shell>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, resolveTestPayment } = useMarketplace();
  const toast = useToast();
  const orderId = searchParams.get("orderId");
  const order = state.orders.find((item) => item.id === orderId);
  const [selectedMethod, setSelectedMethod] = useState<PaymentId>("test");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountCents, setDiscountCents] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  function applyCoupon() {
    if (!order) return;
    const result = validateCoupon(couponInput, order.totalCents);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
      setDiscountCents(result.discountCents);
      setCouponError(null);
      toast.success("Code toegepast!", `Je krijgt ${formatPrice(result.discountCents)} korting.`);
      setCouponInput("");
    } else {
      setCouponError(result.error);
      toast.error("Code niet geldig", result.error);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setDiscountCents(0);
    setCouponError(null);
  }

  if (!order) {
    return (
      <Shell>
        <div className="page">
          <div className="empty-state">
            <h1>Bestelling niet gevonden</h1>
            <p>Maak eerst een bestelling aan via de winkelwagen.</p>
            <Link className="button" href="/winkelwagen">Terug naar winkelwagen</Link>
          </div>
        </div>
      </Shell>
    );
  }

  function finish(status: "paid" | "failed" | "cancelled") {
    resolveTestPayment(order!.id, status);
    if (status === "paid") {
      setTimeout(() => router.push("/account"), 800);
    }
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const setupTotal = order.items.reduce((sum, item) => sum + (item.serviceAddOn ? item.serviceAddOnPriceCents : 0), 0);
  const subtotal = order.totalCents - setupTotal;
  const isPending = order.status === "pending";
  const totalAfterDiscount = Math.max(0, order.totalCents - discountCents);

  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Afrekenen</span>
        <h1>Veilig afronden van je bestelling</h1>
        <p className="lead">Bestelling <strong>#{order.id.slice(-8)}</strong> · {itemCount} {itemCount === 1 ? "tool" : "tools"}. Test-betaling, geen echte afschrijving.</p>

        <div className="detail-layout" style={{ marginTop: 14 }}>
          <div className="stack">
            <section className="section-card">
              <h2>Bestelling</h2>
              {order.items.map((item) => (
                <div className="cart-item" key={item.listingId}>
                  <div className="cart-item-visual">
                    <ShoppingBag size={28} />
                  </div>
                  <div className="cart-item-body">
                    <strong>{item.title}</strong>
                    <span className="small">{item.quantity} × {formatPrice(item.priceCents)}</span>
                    {item.serviceAddOn ? (
                      <span className="cart-item-addon checked" style={{ cursor: "default" }}>
                        <Wrench size={13} /> Setup-service inclusief
                      </span>
                    ) : null}
                  </div>
                  <div className="cart-item-aside">
                    <span className="line-total">{formatPrice(item.quantity * item.priceCents + item.serviceAddOnPriceCents)}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="section-card">
              <h2>Betaalmethode</h2>
              <p>Kies een methode om de checkout-flow te testen.</p>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`payment-method${selectedMethod === method.id ? " selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    disabled={!isPending}
                  />
                  <div>
                    <strong>
                      {method.id === "test" ? <ShieldCheck size={14} style={{ verticalAlign: -2, marginRight: 5, color: "var(--orange-600)" }} /> : null}
                      {method.id === "ideal" ? <Landmark size={14} style={{ verticalAlign: -2, marginRight: 5 }} /> : null}
                      {method.id === "card" ? <CreditCard size={14} style={{ verticalAlign: -2, marginRight: 5 }} /> : null}
                      {method.label}
                    </strong>
                    <span className="small">{method.small}</span>
                  </div>
                  {method.badge ? <span className="badge">{method.badge}</span> : null}
                </label>
              ))}
            </section>

            {!isPending ? (
              <div className={`checkout-status ${order.status}`}>
                {order.status === "paid" ? <CheckCircle2 size={22} /> : null}
                {order.status === "failed" ? <AlertTriangle size={22} /> : null}
                {order.status === "cancelled" ? <XCircle size={22} /> : null}
                <div>
                  <strong style={{ display: "block", fontSize: 15 }}>
                    {order.status === "paid" && "Betaling geslaagd"}
                    {order.status === "failed" && "Betaling mislukt"}
                    {order.status === "cancelled" && "Betaling geannuleerd"}
                  </strong>
                  <span style={{ fontSize: 13 }}>
                    {order.status === "paid" && "Je gaat zo door naar Mijn tools."}
                    {order.status === "failed" && "Probeer een andere methode of begin opnieuw."}
                    {order.status === "cancelled" && "Geen probleem, je winkelwagen staat klaar."}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="summary-card">
            <h2>Samenvatting</h2>
            <div className="summary-row">
              <span>{itemCount} {itemCount === 1 ? "tool" : "tools"}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {setupTotal > 0 ? (
              <div className="summary-row">
                <span>Setup-service</span>
                <span>{formatPrice(setupTotal)}</span>
              </div>
            ) : null}
            {/* Coupon */}
            {appliedCoupon ? (
              <div className="checkout-coupon-applied">
                <div>
                  <strong><Check size={13} /> {appliedCoupon.code}</strong>
                  <small>{appliedCoupon.description}</small>
                </div>
                <button type="button" onClick={removeCoupon} aria-label="Code verwijderen">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div className="checkout-coupon-input">
                <Tag size={14} />
                <input
                  type="text"
                  placeholder="Kortingscode"
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } }}
                />
                <button type="button" onClick={applyCoupon} disabled={!couponInput.trim()}>Toepassen</button>
              </div>
            )}
            {couponError ? <small className="checkout-coupon-error">{couponError}</small> : null}

            {discountCents > 0 ? (
              <div className="summary-row" style={{ color: "var(--orange-700)" }}>
                <span>Korting</span>
                <span>−{formatPrice(discountCents)}</span>
              </div>
            ) : null}
            <div className="summary-row">
              <span>BTW (21%)</span>
              <span>inbegrepen</span>
            </div>
            <div className="summary-row total">
              <span>Totaal</span>
              <strong>{formatPrice(totalAfterDiscount)}</strong>
            </div>

            <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
              <button
                className="button"
                type="button"
                disabled={!isPending}
                onClick={() => finish("paid")}
                style={{ width: "100%", minHeight: 46 }}
              >
                <Lock size={16} /> Veilig afrekenen {formatPrice(totalAfterDiscount)}
              </button>
              {isPending ? (
                <>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => finish("failed")}
                    style={{ width: "100%" }}
                  >
                    <AlertTriangle size={15} /> Test: betaling mislukt
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => finish("cancelled")}
                    style={{ width: "100%", color: "#b91c1c" }}
                  >
                    <XCircle size={15} /> Annuleren
                  </button>
                </>
              ) : (
                <Link className="button secondary" href="/account" style={{ width: "100%" }}>
                  Bekijk mijn tools <ArrowRight size={15} />
                </Link>
              )}
            </div>

            <ul className="trust-list">
              <li><CheckCircle2 size={16} /> SSL-versleuteld checkoutproces</li>
              <li><CheckCircle2 size={16} /> Directe download na succesvolle betaling</li>
              <li><CheckCircle2 size={16} /> Bewaar je factuur via Mijn tools</li>
            </ul>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
