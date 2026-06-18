"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Info } from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

/**
 * Nederlandse loonbelasting tarieven 2025 — indicatief.
 * Bij jaarwissel: pas hier de getallen aan voor 2026.
 * Bron: Belastingdienst.nl jaartarief box 1 + heffingskortingen.
 */
const TARIEVEN_2025 = {
  jaar: 2025,
  // Schijven box 1 — gecombineerd tarief (loonbelasting + premie volksverzekeringen)
  schijfGrenzen: {
    schijf1: 38_441,
    schijf2: 76_817
  },
  // Onder AOW-leeftijd
  tarievenJong: {
    schijf1: 0.3582,
    schijf2: 0.3748,
    schijf3: 0.495
  },
  // Boven AOW-leeftijd: geen AOW-premie meer
  tarievenAOW: {
    schijf1: 0.1792,
    schijf2: 0.3748,
    schijf3: 0.495
  },
  algemeneHeffingskorting: {
    max: 3362,
    afbouwStart: 28_406,
    afbouwEind: 74_413,
    afbouwTempo: 0.06337
  },
  arbeidskorting: {
    // 2025 — getrapt opbouwend, daarna afgebouwd. Approximatie binnen ~€20 nauwkeurig.
    opbouw1Tot: 12_169,
    opbouw1Tarief: 0.08425,
    opbouw2Tot: 26_288,
    opbouw2Tarief: 0.31433,
    opbouw3Tot: 43_071,
    opbouw3Tarief: 0.02471,
    max: 5599,
    afbouwTempo: 0.0651,
    afbouwEind: 129_078
  }
};

function calcBelasting(jaarBruto: number, aow: boolean): number {
  if (jaarBruto <= 0) return 0;
  const T = TARIEVEN_2025;
  const tarieven = aow ? T.tarievenAOW : T.tarievenJong;
  const s1 = T.schijfGrenzen.schijf1;
  const s2 = T.schijfGrenzen.schijf2;

  let belasting = 0;
  const inSchijf1 = Math.min(jaarBruto, s1);
  belasting += inSchijf1 * tarieven.schijf1;

  if (jaarBruto > s1) {
    const inSchijf2 = Math.min(jaarBruto - s1, s2 - s1);
    belasting += inSchijf2 * tarieven.schijf2;
  }
  if (jaarBruto > s2) {
    const inSchijf3 = jaarBruto - s2;
    belasting += inSchijf3 * tarieven.schijf3;
  }
  return belasting;
}

function calcAlgemeneHeffingskorting(jaarBruto: number): number {
  const HK = TARIEVEN_2025.algemeneHeffingskorting;
  if (jaarBruto <= 0) return HK.max;
  if (jaarBruto <= HK.afbouwStart) return HK.max;
  if (jaarBruto >= HK.afbouwEind) return 0;
  return Math.max(0, HK.max - (jaarBruto - HK.afbouwStart) * HK.afbouwTempo);
}

function calcArbeidskorting(jaarBruto: number): number {
  const A = TARIEVEN_2025.arbeidskorting;
  if (jaarBruto <= 0) return 0;
  let korting = 0;
  if (jaarBruto <= A.opbouw1Tot) {
    korting = jaarBruto * A.opbouw1Tarief;
  } else if (jaarBruto <= A.opbouw2Tot) {
    korting = A.opbouw1Tot * A.opbouw1Tarief + (jaarBruto - A.opbouw1Tot) * A.opbouw2Tarief;
  } else if (jaarBruto <= A.opbouw3Tot) {
    korting =
      A.opbouw1Tot * A.opbouw1Tarief +
      (A.opbouw2Tot - A.opbouw1Tot) * A.opbouw2Tarief +
      (jaarBruto - A.opbouw2Tot) * A.opbouw3Tarief;
  } else if (jaarBruto <= A.afbouwEind) {
    korting = A.max - (jaarBruto - A.opbouw3Tot) * A.afbouwTempo;
  } else {
    korting = 0;
  }
  return Math.max(0, Math.min(korting, A.max));
}

type Periode = "maand" | "jaar";
type Direction = "brutoToNetto" | "nettoToBruto";

function formatEur(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

type Result = {
  jaarBruto: number;
  jaarBelasting: number;
  jaarNetto: number;
  algemeneHK: number;
  arbeidsK: number;
};

function brutoNaarNetto(
  jaarBruto: number,
  aow: boolean,
  loonheffingskorting: boolean
): Result {
  const belasting = calcBelasting(jaarBruto, aow);
  const algemeneHK = loonheffingskorting ? calcAlgemeneHeffingskorting(jaarBruto) : 0;
  const arbeidsK = loonheffingskorting ? calcArbeidskorting(jaarBruto) : 0;
  const teBetalen = Math.max(0, belasting - algemeneHK - arbeidsK);
  return {
    jaarBruto,
    jaarBelasting: teBetalen,
    jaarNetto: jaarBruto - teBetalen,
    algemeneHK,
    arbeidsK
  };
}

/**
 * Iteratief omkeerwerk: zoek bruto-bedrag dat een gegeven netto oplevert.
 * Binair zoeken werkt prima omdat netto monotoon stijgt met bruto.
 */
function nettoNaarBruto(
  doelNetto: number,
  aow: boolean,
  loonheffingskorting: boolean
): Result {
  if (doelNetto <= 0) {
    return { jaarBruto: 0, jaarBelasting: 0, jaarNetto: 0, algemeneHK: 0, arbeidsK: 0 };
  }
  let lo = doelNetto;
  let hi = doelNetto * 2.5; // ruim genoeg voor 50% top-tarief
  // Stel hi voldoende hoog
  for (let i = 0; i < 30 && brutoNaarNetto(hi, aow, loonheffingskorting).jaarNetto < doelNetto; i++) {
    hi *= 1.5;
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const r = brutoNaarNetto(mid, aow, loonheffingskorting).jaarNetto;
    if (Math.abs(r - doelNetto) < 0.5) return brutoNaarNetto(mid, aow, loonheffingskorting);
    if (r < doelNetto) lo = mid;
    else hi = mid;
  }
  return brutoNaarNetto((lo + hi) / 2, aow, loonheffingskorting);
}

export function BrutoNettoClient() {
  const [direction, setDirection] = useState<Direction>("brutoToNetto");
  const [periode, setPeriode] = useState<Periode>("maand");
  const [bedrag, setBedrag] = useState<number>(3000);
  const [aow, setAow] = useState(false);
  const [loonheffingskorting, setLhk] = useState(true);

  const result = useMemo<Result>(() => {
    const safe = Number.isFinite(bedrag) && bedrag >= 0 ? bedrag : 0;
    const jaar = periode === "jaar" ? safe : safe * 12;
    if (direction === "brutoToNetto") {
      return brutoNaarNetto(jaar, aow, loonheffingskorting);
    } else {
      return nettoNaarBruto(jaar, aow, loonheffingskorting);
    }
  }, [bedrag, periode, direction, aow, loonheffingskorting]);

  function swapDirection() {
    // Smart-swap: vorige resultaat wordt nieuwe invoer
    if (direction === "brutoToNetto") {
      const newBedrag = periode === "jaar" ? result.jaarNetto : result.jaarNetto / 12;
      setBedrag(Math.round(newBedrag));
      setDirection("nettoToBruto");
    } else {
      const newBedrag = periode === "jaar" ? result.jaarBruto : result.jaarBruto / 12;
      setBedrag(Math.round(newBedrag));
      setDirection("brutoToNetto");
    }
  }

  return (
    <MiniToolPage
      slug="bruto-netto"
      privacyNote="Berekening draait in je browser, niks wordt opgeslagen. Indicatief op basis van 2025-tarieven."
      howItWorks={[
        "Vul je bruto bedrag in (per maand of per jaar) en kies de richting — bruto → netto of andersom.",
        "Zet AOW-leeftijd aan als je AOW ontvangt (lager tarief schijf 1) en loonheffingskorting uit als je die niet toepast.",
        "Je netto loon wordt direct getoond, met daaronder de loonbelasting en heffingskortingen die we hebben afgetrokken."
      ]}
      crossSell={{
        heading: "Loonadministratie volledig laten regelen?",
        body:
          "Hazenco automatiseert je salarisadministratie — loonstroken, aangiftes en koppeling met je boekhouding in één pakket.",
        cta: "Plan een gesprek",
        href: "/tools/website-laten-maken"
      }}
    >
      <div className="brutonetto-tool">
        {/* Direction toggle */}
        <div className="btw-direction-toggle">
          <button
            type="button"
            className={direction === "brutoToNetto" ? "active" : ""}
            onClick={() => setDirection("brutoToNetto")}
          >
            Bruto → Netto
          </button>
          <button
            type="button"
            className="btw-swap"
            onClick={swapDirection}
            title="Wissel richting"
            aria-label="Wissel richting"
          >
            <ArrowLeftRight size={16} />
          </button>
          <button
            type="button"
            className={direction === "nettoToBruto" ? "active" : ""}
            onClick={() => setDirection("nettoToBruto")}
          >
            Netto → Bruto
          </button>
        </div>

        {/* Bedrag input */}
        <label className="btw-input-label">
          <span>
            {direction === "brutoToNetto" ? "Bruto bedrag" : "Gewenst netto bedrag"} (
            {periode === "maand" ? "per maand" : "per jaar"})
          </span>
          <div className="btw-input-row">
            <span className="btw-input-currency">€</span>
            <input
              type="number"
              min={0}
              step={50}
              value={bedrag}
              onChange={(e) => setBedrag(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </label>

        {/* Periode + toggles */}
        <div className="brutonetto-options">
          <div className="brutonetto-option-group">
            <span className="brutonetto-option-label">Periode</span>
            <div className="btw-tarief-buttons">
              {(["maand", "jaar"] as Periode[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`btw-tarief-btn${periode === p ? " active" : ""}`}
                  onClick={() => setPeriode(p)}
                >
                  <strong>{p === "maand" ? "Per maand" : "Per jaar"}</strong>
                  <span>
                    {p === "maand"
                      ? "Maandsalaris (×12 voor jaar)"
                      : "Jaarsalaris direct"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="brutonetto-toggles">
            <label className="brutonetto-toggle">
              <input
                type="checkbox"
                checked={loonheffingskorting}
                onChange={(e) => setLhk(e.target.checked)}
              />
              <span>
                <strong>Loonheffingskorting toepassen</strong>
                <small>Standaard: ja. Uit bij 2e baan.</small>
              </span>
            </label>
            <label className="brutonetto-toggle">
              <input
                type="checkbox"
                checked={aow}
                onChange={(e) => setAow(e.target.checked)}
              />
              <span>
                <strong>AOW-leeftijd bereikt</strong>
                <small>Lager tarief in schijf 1 (geen AOW-premie).</small>
              </span>
            </label>
          </div>
        </div>

        {/* Resultaat */}
        <div className="brutonetto-result">
          <div className="brutonetto-result-grid">
            <ResultCell
              label="Bruto per maand"
              value={result.jaarBruto / 12}
              muted
            />
            <ResultCell
              label="Loonbelasting per maand"
              value={result.jaarBelasting / 12}
              accent
            />
            <ResultCell
              label="Netto per maand"
              value={result.jaarNetto / 12}
              highlight
            />
          </div>
          <div className="brutonetto-result-grid">
            <ResultCell
              label="Bruto per jaar"
              value={result.jaarBruto}
              small
              muted
            />
            <ResultCell
              label="Loonbelasting per jaar"
              value={result.jaarBelasting}
              small
              accent
            />
            <ResultCell
              label="Netto per jaar"
              value={result.jaarNetto}
              small
              highlight
            />
          </div>

          {loonheffingskorting && (result.algemeneHK > 0 || result.arbeidsK > 0) ? (
            <div className="brutonetto-detail">
              <span>Toegepaste heffingskortingen (per jaar):</span>
              <ul>
                {result.algemeneHK > 0 ? (
                  <li>
                    Algemene heffingskorting:{" "}
                    <strong>{formatEur(result.algemeneHK)}</strong>
                  </li>
                ) : null}
                {result.arbeidsK > 0 ? (
                  <li>
                    Arbeidskorting: <strong>{formatEur(result.arbeidsK)}</strong>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Disclaimer */}
        <div className="brutonetto-disclaimer">
          <Info size={15} />
          <div>
            <strong>Indicatief — geen belastingadvies</strong>
            <p>
              Berekend op basis van Nederlandse loonbelasting <strong>{TARIEVEN_2025.jaar}</strong>.
              Werkelijk netto loon kan afwijken door 30%-regeling, pensioenpremie,
              bijzondere beloning of werkgevers-cao. Voor exact werk: gebruik een
              salarisadministrateur of bevraag de Belastingdienst.
            </p>
          </div>
        </div>
      </div>
    </MiniToolPage>
  );
}

function ResultCell({
  label,
  value,
  highlight,
  accent,
  muted,
  small
}: {
  label: string;
  value: number;
  highlight?: boolean;
  accent?: boolean;
  muted?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`brutonetto-cell${highlight ? " highlight" : ""}${
        accent ? " accent" : ""
      }${muted ? " muted" : ""}${small ? " small" : ""}`}
    >
      <span>{label}</span>
      <strong>{formatEur(value)}</strong>
    </div>
  );
}
