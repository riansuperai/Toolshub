"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Props = {
  text: string;
  /** Minimaal aantal characters voor we de toggle tonen. Korter = geen toggle. */
  minCharsForToggle?: number;
};

/**
 * Rendert een Markdown-tekst die collapsed wordt met een fade-out gradient
 * onderaan en een ronde toggle-knop in het midden. Wanneer uitgeklapt:
 * volledige tekst zonder fade.
 *
 * Markdown ondersteund: headings (##), bold (**), italic (*), lijsten (-),
 * links ([tekst](url)), quotes (>), inline code (`x`). Raw HTML wordt om
 * veiligheidsredenen niet gerenderd.
 */
export function ExpandableText({ text, minCharsForToggle = 280 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = (text ?? "").trim();

  const content = (
    <div className="markdown-content">
      <ReactMarkdown>{trimmed}</ReactMarkdown>
    </div>
  );

  if (trimmed.length < minCharsForToggle) {
    return content;
  }

  return (
    <div className={`expandable-text-wrap${expanded ? " is-expanded" : ""}`}>
      <div className="expandable-text-inner">{content}</div>
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
