"use client";

import { useCallback, useRef, useState } from "react";
import {
  Download,
  FileArchive,
  RefreshCw,
  Upload,
  X
} from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

type Level = "light" | "balanced" | "max";

type LevelConfig = {
  id: Level;
  title: string;
  description: string;
  dpi: number;
  jpegQuality: number;
};

const LEVELS: LevelConfig[] = [
  {
    id: "light",
    title: "Licht",
    description: "Best voor printen en scherp lezen. ~150 DPI.",
    dpi: 150,
    jpegQuality: 0.85
  },
  {
    id: "balanced",
    title: "Gebalanceerd",
    description: "Perfect voor e-mail en webgebruik. ~100 DPI.",
    dpi: 100,
    jpegQuality: 0.75
  },
  {
    id: "max",
    title: "Maximaal",
    description: "Kleinste bestand, alleen voor schermweergave. ~72 DPI.",
    dpi: 72,
    jpegQuality: 0.6
  }
];

const MAX_INPUT_SIZE = 50 * 1024 * 1024; // 50 MB

type Stage =
  | { kind: "idle" }
  | {
      kind: "ready-to-compress";
      file: File;
    }
  | {
      kind: "processing";
      page: number;
      totalPages: number;
    }
  | {
      kind: "done";
      originalSize: number;
      newSize: number;
      blob: Blob;
      url: string;
      filename: string;
    }
  | { kind: "error"; message: string };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Cached pdfjs library — eenmaal laden, daarna hergebruiken. De worker
 * komt via jsDelivr CDN zodat we geen extra build-config nodig hebben.
 */
let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;
async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

export function PdfComprimerenClient() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [level, setLevel] = useState<Level>("balanced");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
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
    setStage({ kind: "ready-to-compress", file });
  }, []);

  async function compress() {
    if (stage.kind !== "ready-to-compress") return;
    const { file } = stage;
    const config = LEVELS.find((l) => l.id === level) ?? LEVELS[1];

    setStage({ kind: "processing", page: 0, totalPages: 1 });

    try {
      const pdfjs = await getPdfjs();
      const { PDFDocument } = await import("pdf-lib");

      const buffer = await file.arrayBuffer();
      const sourceDoc = await pdfjs.getDocument({ data: buffer }).promise;
      const numPages = sourceDoc.numPages;
      const newPdf = await PDFDocument.create();

      const scale = config.dpi / 72;

      for (let i = 1; i <= numPages; i++) {
        setStage({ kind: "processing", page: i, totalPages: numPages });

        const page = await sourceDoc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas niet beschikbaar.");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const jpegBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", config.jpegQuality)
        );
        if (!jpegBlob) throw new Error("JPEG-export faalde.");
        const jpegBuffer = await jpegBlob.arrayBuffer();
        const embedded = await newPdf.embedJpg(jpegBuffer);

        // Hou de originele PDF-pagina grootte (72 DPI standaard) zodat het
        // resultaat dezelfde afdrukmaat heeft als het origineel.
        const pageWidth = viewport.width / scale;
        const pageHeight = viewport.height / scale;
        const newPage = newPdf.addPage([pageWidth, pageHeight]);
        newPage.drawImage(embedded, {
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight
        });

        // Yield de event-loop zodat de UI kan updaten
        await new Promise((r) => setTimeout(r, 0));
      }

      const newBytes = await newPdf.save({ useObjectStreams: true });
      const blob = new Blob([newBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, "");
      const filename = `${baseName}-gecomprimeerd.pdf`;

      setStage({
        kind: "done",
        originalSize: file.size,
        newSize: blob.size,
        blob,
        url,
        filename
      });
    } catch (error) {
      console.error("PDF compress error", error);
      setStage({
        kind: "error",
        message:
          error instanceof Error
            ? `Comprimeren mislukt: ${error.message}`
            : "Onbekende fout bij comprimeren."
      });
    }
  }

  function reset() {
    setStage({ kind: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const reduction =
    stage.kind === "done"
      ? Math.max(0, Math.round((1 - stage.newSize / stage.originalSize) * 100))
      : 0;

  return (
    <MiniToolPage
      slug="pdf-comprimeren"
      privacyNote="PDF wordt 100% in je browser verwerkt. Hazenco ontvangt geen documenten."
      howItWorks={[
        "Upload of sleep een PDF naar het vak (.pdf, max 50 MB).",
        "Kies een niveau: licht voor printkwaliteit, gebalanceerd voor e-mail, maximaal voor minimum bestandsgrootte.",
        "Klik op \"Comprimeer\" en download het verkleinde PDF-bestand."
      ]}
      crossSell={{
        heading: "Bulk PDF-verwerking nodig?",
        body:
          "Hazenco bouwt automation voor je document-flow — facturen, contracten en rapporten verkleinen, taggen en archiveren in één pipeline.",
        cta: "Plan een gesprek",
        href: "/tools/website-laten-maken"
      }}
    >
      <div className="pdfcomp-tool">
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

        {stage.kind === "ready-to-compress" ? (
          <>
            <div className="pdfcomp-file">
              <div className="pdfcomp-file-icon">
                <FileArchive size={22} />
              </div>
              <div className="pdfcomp-file-info">
                <strong>{stage.file.name}</strong>
                <span>{formatBytes(stage.file.size)}</span>
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

            <div className="pdfcomp-levels">
              <span className="pdfcomp-levels-label">Compressie-niveau</span>
              <div className="pdfcomp-levels-grid">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={`pdfcomp-level${level === l.id ? " active" : ""}`}
                    onClick={() => setLevel(l.id)}
                  >
                    <strong>{l.title}</strong>
                    <span>{l.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pdfcomp-actions">
              <button type="button" className="button" onClick={compress}>
                <FileArchive size={16} /> Comprimeer PDF
              </button>
              <button type="button" className="button secondary" onClick={reset}>
                Andere PDF kiezen
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
              Comprimeren… pagina {stage.page} van {stage.totalPages}
            </strong>
            <p>
              Elke pagina wordt opnieuw gerenderd op het gekozen niveau. Dit
              kan een paar seconden duren bij grote PDFs.
            </p>
            <div className="bgremove-progress">
              <div
                className="bgremove-progress-bar"
                style={{
                  width: `${Math.round(
                    (stage.page / Math.max(1, stage.totalPages)) * 100
                  )}%`
                }}
              />
            </div>
          </div>
        ) : null}

        {stage.kind === "done" ? (
          <>
            <div className="pdfcomp-result">
              <div className="pdfcomp-result-row">
                <div className="pdfcomp-result-cell">
                  <span>Origineel</span>
                  <strong>{formatBytes(stage.originalSize)}</strong>
                </div>
                <div className="pdfcomp-result-arrow">→</div>
                <div className="pdfcomp-result-cell highlight">
                  <span>Nu</span>
                  <strong>{formatBytes(stage.newSize)}</strong>
                </div>
                <div className="pdfcomp-result-cell badge">
                  <span>Reductie</span>
                  <strong>{reduction}%</strong>
                </div>
              </div>
            </div>
            <div className="bgremove-actions">
              <a
                className="button"
                href={stage.url}
                download={stage.filename}
              >
                <Download size={16} /> Download verkleinde PDF
              </a>
              <button type="button" className="button secondary" onClick={reset}>
                <X size={15} /> Andere PDF
              </button>
            </div>
          </>
        ) : null}

        {stage.kind === "error" ? (
          <div className="bgremove-status error">
            <div className="bgremove-status-icon">
              <FileArchive size={22} />
            </div>
            <strong>Iets ging mis</strong>
            <p>{stage.message}</p>
            <button type="button" className="button secondary" onClick={reset}>
              Opnieuw proberen
            </button>
          </div>
        ) : null}
      </div>
    </MiniToolPage>
  );
}
