/**
 * Klein netwerk-symbool — centrale ring met
 * drie satelliet-knopen. Onderstreept het 'hub' concept. Kleur volgt
 * currentColor (erft van de omliggende .brand small = orange-600).
 */
export function HubGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="brand-hub"
    >
      {/* Centrale ring */}
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {/* 3 satelliet-knopen */}
      <circle cx="19" cy="5.5" r="2.1" />
      <circle cx="4.8" cy="12" r="2.1" />
      <circle cx="19" cy="18.5" r="2.1" />
      {/* Verbindingslijnen ring → knopen */}
      <path
        d="M14.5 9.5 L17.1 6.9 M8.4 12 L6.9 12 M14.5 14.5 L17.1 17.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

import Image from "next/image";

/**
 * Hazenco brand mark — hub-glyph PNG met transparante achtergrond.
 * Twee gespiegelde node-clusters, teal met oranje accent-nodes.
 */
export function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <Image
      src="/brand/hazenco-hub.png"
      alt=""
      width={size}
      height={size}
      priority
      style={{ width: size, height: size, objectFit: "contain", display: "block" }}
    />
  );
}
