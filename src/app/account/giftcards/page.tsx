"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Gift, Mail, Sparkles } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import { formatPrice } from "@/lib/marketplace-data";

const PRESETS = [2500, 5000, 10000, 25000];

function formatDate(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
}

export default function AccountGiftCardsPage() {
  const { state, activeUser, purchaseGiftCard, redeemGiftCard } = useMarketplace();
  const toast = useToast();

  // Buy state
  const [amount, setAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");

  // Redeem state
  const [redeemCode, setRedeemCode] = useState("");
  const [creditBalance, setCreditBalance] = useState(0);

  if (activeUser.role === "visitor") return null;

  const myPurchased = useMemo(
    () => (state.giftCards ?? []).filter((c) => c.purchasedBy === activeUser.id)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [state.giftCards, activeUser.id]
  );

  const finalAmount = customAmount
    ? Math.round(parseFloat(customAmount.replace(",", ".") || "0") * 100)
    : amount;

  function buy() {
    if (finalAmount < 1000 || finalAmount > 50000) {
      toast.error("Bedrag ongeldig", "Kies tussen €10 en €500.");
      return;
    }
    const card = purchaseGiftCard({
      amountCents: finalAmount,
      recipientEmail: recipientEmail.trim() || undefined,
      recipientName: recipientName.trim() || undefined,
      message: message.trim() || undefined
    });
    if (card) {
      toast.success("Cadeaubon aangemaakt!", `Code: ${card.code}`);
      setCustomAmount("");
      setRecipientName("");
      setRecipientEmail("");
      setMessage("");
    }
  }

  function redeem() {
    const result = redeemGiftCard(redeemCode);
    if (result.ok) {
      setCreditBalance((c) => c + (result.amountCents ?? 0));
      toast.success("Cadeaubon verzilverd!", `€${(result.amountCents! / 100).toFixed(2)} toegevoegd aan je tegoed.`);
      setRedeemCode("");
    } else {
      toast.error("Niet gelukt", result.error ?? "Probeer opnieuw.");
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success("Code gekopieerd");
  }

  return (
    <>
      {/* Hero */}
      <section className="giftcard-hero">
        <div>
          <span className="eyebrow"><Gift size={11} /> Cadeaubonnen</span>
          <h1>Geef Hazenco cadeau</h1>
          <p>Perfect cadeau voor mede-ondernemers, je team of jezelf. Vrij te besteden in de hele catalogus.</p>
        </div>
        {creditBalance > 0 ? (
          <div className="giftcard-balance">
            <small>Je tegoed</small>
            <strong>{formatPrice(creditBalance)}</strong>
          </div>
        ) : null}
      </section>

      <div className="widget-grid split-1-1" style={{ marginTop: 24 }}>
        {/* Buy */}
        <section className="section-card" style={{ marginTop: 0 }}>
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow"><Sparkles size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Koop een bon</span>
              <h2>Stuur een cadeaubon</h2>
            </div>
          </div>

          <div className="giftcard-presets">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={`giftcard-preset${amount === p && !customAmount ? " active" : ""}`}
                onClick={() => { setAmount(p); setCustomAmount(""); }}
              >
                {formatPrice(p)}
              </button>
            ))}
          </div>

          <label className="publish-version-field" style={{ marginTop: 14 }}>
            <span>Of eigen bedrag (€10 – €500)</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </label>

          <div className="onboarding-grid-2" style={{ marginTop: 14 }}>
            <label className="publish-version-field">
              <span>Naam ontvanger</span>
              <input type="text" placeholder="Jan Jansen" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
            </label>
            <label className="publish-version-field">
              <span>E-mail ontvanger</span>
              <input type="email" placeholder="jan@bedrijf.nl" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
            </label>
          </div>

          <label className="publish-version-field" style={{ marginTop: 14 }}>
            <span>Persoonlijk bericht</span>
            <textarea rows={2} placeholder="Veel plezier met je nieuwe tools!" value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>

          <button type="button" className="button" onClick={buy} style={{ marginTop: 14, width: "100%" }}>
            <Gift size={14} /> Koop bon van {formatPrice(finalAmount)}
          </button>
        </section>

        {/* Redeem */}
        <section className="section-card" style={{ marginTop: 0 }}>
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow"><Check size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Verzilveren</span>
              <h2>Heb je een code?</h2>
            </div>
          </div>
          <p style={{ color: "var(--green-700)", fontSize: 14, marginTop: 0 }}>
            Voer je 12-cijferige cadeaucode in. Het bedrag wordt direct aan je Hazenco-tegoed toegevoegd.
          </p>
          <label className="publish-version-field">
            <span>Cadeaucode</span>
            <input
              type="text"
              placeholder="HZN-XXXX-XXXX"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              style={{ fontFamily: "ui-monospace, monospace", letterSpacing: "0.05em" }}
            />
          </label>
          <button type="button" className="button" onClick={redeem} disabled={redeemCode.length < 8} style={{ marginTop: 12, width: "100%" }}>
            <Check size={14} /> Verzilver code
          </button>
        </section>
      </div>

      {/* My purchased gift cards */}
      <section className="section-card" style={{ marginTop: 18 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Mail size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Verstuurd</span>
            <h2>Door jou gekochte bonnen ({myPurchased.length})</h2>
          </div>
        </div>
        {myPurchased.length === 0 ? (
          <EmptyState icon={Gift} title="Nog geen bonnen gekocht" description="Koop hierboven een eerste cadeaubon — kun je direct delen." />
        ) : (
          <div className="giftcard-list">
            {myPurchased.map((card) => (
              <div className={`giftcard-item status-${card.status}`} key={card.id}>
                <div className="giftcard-code">
                  <strong>{card.code}</strong>
                  <button type="button" onClick={() => copyCode(card.code)} title="Kopieer code">
                    <Copy size={12} />
                  </button>
                </div>
                <div className="giftcard-meta">
                  <strong>{formatPrice(card.amountCents)}</strong>
                  <small>
                    {card.recipientName ? `Voor ${card.recipientName}` : "Geen ontvanger"} · {formatDate(card.createdAt)}
                  </small>
                </div>
                <span className={`status-badge ${card.status === "redeemed" ? "paid" : "new"}`}>
                  {card.status === "redeemed" ? `Verzilverd ${formatDate(card.redeemedAt)}` : "Actief"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
