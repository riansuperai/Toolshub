"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "subtle";
};

/**
 * Consistente lege-staat met geanimeerd icoon. Gebruik overal waar lijsten,
 * tabellen of grids leeg zijn.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "md",
  variant = "default"
}: EmptyStateProps) {
  return (
    <div className={`empty-state-card ${size} ${variant}`}>
      <div className="empty-state-icon" aria-hidden>
        <Icon size={size === "sm" ? 22 : size === "lg" ? 36 : 28} />
      </div>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}
