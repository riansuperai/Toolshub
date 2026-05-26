"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Box, Search, Star, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { formatPrice, productTypeLabels } from "@/lib/marketplace-data";

export function HeaderSearch() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Click-outside sluit dropdown
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Cmd/Ctrl+K → focus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const results = useMemo(() => {
    if (!debounced) return [];
    const q = debounced;
    return state.listings
      .filter((l) => l.status === "published")
      .filter((l) =>
        l.title.toLowerCase().includes(q) ||
        l.tagline.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)) ||
        l.description.toLowerCase().includes(q)
      )
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 6);
  }, [state.listings, debounced]);

  function navigateToResult(idx: number) {
    const r = results[idx];
    if (!r) return;
    router.push(`/tools/${r.slug}`);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(0, results.length)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx < results.length) {
        navigateToResult(activeIdx);
      } else {
        router.push(`/catalogus?q=${encodeURIComponent(query)}`);
        setOpen(false);
      }
    }
  }

  return (
    <div className={`header-search${open ? " open" : ""}`} ref={containerRef}>
      <div className="header-search-input">
        <Search size={15} />
        <input
          ref={inputRef}
          type="search"
          placeholder="Zoek tools..."
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIdx(0); }}
          onKeyDown={onKeyDown}
          aria-label="Zoek in catalogus"
        />
        {query ? (
          <button type="button" className="header-search-clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Wissen">
            <X size={13} />
          </button>
        ) : (
          <kbd className="header-search-kbd">⌘K</kbd>
        )}
      </div>

      {open && debounced ? (
        <div className="header-search-dropdown" role="listbox">
          {results.length > 0 ? (
            <>
              <div className="header-search-section">
                <small>{results.length} {results.length === 1 ? "resultaat" : "resultaten"}</small>
              </div>
              {results.map((listing, idx) => {
                const seller = state.sellers.find((s) => s.id === listing.sellerId);
                const isActive = idx === activeIdx;
                return (
                  <Link
                    key={listing.id}
                    href={`/tools/${listing.slug}`}
                    className={`header-search-row${isActive ? " active" : ""}`}
                    onClick={() => { setOpen(false); setQuery(""); }}
                    onMouseEnter={() => setActiveIdx(idx)}
                    role="option"
                    aria-selected={isActive}
                  >
                    <span className="header-search-row-icon"><Box size={16} /></span>
                    <div className="header-search-row-body">
                      <strong>{listing.title}</strong>
                      <small>
                        {seller?.name ?? "—"} · {productTypeLabels[listing.type]}
                        {listing.rating > 0 ? <> · <Star size={10} fill="currentColor" style={{ verticalAlign: -1 }} /> {listing.rating.toFixed(1)}</> : null}
                      </small>
                    </div>
                    <strong className="header-search-row-price">{formatPrice(listing.priceCents)}</strong>
                  </Link>
                );
              })}
              <Link
                href={`/catalogus?q=${encodeURIComponent(query)}`}
                className={`header-search-row footer-row${activeIdx === results.length ? " active" : ""}`}
                onClick={() => { setOpen(false); setQuery(""); }}
                onMouseEnter={() => setActiveIdx(results.length)}
              >
                <span className="header-search-row-icon"><Search size={14} /></span>
                <div className="header-search-row-body">
                  <strong>Alle resultaten voor &ldquo;{query}&rdquo;</strong>
                  <small>Open volledige catalogus met filters</small>
                </div>
                <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <div className="header-search-empty">
              <p>Geen tools gevonden voor &ldquo;{query}&rdquo;</p>
              <small>Probeer andere zoektermen of bekijk de complete catalogus.</small>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
