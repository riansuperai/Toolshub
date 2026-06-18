"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Combine,
  CreditCard,
  FileArchive,
  FileText,
  HelpCircle,
  Images,
  ImageOff,
  KeyRound,
  Lock,
  Mail,
  MessageCircle,
  Palette,
  QrCode,
  Scissors,
  Search,
  ShieldCheck,
  Wallet,
  X
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
  palette: Palette,
  "file-archive": FileArchive,
  images: Images,
  wallet: Wallet,
  combine: Combine,
  "qr-code": QrCode,
  "key-round": KeyRound
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
  /** Genummerde stappen die uitleggen hoe de tool werkt. 2-5 korte zinnen. */
  howItWorks?: string[];
  children: React.ReactNode;
};

/**
 * Wrapper voor alle mini-tools in /toolkit. Gebruikt de bestaande Shell
 * voor consistente header/footer en zorgt voor uniforme hero, cross-sell
 * en related-tools secties zodat alle tools eruit zien als één familie.
 *
 * Tool-specifieke UI gaat als children door (in een eigen client component).
 */
/** Hazenco WhatsApp — alleen cijfers, country code voorop. */
const HAZENCO_WHATSAPP = "31643074303";

export function MiniToolPage({
  slug,
  eyebrow,
  privacyNote,
  crossSell,
  howItWorks,
  children
}: MiniToolPageProps) {
  const entry = TOOLKIT_REGISTRY.find((t) => t.slug === slug);
  const related = relatedToolkitEntries(slug, 3);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const computedEyebrow =
    eyebrow ??
    (entry
      ? `GRATIS · ${entry.estimatedMinutes} MIN · GEEN ACCOUNT`
      : "GRATIS · GEEN ACCOUNT");

  const toolLabel = entry?.title ?? slug;
  const feedbackBody = `Hi Hazenco,\n\nIk gebruikte de tool "${toolLabel}" op toolshub.hazenco.nl en wil het volgende melden:\n\n[beschrijf hier wat er niet werkt of wat je mist]\n\nMet vriendelijke groet,`;
  const waUrl = `https://wa.me/${HAZENCO_WHATSAPP}?text=${encodeURIComponent(feedbackBody)}`;
  const mailUrl = `mailto:info@hazenco.nl?subject=${encodeURIComponent(
    `Toolkit feedback: ${toolLabel}`
  )}&body=${encodeURIComponent(feedbackBody)}`;

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

        {howItWorks && howItWorks.length > 0 ? (
          <section className="mini-tool-howto">
            <h2>Hoe het werkt</h2>
            <ol>
              {howItWorks.map((step, idx) => (
                <li key={idx}>
                  <span className="mini-tool-howto-num">{idx + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="mini-tool-body">{children}</section>

        <div className="mini-tool-meta-row">
          {privacyNote ? (
            <p className="mini-tool-privacy">
              <Lock size={13} /> {privacyNote}
            </p>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="mini-tool-feedback-trigger"
            onClick={() => setFeedbackOpen(true)}
          >
            <HelpCircle size={13} /> Werkt iets niet of mis je iets?
          </button>
        </div>

        {crossSell ? (
          <section className="mini-tool-crosssell">
            <div>
              <strong>{crossSell.heading}</strong>
              <p>{crossSell.body}</p>
            </div>
            {crossSell.href.startsWith("http") ? (
              <a
                className="button"
                href={crossSell.href}
                target="_blank"
                rel="noreferrer"
              >
                {crossSell.cta} <ArrowRight size={15} />
              </a>
            ) : (
              <Link className="button" href={crossSell.href}>
                {crossSell.cta} <ArrowRight size={15} />
              </Link>
            )}
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

      {feedbackOpen ? (
        <div
          className="mini-tool-feedback-backdrop"
          onClick={() => setFeedbackOpen(false)}
          role="presentation"
        >
          <div
            className="mini-tool-feedback-modal"
            role="dialog"
            aria-label="Feedback over deze tool"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="mini-tool-feedback-close"
              onClick={() => setFeedbackOpen(false)}
              aria-label="Sluit"
            >
              <X size={16} />
            </button>
            <div className="mini-tool-feedback-icon">
              <HelpCircle size={22} />
            </div>
            <h3>Werkt iets niet of mis je iets?</h3>
            <p>
              We horen graag wat er mis ging in <strong>{toolLabel}</strong>{" "}
              of welke tool je graag zou willen zien. Stuur ons een
              bericht — meestal binnen één werkdag antwoord.
            </p>
            <div className="mini-tool-feedback-actions">
              <a
                className="mini-tool-feedback-wa"
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setFeedbackOpen(false)}
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                className="mini-tool-feedback-mail"
                href={mailUrl}
                onClick={() => setFeedbackOpen(false)}
              >
                <Mail size={15} /> E-mail
              </a>
            </div>
            <p className="mini-tool-feedback-foot">
              Of mail direct naar{" "}
              <a href="mailto:info@hazenco.nl">info@hazenco.nl</a>
            </p>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}
