"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Save, Trash2, Upload } from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

const STORAGE_KEY = "hazenco-factuur-bedrijfsgegevens-v1";

type BtwTarief = 0 | 9 | 21;

type FactuurRegel = {
  id: string;
  omschrijving: string;
  aantal: number;
  prijsPerStuk: number;
  btwTarief: BtwTarief;
};

type Bedrijf = {
  naam: string;
  adres: string;
  postcode: string;
  plaats: string;
  kvk: string;
  btw: string;
  iban: string;
  email: string;
  telefoon: string;
  /** Data-URL van geüploade logo. Wordt in localStorage opgeslagen. */
  logoDataUrl?: string;
};

type Klant = {
  naam: string;
  adres: string;
  postcode: string;
  plaats: string;
  kvk: string;
};

function createId() {
  return Math.random().toString(36).slice(2, 9);
}

function todayIso() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function addDaysIso(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function formatEur(cents: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(cents / 100);
}

function formatDateNl(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch {
    return iso;
  }
}

const EMPTY_BEDRIJF: Bedrijf = {
  naam: "",
  adres: "",
  postcode: "",
  plaats: "",
  kvk: "",
  btw: "",
  iban: "",
  email: "",
  telefoon: ""
};

const EMPTY_KLANT: Klant = {
  naam: "",
  adres: "",
  postcode: "",
  plaats: "",
  kvk: ""
};

function emptyRegel(): FactuurRegel {
  return {
    id: createId(),
    omschrijving: "",
    aantal: 1,
    prijsPerStuk: 0,
    btwTarief: 21
  };
}

export function FactuurGeneratorClient() {
  const [bedrijf, setBedrijf] = useState<Bedrijf>(EMPTY_BEDRIJF);
  const [klant, setKlant] = useState<Klant>(EMPTY_KLANT);
  const [factuurNummer, setFactuurNummer] = useState("2026-001");
  const [factuurDatum, setFactuurDatum] = useState(todayIso());
  const [vervalDatum, setVervalDatum] = useState(addDaysIso(14));
  const [regels, setRegels] = useState<FactuurRegel[]>([emptyRegel()]);
  const [notitie, setNotitie] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Bedrijfsgegevens automatisch laden uit localStorage bij eerste render
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Bedrijf;
      setBedrijf((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore corrupt cache
    }
  }, []);

  function saveBedrijfsgegevens() {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bedrijf));
    setSaveMessage("Opgeslagen in je browser ✓");
    setTimeout(() => setSaveMessage(""), 2500);
  }

  function updateBedrijf<K extends keyof Bedrijf>(key: K, value: Bedrijf[K]) {
    setBedrijf((prev) => ({ ...prev, [key]: value }));
  }

  function updateKlant<K extends keyof Klant>(key: K, value: Klant[K]) {
    setKlant((prev) => ({ ...prev, [key]: value }));
  }

  function updateRegel(id: string, patch: Partial<FactuurRegel>) {
    setRegels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  }

  function addRegel() {
    setRegels((prev) => [...prev, emptyRegel()]);
  }

  function removeRegel(id: string) {
    setRegels((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  function handleLogoUpload(file: File | null) {
    if (!file) return;
    if (file.size > 1_000_000) {
      // 1MB cap — anders wordt localStorage te zwaar
      alert("Logo te groot. Kies een bestand kleiner dan 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      updateBedrijf("logoDataUrl", e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function bumpFactuurNummer() {
    // Probeert achterste cijfergroep met 1 op te hogen, bv 2026-001 → 2026-002
    const match = factuurNummer.match(/^(.*?)(\d+)$/);
    if (!match) {
      setFactuurNummer(factuurNummer + "-1");
      return;
    }
    const prefix = match[1];
    const num = match[2];
    const next = String(parseInt(num, 10) + 1).padStart(num.length, "0");
    setFactuurNummer(prefix + next);
  }

  // Totaal-berekening in centen om floating-point ellende te vermijden
  const totalen = useMemo(() => {
    const perTarief = new Map<BtwTarief, { excl: number; btw: number }>();
    let subtotaalCents = 0;
    let btwTotaalCents = 0;

    for (const r of regels) {
      const regelExclCents = Math.round(r.aantal * r.prijsPerStuk * 100);
      const regelBtwCents = Math.round(regelExclCents * (r.btwTarief / 100));
      subtotaalCents += regelExclCents;
      btwTotaalCents += regelBtwCents;
      const existing = perTarief.get(r.btwTarief) ?? { excl: 0, btw: 0 };
      perTarief.set(r.btwTarief, {
        excl: existing.excl + regelExclCents,
        btw: existing.btw + regelBtwCents
      });
    }

    return {
      subtotaalCents,
      btwTotaalCents,
      totaalCents: subtotaalCents + btwTotaalCents,
      perTarief: Array.from(perTarief.entries()).sort((a, b) => b[0] - a[0])
    };
  }, [regels]);

  async function generatePdf() {
    if (!bedrijf.naam.trim()) {
      alert("Vul minimaal je bedrijfsnaam in.");
      return;
    }
    if (!klant.naam.trim()) {
      alert("Vul minimaal de klantnaam in.");
      return;
    }
    setIsGenerating(true);
    try {
      // jsPDF wordt dynamisch geladen — scheelt initial bundle size
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 18;
      const right = pageWidth - margin;
      let y = margin;

      // Logo (optioneel)
      if (bedrijf.logoDataUrl) {
        try {
          doc.addImage(bedrijf.logoDataUrl, "PNG", margin, y, 28, 28, undefined, "FAST");
        } catch {
          // Logo kan corrupt zijn, niet erg, ga door
        }
      }

      // Bedrijfsnaam rechts bovenaan
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(20, 20, 20);
      doc.text(bedrijf.naam, right, y + 6, { align: "right" });

      // Bedrijf-adres rechts onder de naam
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const bedrijfLines = [
        bedrijf.adres,
        [bedrijf.postcode, bedrijf.plaats].filter(Boolean).join("  "),
        bedrijf.email,
        bedrijf.telefoon
      ].filter(Boolean) as string[];
      bedrijfLines.forEach((line, idx) => {
        doc.text(line, right, y + 12 + idx * 4.2, { align: "right" });
      });

      y += 38;

      // Titel "FACTUUR"
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(26, 60, 46);
      doc.text("FACTUUR", margin, y);

      y += 10;

      // Klant-blok links
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(120, 120, 120);
      doc.text("FACTUREREN AAN", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      const klantLines = [
        klant.naam,
        klant.adres,
        [klant.postcode, klant.plaats].filter(Boolean).join("  "),
        klant.kvk ? `KvK: ${klant.kvk}` : ""
      ].filter(Boolean) as string[];
      klantLines.forEach((line, idx) => {
        doc.text(line, margin, y + 5 + idx * 4.5);
      });

      // Factuur-meta rechts
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(120, 120, 120);
      doc.text("FACTUURNUMMER", right - 50, y);
      doc.text("FACTUURDATUM", right - 50, y + 12);
      doc.text("VERVALDATUM", right - 50, y + 24);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(20, 20, 20);
      doc.text(factuurNummer, right, y, { align: "right" });
      doc.text(formatDateNl(factuurDatum), right, y + 12, { align: "right" });
      doc.text(formatDateNl(vervalDatum), right, y + 24, { align: "right" });

      y += Math.max(klantLines.length * 4.5 + 6, 36);

      // Regels-tabel header
      const colOmschrijving = margin;
      const colAantal = margin + 90;
      const colPrijs = margin + 110;
      const colBtw = margin + 138;
      const colTotaal = right;

      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, right, y);
      y += 5;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(120, 120, 120);
      doc.text("OMSCHRIJVING", colOmschrijving, y);
      doc.text("AANTAL", colAantal, y, { align: "right" });
      doc.text("PRIJS", colPrijs, y, { align: "right" });
      doc.text("BTW", colBtw, y, { align: "right" });
      doc.text("TOTAAL", colTotaal, y, { align: "right" });
      y += 3;
      doc.line(margin, y, right, y);
      y += 5;

      // Regels
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      for (const r of regels) {
        const exclCents = Math.round(r.aantal * r.prijsPerStuk * 100);
        const totaalCents = exclCents + Math.round(exclCents * (r.btwTarief / 100));
        // Wrap-text omschrijving op max 75mm
        const wrapped = doc.splitTextToSize(r.omschrijving || "—", 75);
        wrapped.forEach((line: string, idx: number) => {
          doc.text(line, colOmschrijving, y + idx * 4.5);
        });
        const rowHeight = Math.max(wrapped.length * 4.5, 6);
        doc.text(String(r.aantal), colAantal, y, { align: "right" });
        doc.text(formatEur(Math.round(r.prijsPerStuk * 100)), colPrijs, y, { align: "right" });
        doc.text(`${r.btwTarief}%`, colBtw, y, { align: "right" });
        doc.text(formatEur(totaalCents), colTotaal, y, { align: "right" });
        y += rowHeight + 2;
        doc.setDrawColor(240, 240, 240);
        doc.line(margin, y - 1, right, y - 1);
      }

      y += 6;

      // Totalen-blok rechts
      const totalsLeft = right - 70;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text("Subtotaal", totalsLeft, y);
      doc.setTextColor(20, 20, 20);
      doc.text(formatEur(totalen.subtotaalCents), right, y, { align: "right" });
      y += 5;

      for (const [tarief, info] of totalen.perTarief) {
        if (tarief === 0) {
          doc.setTextColor(80, 80, 80);
          doc.text(`BTW 0% (verlegd / vrijgesteld)`, totalsLeft, y);
          doc.setTextColor(20, 20, 20);
          doc.text(formatEur(0), right, y, { align: "right" });
        } else {
          doc.setTextColor(80, 80, 80);
          doc.text(`BTW ${tarief}% over ${formatEur(info.excl)}`, totalsLeft, y);
          doc.setTextColor(20, 20, 20);
          doc.text(formatEur(info.btw), right, y, { align: "right" });
        }
        y += 5;
      }

      y += 2;
      doc.setDrawColor(180, 180, 180);
      doc.line(totalsLeft, y, right, y);
      y += 5;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(26, 60, 46);
      doc.text("TE BETALEN", totalsLeft, y);
      doc.text(formatEur(totalen.totaalCents), right, y, { align: "right" });

      // Notitie + betaalinfo onderaan
      let footY = doc.internal.pageSize.getHeight() - 32;
      if (notitie.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const wrappedNote = doc.splitTextToSize(notitie, pageWidth - margin * 2);
        doc.text(wrappedNote, margin, footY);
        footY += wrappedNote.length * 4;
      }

      doc.setDrawColor(220, 220, 220);
      doc.line(margin, footY + 4, right, footY + 4);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("BETAALGEGEVENS", margin, footY + 10);
      doc.text("BEDRIJFSGEGEVENS", right - 60, footY + 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      const betaalLines = [
        bedrijf.iban ? `IBAN: ${bedrijf.iban}` : "",
        bedrijf.naam ? `T.n.v. ${bedrijf.naam}` : "",
        `Onder vermelding van: ${factuurNummer}`
      ].filter(Boolean);
      betaalLines.forEach((line, idx) => {
        doc.text(line, margin, footY + 15 + idx * 4);
      });

      const infoLines = [
        bedrijf.kvk ? `KvK: ${bedrijf.kvk}` : "",
        bedrijf.btw ? `BTW: ${bedrijf.btw}` : ""
      ].filter(Boolean);
      infoLines.forEach((line, idx) => {
        doc.text(line, right - 60, footY + 15 + idx * 4);
      });

      doc.save(`factuur-${factuurNummer}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <MiniToolPage
      slug="factuur-generator"
      privacyNote="Alles draait in je eigen browser. Wij ontvangen geen klant- of betaalgegevens."
      howItWorks={[
        "Vul je bedrijfsgegevens in (eenmalig). Klik op \"Onthoud in deze browser\" en je hoeft 't volgende keer niet opnieuw te typen.",
        "Voeg de klant toe en factuurregels (omschrijving, aantal, prijs, BTW-tarief). Totalen worden live berekend, incl. BTW per tarief.",
        "Klik op \"Download factuur als PDF\" — je factuur komt direct in je downloads-map, klaar om te versturen."
      ]}
      crossSell={{
        heading: "Vaker dan eens per maand factureren?",
        body:
          "Hazenco automatiseert je facturatie en koppelt het aan e-Boekhouden, Snelstart of Moneybird — geen kopiëren meer.",
        cta: "Plan een gesprek",
        href: "/tools/website-laten-maken"
      }}
    >
      <div className="factuur-tool">
        {/* === Sectie: Bedrijfsgegevens === */}
        <div className="factuur-section">
          <div className="factuur-section-head">
            <h3>Jouw bedrijf</h3>
            <button
              type="button"
              className="factuur-save"
              onClick={saveBedrijfsgegevens}
              title="Onthouden in deze browser zodat je 't volgende maand niet opnieuw hoeft te typen"
            >
              <Save size={14} />
              {saveMessage || "Onthoud in deze browser"}
            </button>
          </div>
          <div className="factuur-grid-2">
            <label>
              Bedrijfsnaam <span className="req">*</span>
              <input
                value={bedrijf.naam}
                onChange={(e) => updateBedrijf("naam", e.target.value)}
                placeholder="Jouw bedrijf B.V."
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={bedrijf.email}
                onChange={(e) => updateBedrijf("email", e.target.value)}
                placeholder="hallo@jouwbedrijf.nl"
              />
            </label>
            <label>
              Adres
              <input
                value={bedrijf.adres}
                onChange={(e) => updateBedrijf("adres", e.target.value)}
                placeholder="Voorbeeldstraat 1"
              />
            </label>
            <label>
              Telefoon
              <input
                value={bedrijf.telefoon}
                onChange={(e) => updateBedrijf("telefoon", e.target.value)}
                placeholder="+31 6 ..."
              />
            </label>
            <label>
              Postcode
              <input
                value={bedrijf.postcode}
                onChange={(e) => updateBedrijf("postcode", e.target.value)}
                placeholder="1234 AB"
              />
            </label>
            <label>
              Plaats
              <input
                value={bedrijf.plaats}
                onChange={(e) => updateBedrijf("plaats", e.target.value)}
                placeholder="Amsterdam"
              />
            </label>
            <label>
              KvK-nummer
              <input
                value={bedrijf.kvk}
                onChange={(e) => updateBedrijf("kvk", e.target.value)}
                placeholder="12345678"
              />
            </label>
            <label>
              BTW-nummer
              <input
                value={bedrijf.btw}
                onChange={(e) => updateBedrijf("btw", e.target.value)}
                placeholder="NL123456789B01"
              />
            </label>
            <label className="factuur-grid-2-full">
              IBAN
              <input
                value={bedrijf.iban}
                onChange={(e) => updateBedrijf("iban", e.target.value)}
                placeholder="NL12 RABO 0123 4567 89"
              />
            </label>
          </div>

          <div className="factuur-logo">
            <label className="factuur-logo-input">
              <Upload size={15} />
              <span>{bedrijf.logoDataUrl ? "Vervang logo" : "Logo uploaden (optioneel, max 1 MB)"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)}
              />
            </label>
            {bedrijf.logoDataUrl ? (
              <div className="factuur-logo-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={bedrijf.logoDataUrl} alt="Bedrijfslogo" />
                <button
                  type="button"
                  className="factuur-logo-remove"
                  onClick={() => updateBedrijf("logoDataUrl", undefined)}
                >
                  Verwijderen
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* === Sectie: Klant === */}
        <div className="factuur-section">
          <div className="factuur-section-head">
            <h3>Klant</h3>
          </div>
          <div className="factuur-grid-2">
            <label>
              Klantnaam <span className="req">*</span>
              <input
                value={klant.naam}
                onChange={(e) => updateKlant("naam", e.target.value)}
                placeholder="Klantbedrijf B.V."
              />
            </label>
            <label>
              Adres
              <input
                value={klant.adres}
                onChange={(e) => updateKlant("adres", e.target.value)}
                placeholder="Klantstraat 2"
              />
            </label>
            <label>
              Postcode
              <input
                value={klant.postcode}
                onChange={(e) => updateKlant("postcode", e.target.value)}
                placeholder="1234 AB"
              />
            </label>
            <label>
              Plaats
              <input
                value={klant.plaats}
                onChange={(e) => updateKlant("plaats", e.target.value)}
                placeholder="Utrecht"
              />
            </label>
            <label className="factuur-grid-2-full">
              KvK-nummer (optioneel)
              <input
                value={klant.kvk}
                onChange={(e) => updateKlant("kvk", e.target.value)}
                placeholder="87654321"
              />
            </label>
          </div>
        </div>

        {/* === Sectie: Factuur details === */}
        <div className="factuur-section">
          <div className="factuur-section-head">
            <h3>Factuur details</h3>
          </div>
          <div className="factuur-grid-3">
            <label>
              Factuurnummer
              <div className="factuur-input-with-action">
                <input
                  value={factuurNummer}
                  onChange={(e) => setFactuurNummer(e.target.value)}
                />
                <button
                  type="button"
                  onClick={bumpFactuurNummer}
                  title="Volgende factuurnummer"
                >
                  +1
                </button>
              </div>
            </label>
            <label>
              Factuurdatum
              <input
                type="date"
                value={factuurDatum}
                onChange={(e) => setFactuurDatum(e.target.value)}
              />
            </label>
            <label>
              Vervaldatum
              <input
                type="date"
                value={vervalDatum}
                onChange={(e) => setVervalDatum(e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* === Sectie: Regels === */}
        <div className="factuur-section">
          <div className="factuur-section-head">
            <h3>Factuurregels</h3>
            <button type="button" className="factuur-add" onClick={addRegel}>
              <Plus size={14} /> Regel toevoegen
            </button>
          </div>
          <div className="factuur-regels">
            {regels.map((r, idx) => {
              const exclCents = Math.round(r.aantal * r.prijsPerStuk * 100);
              const totaalCents = exclCents + Math.round(exclCents * (r.btwTarief / 100));
              return (
                <div key={r.id} className="factuur-regel">
                  <label className="factuur-regel-omschrijving">
                    {idx === 0 ? <span>Omschrijving</span> : null}
                    <input
                      value={r.omschrijving}
                      onChange={(e) => updateRegel(r.id, { omschrijving: e.target.value })}
                      placeholder="Bijv. Consultancy uur"
                    />
                  </label>
                  <label className="factuur-regel-aantal">
                    {idx === 0 ? <span>Aantal</span> : null}
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={r.aantal}
                      onChange={(e) =>
                        updateRegel(r.id, { aantal: Number(e.target.value) || 0 })
                      }
                    />
                  </label>
                  <label className="factuur-regel-prijs">
                    {idx === 0 ? <span>Prijs (excl.)</span> : null}
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={r.prijsPerStuk}
                      onChange={(e) =>
                        updateRegel(r.id, { prijsPerStuk: Number(e.target.value) || 0 })
                      }
                    />
                  </label>
                  <label className="factuur-regel-btw">
                    {idx === 0 ? <span>BTW</span> : null}
                    <select
                      value={r.btwTarief}
                      onChange={(e) =>
                        updateRegel(r.id, { btwTarief: Number(e.target.value) as BtwTarief })
                      }
                    >
                      <option value={21}>21%</option>
                      <option value={9}>9%</option>
                      <option value={0}>0%</option>
                    </select>
                  </label>
                  <div className="factuur-regel-totaal">
                    {idx === 0 ? <span>Totaal</span> : null}
                    <strong>{formatEur(totaalCents)}</strong>
                  </div>
                  <button
                    type="button"
                    className="factuur-regel-remove"
                    onClick={() => removeRegel(r.id)}
                    aria-label="Verwijder regel"
                    disabled={regels.length === 1}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* === Sectie: Notitie === */}
        <div className="factuur-section">
          <div className="factuur-section-head">
            <h3>Notitie (optioneel)</h3>
          </div>
          <textarea
            className="factuur-notitie"
            value={notitie}
            onChange={(e) => setNotitie(e.target.value)}
            placeholder="Bijv. Bedankt voor je opdracht. Graag binnen 14 dagen overmaken naar bovenstaand IBAN onder vermelding van het factuurnummer."
            rows={3}
          />
        </div>

        {/* === Totalen + actie === */}
        <div className="factuur-totalen-box">
          <div className="factuur-totalen-rows">
            <div>
              <span>Subtotaal</span>
              <strong>{formatEur(totalen.subtotaalCents)}</strong>
            </div>
            {totalen.perTarief.map(([tarief, info]) => (
              <div key={tarief}>
                <span>BTW {tarief}%</span>
                <strong>{formatEur(info.btw)}</strong>
              </div>
            ))}
            <div className="factuur-totalen-eind">
              <span>Te betalen</span>
              <strong>{formatEur(totalen.totaalCents)}</strong>
            </div>
          </div>
          <button
            type="button"
            className="button"
            onClick={generatePdf}
            disabled={isGenerating}
          >
            <Download size={16} />
            {isGenerating ? "Even geduld…" : "Download factuur als PDF"}
          </button>
        </div>
      </div>
    </MiniToolPage>
  );
}
