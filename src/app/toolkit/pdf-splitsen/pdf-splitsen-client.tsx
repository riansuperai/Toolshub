"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileArchive,
  FileText,
  RefreshCw,
  Scissors,
  Upload,
  X
} from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

type Mode = "perPage" | "selection";

type FileInfo = {
  file: File;
  pageCount: number;
};

type Stage =
  | { kind: "idle" }
  | { kind: "loaded"; info: FileInfo }
  | { kind: "processing"; page: number; total: number }
  | {
      kind: "done";
      url: string;
      filename: string;
      pageCount: number;
      sizeBytes: number;
      isZip: boolean;
    }
  | { kind: "error"; message: string };

const MAX_INPUT_SIZE = 50 * 1024 * 1024; // 50 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Parseer page-range input zoals "1-3, 5, 7-10" naar een gesorteerde
 * gededupliceerde lijst van 1-geïndexeerde pagina-nummers binnen 1..maxPage.
 */
function parseRanges(input: string, maxPage: number): number[] {
  const result = new Set<number>();
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [aStr, bStr] = part.split("-").map((s) => s.trim());
      const a = parseInt(aStr, 10);
      const b = parseInt(bStr, 10);
      if (Number.isNaN(a) || Number.isNaN(b)) continue;
      const from = Math.max(1, Math.min(a, b));
      const to = Math.min(maxPage, Math.max(a, b));
      for (let i = from; i <= to; i++) result.add(i);
    } else {
      const n = parseInt(part, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= maxPage) result.add(n);
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

export function PdfSplitsenClient() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [mode, setMode] = useState<Mode>("perPage");
  const [selection, setSelection] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URL bij vervangen of unmount
  useEffect(() => {
    return () => {
      if (stage.kind === "done") URL.revokeObjectURL(stage.url);
    };
  }, [stage]);

  const handleFile = useCallback(async (file: File) => {
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setStage({ kind: "error", message: "Kies een PDF-bestand (.pdf)." });
      return;
    }
    if (file.size > MAX_INPUT_SIZE) {
      setStage({
        kind: "error",
        message: "PDF te groot. Kies een bestand kleiner dan 50 MB."
      });
      return;
    }
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const pageCount = doc.getPageCount();
      setStage({ kind: "loaded", info: { file, pageCount } });
      // Default selectie: hele bestand
      setSelection(`1-${pageCount}`);
    } catch (err) {
      setStage({
        kind: "error",
        message:
          err instanceof Error
            ? `PDF kon niet ingelezen worden: ${err.message}`
            : "Onbekende fout bij inlezen PDF."
      });
    }
  }, []);

  function reset() {
    setStage({ kind: "idle" });
    setSelection("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  // Live preview welke pagina's geselecteerd zijn
  const selectedPages = useMemo(() => {
    if (stage.kind !== "loaded" && stage.kind !== "processing") return [];
    const max =
      stage.kind === "loaded"
        ? stage.info.pageCount
        : stage.total;
    return parseRanges(selection, max);
  }, [selection, stage]);

  async function splitPerPage() {
    if (stage.kind !== "loaded") return;
    const { file, pageCount } = stage.info;
    setStage({ kind: "processing", page: 0, total: pageCount });
    try {
      const { PDFDocument } = await import("pdf-lib");
      const JSZip = (await import("jszip")).default;
      const buf = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const zip = new JSZip();
      const baseName = file.name.replace(/\.pdf$/i, "");

      for (let i = 0; i < pageCount; i++) {
        setStage({ kind: "processing", page: i + 1, total: pageCount });
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(sourceDoc, [i]);
        newDoc.addPage(page);
        const bytes = await newDoc.save();
        zip.file(`${baseName}-pagina-${i + 1}.pdf`, bytes);
        // Yield event-loop voor UI updates
        await new Promise((r) => setTimeout(r, 0));
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      setStage({
        kind: "done",
        url,
        filename: `${baseName}-gesplitst.zip`,
        pageCount,
        sizeBytes: blob.size,
        isZip: true
      });
    } catch (err) {
      setStage({
        kind: "error",
        message:
          err instanceof Error
            ? `Splitsen mislukt: ${err.message}`
            : "Onbekende fout bij splitsen."
      });
    }
  }

  async function extractSelection() {
    if (stage.kind !== "loaded") return;
    const { file, pageCount } = stage.info;
    const pages = parseRanges(selection, pageCount);
    if (pages.length === 0) {
      setStage({ kind: "error", message: "Geen geldige pagina's geselecteerd." });
      return;
    }
    setStage({ kind: "processing", page: 0, total: pages.length });
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buf = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const indices = pages.map((p) => p - 1);
      const copied = await newDoc.copyPages(sourceDoc, indices);
      for (let i = 0; i < copied.length; i++) {
        newDoc.addPage(copied[i]);
        setStage({ kind: "processing", page: i + 1, total: copied.length });
        await new Promise((r) => setTimeout(r, 0));
      }
      const bytes = await newDoc.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, "");
      setStage({
        kind: "done",
        url,
        filename: `${baseName}-selectie.pdf`,
        pageCount: pages.length,
        sizeBytes: blob.size,
        isZip: false
      });
    } catch (err) {
      setStage({
        kind: "error",
        message:
          err instanceof Error
            ? `Extractie mislukt: ${err.message}`
            : "Onbekende fout bij extractie."
      });
    }
  }

  return (
    <MiniToolPage
      slug="pdf-splitsen"
      privacyNote="PDF wordt 100% in je browser gesplitst. Hazenco ontvangt geen documenten."
      howItWorks={[
        "Upload of sleep een PDF (.pdf, max 50 MB).",
        "Kies of je elke pagina als losse PDF wil (per-pagina), of een selectie pagina's in één PDF (bijv. 1-3, 5, 7-10).",
        "Download het resultaat — als ZIP bij per-pagina, als losse PDF bij selectie."
      ]}
      crossSell={{
        heading: "PDFs automatisch knippen op trigger?",
        body:
          "Hazenco bouwt PDF-workflows die rapporten splitsen, contracten extraheren of facturen taggen — bij upload, op schema of vanaf je inbox.",
        cta: "Plan een gesprek",
        href: "https://hazenco.nl/contact/"
      }}
    >
      <div className="pdfsplit-tool">
        {stage.kind === "idle" ? (
          <label
            className={`bgremove-dropzone${isDragging ? " dragging" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="bgremove-dropzone-inner">
              <div className="bgremove-dropzone-icon">
                <Upload size={26} />
              </div>
              <strong>Sleep een PDF hierheen of klik om te uploaden</strong>
              <p>PDF — max 50 MB</p>
            </div>
          </label>
        ) : null}

        {stage.kind === "loaded" ? (
          <>
            <div className="pdfcomp-file">
              <div className="pdfcomp-file-icon">
                <FileText size={22} />
              </div>
              <div className="pdfcomp-file-info">
                <strong>{stage.info.file.name}</strong>
                <span>
                  {formatBytes(stage.info.file.size)} · {stage.info.pageCount} pagina&apos;s
                </span>
              </div>
              <button
                type="button"
                className="pdfcomp-file-remove"
                onClick={reset}
                aria-label="Verwijder bestand"
              >
                <X size={16} />
              </button>
            </div>

            <div className="pdfsplit-modes">
              <button
                type="button"
                className={`pdfsplit-mode${mode === "perPage" ? " active" : ""}`}
                onClick={() => setMode("perPage")}
              >
                <strong>Elke pagina los</strong>
                <span>Krijg een ZIP met {stage.info.pageCount} aparte PDFs</span>
              </button>
              <button
                type="button"
                className={`pdfsplit-mode${mode === "selection" ? " active" : ""}`}
                onClick={() => setMode("selection")}
              >
                <strong>Selecteer pagina&apos;s</strong>
                <span>Eén PDF met alleen de pagina&apos;s die jij kiest</span>
              </button>
            </div>

            {mode === "selection" ? (
              <label className="pdfsplit-input-label">
                <span>Pagina-selectie</span>
                <input
                  type="text"
                  value={selection}
                  onChange={(e) => setSelection(e.target.value)}
                  placeholder="Bijv. 1-3, 5, 7-10"
                  spellCheck={false}
                />
                <small>
                  {selectedPages.length === 0
                    ? "Type bereiken of losse pagina's, gescheiden door komma's."
                    : `${selectedPages.length} pagina${
                        selectedPages.length === 1 ? "" : "'s"
                      } geselecteerd: ${
                        selectedPages.length <= 12
                          ? selectedPages.join(", ")
                          : `${selectedPages.slice(0, 10).join(", ")}, ... +${selectedPages.length - 10}`
                      }`}
                </small>
              </label>
            ) : null}

            <div className="bgremove-actions">
              <button
                type="button"
                className="button"
                onClick={mode === "perPage" ? splitPerPage : extractSelection}
                disabled={mode === "selection" && selectedPages.length === 0}
              >
                <Scissors size={16} />
                {mode === "perPage"
                  ? `Splits in ${stage.info.pageCount} bestanden`
                  : `Extraheer ${selectedPages.length} pagina${
                      selectedPages.length === 1 ? "" : "'s"
                    }`}
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={reset}
              >
                Andere PDF
              </button>
            </div>
          </>
        ) : null}

        {stage.kind === "processing" ? (
          <div className="bgremove-status">
            <div className="bgremove-status-icon spinning">
              <RefreshCw size={22} />
            </div>
            <strong>
              Bezig… pagina {stage.page} van {stage.total}
            </strong>
            <p>Even geduld, je PDF wordt gesplitst.</p>
            <div className="bgremove-progress">
              <div
                className="bgremove-progress-bar"
                style={{
                  width: `${Math.round(
                    (stage.page / Math.max(1, stage.total)) * 100
                  )}%`
                }}
              />
            </div>
          </div>
        ) : null}

        {stage.kind === "done" ? (
          <>
            <div className="pdfsplit-result">
              <div className="pdfsplit-result-icon">
                {stage.isZip ? <FileArchive size={22} /> : <FileText size={22} />}
              </div>
              <div className="pdfsplit-result-info">
                <strong>
                  Klaar — {stage.pageCount} pagina
                  {stage.pageCount === 1 ? "" : "'s"}
                </strong>
                <span>
                  {stage.isZip ? "ZIP-bestand" : "PDF"} · {formatBytes(stage.sizeBytes)}
                </span>
              </div>
              <a
                className="button"
                href={stage.url}
                download={stage.filename}
              >
                <Download size={16} /> Download
              </a>
            </div>
            <button
              type="button"
              className="button secondary"
              onClick={reset}
              style={{ alignSelf: "flex-start" }}
            >
              <X size={15} /> Andere PDF splitsen
            </button>
          </>
        ) : null}

        {stage.kind === "error" ? (
          <div className="bgremove-status error">
            <div className="bgremove-status-icon">
              <FileText size={22} />
            </div>
            <strong>Iets ging mis</strong>
            <p>{stage.message}</p>
            <button
              type="button"
              className="button secondary"
              onClick={reset}
            >
              Opnieuw proberen
            </button>
          </div>
        ) : null}
      </div>
    </MiniToolPage>
  );
}
