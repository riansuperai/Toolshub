"use client";

import { useRef, useState } from "react";
import { File as FileIcon, Trash2, Upload } from "lucide-react";
import type { ToolAsset } from "@/lib/types";

type Props = {
  files: ToolAsset[];
  onChange: (files: ToolAsset[]) => void;
  accept?: string;
};

function bytesToLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectKind(fileName: string): ToolAsset["kind"] {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".json")) return "workflow-json";
  if (lower.endsWith(".pdf") || lower.endsWith(".md") || lower.endsWith(".doc") || lower.endsWith(".docx")) return "documentation";
  if (lower.endsWith(".zip")) return "plugin-zip";
  return "template-file";
}

export function FileDropzone({ files, onChange, accept }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    const added: ToolAsset[] = [];
    for (const f of Array.from(incoming)) {
      added.push({
        id: `asset_${Math.random().toString(36).slice(2, 10)}`,
        name: f.name,
        kind: detectKind(f.name),
        sizeLabel: bytesToLabel(f.size),
        private: true
      });
    }
    onChange([...files, ...added]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(id: string) {
    onChange(files.filter((f) => f.id !== id));
  }

  function toggleVisibility(id: string) {
    onChange(files.map((f) => f.id === id ? { ...f, private: !f.private } : f));
  }

  return (
    <div className="file-dropzone-wrap">
      <div
        className={`file-dropzone${dragOver ? " dragging" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        <div className="file-dropzone-icon"><Upload size={28} /></div>
        <strong>Sleep bestanden hierheen</strong>
        <small>of klik om te bladeren · workflow-JSON, ZIP, PDF, MD</small>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 ? (
        <div className="file-dropzone-list">
          {files.map((file) => (
            <div className="file-dropzone-row" key={file.id}>
              <FileIcon size={16} />
              <div className="file-dropzone-row-body">
                <strong>{file.name}</strong>
                <small>{file.kind.replace(/-/g, " ")} · {file.sizeLabel}</small>
              </div>
              <button
                type="button"
                className={`file-dropzone-visibility${file.private ? " private" : " public"}`}
                onClick={() => toggleVisibility(file.id)}
                title={file.private ? "Privé — alleen kopers" : "Publiek — preview"}
              >
                {file.private ? "Privé" : "Preview"}
              </button>
              <button
                type="button"
                className="file-dropzone-remove"
                onClick={() => remove(file.id)}
                aria-label={`Verwijder ${file.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
