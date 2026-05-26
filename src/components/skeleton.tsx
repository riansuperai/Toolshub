"use client";

import type { CSSProperties } from "react";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  style?: CSSProperties;
  className?: string;
};

/**
 * Lichte placeholder met shimmer-animatie. Gebruik tijdens initial-hydration
 * of API-laden om layout-shift te voorkomen.
 */
export function Skeleton({ width = "100%", height = 14, circle, style, className }: SkeletonProps) {
  return (
    <span
      className={`skeleton${circle ? " skeleton-circle" : ""}${className ? ` ${className}` : ""}`}
      style={{ width, height, display: "inline-block", ...style }}
      aria-hidden
    />
  );
}

/** Een hele card-skeleton — handig voor product/widget grids. */
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height={140} style={{ borderRadius: 10 }} />
      <Skeleton width="60%" height={14} />
      <div className="skeleton-text-block">
        <Skeleton width="90%" height={10} />
        <Skeleton width="70%" height={10} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <Skeleton width={60} height={20} style={{ borderRadius: 999 }} />
        <Skeleton width={80} height={20} />
      </div>
    </div>
  );
}

/** Tabel-rij skeleton. */
export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: 12 }}>
          <Skeleton height={14} width={i === cols - 1 ? "40%" : `${60 + i * 10}%`} />
        </td>
      ))}
    </tr>
  );
}
