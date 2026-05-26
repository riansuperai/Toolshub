"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FilterPillOption = {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
};

export type FilterPillGroupProps = {
  label: string;
  icon: LucideIcon;
  options: FilterPillOption[];
  value: string;
  onChange: (id: string) => void;
  collapsedCount?: number;
};

export function FilterPillGroup({
  label,
  icon: LabelIcon,
  options,
  value,
  onChange,
  collapsedCount = 7
}: FilterPillGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const activeIndex = options.findIndex((option) => option.id === value);
  const forceExpanded = activeIndex >= collapsedCount;
  const canCollapse = options.length > collapsedCount;
  const isExpanded = expanded || forceExpanded || !canCollapse;
  const visible = isExpanded ? options : options.slice(0, collapsedCount);

  return (
    <div className="filter-row">
      <div className="filter-row-head">
        <span className="filter-group-label"><LabelIcon size={14} /> {label}</span>
        {canCollapse ? (
          <button
            type="button"
            className="category-toggle"
            onClick={() => setExpanded((value) => !value)}
            disabled={forceExpanded}
          >
            {isExpanded ? "Minder tonen" : `Toon alle (${options.length})`}
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        ) : null}
      </div>
      <div className="pill-row">
        {visible.map((option, index) => {
          const Icon = option.icon;
          const isActive = value === option.id;
          const isMuted = !isActive && option.count === 0;
          return (
            <button
              key={option.id}
              type="button"
              className={`pill${isActive ? " active" : ""}${isMuted ? " muted" : ""}`}
              onClick={() => onChange(option.id)}
              style={{ animationDelay: `${Math.min(index * 12, 180)}ms` }}
            >
              {Icon ? <Icon size={14} /> : null}
              <span>{option.label}</span>
              {typeof option.count === "number" ? (
                <span className="pill-count">{option.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
