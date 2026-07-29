import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Shell } from "@/components/shell";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact — Hazenco",
  description:
    "Plan een gesprek van 15 minuten met Hazenco, of stuur direct een WhatsApp of e-mail. Meestal binnen 1 werkdag antwoord."
};

const HAZENCO_WHATSAPP = "31643074303";
const HAZENCO_EMAIL = "hallo@hazenco.nl";

export default function ContactPage() {
  return (
    <Shell>
      <div className="page">
        <header className="section-hero" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <p className="eyebrow">Contact</p>
          <h1>Kort gesprek, concrete inschatting.</h1>
          <p className="lead">
            Vertel wat je zoekt — dan hoor je binnen 1 werkdag of we een fit zijn en wat het grofweg kost. Geen
            verkoopgesprek, geen verplichtingen.
          </p>
        </header>

        <div className="contact-layout">
          <div className="contact-form-wrap">
            <ContactForm />
          </div>

          <aside className="contact-aside">
            <p className="contact-aside-eyebrow">Liever direct?</p>

            <a
              href={`https://wa.me/${HAZENCO_WHATSAPP}?text=${encodeURIComponent(
                "Hallo Hazenco, ik heb een vraag."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="contact-channel"
            >
              <div className="contact-channel-icon">
                <MessageCircle size={20} />
              </div>
              <div>
                <strong>WhatsApp</strong>
                <span>Snelste route — meestal binnen een uur</span>
              </div>
            </a>

            <a href={`mailto:${HAZENCO_EMAIL}`} className="contact-channel">
              <div className="contact-channel-icon">
                <Mail size={20} />
              </div>
              <div>
                <strong>E-mail</strong>
                <span>{HAZENCO_EMAIL}</span>
              </div>
            </a>

            <a href="tel:+31643074303" className="contact-channel">
              <div className="contact-channel-icon">
                <Phone size={20} />
              </div>
              <div>
                <strong>Telefoon</strong>
                <span>+31 6 4307 4303 · ma–vr 09:00–17:00</span>
              </div>
            </a>

            <div className="contact-aside-note">
              <p>
                We zijn een klein Nederlands team. Je spreekt altijd direct met iemand die weet waar 'ie het over
                heeft — geen callcenter of tussenlaag.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
