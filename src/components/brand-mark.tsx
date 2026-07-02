/**
 * Klein netwerk-symbool voor achter 'Toolshub' — centrale ring met
 * drie satelliet-knopen. Onderstreept het 'hub' concept. Kleur volgt
 * currentColor (erft van de omliggende .brand small = orange-600).
 */
export function HubGlyph({ size = 17 }: { size?: number }) {
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

/**
 * Hazenco Toolshub brand mark — 2×2 grid met vier gekleurde blokken
 * (peach + dark green, diagonaal alterneren). Verwijst naar de
 * toolshub als een raster van verzamelde tools. De blokken hebben
 * hardcoded brand-kleuren; de omliggende .brand-mark container geeft
 * de cream/white achtergrond.
 */
export function BrandMark({ size = 38 }: { size?: number }) {
  // Matched met var(--orange-600) — dezelfde tint als 'Toolshub' tekst
  const orange = "#f26b1d";
  const darkGreen = "#1a3c2e";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-hidden="true"
    >
      {/* 2×2 grid: cell 18×18, gap 2px, padding 3px rondom */}
      <rect x="3" y="3" width="18" height="18" rx="3" fill={orange} />
      <rect x="23" y="3" width="18" height="18" rx="3" fill={darkGreen} />
      <rect x="3" y="23" width="18" height="18" rx="3" fill={darkGreen} />
      <rect x="23" y="23" width="18" height="18" rx="3" fill={orange} />
    </svg>
  );
}
