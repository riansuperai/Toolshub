"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Layers, Sparkles, X } from "lucide-react";
import {
  brancheLabels,
  deliveryModeLabels,
  formatPrice,
  useCaseLabels
} from "@/lib/marketplace-data";
import { brancheIcons } from "@/lib/branche-icons";
import type { Branche, DeliveryMode, Listing, UseCase } from "@/lib/types";

export type WizardSelection = {
  branche: Branche | "all";
  useCase: UseCase | "all";
  platform: string;
  price: "all" | "free" | "lt25" | "25_50" | "50_100" | "gt100";
  delivery: DeliveryMode | "all";
};

const initialSelection: WizardSelection = {
  branche: "all",
  useCase: "all",
  platform: "all",
  price: "all",
  delivery: "all"
};

const priceOptions: { id: WizardSelection["price"]; label: string }[] = [
  { id: "all", label: "Maakt niet uit" },
  { id: "free", label: "Gratis" },
  { id: "lt25", label: "Onder €25" },
  { id: "25_50", label: "€25 – €50" },
  { id: "50_100", label: "€50 – €100" },
  { id: "gt100", label: "Boven €100" }
];

function bucketForPrice(cents: number): Exclude<WizardSelection["price"], "all"> {
  if (cents === 0) return "free";
  if (cents < 2500) return "lt25";
  if (cents <= 5000) return "25_50";
  if (cents <= 10000) return "50_100";
  return "gt100";
}

export type FilterWizardProps = {
  open: boolean;
  onClose: () => void;
  onApply: (selection: WizardSelection) => void;
  listings: Listing[];
  initial?: WizardSelection;
};

export function FilterWizard({ open, onClose, onApply, listings, initial }: FilterWizardProps) {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<WizardSelection>(initial ?? initialSelection);

  useEffect(() => {
    if (open) {
      setStep(0);
      setSelection(initial ?? initialSelection);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  const matchCount = useMemo(() => {
    return listings.filter((listing) => {
      if (listing.status !== "published") return false;
      if (selection.branche !== "all" && !(listing.branches ?? []).includes(selection.branche)) return false;
      if (selection.useCase !== "all" && !(listing.useCases ?? []).includes(selection.useCase)) return false;
      if (selection.platform !== "all" && !listing.compatibility.includes(selection.platform)) return false;
      if (selection.price !== "all" && bucketForPrice(listing.priceCents) !== selection.price) return false;
      if (selection.delivery !== "all" && !listing.deliveryModes.includes(selection.delivery)) return false;
      return true;
    }).length;
  }, [listings, selection]);

  if (!open) return null;

  const brancheEntries = Object.entries(brancheLabels) as [Branche, string][];
  const useCaseEntries = Object.entries(useCaseLabels) as [UseCase, string][];
  const deliveryEntries = Object.entries(deliveryModeLabels) as [DeliveryMode, string][];

  const steps = [
    {
      title: "In welke branche werk je?",
      lead: "Zo zien we welke tools het beste passen bij jouw sector.",
      render: () => (
        <div className="wizard-options">
          <button
            type="button"
            className={`wizard-option${selection.branche === "all" ? " active" : ""}`}
            onClick={() => setSelection((s) => ({ ...s, branche: "all" }))}
          >
            <Layers size={14} /> Maakt niet uit
          </button>
          {brancheEntries.map(([key, label]) => {
            const Icon = brancheIcons[key];
            return (
              <button
                key={key}
                type="button"
                className={`wizard-option${selection.branche === key ? " active" : ""}`}
                onClick={() => setSelection((s) => ({ ...s, branche: key }))}
              >
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>
      )
    },
    {
      title: "Wat zoek je?",
      lead: "Kies de categorie die het beste past bij de oplossing die je nodig hebt.",
      render: () => (
        <div className="wizard-options">
          <button
            type="button"
            className={`wizard-option${selection.useCase === "all" ? " active" : ""}`}
            onClick={() => setSelection((s) => ({ ...s, useCase: "all" }))}
          >
            Verras me
          </button>
          {useCaseEntries.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`wizard-option${selection.useCase === key ? " active" : ""}`}
              onClick={() => setSelection((s) => ({ ...s, useCase: key }))}
            >
              {label}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Wat is je budget?",
      lead: "Wij tonen tools binnen het bereik dat bij je past.",
      render: () => (
        <div className="wizard-options">
          {priceOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`wizard-option${selection.price === option.id ? " active" : ""}`}
              onClick={() => setSelection((s) => ({ ...s, price: option.id }))}
            >
              {option.label}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Hoe wil je het ontvangen?",
      lead: "Direct downloaden, in de cloud gebruiken of laten setuppen door de seller.",
      render: () => (
        <div className="wizard-options">
          <button
            type="button"
            className={`wizard-option${selection.delivery === "all" ? " active" : ""}`}
            onClick={() => setSelection((s) => ({ ...s, delivery: "all" }))}
          >
            Maakt niet uit
          </button>
          {deliveryEntries.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`wizard-option${selection.delivery === key ? " active" : ""}`}
              onClick={() => setSelection((s) => ({ ...s, delivery: key }))}
            >
              {label}
            </button>
          ))}
        </div>
      )
    }
  ];

  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow"><Sparkles size={13} style={{ marginRight: 4, verticalAlign: -2 }} /> Filter-assistent</span>
            <h2>{current.title}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Sluiten">
            <X size={17} />
          </button>
        </div>
        <div className="wizard-steps">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`wizard-step-dot${index === step ? " active" : index < step ? " done" : ""}`}
            />
          ))}
        </div>
        <div className="wizard-body">
          <p className="lead-sm">{current.lead}</p>
          {current.render()}
        </div>
        <div className="wizard-foot">
          <span className="wizard-progress">
            Stap {step + 1} van {steps.length} • {matchCount} {matchCount === 1 ? "match" : "matches"}
          </span>
          <div className="wizard-foot-actions">
            {step > 0 ? (
              <button type="button" className="button secondary" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft size={16} /> Vorige
              </button>
            ) : null}
            {isLast ? (
              <button
                type="button"
                className="button"
                onClick={() => {
                  onApply(selection);
                  onClose();
                }}
              >
                Toon {matchCount} {matchCount === 1 ? "tool" : "tools"}
              </button>
            ) : (
              <button type="button" className="button" onClick={() => setStep((s) => s + 1)}>
                Volgende <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { initialSelection as wizardInitialSelection, bucketForPrice as wizardBucketForPrice };
