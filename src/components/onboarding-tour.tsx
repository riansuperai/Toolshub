"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Compass, Heart, Library, Search, Sparkles, Star, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";

const STORAGE_KEY = "hazenco-onboarding-completed";

type Step = {
  icon: typeof Search;
  title: string;
  body: string;
  highlight?: { selector: string; label: string };
};

const BUYER_STEPS: Step[] = [
  {
    icon: Sparkles,
    title: "Welkom bij Hazenco!",
    body: "Een marktplaats voor n8n workflows, AI agents, plugins en meer. Laten we een korte rondleiding doen."
  },
  {
    icon: Search,
    title: "Zoeken & vinden",
    body: "Gebruik de zoekbalk bovenaan (of druk op ⌘K) om snel tools te vinden. Filter op categorie, prijs, of branche in de catalogus."
  },
  {
    icon: Library,
    title: "Je bibliotheek",
    body: "Wat je koopt staat altijd klaar in je bibliotheek. Updates van creators krijg je gratis — je ziet automatisch een 'update beschikbaar' badge."
  },
  {
    icon: Heart,
    title: "Volg & like",
    body: "Volg je favoriete creators om meldingen te krijgen bij nieuwe tools. Like tools die je gaaf vindt om ze later terug te vinden."
  },
  {
    icon: Star,
    title: "Help de community",
    body: "Schrijf reviews, stel vragen op tool-pagina's, en deel screenshots van je setup. Andere kopers helpen er enorm mee."
  }
];

export function OnboardingTour() {
  const { activeUser } = useMarketplace();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (activeUser.role !== "buyer") return;
    const completed = window.localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Kleine vertraging voor minder shock-effect
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [activeUser.role]);

  function close() {
    window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setOpen(false);
  }

  function next() {
    if (step < BUYER_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      close();
    }
  }

  if (!open) return null;

  const current = BUYER_STEPS[step];
  const Icon = current.icon;
  const isLast = step === BUYER_STEPS.length - 1;
  const progress = ((step + 1) / BUYER_STEPS.length) * 100;

  return (
    <div className="onboarding-tour-backdrop">
      <div className="onboarding-tour-modal">
        <div className="onboarding-tour-progress">
          <div className="onboarding-tour-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        <button type="button" className="onboarding-tour-skip" onClick={close} aria-label="Sluiten">
          <X size={14} />
        </button>

        <div className="onboarding-tour-icon">
          <Icon size={28} />
        </div>

        <div className="onboarding-tour-stepper">
          {BUYER_STEPS.map((_, i) => (
            <span key={i} className={`onboarding-tour-dot${i === step ? " active" : ""}${i < step ? " done" : ""}`}>
              {i < step ? <Check size={9} /> : null}
            </span>
          ))}
        </div>

        <h2>{current.title}</h2>
        <p>{current.body}</p>

        <div className="onboarding-tour-actions">
          {!isLast ? (
            <button type="button" className="button secondary" onClick={close}>
              Sla over
            </button>
          ) : (
            <Link href="/catalogus" className="button secondary" onClick={close}>
              <Compass size={14} /> Verken catalogus
            </Link>
          )}
          <button type="button" className="button" onClick={next}>
            {isLast ? <>Begrepen <Check size={14} /></> : <>Volgende <ArrowRight size={14} /></>}
          </button>
        </div>

        <small className="onboarding-tour-counter">Stap {step + 1} van {BUYER_STEPS.length}</small>
      </div>
    </div>
  );
}
