"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Combine,
  Download,
  FileText,
  Upload,
  X
} from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

type FileEntry = {
  id: string;
  file: File;
  pages: number | null;
};

type Stage =
  | { kind: "idle" }
  | { kind: "processing" }
  | {
      kind: "done";
      blob: Blob;
      url: string;
      totalPages: number;
      totalSize: number;
    }
  | { kind: "error"; message: string };

const MAX_FILES = 20;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

function createId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfSamenvoegenClient() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Object-URLs opruimen wanneer state weg gaat
  useEffect(() => {
    return () => {
      if (stage.kind === "done" && stage.url) URL.revokeObjectURL(stage.url);
    };
  }, [stage]);

  const addFiles = useCallback(async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    setFiles((prev) => {
      const space = MAX_FILES - prev.length;
      if (space <= 0) return prev;
      const accepted: FileEntry[] = [];
      for (const f of arr.slice(0, space)) {
        const isPdf =
          f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
        if (!isPdf) continue;
        if (f.size > MAX_FILE_SIZE) continue;
        accepted.push({ id: createId(), file: f, pages: null });
      }
      return [...prev, ...accepted];
    });

    // Pagina-aantal asynchroon ophalen via pdf-lib — niet blokkerend
    for (const f of arr) {
      if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf"))
        continue;
      if (f.size > MAX_FILE_SIZE) continue;
      try {
        const { PDFDocument } = await import("pdf-lib");
        const buf = await f.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pages = doc.getPageCount();
        setFiles((prev) =>
          prev.map((entry) =>
            entry.file === f && entry.pages === null ? { ...entry, pages } : entry
          )
        );
      } catch {
        // Pagina-telling lukt niet (encryptie etc.) — laat null staan,
        // merge kan alsnog werken zolang pdf-lib het bestand kan inladen
      }
    }
  }, []);

  function moveUp(id: string) {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(id: string) {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function clearAll() {
    setFiles([]);
    if (stage.kind === "done") URL.revokeObjectURL(stage.url);
    setStage({ kind: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  async function merge() {
    if (files.length < 2) return;
    setStage({ kind: "processing" });
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedDoc = await PDFDocument.create();
      let totalPages = 0;

      for (const entry of files) {
        const buf = await entry.file.arrayBuffer();
        const sourceDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const pageIndices = sourceDoc.getPageIndices();
        const copied = await mergedDoc.copyPages(sourceDoc, pageIndices);
        for (const page of copied) {
          mergedDoc.addPage(page);
          totalPages += 1;
        }
        // Yield event-loop tussen bestanden zodat UI niet vastloopt
        await new Promise((r) => setTimeout(r, 0));
      }

      const bytes = await mergedDoc.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setStage({
        kind: "done",
        blob,
        url,
        totalPages,
        totalSize: blob.size
      });
    } catch (error) {
      console.error("PDF merge error", error);
      setStage({
        kind: "error",
        message:
          error instanceof Error
            ? `Samenvoegen mislukt: ${error.message}`
            : "Onbekende fout bij samenvoegen."
      });
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  const canMerge = files.length >= 2 && stage.kind !== "processing";
  const totalInputPages = files.reduce((s, f) => s + (f.pages ?? 0), 0);
  const totalInputSize = files.reduce((s, f) => s + f.file.size, 0);

  return (
    <MiniToolPage
      slug="pdf-samenvoegen"
      privacyNote="PDFs worden in je eigen browser samengevoegd. Hazenco ontvangt geen bestanden."
      howItWorks={[
        "Sleep of upload 2 tot 20 PDF-bestanden (max 50 MB per stuk).",
        "Zet ze in de juiste volgorde met de pijltjes — bovenste komt eerst, onderste komt laatst.",
        "Klik op \"PDFs samenvoegen\" en download het gecombineerde document."
      ]}
      crossSell={{
        heading: "Bulk PDF-workflow nodig?",
        body:
          "Hazenco automatiseert je document-pipeline — facturen bundelen, contracten samenvoegen, rapporten genereren in één flow.",
        cta: "Plan een gesprek",
        href: "/tools/website-laten-maken"
      }}
    >
      <div className="pdfmerge-tool">
        {files.length < MAX_FILES ? (
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
              multiple
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
              }}
            />
            <div className="bgremove-dropzone-inner">
              <div className="bgremove-dropzone-icon">
                <Upload size={26} />
              </div>
              <strong>Sleep PDFs hierheen of klik om te uploaden</strong>
              <p>
                PDF — max {MAX_FILES} tegelijk, 50 MB per stuk
                {files.length > 0
                  ? ` (${files.length}/${MAX_FILES} toegevoegd)`
                  : ""}
              </p>
            </div>
          </label>
        ) : (
          <div className="imgcomp-limit">
            <FileText size={18} />
            Maximum bereikt — {MAX_FILES} PDFs. Verwijder er één om door te gaan.
          </div>
        )}

        {/* File list met reorder + remove */}
        {files.length > 0 ? (
          <div className="pdfmerge-list">
            {files.map((entry, idx) => (
              <div key={entry.id} className="pdfmerge-row">
                <div className="pdfmerge-index">{idx + 1}</div>
                <div className="pdfmerge-icon">
                  <FileText size={20} />
                </div>
                <div className="pdfmerge-info">
                  <strong>{entry.file.name}</strong>
                  <span>
                    {formatBytes(entry.file.size)}
                    {entry.pages !== null ? ` · ${entry.pages} pagina's` : ""}
                  </span>
                </div>
                <div className="pdfmerge-actions">
                  <button
                    type="button"
                    onClick={() => moveUp(entry.id)}
                    disabled={idx === 0}
                    aria-label="Naar boven"
                    title="Naar boven"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(entry.id)}
                    disabled={idx === files.length - 1}
                    aria-label="Naar beneden"
                    title="Naar beneden"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    className="pdfmerge-remove"
                    onClick={() => removeFile(entry.id)}
                    aria-label="Verwijder"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Totalen + main action */}
        {files.length > 0 ? (
          <div className="pdfmerge-summary">
            <div className="pdfmerge-summary-text">
              <strong>
                {files.length} bestand{files.length === 1 ? "" : "en"}
                {totalInputPages > 0 ? ` · ${totalInputPages} pagina's totaal` : ""}
              </strong>
              <span>Totaal: {formatBytes(totalInputSize)}</span>
            </div>
            <div className="bgremove-actions">
              <button
                type="button"
                className="button"
                onClick={merge}
                disabled={!canMerge}
              >
                <Combine size={16} />
                {stage.kind === "processing"
                  ? "Bezig…"
                  : files.length < 2
                  ? "Voeg minstens 2 PDFs toe"
                  : "PDFs samenvoegen"}
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={clearAll}
                disabled={stage.kind === "processing"}
              >
                <X size={15} /> Leegmaken
              </button>
            </div>
          </div>
        ) : null}

        {/* Resultaat */}
        {stage.kind === "done" ? (
          <div className="pdfmerge-result">
            <div className="pdfmerge-result-info">
              <strong>Samengevoegd ✓</strong>
              <span>
                {stage.totalPages} pagina's · {formatBytes(stage.totalSize)}
              </span>
            </div>
            <a
              className="button"
              href={stage.url}
              download={`samengevoegd-${Date.now()}.pdf`}
            >
              <Download size={16} /> Download samengevoegde PDF
            </a>
          </div>
        ) : null}

        {/* Error */}
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
              onClick={() => setStage({ kind: "idle" })}
            >
              Sluiten
            </button>
          </div>
        ) : null}
      </div>
    </MiniToolPage>
  );
}
