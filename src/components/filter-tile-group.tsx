"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FilterPillOption } from "./filter-pill-group";

export type FilterTileGroupProps = {
  label: string;
  icon: LucideIcon;
  options: FilterPillOption[];
  value: string;
  onChange: (id: string) => void;
  collapsedCount?: number;
};

export function FilterTileGroup({
  label,
  icon: LabelIcon,
  options,
  value,
  onChange,
  collapsedCount = 6
}: FilterTileGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxCols, setMaxCols] = useState(12);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const minTileWidth = 96;
    const gap = 6;
    const update = (width: number) => {
      const cols = Math.max(1, Math.floor((width + gap) / (minTileWidth + gap)));
      setMaxCols(cols);
    };
    update(node.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activeIndex = options.findIndex((option) => option.id === value);
  const forceExpanded = activeIndex >= collapsedCount;
  const canCollapse = options.length > collapsedCount;
  const isExpanded = expanded || forceExpanded || !canCollapse;
  const visible = isExpanded ? options : options.slice(0, collapsedCount);

  const rows = Math.max(1, Math.ceil(visible.length / maxCols));
  const balancedCols = Math.max(1, Math.ceil(visible.length / rows));
  const gridStyle = { gridTemplateColumns: `repeat(${balancedCols}, minmax(0, 1fr))` };

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
      <div className="category-tiles" ref={containerRef} style={gridStyle}>
        {visible.map((option, index) => {
          const Icon = option.icon;
          const isActive = value === option.id;
          const isMuted = !isActive && option.count === 0;
          return (
            <button
              key={option.id}
              type="button"
              className={`category-tile${isActive ? " active" : ""}${isMuted ? " muted" : ""}`}
              onClick={() => onChange(option.id)}
              style={{ animationDelay: `${Math.min(index * 18, 220)}ms` }}
            >
              <span className="category-tile-icon">{Icon ? <Icon size={20} /> : null}</span>
              <span className="category-tile-label">{option.label}</span>
              {typeof option.count === "number" ? (
                <span className="category-tile-count">{option.count}</span>
              ) : null}
              {isActive ? <span className="category-tile-mark" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
