"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Upload } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import type { ProductType } from "@/lib/types";

const SAMPLE_CSV = `title,tagline,description,type,price_eur,setup_price_eur,compatibility,tags,delivery_modes,support_included
"n8n Slack Notifier","Stuur Slack berichten vanuit elke workflow","Voorbeeldig configureerbare Slack-integratie...",workflow,29,15,"n8n,zapier","slack,notifications,workflow",download,"3 maanden e-mail support"
"AI Email Classifier","Sorteer e-mails automatisch met GPT-4","Categoriseert binnenkomende e-mails...",ai_agent,49,25,"gmail,outlook","ai,gpt,classifier","download,cloud","6 maanden chat support"
"Shopify Inventory Sync","Houd voorraad gelijk over kanalen","Synchroniseert Shopify voorraad...",plugin,99,50,"shopify","ecommerce,inventory","download,custom","12 maanden support"`;

type ParsedRow = {
  title: string;
  tagline: string;
  description: string;
  type: string;
  price_eur: string;
  setup_price_eur: string;
  compatibility: string;
  tags: string;
  delivery_modes: string;
  support_included: string;
  valid: boolean;
  errors: string[];
};

const VALID_TYPES: ProductType[] = ["workflow", "ai_agent", "plugin", "extension", "skill", "theme", "template", "service_package"];

function parseCsv(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => { obj[h] = (cells[idx] ?? "").trim(); });

    const errors: string[] = [];
    if (!obj.title || obj.title.length < 3) errors.push("Titel te kort");
    if (!obj.type || !VALID_TYPES.includes(obj.type as ProductType)) errors.push(`Type ongeldig (kies: ${VALID_TYPES.join(", ")})`);
    if (!obj.price_eur || isNaN(parseFloat(obj.price_eur))) errors.push("Prijs niet numeriek");

    rows.push({
      title: obj.title ?? "",
      tagline: obj.tagline ?? "",
      description: obj.description ?? "",
      type: obj.type ?? "",
      price_eur: obj.price_eur ?? "0",
      setup_price_eur: obj.setup_price_eur ?? "0",
      compatibility: obj.compatibility ?? "",
      tags: obj.tags ?? "",
      delivery_modes: obj.delivery_modes ?? "download",
      support_included: obj.support_included ?? "",
      valid: errors.length === 0,
      errors
    });
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuote = false;
      else cur += ch;
    } else {
      if (ch === ",") { out.push(cur); cur = ""; }
      else if (ch === '"') inQuote = true;
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export default function SellerImportPage() {
  const { activeUser, state, createListing } = useMarketplace();
  const data = useSellerData();
  const toast = useToast();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (activeUser.role !== "seller" || !data.seller) return null;

  const defaultCategoryId = state.categories[0]?.id ?? "";

  async function handleFile(file: File) {
    const text = await file.text();
    const parsed = parseCsv(text);
    setRows(parsed);
    setSelectedIndices(new Set(parsed.map((_, i) => parsed[i].valid ? i : -1).filter((i) => i >= 0)));
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hazenco-listings-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importSelected() {
    let count = 0;
    for (const idx of selectedIndices) {
      const row = rows[idx];
      if (!row?.valid) continue;
      const result = createListing({
        title: row.title,
        tagline: row.tagline,
        description: row.description,
        categoryId: defaultCategoryId,
        type: row.type as ProductType,
        priceCents: Math.round(parseFloat(row.price_eur) * 100),
        setupPriceCents: Math.round(parseFloat(row.setup_price_eur || "0") * 100),
        compatibility: row.compatibility.split(",").map((s) => s.trim()).filter(Boolean),
        tags: row.tags.split(",").map((s) => s.trim()).filter(Boolean),
        deliveryModes: row.delivery_modes.split(",").map((s) => s.trim()).filter(Boolean) as ("download" | "cloud" | "custom")[],
        files: [],
        demoUrl: "",
        demoInstructions: "",
        sampleInput: "",
        supportIncluded: row.support_included
      });
      if (result) count++;
    }
    toast.success(`${count} listings aangemaakt`, "Allemaal in concept — kun je nog finetunen voor je ze indient.");
    setRows([]);
    setSelectedIndices(new Set());
  }

  function toggleSelect(idx: number) {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const validCount = rows.filter((r) => r.valid).length;

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><FileSpreadsheet size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Bulk import</span>
            <h2>Upload meerdere listings tegelijk</h2>
          </div>
          <button type="button" className="button secondary" onClick={downloadSample}>
            <Download size={14} /> Download template
          </button>
        </div>

        {rows.length === 0 ? (
          <>
            <div className="file-dropzone" onClick={() => inputRef.current?.click()} role="button" tabIndex={0}>
              <div className="file-dropzone-icon"><Upload size={28} /></div>
              <strong>Sleep een CSV hierheen</strong>
              <small>Of klik om te bladeren · gebruik onze template voor het juiste format</small>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              />
            </div>
            <p style={{ marginTop: 14, color: "var(--green-500)", fontSize: 12.5 }}>
              <AlertCircle size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
              Geïmporteerde listings staan op <strong>concept</strong> — je moet ze daarna nog handmatig indienen voor review.
            </p>
          </>
        ) : (
          <>
            <div className="import-preview-summary">
              <div>
                <strong>{rows.length}</strong>
                <small>Rijen gevonden</small>
              </div>
              <div className="ok">
                <strong>{validCount}</strong>
                <small>Geldig</small>
              </div>
              <div className="warn">
                <strong>{rows.length - validCount}</strong>
                <small>Met fouten</small>
              </div>
              <div className="highlight">
                <strong>{selectedIndices.size}</strong>
                <small>Geselecteerd</small>
              </div>
            </div>

            <div className="import-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Status</th>
                    <th>Titel</th>
                    <th>Type</th>
                    <th>Prijs</th>
                    <th>Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className={row.valid ? "" : "row-invalid"}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIndices.has(idx)}
                          onChange={() => toggleSelect(idx)}
                          disabled={!row.valid}
                        />
                      </td>
                      <td>
                        {row.valid ? (
                          <span style={{ color: "#16a34a" }}><CheckCircle2 size={14} style={{ verticalAlign: -2 }} /> OK</span>
                        ) : (
                          <span style={{ color: "#dc2626" }} title={row.errors.join(", ")}>
                            <AlertCircle size={14} style={{ verticalAlign: -2 }} /> {row.errors[0]}
                          </span>
                        )}
                      </td>
                      <td><strong>{row.title || "—"}</strong></td>
                      <td>{row.type}</td>
                      <td>€{row.price_eur}</td>
                      <td><small>{row.tags}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="import-actions">
              <button type="button" className="button secondary" onClick={() => { setRows([]); setSelectedIndices(new Set()); }}>
                Annuleren
              </button>
              <button type="button" className="button" disabled={selectedIndices.size === 0} onClick={importSelected}>
                <Upload size={14} /> Importeer {selectedIndices.size} listings
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
