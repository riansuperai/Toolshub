"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FilterPillOption } from "./filter-pill-group";

export type FilterDropdownProps = {
  label: string;
  icon: LucideIcon;
  options: FilterPillOption[];
  value: string;
  onChange: (id: string) => void;
};

export function FilterDropdown({ label, icon: LabelIcon, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = options.find((option) => option.id === value);
  const isActive = value !== "all" && !!current;
  const display = isActive && current ? current.label : label;

  return (
    <div className={`filter-dropdown${open ? " open" : ""}${isActive ? " active" : ""}`} ref={ref}>
      <button
        type="button"
        className="filter-dropdown-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <LabelIcon size={14} />
        <span className="filter-dropdown-label">{display}</span>
        <ChevronDown size={12} className="filter-dropdown-caret" />
      </button>
      {open ? (
        <div className="filter-dropdown-pop" role="listbox">
          {options.map((option) => {
            const Icon = option.icon;
            const selected = option.id === value;
            const muted = !selected && option.count === 0;
            return (
              <button
                key={option.id}
                type="button"
                className={`filter-dropdown-item${selected ? " selected" : ""}${muted ? " muted" : ""}`}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                role="option"
                aria-selected={selected}
              >
                {Icon ? <Icon size={14} /> : <span className="filter-dropdown-icon-spacer" />}
                <span className="filter-dropdown-item-label">{option.label}</span>
                {typeof option.count === "number" ? (
                  <span className="filter-dropdown-item-count">{option.count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
