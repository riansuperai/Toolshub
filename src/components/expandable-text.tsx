"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  text: string;
  maxChars?: number;
};

/**
 * Toont een tekst met een "Lees meer" knop als de tekst langer is dan
 * maxChars. Behoudt regeleinden (\n) uit de oorspronkelijke tekst.
 */
export function ExpandableText({ text, maxChars = 280 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = (text ?? "").trim();
  const needsToggle = trimmed.length > maxChars;

  if (!needsToggle) {
    return <p className="expandable-text">{trimmed}</p>;
  }

  // Knip op laatste woord-grens binnen maxChars zodat we niet
  // midden in een woord stoppen.
  const sliceEnd = trimmed.lastIndexOf(" ", maxChars);
  const preview = trimmed.slice(0, sliceEnd > 0 ? sliceEnd : maxChars).trimEnd();

  return (
    <div className="expandable-text-wrap">
      <p className="expandable-text">
        {expanded ? trimmed : `${preview}…`}
      </p>
      <button
        type="button"
        className="expandable-text-toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? (
          <>
            Lees minder <ChevronUp size={14} />
          </>
        ) : (
          <>
            Lees meer <ChevronDown size={14} />
          </>
        )}
      </button>
    </div>
  );
}
