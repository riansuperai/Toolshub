"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { submitContact, type ContactFormState } from "./actions";

const INITIAL_STATE: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL_STATE);

  if (state.status === "success") {
    return (
      <div className="contact-form-success">
        <div className="contact-form-success-icon">
          <CheckCircle2 size={28} />
        </div>
        <h3>Bericht ontvangen</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="contact-form">
      <div className="contact-form-row">
        <label className="contact-field">
          <span>Naam <em>*</em></span>
          <input type="text" name="naam" required autoComplete="name" placeholder="Voor- en achternaam" />
        </label>
        <label className="contact-field">
          <span>E-mail <em>*</em></span>
          <input type="email" name="email" required autoComplete="email" placeholder="jij@bedrijf.nl" />
        </label>
      </div>

      <div className="contact-form-row">
        <label className="contact-field">
          <span>Bedrijf</span>
          <input type="text" name="bedrijf" autoComplete="organization" placeholder="Optioneel" />
        </label>
        <label className="contact-field">
          <span>Telefoon</span>
          <input type="tel" name="telefoon" autoComplete="tel" placeholder="Optioneel" />
        </label>
      </div>

      <label className="contact-field">
        <span>Waar gaat het over?</span>
        <select name="onderwerp" defaultValue="webdesign">
          <option value="webdesign">Maatwerk weboplossingen</option>
          <option value="workflow">Workflow-automatisering</option>
          <option value="ai">AI-workflows &amp; integraties</option>
          <option value="toolkit">Vraag over de gratis toolkit</option>
          <option value="anders">Iets anders</option>
        </select>
      </label>

      <label className="contact-field">
        <span>Bericht <em>*</em></span>
        <textarea
          name="bericht"
          required
          rows={6}
          placeholder="Vertel kort wat je zoekt of welke situatie je wilt oplossen."
        />
      </label>

      {/* Honeypot, verborgen veld dat bots wel invullen, mensen niet */}
      <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
        <label>
          Als je een mens bent, laat dit veld leeg
          <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && state.message ? (
        <div className="contact-form-error" role="alert">
          <AlertCircle size={16} /> {state.message}
        </div>
      ) : null}

      <div className="contact-form-actions">
        <button type="submit" className="button" disabled={pending}>
          {pending ? "Versturen..." : <>Verstuur bericht <Send size={14} /></>}
        </button>
        <p className="contact-form-note">
          <em>*</em> Verplicht. We reageren meestal binnen één werkdag.
        </p>
      </div>
    </form>
  );
}
