"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, FileUp, Image as ImageIcon, Sparkles, Trash2 } from "lucide-react";
import { generateMockScreenshots, productTypeLabels } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";
import { FileDropzone } from "@/components/file-dropzone";
import { ScreenshotDropzone } from "@/components/screenshot-dropzone";
import type { DeliveryMode, ProductType, ToolAsset } from "@/lib/types";

export function ListingForm() {
  const { state, createListing } = useMarketplace();
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(state.categories[0]?.id ?? "");
  const [type, setType] = useState<ProductType>("workflow");
  const [price, setPrice] = useState("79");
  const [setupPrice, setSetupPrice] = useState("149");
  const [compatibility, setCompatibility] = useState("n8n, Make, OpenAI");
  const [tags, setTags] = useState("Automation, MKB");
  const [demoUrl, setDemoUrl] = useState("https://demo.hazenco.nl/mijn-tool");
  const [demoInstructions, setDemoInstructions] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [supportIncluded, setSupportIncluded] = useState("14 dagen support");
  const [modes, setModes] = useState<DeliveryMode[]>(["download", "cloud"]);
  const [files, setFiles] = useState<ToolAsset[]>([]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [autoFilled, setAutoFilled] = useState(false);

  const categoryType = useMemo(
    () => state.categories.find((category) => category.id === categoryId)?.type,
    [categoryId, state.categories]
  );

  function toggleMode(mode: DeliveryMode) {
    setModes((current) =>
      current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode]
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const listing = createListing({
      title,
      tagline,
      description,
      categoryId,
      type: categoryType ?? type,
      priceCents: Math.round(Number(price) * 100),
      setupPriceCents: Math.round(Number(setupPrice) * 100),
      compatibility: compatibility.split(",").map((item) => item.trim()).filter(Boolean),
      tags: tags.split(",").map((item) => item.trim()).filter(Boolean),
      deliveryModes: modes.length ? modes : ["download"],
      files: files.length
        ? files
        : [
            {
              id: `asset_${Date.now()}`,
              name: "tool-bestanden.zip",
              kind: "template-file",
              sizeLabel: "Demo bestand",
              private: true
            }
          ],
      demoUrl,
      demoInstructions,
      sampleInput,
      supportIncluded,
      screenshots:
        screenshots.length > 0
          ? screenshots
          : generateMockScreenshots(title, categoryType ?? type)
    });
    if (listing) {
      setTitle("");
      setTagline("");
      setDescription("");
      setDemoInstructions("");
      setSampleInput("");
      setFiles([]);
      setScreenshots([]);
      setAutoFilled(false);
    }
  }

  function autoFillScreenshots() {
    const generated = generateMockScreenshots(title || "Tool", categoryType ?? type);
    setScreenshots(generated);
    setAutoFilled(true);
  }

  function updateScreenshot(index: number, value: string) {
    setScreenshots((current) => current.map((item, i) => (i === index ? value : item)));
  }

  function removeScreenshot(index: number) {
    setScreenshots((current) => current.filter((_, i) => i !== index));
  }

  function addScreenshot() {
    if (screenshots.length >= 5) return;
    setScreenshots((current) => [...current, `Scherm ${current.length + 1}`]);
  }

  return (
    <section className="section-card" style={{ marginTop: 0 }}>
      <span className="eyebrow">Nieuwe listing</span>
      <h2>Upload tool voor admin review</h2>
      <form className="form-grid" onSubmit={submit}>
        <label className="form-field">
          <span>Titel</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <label className="form-field">
          <span>Korte belofte</span>
          <input value={tagline} onChange={(event) => setTagline(event.target.value)} required />
        </label>
        <label className="form-field">
          <span>Categorie</span>
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            {state.categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Type</span>
          <select value={type} onChange={(event) => setType(event.target.value as ProductType)}>
            {Object.entries(productTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>Prijs</span>
          <input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} required />
        </label>
        <label className="form-field">
          <span>Setup service prijs</span>
          <input type="number" min="0" value={setupPrice} onChange={(event) => setSetupPrice(event.target.value)} />
        </label>
        <label className="form-field full">
          <span>Beschrijving</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} required />
        </label>
        <label className="form-field">
          <span>Compatibiliteit</span>
          <input value={compatibility} onChange={(event) => setCompatibility(event.target.value)} />
        </label>
        <label className="form-field">
          <span>Tags</span>
          <input value={tags} onChange={(event) => setTags(event.target.value)} />
        </label>
        <label className="form-field">
          <span>Demo URL</span>
          <input value={demoUrl} onChange={(event) => setDemoUrl(event.target.value)} />
        </label>
        <label className="form-field">
          <span>Support inbegrepen</span>
          <input value={supportIncluded} onChange={(event) => setSupportIncluded(event.target.value)} />
        </label>
        <label className="form-field full">
          <span>Demo instructies</span>
          <textarea value={demoInstructions} onChange={(event) => setDemoInstructions(event.target.value)} required />
        </label>
        <label className="form-field full">
          <span>Voorbeeldinput</span>
          <input value={sampleInput} onChange={(event) => setSampleInput(event.target.value)} required />
        </label>
        <div className="form-field full">
          <span>Levering</span>
          <div className="inline-actions">
            {(["download", "cloud", "custom"] as DeliveryMode[]).map((mode) => (
              <label className="checkbox-row" key={mode}>
                <input type="checkbox" checked={modes.includes(mode)} onChange={() => toggleMode(mode)} />{" "}
                {mode === "download" ? "Download" : mode === "cloud" ? "Cloud" : "Op maat"}
              </label>
            ))}
          </div>
        </div>
        <div className="form-field full">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <div>
              <span style={{ fontWeight: 800, color: "var(--green-900)" }}>
                <ImageIcon size={14} style={{ verticalAlign: -2, marginRight: 5 }} /> Demo screenshots
              </span>
              <p style={{ margin: "2px 0 0", color: "var(--green-500)", fontSize: 13 }}>
                Max 5 schermen. Bij upload genereren we automatisch suggesties op basis van type — pas ze gerust aan.
              </p>
            </div>
            <button
              type="button"
              className="button secondary"
              onClick={autoFillScreenshots}
              style={{ minHeight: 36, padding: "0 12px", fontSize: 13 }}
            >
              <Sparkles size={14} /> {autoFilled ? "Opnieuw genereren" : "Auto-genereren"}
            </button>
          </div>
          <ScreenshotDropzone screenshots={screenshots} onChange={setScreenshots} max={5} />
          {screenshots.length === 0 ? (
            <p style={{ marginTop: 8, color: "var(--green-500)", fontSize: 12.5 }}>
              Tip: klik op <strong>Auto-genereren</strong> hierboven voor 5 placeholder-titels, of upload echte screenshots door te slepen.
            </p>
          ) : null}
        </div>
        <div className="form-field full">
          <span style={{ display: "block", fontWeight: 800, marginBottom: 8 }}>Bestanden</span>
          <FileDropzone files={files} onChange={setFiles} />
        </div>
        <button className="button" type="submit">
          <FileUp size={18} /> Indienen voor review
        </button>
      </form>
      <p style={{ marginTop: 16, color: "var(--green-700)", display: "flex", alignItems: "center", gap: 6 }}>
        <CheckCircle2 size={16} /> Na indienen verschijnt de listing in de admin approval queue.
      </p>
    </section>
  );
}
