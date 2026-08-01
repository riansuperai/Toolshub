"use server";

import { Resend } from "resend";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

type Field = "naam" | "email" | "bedrijf" | "telefoon" | "onderwerp" | "bericht" | "honeypot";

function sanitize(v: FormDataEntryValue | null, max = 500): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

// Naïve rate-limit: unieke user krijgt max 3 submissions per uur op de server-instance.
// Voor productie liever een Redis/Upstash-based limiter; dit is genoeg voor low-traffic B2B.
const submissions = new Map<string, number[]>();
function checkRateLimit(key: string, maxPerHour = 3): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const history = (submissions.get(key) ?? []).filter((t) => t > hourAgo);
  if (history.length >= maxPerHour) {
    submissions.set(key, history);
    return false;
  }
  history.push(now);
  submissions.set(key, history);
  return true;
}

const ONDERWERP_LABELS: Record<string, string> = {
  webdesign: "Maatwerk weboplossingen",
  workflow: "Workflow-automatisering",
  ai: "AI-workflows & integraties",
  toolkit: "Vraag over de gratis toolkit",
  anders: "Iets anders"
};

export async function submitContact(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const naam = sanitize(formData.get("naam"), 100);
  const email = sanitize(formData.get("email"), 200);
  const bedrijf = sanitize(formData.get("bedrijf"), 100);
  const telefoon = sanitize(formData.get("telefoon"), 30);
  const onderwerp = sanitize(formData.get("onderwerp"), 40);
  const bericht = sanitize(formData.get("bericht"), 3000);
  const honeypot = sanitize(formData.get("honeypot"), 200);

  // Honeypot: bots vullen 't in, mensen niet, hidden veld
  if (honeypot.length > 0) {
    return { status: "success", message: "Bedankt, we nemen zo snel mogelijk contact op." };
  }

  // Basis-validatie
  if (!naam || !email || !bericht) {
    return { status: "error", message: "Vul in ieder geval je naam, e-mail en bericht in." };
  }
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValid) {
    return { status: "error", message: "Dit e-mailadres lijkt niet te kloppen, check even?" };
  }

  // Rate-limit per e-mail
  if (!checkRateLimit(email)) {
    return {
      status: "error",
      message: "Je hebt al een paar berichten verstuurd. Probeer over een uur opnieuw, of stuur direct een WhatsApp."
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Hazenco Contact <hallo@hazenco.nl>";
  const to = process.env.RESEND_TO ?? "hallo@hazenco.nl";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY niet ingesteld, bericht niet verstuurd", {
      naam, email, onderwerp
    });
    return {
      status: "error",
      message: "Contactformulier is nog niet volledig ingesteld. Stuur direct een WhatsApp of mail, die werken al wel."
    };
  }

  const resend = new Resend(apiKey);
  const onderwerpLabel = ONDERWERP_LABELS[onderwerp] ?? "Contact via website";

  try {
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[hazenco.nl] ${onderwerpLabel}, ${naam}`,
      text: [
        `Nieuw bericht via hazenco.nl:`,
        ``,
        `Naam: ${naam}`,
        `E-mail: ${email}`,
        bedrijf ? `Bedrijf: ${bedrijf}` : null,
        telefoon ? `Telefoon: ${telefoon}` : null,
        `Onderwerp: ${onderwerpLabel}`,
        ``,
        `Bericht:`,
        bericht
      ].filter(Boolean).join("\n")
    });
  } catch (err) {
    console.error("[contact] Resend send failed", err);
    return {
      status: "error",
      message: "Er ging iets mis bij het versturen. Probeer het opnieuw of stuur direct een WhatsApp / mail."
    };
  }

  return {
    status: "success",
    message: "Bedankt! We hebben je bericht binnen. Meestal binnen één werkdag antwoord."
  };
}
