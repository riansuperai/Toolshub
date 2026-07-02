/**
 * Hazenco Toolshub brand mark — 2×2 grid met vier gekleurde blokken
 * (peach + dark green, diagonaal alterneren). Verwijst naar de
 * toolshub als een raster van verzamelde tools. De blokken hebben
 * hardcoded brand-kleuren; de omliggende .brand-mark container geeft
 * de cream/white achtergrond.
 */
export function BrandMark({ size = 26 }: { size?: number }) {
  const peach = "#f59e7c";
  const darkGreen = "#1a3c2e";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-hidden="true"
    >
      {/* 2×2 grid: cell 12×12, gap 2px, padding 9px rondom */}
      <rect x="9" y="9" width="12" height="12" rx="2" fill={peach} />
      <rect x="23" y="9" width="12" height="12" rx="2" fill={darkGreen} />
      <rect x="9" y="23" width="12" height="12" rx="2" fill={darkGreen} />
      <rect x="23" y="23" width="12" height="12" rx="2" fill={peach} />
    </svg>
  );
}
