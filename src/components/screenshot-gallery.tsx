"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

type Props = {
  screenshots: string[];
  toolTitle: string;
};

export function ScreenshotGallery({ screenshots, toolTitle }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const total = screenshots.length;

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % total);
  }, [total]);

  const openLightbox = useCallback(() => {
    if (total > 0) setLightboxOpen(true);
  }, [total]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Keyboard navigation: arrows for slider, Esc closes lightbox
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxOpen) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goPrev, goNext, closeLightbox]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [lightboxOpen]);

  if (total === 0) return null;

  const current = screenshots[currentIndex];

  return (
    <>
      <section id="screenshots" className="section-card screenshots-section">
        <header className="screenshots-header">
          <h2>Screenshots</h2>
          <p className="small">
            {total} {total === 1 ? "afbeelding" : "afbeeldingen"} · klik om te vergroten
          </p>
        </header>

        {/* Hero slider */}
        <div className="screenshots-hero">
          <button
            type="button"
            className="screenshots-stage"
            onClick={openLightbox}
            aria-label={`Vergroot screenshot ${currentIndex + 1} van ${total}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current}
              src={current}
              alt={`${toolTitle} screenshot ${currentIndex + 1}`}
              loading="lazy"
            />
            <span className="screenshots-zoom-hint">
              <Expand size={16} /> Vergroten
            </span>
          </button>

          {total > 1 ? (
            <>
              <button
                type="button"
                className="screenshots-arrow prev"
                onClick={goPrev}
                aria-label="Vorige screenshot"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="screenshots-arrow next"
                onClick={goNext}
                aria-label="Volgende screenshot"
              >
                <ChevronRight size={22} />
              </button>
              <span className="screenshots-counter">
                {currentIndex + 1} / {total}
              </span>
            </>
          ) : null}
        </div>

        {/* Thumbnail strip */}
        {total > 1 ? (
          <div className="screenshots-thumbs" role="tablist" aria-label="Screenshot navigatie">
            {screenshots.map((url, idx) => (
              <button
                key={url + idx}
                type="button"
                className={`screenshots-thumb ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Toon screenshot ${idx + 1}`}
                aria-selected={idx === currentIndex}
                role="tab"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {/* Lightbox overlay */}
      {lightboxOpen ? (
        <div
          className="screenshots-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Screenshot ${currentIndex + 1} van ${total}`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="screenshots-lightbox-close"
            onClick={closeLightbox}
            aria-label="Sluit"
          >
            <X size={24} />
          </button>

          {total > 1 ? (
            <>
              <button
                type="button"
                className="screenshots-lightbox-arrow prev"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Vorige"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                className="screenshots-lightbox-arrow next"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Volgende"
              >
                <ChevronRight size={28} />
              </button>
            </>
          ) : null}

          <figure
            className="screenshots-lightbox-figure"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt={`${toolTitle} screenshot ${currentIndex + 1}`}
            />
            <figcaption>
              {currentIndex + 1} / {total} · {toolTitle}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
