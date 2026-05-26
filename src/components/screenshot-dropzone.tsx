"use client";

import { useRef, useState } from "react";
import { GripVertical, Image as ImageIcon, Trash2, Upload } from "lucide-react";

type Props = {
  /** Geüploade screenshots als data-URLs (jpeg/png). */
  screenshots: string[];
  onChange: (next: string[]) => void;
  max?: number;
};

function fileToResizedDataUrl(file: File, maxWidth = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas niet ondersteund"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      img.onerror = reject;
      img.src = src;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ScreenshotDropzone({ screenshots, onChange, max = 6 }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    try {
      const room = max - screenshots.length;
      const incoming = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
      const dataUrls = await Promise.all(incoming.map((f) => fileToResizedDataUrl(f)));
      onChange([...screenshots, ...dataUrls]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(idx: number) {
    onChange(screenshots.filter((_, i) => i !== idx));
  }

  // Drag-to-reorder
  function onItemDragStart(idx: number, e: React.DragEvent) {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = "move";
  }

  function onItemDragOver(idx: number, e: React.DragEvent) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) return;
    const next = [...screenshots];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(idx, 0, moved);
    setDragIndex(idx);
    onChange(next);
  }

  function onItemDragEnd() {
    setDragIndex(null);
  }

  return (
    <div className="screenshot-dropzone-wrap">
      <div
        className={`file-dropzone${dragOver ? " dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        <div className="file-dropzone-icon">{busy ? <Upload size={28} /> : <ImageIcon size={28} />}</div>
        <strong>Sleep screenshots hierheen</strong>
        <small>
          {screenshots.length === 0 ? `Maximaal ${max} afbeeldingen` : `${screenshots.length}/${max} toegevoegd`} · JPG/PNG · automatisch geresized
        </small>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {screenshots.length > 0 ? (
        <div className="screenshot-grid">
          {screenshots.map((src, i) => (
            <div
              key={i}
              className="screenshot-thumb"
              draggable
              onDragStart={(e) => onItemDragStart(i, e)}
              onDragOver={(e) => onItemDragOver(i, e)}
              onDragEnd={onItemDragEnd}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Screenshot ${i + 1}`} />
              <div className="screenshot-thumb-overlay">
                <span className="screenshot-thumb-order">#{i + 1}</span>
                <button
                  type="button"
                  className="screenshot-thumb-handle"
                  title="Sleep om te ordenen"
                  aria-label="Sleep om te ordenen"
                >
                  <GripVertical size={14} />
                </button>
                <button
                  type="button"
                  className="screenshot-thumb-remove"
                  onClick={() => remove(i)}
                  aria-label="Verwijder"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {i === 0 ? <span className="screenshot-thumb-primary">Hoofdfoto</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
