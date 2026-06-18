"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Copy } from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

type BtwTarief = 0 | 9 | 21;
type Direction = "exclToIncl" | "inclToExcl";

const TARIEVEN: { value: BtwTarief; label: string; hint: string }[] = [
  { value: 21, label: "21%", hint: "Standaard tarief" },
  { value: 9, label: "9%", hint: "Verlaagd: o.a. voedsel, boeken, kappers" },
  { value: 0, label: "0%", hint: "Vrijgesteld / export buiten EU" }
];

function formatEur(value: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

export function BtwCalculatorClient() {
  const [direction, setDirection] = useState<Direction>("exclToIncl");
  const [bedrag, setBedrag] = useState<number>(100);
  const [tarief, setTarief] = useState<BtwTarief>(21);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const result = useMemo(() => {
    const safeBedrag = Number.isFinite(bedrag) && bedrag >= 0 ? bedrag : 0;
    if (direction === "exclToIncl") {
      const excl = safeBedrag;
      const btw = +(excl * (tarief / 100)).toFixed(2);
      const incl = +(excl + btw).toFixed(2);
      return { excl, btw, incl };
    } else {
      const incl = safeBedrag;
      const excl = +(incl / (1 + tarief / 100)).toFixed(2);
      const btw = +(incl - excl).toFixed(2);
      return { excl, btw, incl };
    }
  }, [bedrag, tarief, direction]);

  function copyValue(key: string, value: number) {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(
      value
        .toFixed(2)
        .replace(".", ",")
    );
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  function swapDirection() {
    // Swap zo dat de "huidige uitkomst" de nieuwe invoer wordt
    if (direction === "exclToIncl") {
      setBedrag(result.incl);
      setDirection("inclToExcl");
    } else {
      setBedrag(result.excl);
      setDirection("exclToIncl");
    }
  }

  return (
    <MiniToolPage
      slug="btw-calculator"
      privacyNote="Berekening draait in je browser. Geen tracking, geen account."
      howItWorks={[
        "Kies of je het bedrag exclusief of inclusief BTW invult — klik op de pijltjes om te wisselen.",
        "Selecteer het BTW-tarief (21% standaard, 9% verlaagd, 0% vrijgesteld/export).",
        "Lees direct het BTW-bedrag en de andere prijs af. Kopieer met één klik."
      ]}
      crossSell={{
        heading: "Boekhouding eronder automatiseren?",
        body:
          "Hazenco koppelt jouw verkopen aan e-Boekhouden, Snelstart of Moneybird — facturen, BTW-aangifte en relatiebeheer in één.",
        cta: "Plan een gesprek",
        href: "https://hazenco.nl/contact/"
      }}
    >
      <div className="btw-tool">
        {/* Toggle: excl ↔ incl */}
        <div className="btw-direction-toggle">
          <button
            type="button"
            className={direction === "exclToIncl" ? "active" : ""}
            onClick={() => setDirection("exclToIncl")}
          >
            Excl. → Incl. BTW
          </button>
          <button
            type="button"
            className="btw-swap"
            onClick={swapDirection}
            title="Wissel richting (waarden blijven kloppen)"
            aria-label="Wissel richting"
          >
            <ArrowLeftRight size={16} />
          </button>
          <button
            type="button"
            className={direction === "inclToExcl" ? "active" : ""}
            onClick={() => setDirection("inclToExcl")}
          >
            Incl. → Excl. BTW
          </button>
        </div>

        {/* Input */}
        <label className="btw-input-label">
          <span>
            Bedrag {direction === "exclToIncl" ? "exclusief" : "inclusief"} BTW
          </span>
          <div className="btw-input-row">
            <span className="btw-input-currency">€</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={bedrag}
              onChange={(e) => setBedrag(Number(e.target.value))}
              placeholder="0,00"
            />
          </div>
        </label>

        {/* Tarief selector */}
        <div className="btw-tarief-group">
          <span className="btw-tarief-label">BTW-tarief</span>
          <div className="btw-tarief-buttons">
            {TARIEVEN.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`btw-tarief-btn${tarief === t.value ? " active" : ""}`}
                onClick={() => setTarief(t.value)}
              >
                <strong>{t.label}</strong>
                <span>{t.hint}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resultaat */}
        <div className="btw-result">
          <ResultRow
            label="Exclusief BTW"
            value={result.excl}
            keyId="excl"
            copiedKey={copiedKey}
            onCopy={copyValue}
            muted
          />
          <ResultRow
            label={`BTW (${tarief}%)`}
            value={result.btw}
            keyId="btw"
            copiedKey={copiedKey}
            onCopy={copyValue}
            accent
          />
          <ResultRow
            label="Inclusief BTW"
            value={result.incl}
            keyId="incl"
            copiedKey={copiedKey}
            onCopy={copyValue}
            highlight
          />
        </div>
      </div>
    </MiniToolPage>
  );
}

function ResultRow({
  label,
  value,
  keyId,
  copiedKey,
  onCopy,
  muted,
  accent,
  highlight
}: {
  label: string;
  value: number;
  keyId: string;
  copiedKey: string | null;
  onCopy: (key: string, value: number) => void;
  muted?: boolean;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`btw-result-row${muted ? " muted" : ""}${accent ? " accent" : ""}${
        highlight ? " highlight" : ""
      }`}
    >
      <span className="btw-result-label">{label}</span>
      <div className="btw-result-value-wrap">
        <span className="btw-result-value">{formatEur(value)}</span>
        <button
          type="button"
          className="btw-result-copy"
          onClick={() => onCopy(keyId, value)}
          title="Kopieer waarde"
          aria-label="Kopieer waarde"
        >
          <Copy size={14} />
          {copiedKey === keyId ? <span>Gekopieerd ✓</span> : null}
        </button>
      </div>
    </div>
  );
}
