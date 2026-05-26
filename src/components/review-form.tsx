"use client";

import { useRef, useState } from "react";
import { Camera, Star, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";

type Props = {
  listingId: string;
  onSubmitted?: () => void;
};

const MAX_SCREENSHOTS = 3;
const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB per shot (na resize)

function fileToDataUrl(file: File, maxWidth = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Resize naar maxWidth om localStorage niet vol te stoppen
        const ratio = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas niet ondersteund"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = src;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ReviewForm({ listingId, onSubmitted }: Props) {
  const { addReview } = useMarketplace();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [shots, setShots] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    setBusy(true);
    try {
      const incoming = Array.from(files).slice(0, MAX_SCREENSHOTS - shots.length);
      for (const f of incoming) {
        if (!f.type.startsWith("image/")) {
          setError("Alleen afbeeldingen toegestaan.");
          continue;
        }
        if (f.size > MAX_FILE_SIZE * 4) {
          setError("Bestand te groot (max 6 MB).");
          continue;
        }
        const dataUrl = await fileToDataUrl(f);
        setShots((s) => [...s, dataUrl]);
      }
    } catch {
      setError("Kon afbeelding niet verwerken.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Geef minimaal 1 ster.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Beschrijf je ervaring in minimaal 10 tekens.");
      return;
    }
    addReview(listingId, rating, comment.trim(), shots);
    toast.success("Review ingediend", "Admin keurt 'm binnen 24 uur en daarna staat'ie live.");
    setSuccess(true);
    setTimeout(() => onSubmitted?.(), 1200);
  }

  if (success) {
    return (
      <div className="review-success">
        <Star size={28} fill="currentColor" style={{ color: "var(--orange-600)" }} />
        <strong>Bedankt voor je review!</strong>
        <small>Admin keurt &lsquo;m binnen 24 uur, daarna staat&apos;ie live op de toolpagina.</small>
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="review-stars">
        <span className="review-label">Hoe ervaarde je deze tool?</span>
        <div className="review-stars-row" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              className={`review-star${(hover || rating) >= n ? " active" : ""}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
            >
              <Star size={28} fill={(hover || rating) >= n ? "currentColor" : "none"} strokeWidth={2} />
            </button>
          ))}
          {rating > 0 ? <span className="review-rating-text">{rating}/5</span> : null}
        </div>
      </div>

      <label className="review-comment-label">
        <span>Wat vond je goed of minder goed?</span>
        <textarea
          rows={5}
          placeholder="Vertel andere kopers wat ze kunnen verwachten — wat werkte goed, waar liep je tegenaan?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
        />
        <small className="review-counter">{comment.length}/1000</small>
      </label>

      <div className="review-screenshots">
        <span className="review-label">Screenshots toevoegen (optioneel)</span>
        <div className="review-screenshots-grid">
          {shots.map((src, i) => (
            <div key={i} className="review-screenshot-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Screenshot ${i + 1}`} />
              <button type="button" className="review-screenshot-remove" onClick={() => setShots((s) => s.filter((_, idx) => idx !== i))} aria-label="Verwijderen">
                <X size={12} />
              </button>
            </div>
          ))}
          {shots.length < MAX_SCREENSHOTS ? (
            <button
              type="button"
              className="review-screenshot-add"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
            >
              <Camera size={18} />
              <small>{busy ? "Bezig..." : "Toevoegen"}</small>
            </button>
          ) : null}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <small className="review-hint">Tot {MAX_SCREENSHOTS} afbeeldingen · max 6 MB elk · automatisch geresized</small>
      </div>

      {error ? <div className="review-error">{error}</div> : null}

      <div className="review-actions">
        <button type="submit" className="button" disabled={busy}>
          <Star size={14} fill="currentColor" /> Review plaatsen
        </button>
      </div>
    </form>
  );
}
