"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, QrCode } from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

type QrType = "url" | "tekst" | "email" | "telefoon" | "wifi";
type ErrorLevel = "L" | "M" | "Q" | "H";

type WifiState = {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
};

const TYPES: { id: QrType; label: string; placeholder: string }[] = [
  { id: "url", label: "URL", placeholder: "https://hazenco.nl" },
  { id: "tekst", label: "Tekst", placeholder: "Jouw boodschap..." },
  { id: "email", label: "E-mail", placeholder: "info@hazenco.nl" },
  { id: "telefoon", label: "Telefoon", placeholder: "+31643074303" },
  { id: "wifi", label: "WiFi", placeholder: "" }
];

const ERROR_LEVELS: { id: ErrorLevel; label: string; description: string }[] = [
  { id: "L", label: "Laag", description: "~7% herstel, kleinste QR" },
  { id: "M", label: "Middel", description: "~15% herstel, balans" },
  { id: "Q", label: "Hoog", description: "~25% herstel, met logo" },
  { id: "H", label: "Maximaal", description: "~30% herstel, robuust" }
];

function buildContent(
  type: QrType,
  value: string,
  wifi: WifiState
): string {
  if (type === "wifi") {
    // WIFI:T:WPA;S:<ssid>;P:<password>;H:true; — semicolons en ; escapen
    const esc = (v: string) =>
      v.replace(/([\\;,"':])/g, "\\$1");
    return `WIFI:T:${wifi.encryption};S:${esc(wifi.ssid)};P:${
      wifi.encryption === "nopass" ? "" : esc(wifi.password)
    };${wifi.hidden ? "H:true;" : ""};`;
  }
  if (type === "email") {
    return value ? `mailto:${value}` : "";
  }
  if (type === "telefoon") {
    return value ? `tel:${value.replace(/\s/g, "")}` : "";
  }
  return value;
}

export function QrCodeGeneratorClient() {
  const [type, setType] = useState<QrType>("url");
  const [value, setValue] = useState<string>("https://hazenco.nl");
  const [size, setSize] = useState<number>(512);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [margin, setMargin] = useState<number>(2);
  const [fg, setFg] = useState<string>("#0a1813");
  const [bg, setBg] = useState<string>("#ffffff");
  const [wifi, setWifi] = useState<WifiState>({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pngUrl, setPngUrl] = useState<string>("");
  const [svgUrl, setSvgUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const content = useMemo(() => buildContent(type, value, wifi), [type, value, wifi]);

  useEffect(() => {
    let cancelled = false;
    setError("");

    if (!content) {
      setPngUrl("");
      setSvgUrl("");
      // Canvas leegmaken
      const c = canvasRef.current;
      if (c) {
        const ctx = c.getContext("2d");
        ctx?.clearRect(0, 0, c.width, c.height);
      }
      return;
    }

    (async () => {
      try {
        const QR = (await import("qrcode")).default;
        if (cancelled) return;
        // Canvas voor preview
        const canvas = canvasRef.current;
        if (canvas) {
          await QR.toCanvas(canvas, content, {
            width: size,
            errorCorrectionLevel: errorLevel,
            margin,
            color: { dark: fg, light: bg }
          });
        }
        // PNG dataURL voor download
        const png = await QR.toDataURL(content, {
          width: size,
          errorCorrectionLevel: errorLevel,
          margin,
          color: { dark: fg, light: bg }
        });
        // SVG string
        const svg = await QR.toString(content, {
          type: "svg",
          errorCorrectionLevel: errorLevel,
          margin,
          color: { dark: fg, light: bg }
        });
        if (cancelled) return;
        setPngUrl(png);
        const svgBlob = new Blob([svg], { type: "image/svg+xml" });
        setSvgUrl(URL.createObjectURL(svgBlob));
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? `Kon QR-code niet maken: ${err.message}`
            : "Onbekende fout bij genereren."
        );
      }
    })();

    return () => {
      cancelled = true;
    };
    // svgUrl wordt revoked op volgende run via cleanup-effect hieronder
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, size, errorLevel, margin, fg, bg]);

  // Cleanup oude svgUrl bij vervangen
  useEffect(() => {
    return () => {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
    };
  }, [svgUrl]);

  function safeFileName(): string {
    const base =
      type === "url" && /^https?:\/\//.test(value)
        ? value.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-")
        : type;
    return base.slice(0, 40) || "qrcode";
  }

  return (
    <MiniToolPage
      slug="qr-code-generator"
      privacyNote="Alles draait in je browser, geen tracking. Wij ontvangen geen data."
      howItWorks={[
        "Kies het type (URL, tekst, e-mail, telefoon of WiFi) en vul de inhoud in.",
        "Pas optioneel het formaat, kleuren of de fout-correctie aan voor specifieke use-cases.",
        "Download de QR-code direct als PNG (voor print/web) of SVG (voor schaalbare drukwerk)."
      ]}
      crossSell={{
        heading: "QR-campagnes met tracking?",
        body:
          "Hazenco bouwt slimme QR-flows met short-links en analytics — meet exact welke poster, sticker of menu wordt gescand.",
        cta: "Plan een gesprek",
        href: "https://hazenco.nl/contact/"
      }}
    >
      <div className="qr-tool">
        {/* Type selector */}
        <div className="qr-types">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`qr-type${type === t.id ? " active" : ""}`}
              onClick={() => setType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Input — verschillend per type */}
        {type !== "wifi" ? (
          <label className="qr-input-label">
            <span>
              {type === "url"
                ? "URL"
                : type === "tekst"
                ? "Tekst"
                : type === "email"
                ? "E-mail adres"
                : "Telefoonnummer"}
            </span>
            {type === "tekst" ? (
              <textarea
                className="qr-textarea"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={TYPES.find((t) => t.id === type)?.placeholder}
                rows={3}
              />
            ) : (
              <input
                type={type === "email" ? "email" : type === "telefoon" ? "tel" : "text"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={TYPES.find((t) => t.id === type)?.placeholder}
                spellCheck={false}
              />
            )}
          </label>
        ) : (
          <div className="qr-wifi-grid">
            <label className="qr-input-label">
              <span>Netwerknaam (SSID)</span>
              <input
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                placeholder="bv. Hazenco-WiFi"
              />
            </label>
            <label className="qr-input-label">
              <span>Beveiliging</span>
              <select
                value={wifi.encryption}
                onChange={(e) =>
                  setWifi({ ...wifi, encryption: e.target.value as WifiState["encryption"] })
                }
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP (oud)</option>
                <option value="nopass">Geen wachtwoord</option>
              </select>
            </label>
            {wifi.encryption !== "nopass" ? (
              <label className="qr-input-label" style={{ gridColumn: "1 / -1" }}>
                <span>Wachtwoord</span>
                <input
                  type="text"
                  value={wifi.password}
                  onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                  placeholder="Wachtwoord van het netwerk"
                  spellCheck={false}
                />
              </label>
            ) : null}
            <label className="qr-wifi-hidden">
              <input
                type="checkbox"
                checked={wifi.hidden}
                onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
              />
              <span>Verborgen netwerk (SSID broadcast uit)</span>
            </label>
          </div>
        )}

        {/* Settings grid */}
        <div className="qr-settings">
          <div className="qr-setting">
            <div className="qr-setting-head">
              <span>Formaat</span>
              <strong>{size} × {size} px</strong>
            </div>
            <input
              type="range"
              min={128}
              max={1024}
              step={64}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="imgcomp-slider"
            />
          </div>

          <div className="qr-setting">
            <div className="qr-setting-head">
              <span>Marge</span>
              <strong>{margin}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="imgcomp-slider"
            />
          </div>

          <div className="qr-setting">
            <span>Fout-correctie</span>
            <div className="qr-error-buttons">
              {ERROR_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  className={`qr-error${errorLevel === lvl.id ? " active" : ""}`}
                  onClick={() => setErrorLevel(lvl.id)}
                  title={lvl.description}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="qr-setting">
            <span>Kleuren</span>
            <div className="qr-colors">
              <label>
                <span>Voorgrond</span>
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                />
              </label>
              <label>
                <span>Achtergrond</span>
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Preview + downloads */}
        <div className="qr-preview-row">
          <div className="qr-preview">
            {content ? (
              <canvas ref={canvasRef} />
            ) : (
              <div className="qr-preview-empty">
                <QrCode size={42} />
                <p>Vul iets in om de QR-code te zien</p>
              </div>
            )}
            {error ? <p className="qr-error-text">{error}</p> : null}
          </div>

          <div className="qr-actions">
            <p className="qr-actions-label">Download</p>
            <a
              className="button"
              href={pngUrl || "#"}
              download={`${safeFileName()}.png`}
              aria-disabled={!pngUrl}
              onClick={(e) => {
                if (!pngUrl) e.preventDefault();
              }}
            >
              <Download size={16} /> PNG (raster)
            </a>
            <a
              className="button secondary"
              href={svgUrl || "#"}
              download={`${safeFileName()}.svg`}
              aria-disabled={!svgUrl}
              onClick={(e) => {
                if (!svgUrl) e.preventDefault();
              }}
            >
              <Download size={16} /> SVG (vector)
            </a>
            <p className="qr-actions-hint">
              <strong>PNG</strong> voor scherm en social.
              <br />
              <strong>SVG</strong> voor print en groot drukwerk.
            </p>
          </div>
        </div>
      </div>
    </MiniToolPage>
  );
}
