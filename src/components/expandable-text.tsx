"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  text: string;
  /** Minimaal aantal characters voor we de toggle tonen. Korter = geen toggle. */
  minCharsForToggle?: number;
};

/**
 * Toont een tekst die collapsed wordt met een fade-out gradient onderaan
 * en een ronde toggle-knop in het midden. Wanneer uitgeklapt: volledige
 * tekst zonder fade. Bewaart regeleinden uit de originele tekst.
 */
export function ExpandableText({ text, minCharsForToggle = 200 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = (text ?? "").trim();

  if (trimmed.length < minCharsForToggle) {
    return <p className="expandable-text">{trimmed}</p>;
  }

  return (
    <div className={`expandable-text-wrap${expanded ? " is-expanded" : ""}`}>
      <div className="expandable-text-inner">
        <p className="expandable-text">{trimmed}</p>
      </div>
      <button
        type="button"
        className="expandable-text-toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? "Lees minder" : "Lees meer"}
        title={expanded ? "Lees minder" : "Lees meer"}
      >
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
  );
}
