"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Command, Keyboard, X } from "lucide-react";

type Shortcut = {
  group: string;
  keys: string[];
  description: string;
};

const SHORTCUTS: Shortcut[] = [
  { group: "Algemeen", keys: ["Cmd", "K"], description: "Focus de zoekbalk" },
  { group: "Algemeen", keys: ["?"], description: "Toon dit overzicht" },
  { group: "Algemeen", keys: ["Esc"], description: "Sluit modal of dropdown" },
  { group: "Navigatie", keys: ["G", "H"], description: "Ga naar home" },
  { group: "Navigatie", keys: ["G", "C"], description: "Ga naar catalogus" },
  { group: "Navigatie", keys: ["G", "A"], description: "Ga naar je account" },
  { group: "Navigatie", keys: ["G", "S"], description: "Ga naar creator dashboard" },
  { group: "Zoeken", keys: ["↑", "↓"], description: "Door zoekresultaten" },
  { group: "Zoeken", keys: ["Enter"], description: "Open geselecteerd resultaat" }
];

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if (e.key === "?" && !inField) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      if (e.key.toLowerCase() === "g" && !inField && !pendingKey) {
        setPendingKey("g");
        setTimeout(() => setPendingKey((p) => (p === "g" ? null : p)), 1200);
        return;
      }
      if (pendingKey === "g" && !inField) {
        e.preventDefault();
        const key = e.key.toLowerCase();
        if (key === "h") window.location.href = "/";
        else if (key === "c") window.location.href = "/catalogus";
        else if (key === "a") window.location.href = "/account";
        else if (key === "s") window.location.href = "/seller";
        setPendingKey(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pendingKey]);

  const grouped: Record<string, Shortcut[]> = {};
  SHORTCUTS.forEach((s) => {
    if (!grouped[s.group]) grouped[s.group] = [];
    grouped[s.group].push(s);
  });

  return (
    <>
      {children}
      {open ? (
        <div className="kbd-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="kbd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="kbd-modal-head">
              <div>
                <span className="eyebrow"><Keyboard size={11} /> Sneltoetsen</span>
                <h2>Sneller door Hazenco</h2>
              </div>
              <button type="button" className="composer-icon-btn" onClick={() => setOpen(false)} aria-label="Sluiten">
                <X size={14} />
              </button>
            </div>
            <div className="kbd-modal-body">
              {Object.entries(grouped).map(([group, items]) => (
                <div className="kbd-group" key={group}>
                  <strong>{group}</strong>
                  {items.map((s, i) => (
                    <div className="kbd-row" key={`${group}-${i}`}>
                      <span>{s.description}</span>
                      <div className="kbd-keys">
                        {s.keys.map((k, idx) => (
                          <kbd key={idx}>{k === "Cmd" ? <Command size={11} /> : k}</kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="kbd-modal-foot">
              <small>Druk op <kbd>?</kbd> om dit overzicht ook weer te tonen.</small>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
