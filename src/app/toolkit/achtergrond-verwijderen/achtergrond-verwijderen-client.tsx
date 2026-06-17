"use client";

import { useCallback, useRef, useState } from "react";
import { Download, ImageOff, RefreshCw, Sparkles, Upload, X } from "lucide-react";
import { MiniToolPage } from "@/components/mini-tool-page";

type Stage =
  | { kind: "idle" }
  | { kind: "loading-model"; progress: number }
  | { kind: "processing" }
  | { kind: "ready"; resultUrl: string; originalUrl: string; resultBlob: Blob }
  | { kind: "error"; message: string };

const MODEL_ID = "briaai/RMBG-1.4";
const MAX_INPUT_SIZE = 8 * 1024 * 1024; // 8MB cap, anders te zwaar voor browser

/**
 * Cache van de transformers.js pipeline. Eenmaal geladen, hergebruiken
 * voor volgende afbeeldingen. Promise zodat parallelle calls dezelfde
 * load delen.
 */
let pipelinePromise: Promise<unknown> | null = null;

async function loadPipeline(onProgress: (progress: number) => void) {
  if (!pipelinePromise) {
    pipelinePromise = (async () => {
      const transformers = await import("@huggingface/transformers");
      // Configure: geen lokale modellen, browser cache aan
      transformers.env.allowLocalModels = false;
      // Geen WASM-paths verstellen, gewoon default cdn
      // useBrowserCache property bestaat niet in v3, IndexedDB cache is by default aan
      const pipeline = await transformers.pipeline("image-segmentation", MODEL_ID, {
        // Probeer WebGPU eerst, transformers.js valt terug op WASM
        device: hasWebGpu() ? "webgpu" : "wasm",
        progress_callback: (data: { status: string; progress?: number }) => {
          if (data?.status === "progress" && typeof data.progress === "number") {
            onProgress(data.progress);
          }
        }
      });
      return pipeline;
    })();
  }
  return pipelinePromise;
}

function hasWebGpu(): boolean {
  if (typeof navigator === "undefined") return false;
  return !!(navigator as { gpu?: unknown }).gpu;
}

export function AchtergrondVerwijderenClient() {
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStage({ kind: "error", message: "Kies een afbeelding (JPG, PNG, WebP)." });
      return;
    }
    if (file.size > MAX_INPUT_SIZE) {
      setStage({
        kind: "error",
        message: "Afbeelding te groot — kies een bestand kleiner dan 8 MB."
      });
      return;
    }

    const originalUrl = URL.createObjectURL(file);

    // Stap 1: model laden (eerste keer ~80MB download, daarna gecached)
    setStage({ kind: "loading-model", progress: 0 });

    try {
      const pipe = (await loadPipeline((p) => {
        setStage({ kind: "loading-model", progress: p });
      })) as (input: string) => Promise<Array<{ mask: { data: Uint8Array; width: number; height: number } }>>;

      // Stap 2: afbeelding door het model
      setStage({ kind: "processing" });

      const segmentationResult = await pipe(originalUrl);
      const mask = segmentationResult?.[0]?.mask;
      if (!mask) {
        throw new Error("Geen segmentatie-masker terug van model.");
      }

      // Stap 3: maak transparante PNG door het masker op de originele
      // afbeelding als alpha-channel toe te passen
      const resultBlob = await applyMask(originalUrl, mask);
      const resultUrl = URL.createObjectURL(resultBlob);

      setStage({ kind: "ready", resultUrl, originalUrl, resultBlob });
    } catch (error) {
      console.error("RMBG error", error);
      setStage({
        kind: "error",
        message:
          error instanceof Error
            ? `Verwerken mislukt: ${error.message}`
            : "Onbekende fout bij verwerken."
      });
    }
  }, []);

  function reset() {
    setStage({ kind: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  function downloadResult() {
    if (stage.kind !== "ready") return;
    const a = document.createElement("a");
    a.href = stage.resultUrl;
    a.download = `zonder-achtergrond-${Date.now()}.png`;
    a.click();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <MiniToolPage
      slug="achtergrond-verwijderen"
      privacyNote="AI draait 100% in je browser. Je foto wordt nooit naar onze servers gestuurd."
      howItWorks={[
        "Upload of sleep je foto (JPG, PNG of WebP, max 8 MB). Werkt voor producten, profielfoto's en logo's.",
        "Eerste keer: het AI-model wordt naar je browser gedownload (~44 MB, ~10-30 seconden op WiFi). Volgende keer is dat niet meer nodig.",
        "Download het resultaat als transparante PNG. Klaar voor webshop, social media of presentaties."
      ]}
      crossSell={{
        heading: "Productfoto's bulk verwerken?",
        body:
          "Hazenco zet automation op voor je webshop — productfoto's worden bij upload automatisch geprocest, formaten aangepast en geoptimaliseerd.",
        cta: "Plan een gesprek",
        href: "/tools/website-laten-maken"
      }}
    >
      <div className="bgremove-tool">
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
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="bgremove-dropzone-inner">
              <div className="bgremove-dropzone-icon">
                <Upload size={26} />
              </div>
              <strong>Sleep een afbeelding hierheen of klik om te uploaden</strong>
              <p>JPG, PNG of WebP — max 8 MB</p>
            </div>
          </label>
        ) : null}

        {stage.kind === "loading-model" ? (
          <div className="bgremove-status">
            <div className="bgremove-status-icon spinning">
              <Sparkles size={22} />
            </div>
            <strong>AI-model wordt geladen…</strong>
            <p>
              Eerste keer dat je deze tool gebruikt — duurt ongeveer 10-30
              seconden. Volgende keer is dit niet meer nodig.
            </p>
            <div className="bgremove-progress">
              <div
                className="bgremove-progress-bar"
                style={{ width: `${Math.round(stage.progress)}%` }}
              />
            </div>
          </div>
        ) : null}

        {stage.kind === "processing" ? (
          <div className="bgremove-status">
            <div className="bgremove-status-icon spinning">
              <RefreshCw size={22} />
            </div>
            <strong>Achtergrond verwijderen…</strong>
            <p>De AI analyseert je foto. Dit duurt 3-10 seconden.</p>
          </div>
        ) : null}

        {stage.kind === "ready" ? (
          <>
            <div className="bgremove-compare">
              <div className="bgremove-compare-pane">
                <span className="bgremove-pane-label">Origineel</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stage.originalUrl} alt="Origineel" />
              </div>
              <div className="bgremove-compare-pane checker">
                <span className="bgremove-pane-label">Zonder achtergrond</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stage.resultUrl} alt="Resultaat" />
              </div>
            </div>
            <div className="bgremove-actions">
              <button
                type="button"
                className="button"
                onClick={downloadResult}
              >
                <Download size={16} /> Download als PNG
              </button>
              <button type="button" className="button secondary" onClick={reset}>
                <X size={15} /> Nieuwe afbeelding
              </button>
            </div>
          </>
        ) : null}

        {stage.kind === "error" ? (
          <div className="bgremove-status error">
            <div className="bgremove-status-icon">
              <ImageOff size={22} />
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

/**
 * Past het segmentatie-masker toe op de originele afbeelding via een canvas
 * en levert een PNG-blob met transparante achtergrond.
 */
async function applyMask(
  imageUrl: string,
  mask: { data: Uint8Array; width: number; height: number }
): Promise<Blob> {
  const image = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar.");

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Mask is een Uint8Array met grayscale waarden 0-255.
  // Het masker is in de modelresolutie (meestal 1024x1024) — we schalen mee
  // door indices te interpoleren naar de target-resolutie. Simpele nearest
  // neighbor is genoeg voor alpha.
  const scaleX = mask.width / canvas.width;
  const scaleY = mask.height / canvas.height;
  for (let y = 0; y < canvas.height; y++) {
    const my = Math.min(mask.height - 1, Math.floor(y * scaleY));
    for (let x = 0; x < canvas.width; x++) {
      const mx = Math.min(mask.width - 1, Math.floor(x * scaleX));
      const maskValue = mask.data[my * mask.width + mx];
      const pixelIdx = (y * canvas.width + x) * 4;
      imageData.data[pixelIdx + 3] = maskValue;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob faalde."));
      },
      "image/png"
    );
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Afbeelding kon niet geladen worden."));
    img.src = url;
  });
}
