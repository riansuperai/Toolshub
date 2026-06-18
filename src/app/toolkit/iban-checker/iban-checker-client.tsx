"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, XCircle } from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

/**
 * Map van NL bank-codes (4 letters in IBAN) naar herkenbare namen.
 * Lijst klein gehouden — voor exotische codes valt 'ie terug op "Onbekende bank".
 */
const NL_BANK_CODES: Record<string, string> = {
  ABNA: "ABN AMRO",
  RABO: "Rabobank",
  INGB: "ING",
  SNSB: "SNS Bank",
  BUNQ: "bunq",
  KNAB: "Knab",
  TRIO: "Triodos Bank",
  ASNB: "ASN Bank",
  RBRB: "RegioBank",
  REVO: "Revolut",
  NWAB: "Nationale-Nederlanden Bank",
  HAND: "Svenska Handelsbanken",
  FVLB: "Van Lanschot",
  DEUT: "Deutsche Bank",
  BMEU: "BMW Bank",
  BNGH: "BNG Bank",
  BCDM: "Banque Chaabi du Maroc",
  ABNC: "ABN AMRO Commercial",
  CITC: "Citibank",
  COBA: "Commerzbank",
  FBHL: "Credit Europe Bank",
  ICBK: "ICBC",
  FRGH: "Friesland Bank",
  GILL: "Gillissen",
  INSI: "Insinger Gilissen",
  ISBK: "Isbank",
  KASA: "KAS BANK",
  KOEX: "Korea Exchange Bank",
  LOCY: "LeasePlan",
  MHCB: "Mizuho Bank",
  NNBA: "Nationale-Nederlanden Bank",
  RBOS: "Royal Bank of Scotland",
  TEBU: "Trustly Group",
  UGBI: "United Garanti Bank",
  YOUR: "yourSafe"
};

const COUNTRY_LENGTHS: Record<string, number> = {
  NL: 18,
  BE: 16,
  DE: 22,
  FR: 27,
  GB: 22,
  IT: 27,
  ES: 24,
  AT: 20,
  CH: 21,
  LU: 20,
  PT: 25
};

type ValidationResult =
  | { state: "empty" }
  | { state: "too-short"; minLen: number }
  | { state: "bad-format" }
  | { state: "bad-checksum" }
  | {
      state: "ok";
      formatted: string;
      country: string;
      bankCode?: string;
      bankName?: string;
      account?: string;
    };

function validateIban(raw: string): ValidationResult {
  const clean = raw.replace(/[\s-]/g, "").toUpperCase();
  if (!clean) return { state: "empty" };

  if (!/^[A-Z]{2}\d{2}/.test(clean)) {
    return { state: "bad-format" };
  }

  const country = clean.slice(0, 2);
  const expectedLen = COUNTRY_LENGTHS[country];
  if (expectedLen && clean.length < expectedLen) {
    return { state: "too-short", minLen: expectedLen };
  }
  if (expectedLen && clean.length > expectedLen) {
    return { state: "bad-format" };
  }

  // Verplaats eerste 4 chars naar einde
  const rearranged = clean.slice(4) + clean.slice(0, 4);
  // Vervang letters door cijfers (A=10, B=11, ..., Z=35)
  const numeric = rearranged.replace(/[A-Z]/g, (c) =>
    String(c.charCodeAt(0) - 55)
  );
  // Mod 97 berekenen
  let mod = 0;
  for (const digit of numeric) {
    mod = (mod * 10 + parseInt(digit, 10)) % 97;
  }
  if (mod !== 1) {
    return { state: "bad-checksum" };
  }

  // Geformatteerd uitprinten in groepen van 4
  const formatted = clean.match(/.{1,4}/g)?.join(" ") ?? clean;

  // Bank-info alleen voor NL
  let bankCode: string | undefined;
  let bankName: string | undefined;
  let account: string | undefined;
  if (country === "NL") {
    bankCode = clean.slice(4, 8);
    bankName = NL_BANK_CODES[bankCode] ?? "Onbekende bank";
    account = clean.slice(8);
  }

  return {
    state: "ok",
    formatted,
    country,
    bankCode,
    bankName,
    account
  };
}

export function IbanCheckerClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => validateIban(input), [input]);

  function copyFormatted() {
    if (result.state !== "ok") return;
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(result.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <MiniToolPage
      slug="iban-checker"
      privacyNote="Validatie draait in je browser. Wij ontvangen geen rekeninggegevens."
      howItWorks={[
        "Plak of typ een IBAN-nummer (Nederlands of internationaal — spaties en streepjes mogen).",
        "We checken de structuur en de wiskundige controle (mod-97) van het nummer.",
        "Bij Nederlandse IBANs zie je direct welke bank het is."
      ]}
      crossSell={{
        heading: "Klanten automatisch incasseren?",
        body:
          "Hazenco zet SEPA incasso op via Mollie of Stripe — facturen worden automatisch geïnd, klanten houden controle.",
        cta: "Plan een gesprek",
        href: "https://hazenco.nl/contact/"
      }}
    >
      <div className="iban-tool">
        <label className="iban-input-label">
          <span>IBAN-nummer</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="NL12 RABO 0123 4567 89"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="characters"
          />
        </label>

        {result.state === "empty" ? (
          <div className="iban-empty">
            Voer een IBAN-nummer in om te checken.
          </div>
        ) : null}

        {result.state === "too-short" ? (
          <div className="iban-status pending">
            Nog typen… een {input.slice(0, 2).toUpperCase()}-IBAN telt {result.minLen} tekens.
          </div>
        ) : null}

        {result.state === "bad-format" ? (
          <div className="iban-status invalid">
            <XCircle size={18} />
            <div>
              <strong>Ongeldig formaat</strong>
              <p>Een IBAN start met 2 landletters + 2 controle-cijfers (bv. NL12).</p>
            </div>
          </div>
        ) : null}

        {result.state === "bad-checksum" ? (
          <div className="iban-status invalid">
            <XCircle size={18} />
            <div>
              <strong>Checksum klopt niet</strong>
              <p>De wiskundige controle faalt — er staat waarschijnlijk een typefout in.</p>
            </div>
          </div>
        ) : null}

        {result.state === "ok" ? (
          <div className="iban-status valid">
            <CheckCircle2 size={18} />
            <div>
              <strong>Geldig IBAN-nummer</strong>
              <p>Structuur klopt en checksum is correct.</p>
            </div>
          </div>
        ) : null}

        {result.state === "ok" ? (
          <div className="iban-details">
            <div className="iban-details-row">
              <span>Geformatteerd</span>
              <div className="iban-details-value">
                <strong>{result.formatted}</strong>
                <button
                  type="button"
                  className="iban-copy"
                  onClick={copyFormatted}
                  title="Kopieer"
                  aria-label="Kopieer geformatteerd IBAN"
                >
                  <Copy size={13} />
                  {copied ? <span>Gekopieerd ✓</span> : null}
                </button>
              </div>
            </div>
            <div className="iban-details-row">
              <span>Land</span>
              <strong>{result.country}</strong>
            </div>
            {result.bankCode ? (
              <div className="iban-details-row">
                <span>Bank</span>
                <strong>
                  {result.bankName}
                  <span className="iban-bankcode"> · {result.bankCode}</span>
                </strong>
              </div>
            ) : null}
            {result.account ? (
              <div className="iban-details-row">
                <span>Rekeningnummer</span>
                <strong>{result.account}</strong>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </MiniToolPage>
  );
}
