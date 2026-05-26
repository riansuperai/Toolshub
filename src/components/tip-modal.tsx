"use client";

import { useState } from "react";
import { Coffee, Heart, Sparkles, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";
import { formatPrice } from "@/lib/marketplace-data";

const PRESET_AMOUNTS = [500, 1000, 2500]; // €5, €10, €25

export function TipModal({
  sellerId,
  sellerName,
  onClose
}: {
  sellerId: string;
  sellerName: string;
  onClose: () => void;
}) {
  const { sendTip } = useMarketplace();
  const toast = useToast();
  const [amountCents, setAmountCents] = useState<number>(1000);
  const [custom, setCustom] = useState<string>("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const finalAmount = custom
    ? Math.round(parseFloat(custom.replace(",", ".") || "0") * 100)
    : amountCents;

  const valid = finalAmount >= 100; // min €1

  function send() {
    sendTip(sellerId, finalAmount, message.trim() || undefined);
    setDone(true);
    toast.success("Tip verstuurd!", `${formatPrice(finalAmount)} gaat naar ${sellerName}.`);
    setTimeout(onClose, 1800);
  }

  if (done) {
    return (
      <div className="changelog-backdrop" onClick={onClose}>
        <div className="tip-modal tip-done" onClick={(e) => e.stopPropagation()}>
          <div className="tip-done-icon"><Heart size={42} fill="currentColor" /></div>
          <h2>Dank je wel!</h2>
          <p><strong>{sellerName}</strong> wordt blij van je {formatPrice(finalAmount)} tip.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="changelog-backdrop" onClick={onClose}>
      <div className="tip-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-head">
          <div>
            <span className="eyebrow"><Coffee size={11} /> Bedank de creator</span>
            <h2>Tip {sellerName}</h2>
            <small>100% gaat direct naar de creator · geen platform-fee</small>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose} aria-label="Sluiten">
            <X size={14} />
          </button>
        </div>

        <div className="tip-body">
          <div className="tip-presets">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`tip-preset${amountCents === amt && !custom ? " active" : ""}`}
                onClick={() => { setAmountCents(amt); setCustom(""); }}
              >
                <strong>{formatPrice(amt)}</strong>
                <small>{amt === 500 ? "Een koffie" : amt === 1000 ? "Een lunch" : "Een avondje uit"}</small>
              </button>
            ))}
          </div>

          <label className="tip-custom">
            <span>Of een eigen bedrag</span>
            <div className="tip-custom-wrap">
              <span>€</span>
              <input
                type="text"
                inputMode="decimal"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </label>

          <label className="tip-message">
            <span>Berichtje (optioneel)</span>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Gave tool! Veel succes met v2."
              maxLength={140}
            />
          </label>

          <div className="tip-info">
            <Sparkles size={14} />
            <p>Tips zijn vrijwillig en gaan direct naar de creator. Geen abonnement, je betaalt eenmalig.</p>
          </div>
        </div>

        <div className="publish-version-foot">
          <button type="button" className="button secondary" onClick={onClose}>Niet nu</button>
          <button type="button" className="button" disabled={!valid} onClick={send}>
            <Heart size={14} fill="currentColor" /> Stuur {formatPrice(finalAmount)}
          </button>
        </div>
      </div>
    </div>
  );
}
