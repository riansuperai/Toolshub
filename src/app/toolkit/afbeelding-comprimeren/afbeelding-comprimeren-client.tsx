"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  FileArchive,
  Images,
  RefreshCw,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

type OutputFormat = "auto" | "jpeg" | "webp";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per bestand

type FileEntry = {
  id: string;
  file: File;
  originalSize: number;
  previewUrl: string;
  result?: {
    blob: Blob;
    url: string;
    size: number;
    outputName: string;
  };
  error?: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function createId() {
  return Math.random().toString(36).slice(2, 9);
}

function pickMimeAndExt(
  source: File,
  format: OutputFormat
): { mime: string; ext: string } {
  if (format === "jpeg") return { mime: "image/jpeg", ext: "jpg" };
  if (format === "webp") return { mime: "image/webp", ext: "webp" };
  // auto: hou origineel formaat aan, valt terug op JPEG bij onbekend
  if (source.type === "image/jpeg") return { mime: "image/jpeg", ext: "jpg" };
  if (source.type === "image/png") return { mime: "image/png", ext: "png" };
  if (source.type === "image/webp") return { mime: "image/webp", ext: "webp" };
  return { mime: "image/jpeg", ext: "jpg" };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Kon afbeelding niet laden."));
    img.src = url;
  });
}

async function compressImage(
  file: File,
  format: OutputFormat,
  quality: number
): Promise<{ blob: Blob; mime: string; ext: string }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas niet beschikbaar.");
    ctx.drawImage(img, 0, 0);

    const { mime, ext } = pickMimeAndExt(file, format);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), mime, quality / 100)
    );
    if (!blob) {
      throw new Error(
        `${mime} wordt niet door je browser ondersteund. Probeer een ander uitvoerformaat.`
      );
    }
    return { blob, mime, ext };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function AfbeeldingComprimerenClient() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [quality, setQuality] = useState<number>(75);
  const [format, setFormat] = useState<OutputFormat>("auto");
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Object-URLs opruimen wanneer entry uit state verdwijnt
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        URL.revokeObjectURL(f.previewUrl);
        if (f.result?.url) URL.revokeObjectURL(f.result.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setFiles((prev) => {
      const space = MAX_FILES - prev.length;
      if (space <= 0) return prev;
      const accepted: FileEntry[] = [];
      for (const f of Array.from(incoming).slice(0, space)) {
        if (!f.type.startsWith("image/")) continue;
        if (f.size > MAX_FILE_SIZE) continue;
        accepted.push({
          id: createId(),
          file: f,
          originalSize: f.size,
          previewUrl: URL.createObjectURL(f)
        });
      }
      return [...prev, ...accepted];
    });
  }, []);

  function removeFile(id: string) {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.result?.url) URL.revokeObjectURL(target.result.url);
      }
      return prev.filter((f) => f.id !== id);
    });
  }

  function clearAll() {
    files.forEach((f) => {
      URL.revokeObjectURL(f.previewUrl);
      if (f.result?.url) URL.revokeObjectURL(f.result.url);
    });
    setFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function compressAll() {
    if (files.length === 0 || processing) return;
    setProcessing(true);
    try {
      // Sequentieel verwerken — voorkomt memory-piek bij grote sets
      for (const entry of files) {
        try {
          // Vorige run weggooien als bezoeker quality/format veranderde
          if (entry.result?.url) URL.revokeObjectURL(entry.result.url);
          const { blob, ext } = await compressImage(entry.file, format, quality);
          const baseName = entry.file.name.replace(/\.[^.]+$/, "");
          const outputName = `${baseName}-klein.${ext}`;
          const url = URL.createObjectURL(blob);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? {
                    ...f,
                    error: undefined,
                    result: { blob, url, size: blob.size, outputName }
                  }
                : f
            )
          );
        } catch (err) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? {
                    ...f,
                    result: undefined,
                    error: err instanceof Error ? err.message : "Onbekende fout"
                  }
                : f
            )
          );
        }
        // Yield zodat UI tussentijds kan updaten
        await new Promise((r) => setTimeout(r, 0));
      }
    } finally {
      setProcessing(false);
    }
  }

  async function downloadZip() {
    const ready = files.filter((f) => f.result);
    if (ready.length === 0) return;
    setZipBusy(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const f of ready) {
        zip.file(f.result!.outputName, f.result!.blob);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `afbeeldingen-klein-${Date.now()}.zip`;
      a.click();
      // Korte timeout zodat de browser de download mag pakken voor we revoken
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } finally {
      setZipBusy(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }

  const totalOriginal = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalNew = files.reduce(
    (sum, f) => sum + (f.result?.size ?? f.originalSize),
    0
  );
  const readyCount = files.filter((f) => f.result).length;
  const totalReduction =
    totalOriginal > 0 && readyCount === files.length && files.length > 0
      ? Math.max(0, Math.round((1 - totalNew / totalOriginal) * 100))
      : 0;

  return (
    <MiniToolPage
      slug="afbeelding-comprimeren"
      privacyNote="Compressie draait 100% in je browser. Jouw afbeeldingen blijven op je eigen apparaat."
      howItWorks={[
        "Upload of sleep tot 10 afbeeldingen (JPG, PNG, WebP) naar het vak — max 50 MB per stuk.",
        "Kies kwaliteit (75% is een goede balans) en eventueel een ander uitvoerformaat (JPEG of WebP voor kleinere bestanden).",
        "Klik op \"Comprimeer alles\" en download afzonderlijk of alles tegelijk als ZIP."
      ]}
      crossSell={{
        heading: "Productfoto's automatisch optimaliseren?",
        body:
          "Hazenco bouwt image-pipelines voor webshops — bij upload meteen comprimeren, formaten omzetten en in juiste formaten klaarzetten.",
        cta: "Plan een gesprek",
        href: "https://hazenco.nl/contact/"
      }}
    >
      <div className="imgcomp-tool">
        {/* Dropzone — blijft altijd zichtbaar, tenzij MAX_FILES bereikt */}
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
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
              }}
            />
            <div className="bgremove-dropzone-inner">
              <div className="bgremove-dropzone-icon">
                <Upload size={26} />
              </div>
              <strong>
                Sleep afbeeldingen hierheen of klik om te uploaden
              </strong>
              <p>
                JPG, PNG of WebP — max {MAX_FILES} tegelijk, 50 MB per stuk
                {files.length > 0 ? ` (${files.length}/${MAX_FILES} toegevoegd)` : ""}
              </p>
            </div>
          </label>
        ) : (
          <div className="imgcomp-limit">
            <Images size={18} />
            Maximum bereikt — {MAX_FILES} afbeeldingen. Verwijder er een om nieuwe toe te voegen.
          </div>
        )}

        {/* Settings */}
        {files.length > 0 ? (
          <div className="imgcomp-settings">
            <div className="imgcomp-setting">
              <div className="imgcomp-setting-head">
                <span>Kwaliteit</span>
                <strong>{quality}%</strong>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="imgcomp-slider"
              />
              <p className="imgcomp-hint">
                {quality >= 90
                  ? "Zo goed als origineel, weinig reductie."
                  : quality >= 70
                  ? "Goede balans tussen kwaliteit en grootte."
                  : quality >= 50
                  ? "Zichtbaar lager, maar veel kleiner bestand."
                  : "Sterk gecomprimeerd, alleen voor previews."}
              </p>
            </div>

            <div className="imgcomp-setting">
              <div className="imgcomp-setting-head">
                <span>Uitvoerformaat</span>
              </div>
              <div className="imgcomp-format-buttons">
                {(["auto", "jpeg", "webp"] as OutputFormat[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`imgcomp-format${format === f ? " active" : ""}`}
                    onClick={() => setFormat(f)}
                  >
                    {f === "auto" ? "Origineel" : f.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="imgcomp-hint">
                WebP geeft meestal de kleinste bestanden — ideaal voor websites.
              </p>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        {files.length > 0 ? (
          <div className="bgremove-actions">
            <button
              type="button"
              className="button"
              onClick={compressAll}
              disabled={processing}
            >
              <RefreshCw size={16} />
              {processing
                ? "Bezig…"
                : readyCount === files.length
                ? "Opnieuw comprimeren"
                : "Comprimeer alles"}
            </button>
            {readyCount > 1 ? (
              <button
                type="button"
                className="button secondary"
                onClick={downloadZip}
                disabled={zipBusy}
              >
                <FileArchive size={15} />
                {zipBusy ? "ZIP maken…" : `Download alles (${readyCount}) als ZIP`}
              </button>
            ) : null}
            <button
              type="button"
              className="button secondary"
              onClick={clearAll}
              disabled={processing}
            >
              <Trash2 size={15} /> Lijst leegmaken
            </button>
          </div>
        ) : null}

        {/* Totalen-balk */}
        {readyCount > 0 && readyCount === files.length ? (
          <div className="imgcomp-totals">
            <div>
              <span>Totaal origineel</span>
              <strong>{formatBytes(totalOriginal)}</strong>
            </div>
            <span className="imgcomp-totals-arrow">→</span>
            <div className="highlight">
              <span>Nu</span>
              <strong>{formatBytes(totalNew)}</strong>
            </div>
            <div className="badge">
              <span>Reductie</span>
              <strong>{totalReduction}%</strong>
            </div>
          </div>
        ) : null}

        {/* File list */}
        {files.length > 0 ? (
          <div className="imgcomp-list">
            {files.map((entry) => {
              const reduction =
                entry.result && entry.originalSize > 0
                  ? Math.max(
                      0,
                      Math.round((1 - entry.result.size / entry.originalSize) * 100)
                    )
                  : null;
              return (
                <div key={entry.id} className="imgcomp-row">
                  <div className="imgcomp-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={entry.previewUrl} alt={entry.file.name} />
                  </div>
                  <div className="imgcomp-row-info">
                    <strong>{entry.file.name}</strong>
                    <div className="imgcomp-row-sizes">
                      <span>{formatBytes(entry.originalSize)}</span>
                      {entry.result ? (
                        <>
                          <span className="arrow">→</span>
                          <span className="result-size">
                            {formatBytes(entry.result.size)}
                          </span>
                          {reduction !== null ? (
                            <span className="reduction">−{reduction}%</span>
                          ) : null}
                        </>
                      ) : entry.error ? (
                        <span className="error">{entry.error}</span>
                      ) : (
                        <span className="muted">Nog niet gecomprimeerd</span>
                      )}
                    </div>
                  </div>
                  <div className="imgcomp-row-actions">
                    {entry.result ? (
                      <a
                        className="imgcomp-row-download"
                        href={entry.result.url}
                        download={entry.result.outputName}
                        title="Download"
                      >
                        <Download size={15} />
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className="imgcomp-row-remove"
                      onClick={() => removeFile(entry.id)}
                      aria-label="Verwijder"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </MiniToolPage>
  );
}
