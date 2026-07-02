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
