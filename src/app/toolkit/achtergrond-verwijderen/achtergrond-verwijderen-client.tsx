"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
 * Cache van het model + processor. Eenmaal geladen, hergebruiken voor
 * volgende afbeeldingen. RMBG-1.4 wordt niet door de standaard
 * 'image-segmentation' pipeline ondersteund (Segformer-architectuur),
 * dus we gebruiken AutoModel + AutoProcessor direct.
 */
type LoadedModel = {
  model: { (input: { input: unknown }): Promise<{ output: { data: Float32Array; dims: number[] } | unknown }>; new?: never };
  processor: (image: unknown) => Promise<{ pixel_values?: unknown; input_image?: unknown }>;
  RawImage: { fromURL: (url: string) => Promise<unknown> };
};

let modelPromise: Promise<LoadedModel> | null = null;

async function loadModel(onProgress: (progress: number) => void) {
  if (!modelPromise) {
    modelPromise = (async () => {
      const transformers = await import("@huggingface/transformers");
      transformers.env.allowLocalModels = false;

      const progress_callback = (data: { status: string; progress?: number }) => {
        if (data?.status === "progress" && typeof data.progress === "number") {
          onProgress(data.progress);
        }
      };

      const [model, processor] = await Promise.all([
        transformers.AutoModel.from_pretrained(MODEL_ID, {
          device: hasWebGpu() ? "webgpu" : "wasm",
          progress_callback
        } as Parameters<typeof transformers.AutoModel.from_pretrained>[1]),
        transformers.AutoProcessor.from_pretrained(MODEL_ID, {
          progress_callback
        } as Parameters<typeof transformers.AutoProcessor.from_pretrained>[1])
      ]);

      return {
        model: model as unknown as LoadedModel["model"],
        processor: processor as unknown as LoadedModel["processor"],
        RawImage: transformers.RawImage as unknown as LoadedModel["RawImage"]
      };
    })();
  }
  return modelPromise;
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

    // Stap 1: model laden (eerste keer ~44MB download, daarna gecached)
    setStage({ kind: "loading-model", progress: 0 });

    try {
      const { model, processor, RawImage } = await loadModel((p) => {
        setStage({ kind: "loading-model", progress: p });
      });

      // Stap 2: afbeelding door het model
      setStage({ kind: "processing" });

      const image = await RawImage.fromURL(originalUrl);
      const processed = await processor(image);
      // RMBG-1.4 verwacht input onder de key 'input'. Sommige builds geven
      // pixel_values terug, anderen input_image — beide hieronder afgevangen.
      const pixelValues =
        (processed as { pixel_values?: unknown; input_image?: unknown }).pixel_values ??
        (processed as { pixel_values?: unknown; input_image?: unknown }).input_image;
      if (!pixelValues) throw new Error("Processor gaf geen pixel-data terug.");

      const result = (await model({ input: pixelValues })) as {
        output: { data: Float32Array; dims: number[] };
      };
      const tensor = result.output;
      if (!tensor?.data || !tensor?.dims) {
        throw new Error("Model gaf geen tensor terug.");
      }
      // dims is typisch [1, 1, H, W]
      const maskH = tensor.dims[tensor.dims.length - 2];
      const maskW = tensor.dims[tensor.dims.length - 1];

      // Stap 3: maak transparante PNG door het masker op de originele
      // afbeelding als alpha-channel toe te passen
      const resultBlob = await applyMask(originalUrl, {
        data: tensor.data,
        width: maskW,
        height: maskH
      });
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

  // Plakken via Ctrl/Cmd+V — werkt vanaf screenshot-tools, browser-rechtsklik
  // 'kopieer afbeelding', en file-managers. Alleen actief in idle/error-state
  // zodat een geplakte URL of tekst in een ander gesprek hier niet stiekem een
  // verwerking triggert.
  useEffect(() => {
    if (stage.kind !== "idle" && stage.kind !== "error") return;
    function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            handleFile(file);
            return;
          }
        }
      }
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [stage.kind, handleFile]);

  return (
    <MiniToolPage
      slug="achtergrond-verwijderen"
      privacyNote="AI draait 100% in je browser. Je foto wordt nooit naar onze servers gestuurd."
      howItWorks={[
        "Upload, sleep of plak (Ctrl/⌘+V) je foto (JPG, PNG of WebP, max 8 MB). Werkt voor producten, profielfoto's en logo's.",
        "Eerste keer: het AI-model wordt naar je browser gedownload (~44 MB, ~10-30 seconden op WiFi). Volgende keer is dat niet meer nodig.",
        "Download het resultaat als transparante PNG. Klaar voor webshop, social media of presentaties."
      ]}
      crossSell={{
        heading: "Productfoto's bulk verwerken?",
        body:
          "Hazenco zet automation op voor je webshop — productfoto's worden bij upload automatisch geprocest, formaten aangepast en geoptimaliseerd.",
        cta: "Plan een gesprek",
        href: "https://hazenco.nl/contact/"
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
              <strong>Sleep, klik of plak (Ctrl/⌘+V) een afbeelding</strong>
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
 *
 * RMBG-1.4 geeft een Float32Array tensor met waarden 0..1 (1 = voorgrond).
 * Het masker is in de modelresolutie (meestal 1024x1024) — we schalen mee
 * door indices te interpoleren naar de target-resolutie via nearest-neighbor.
 */
async function applyMask(
  imageUrl: string,
  mask: { data: Float32Array; width: number; height: number }
): Promise<Blob> {
  const image = await loadImage(imageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niet beschikbaar.");

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const scaleX = mask.width / canvas.width;
  const scaleY = mask.height / canvas.height;
  for (let y = 0; y < canvas.height; y++) {
    const my = Math.min(mask.height - 1, Math.floor(y * scaleY));
    for (let x = 0; x < canvas.width; x++) {
      const mx = Math.min(mask.width - 1, Math.floor(x * scaleX));
      // Float 0..1 → 0..255 alpha
      const alpha = Math.round(mask.data[my * mask.width + mx] * 255);
      const pixelIdx = (y * canvas.width + x) * 4;
      imageData.data[pixelIdx + 3] = Math.max(0, Math.min(255, alpha));
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
