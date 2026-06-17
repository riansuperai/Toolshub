"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CreditCard,
  FileText,
  ImageOff,
  Lock,
  Palette,
  Scissors,
  Search,
  ShieldCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Shell } from "@/components/shell";
import {
  TOOLKIT_REGISTRY,
  relatedToolkitEntries,
  type ToolkitIcon
} from "@/lib/toolkit-registry";

const ICON_MAP: Record<ToolkitIcon, LucideIcon> = {
  "file-text": FileText,
  calculator: Calculator,
  "image-off": ImageOff,
  "shield-check": ShieldCheck,
  "credit-card": CreditCard,
  search: Search,
  scissors: Scissors,
  palette: Palette
};

export function ToolkitIconRender({
  name,
  size = 22
}: {
  name: ToolkitIcon;
  size?: number;
}) {
  const Icon = ICON_MAP[name] ?? FileText;
  return <Icon size={size} />;
}

type CrossSell = {
  heading: string;
  body: string;
  cta: string;
  href: string;
};

export type MiniToolPageProps = {
  /** Slug uit het registry. Wordt gebruikt om related tools te kiezen. */
  slug: string;
  eyebrow?: string;
  /** Privacy reassurance onderaan de tool — bv. "Wij slaan niks op". */
  privacyNote?: string;
  /** Conversie-block naar relevante Hazenco-dienst. */
  crossSell?: CrossSell;
  children: React.ReactNode;
};

/**
 * Wrapper voor alle mini-tools in /toolkit. Gebruikt de bestaande Shell
 * voor consistente header/footer en zorgt voor uniforme hero, cross-sell
 * en related-tools secties zodat alle tools eruit zien als één familie.
 *
 * Tool-specifieke UI gaat als children door (in een eigen client component).
 */
export function MiniToolPage({
  slug,
  eyebrow,
  privacyNote,
  crossSell,
  children
}: MiniToolPageProps) {
  const entry = TOOLKIT_REGISTRY.find((t) => t.slug === slug);
  const related = relatedToolkitEntries(slug, 3);

  const computedEyebrow =
    eyebrow ??
    (entry
      ? `GRATIS · ${entry.estimatedMinutes} MIN · GEEN ACCOUNT`
      : "GRATIS · GEEN ACCOUNT");

  return (
    <Shell>
      <div className="page mini-tool-page">
        <Link className="detail-back" href="/toolkit">
          ← Terug naar alle tools
        </Link>

        <section className="mini-tool-hero">
          <span className="mini-tool-eyebrow">{computedEyebrow}</span>
          <div className="mini-tool-hero-row">
            {entry ? (
              <div className="mini-tool-hero-icon">
                <ToolkitIconRender name={entry.iconName} size={28} />
              </div>
            ) : null}
            <div>
              <h1>{entry?.title ?? "Tool"}</h1>
              {entry ? <p className="lead-sm">{entry.tagline}</p> : null}
            </div>
          </div>
        </section>

        <section className="mini-tool-body">{children}</section>

        {privacyNote ? (
          <p className="mini-tool-privacy">
            <Lock size={13} /> {privacyNote}
          </p>
        ) : null}

        {crossSell ? (
          <section className="mini-tool-crosssell">
            <div>
              <strong>{crossSell.heading}</strong>
              <p>{crossSell.body}</p>
            </div>
            <Link className="button" href={crossSell.href}>
              {crossSell.cta} <ArrowRight size={15} />
            </Link>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mini-tool-related">
            <h2>Ook handig</h2>
            <div className="mini-tool-related-grid">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/toolkit/${r.slug}`}
                  className="mini-tool-related-card"
                >
                  <div className="mini-tool-related-icon">
                    <ToolkitIconRender name={r.iconName} size={18} />
                  </div>
                  <strong>{r.title}</strong>
                  <p>{r.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Shell>
  );
}
