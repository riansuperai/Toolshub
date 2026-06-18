"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, RefreshCw, ShieldCheck } from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";
// Karakters die er hetzelfde uitzien in vrijwel elk lettertype
const AMBIGUOUS = new Set(["0", "O", "o", "l", "1", "I", "i", "|"]);

type Options = {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

/**
 * Cryptografisch random — gebruikt Web Crypto API. Geen Math.random
 * want die is niet veilig voor wachtwoorden. We trekken uit een 32-bit
 * pool en mod-en op de charset-lengte (modulo bias is verwaarloosbaar
 * bij charset <= 100 en pool 2^32).
 */
function randomFromCharset(charset: string, length: number): string {
  if (!charset || length <= 0) return "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += charset[arr[i] % charset.length];
  }
  return out;
}

function buildCharset(opts: Options): string {
  let chars = "";
  if (opts.upper) chars += UPPER;
  if (opts.lower) chars += LOWER;
  if (opts.digits) chars += DIGITS;
  if (opts.symbols) chars += SYMBOLS;
  if (opts.excludeAmbiguous) {
    chars = chars
      .split("")
      .filter((c) => !AMBIGUOUS.has(c))
      .join("");
  }
  return chars;
}

function generate(opts: Options): string {
  const charset = buildCharset(opts);
  if (!charset) return "";
  // Garanteer minimaal 1 char uit elke geselecteerde categorie zodat
  // het wachtwoord echt aan de criteria voldoet (anders pure random kans
  // dat 'ie geen digit bevat ondanks dat digits aan staan).
  const required: string[] = [];
  const filtered = (set: string) =>
    opts.excludeAmbiguous
      ? set
          .split("")
          .filter((c) => !AMBIGUOUS.has(c))
          .join("")
      : set;
  if (opts.upper) required.push(randomFromCharset(filtered(UPPER), 1));
  if (opts.lower) required.push(randomFromCharset(filtered(LOWER), 1));
  if (opts.digits) required.push(randomFromCharset(filtered(DIGITS), 1));
  if (opts.symbols) required.push(randomFromCharset(filtered(SYMBOLS), 1));

  const remaining = Math.max(0, opts.length - required.length);
  const filler = randomFromCharset(charset, remaining);
  const merged = (required.join("") + filler).split("");

  // Fisher-Yates shuffle met crypto random
  const indices = new Uint32Array(merged.length);
  crypto.getRandomValues(indices);
  for (let i = merged.length - 1; i > 0; i--) {
    const j = indices[i] % (i + 1);
    [merged[i], merged[j]] = [merged[j], merged[i]];
  }
  return merged.join("");
}

type Strength = {
  label: string;
  color: string;
  percentage: number;
  bits: number;
};

function calcStrength(password: string, charsetSize: number): Strength {
  if (!password) {
    return { label: "—", color: "var(--line)", percentage: 0, bits: 0 };
  }
  // Entropie = log2(charsetSize^length) = length * log2(charsetSize)
  const bits = password.length * Math.log2(Math.max(1, charsetSize));
  let label: string;
  let color: string;
  if (bits < 40) {
    label = "Zwak";
    color = "#d94747";
  } else if (bits < 60) {
    label = "Redelijk";
    color = "#e3a31e";
  } else if (bits < 90) {
    label = "Sterk";
    color = "#1d9e75";
  } else {
    label = "Zeer sterk";
    color = "#0c704f";
  }
  // 100% bij 120 bits (bovengrens voor visualisatie)
  const percentage = Math.min(100, Math.round((bits / 120) * 100));
  return { label, color, percentage, bits: Math.round(bits) };
}

export function WachtwoordGeneratorClient() {
  const [opts, setOpts] = useState<Options>({
    length: 16,
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // Re-generate wanneer opties wijzigen (excl. eerste mount)
  useEffect(() => {
    setPassword(generate(opts));
    setCopied(false);
  }, [opts]);

  const charsetSize = useMemo(() => buildCharset(opts).length, [opts]);
  const strength = useMemo(
    () => calcStrength(password, charsetSize),
    [password, charsetSize]
  );

  function update<K extends keyof Options>(key: K, value: Options[K]) {
    setOpts((prev) => ({ ...prev, [key]: value }));
  }

  function copyPassword() {
    if (!password || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function regenerate() {
    setPassword(generate(opts));
    setCopied(false);
  }

  const noCategoriesSelected =
    !opts.upper && !opts.lower && !opts.digits && !opts.symbols;

  return (
    <MiniToolPage
      slug="wachtwoord-generator"
      privacyNote="Wachtwoorden worden cryptografisch in je browser gegenereerd. Wij zien of slaan niks op."
      howItWorks={[
        "Kies hoe lang het wachtwoord moet zijn (16+ tekens is aanbevolen).",
        "Selecteer welke type karakters meedoen — hoofdletters, kleine letters, cijfers en symbolen. Optioneel: filter verwarrende tekens (0/O, 1/l/I).",
        "Kopieer het wachtwoord met één klik of genereer een nieuwe. Bewaar 'm in een wachtwoordmanager."
      ]}
      crossSell={{
        heading: "Wachtwoordbeheer team-breed regelen?",
        body:
          "Hazenco adviseert MKB-bedrijven over security: van een gedeelde password-manager tot 2FA en SSO — passend bij je team-grootte.",
        cta: "Plan een gesprek",
        href: "https://hazenco.nl/contact/"
      }}
    >
      <div className="pwgen-tool">
        {/* Wachtwoord output */}
        <div className="pwgen-output">
          <code className="pwgen-password">
            {noCategoriesSelected
              ? "(kies minstens 1 type karakter)"
              : password || "•"}
          </code>
          <div className="pwgen-actions-inline">
            <button
              type="button"
              className="pwgen-icon-btn"
              onClick={copyPassword}
              disabled={noCategoriesSelected || !password}
              title="Kopieer"
              aria-label="Kopieer wachtwoord"
            >
              <Copy size={16} />
              {copied ? <span>Gekopieerd ✓</span> : null}
            </button>
            <button
              type="button"
              className="pwgen-icon-btn"
              onClick={regenerate}
              disabled={noCategoriesSelected}
              title="Genereer opnieuw"
              aria-label="Genereer opnieuw"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Strength bar */}
        <div className="pwgen-strength">
          <div className="pwgen-strength-head">
            <span>Sterkte</span>
            <strong style={{ color: strength.color }}>
              {strength.label}
              {strength.bits > 0 ? ` · ${strength.bits} bit entropie` : ""}
            </strong>
          </div>
          <div className="pwgen-strength-bar">
            <div
              className="pwgen-strength-bar-fill"
              style={{
                width: `${strength.percentage}%`,
                background: strength.color
              }}
            />
          </div>
        </div>

        {/* Lengte slider */}
        <div className="pwgen-setting">
          <div className="pwgen-setting-head">
            <span>Lengte</span>
            <strong>{opts.length} tekens</strong>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            step={1}
            value={opts.length}
            onChange={(e) => update("length", Number(e.target.value))}
            className="imgcomp-slider"
          />
        </div>

        {/* Toggles */}
        <div className="pwgen-toggles">
          <Toggle
            label="Hoofdletters"
            hint="A-Z"
            checked={opts.upper}
            onChange={(v) => update("upper", v)}
          />
          <Toggle
            label="Kleine letters"
            hint="a-z"
            checked={opts.lower}
            onChange={(v) => update("lower", v)}
          />
          <Toggle
            label="Cijfers"
            hint="0-9"
            checked={opts.digits}
            onChange={(v) => update("digits", v)}
          />
          <Toggle
            label="Symbolen"
            hint="!@#$..."
            checked={opts.symbols}
            onChange={(v) => update("symbols", v)}
          />
          <Toggle
            label="Geen verwarrende tekens"
            hint="Filter 0/O, 1/l/I, |"
            checked={opts.excludeAmbiguous}
            onChange={(v) => update("excludeAmbiguous", v)}
            wide
          />
        </div>

        {/* Tips */}
        <div className="pwgen-tip">
          <ShieldCheck size={15} />
          <span>
            <strong>Tip:</strong> 16+ tekens met alle types is voor de meeste
            accounts ruim voldoende. Bewaar wachtwoorden nooit in een browser
            of tekstbestand — gebruik een password-manager zoals Bitwarden of
            1Password.
          </span>
        </div>
      </div>
    </MiniToolPage>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
  wide
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  wide?: boolean;
}) {
  return (
    <label className={`pwgen-toggle${wide ? " wide" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
    </label>
  );
}
