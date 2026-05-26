"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Eye, FileText, Mail, RotateCcw, Save } from "lucide-react";

const STORAGE_KEY = "hazenco-email-templates";

type Template = {
  id: string;
  name: string;
  trigger: string;
  subject: string;
  body: string;
  variables: string[];
};

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "welcome",
    name: "Welkom",
    trigger: "Nieuwe registratie",
    subject: "Welkom bij Hazenco, {{firstName}}!",
    body: `Hallo {{firstName}},

Bedankt voor je registratie op Hazenco. Je account is direct actief en je kunt nu tools kopen, opslaan en reviewen.

Eerst rondkijken? → {{catalogusUrl}}

Vragen? Reply gewoon op deze mail.

Groet,
Team Hazenco`,
    variables: ["firstName", "catalogusUrl"]
  },
  {
    id: "order_confirmation",
    name: "Bestelbevestiging",
    trigger: "Order betaald",
    subject: "Bestelling #{{orderId}} bevestigd",
    body: `Hoi {{firstName}},

Je bestelling is succesvol verwerkt. De tools staan klaar in je bibliotheek.

Bestelnummer: #{{orderId}}
Totaal: €{{totalEur}}
Datum: {{orderDate}}

Items:
{{itemList}}

Ga naar je bibliotheek → {{libraryUrl}}

Veel succes!
Team Hazenco`,
    variables: ["firstName", "orderId", "totalEur", "orderDate", "itemList", "libraryUrl"]
  },
  {
    id: "new_sale",
    name: "Nieuwe verkoop (creator)",
    trigger: "Verkoop verwerkt",
    subject: "🎉 Nieuwe verkoop: {{toolTitle}}",
    body: `Hoi {{creatorName}},

Goed nieuws! Iemand heeft je tool {{toolTitle}} gekocht.

Bedrag: €{{netAmount}} (na 10% platform-fee)
Saldo "Nog uit te betalen": €{{pendingBalance}}

Bekijk de details → {{dashboardUrl}}

Keep building,
Team Hazenco`,
    variables: ["creatorName", "toolTitle", "netAmount", "pendingBalance", "dashboardUrl"]
  },
  {
    id: "payout_completed",
    name: "Uitbetaling voltooid",
    trigger: "SEPA uitbetaling verstuurd",
    subject: "€{{amount}} onderweg naar je IBAN",
    body: `Hoi {{creatorName}},

De opname van €{{amount}} is naar je IBAN gestuurd. Verwachte aankomst: {{expectedDate}}.

IBAN: {{ibanLast4}}
BTW-factuur: {{invoiceUrl}}

Bedankt voor het bouwen op Hazenco!
Team Hazenco`,
    variables: ["creatorName", "amount", "expectedDate", "ibanLast4", "invoiceUrl"]
  },
  {
    id: "listing_approved",
    name: "Listing goedgekeurd",
    trigger: "Admin keurt listing goed",
    subject: "✅ {{toolTitle}} is live!",
    body: `Hoi {{creatorName}},

Je listing {{toolTitle}} is goedgekeurd en staat nu live in de catalogus.

Direct bekijken → {{listingUrl}}

Tip: deel de link op LinkedIn voor extra traffic.

Team Hazenco`,
    variables: ["creatorName", "toolTitle", "listingUrl"]
  },
  {
    id: "listing_rejected",
    name: "Listing afgewezen",
    trigger: "Admin wijst listing af",
    subject: "Listing {{toolTitle}} afgewezen",
    body: `Hoi {{creatorName}},

Je listing {{toolTitle}} kon niet worden goedgekeurd. Reden:

{{reason}}

Pas de listing aan en dien opnieuw in → {{editUrl}}

Vragen? Reply gewoon.
Team Hazenco`,
    variables: ["creatorName", "toolTitle", "reason", "editUrl"]
  },
  {
    id: "appointment_proposed",
    name: "Afspraak voorgesteld",
    trigger: "Afspraak aangevraagd",
    subject: "Afspraakvoorstel: {{date}}",
    body: `Hoi {{recipientName}},

{{senderName}} stelt een sessie voor:

📅 {{date}}
🕒 {{time}} · {{duration}} min
💬 {{topic}}

Goedkeuren of afwijzen → {{appointmentUrl}}

Team Hazenco`,
    variables: ["recipientName", "senderName", "date", "time", "duration", "topic", "appointmentUrl"]
  },
  {
    id: "refund_issued",
    name: "Refund verleend",
    trigger: "Admin refundt order",
    subject: "Refund van €{{amount}} verleend",
    body: `Hoi {{firstName}},

Je refund-verzoek is goedgekeurd. €{{amount}} wordt teruggeboekt naar je rekening, dit duurt 3-5 werkdagen.

Order: #{{orderId}}
Reden: {{reason}}

Vragen? Reply gewoon.
Team Hazenco`,
    variables: ["firstName", "amount", "orderId", "reason"]
  }
];

function loadTemplates(): Template[] {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_TEMPLATES;
    const parsed = JSON.parse(stored) as Template[];
    // Merge missing defaults
    const ids = new Set(parsed.map((t) => t.id));
    const merged = [...parsed];
    for (const d of DEFAULT_TEMPLATES) if (!ids.has(d.id)) merged.push(d);
    return merged;
  } catch {
    return DEFAULT_TEMPLATES;
  }
}

function saveTemplates(t: Template[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [activeId, setActiveId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = loadTemplates();
    setTemplates(loaded);
  }, []);

  const active = templates.find((t) => t.id === activeId) ?? templates[0];

  useEffect(() => {
    if (!active) return;
    setEditSubject(active.subject);
    setEditBody(active.body);
    setPreviewMode(false);
    setSaved(false);
  }, [activeId, active]);

  const hasChanges = active && (editSubject !== active.subject || editBody !== active.body);

  function save() {
    const updated = templates.map((t) => t.id === activeId ? { ...t, subject: editSubject, body: editBody } : t);
    setTemplates(updated);
    saveTemplates(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function resetToDefault() {
    const original = DEFAULT_TEMPLATES.find((t) => t.id === activeId);
    if (!original) return;
    setEditSubject(original.subject);
    setEditBody(original.body);
  }

  const previewSubject = useMemo(() => fillSample(editSubject, active?.variables ?? []), [editSubject, active]);
  const previewBody = useMemo(() => fillSample(editBody, active?.variables ?? []), [editBody, active]);

  if (!active) return null;

  return (
    <div className="templates-layout">
      <aside className="templates-sidebar">
        <div className="templates-sidebar-head">
          <Mail size={14} />
          <strong>E-mail templates</strong>
        </div>
        <small style={{ padding: "0 14px", color: "var(--green-500)", fontSize: 11.5, fontWeight: 700 }}>
          {templates.length} templates
        </small>
        <nav className="templates-nav">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`templates-nav-item${activeId === t.id ? " active" : ""}`}
              onClick={() => setActiveId(t.id)}
            >
              <strong>{t.name}</strong>
              <small>{t.trigger}</small>
            </button>
          ))}
        </nav>
      </aside>

      <section className="templates-editor">
        <div className="templates-editor-head">
          <div>
            <span className="eyebrow"><FileText size={11} /> Template editor</span>
            <h2>{active.name}</h2>
            <small style={{ color: "var(--green-500)", fontSize: 12.5, fontWeight: 700 }}>Verstuurd bij: <strong>{active.trigger}</strong></small>
          </div>
          <div className="templates-editor-actions">
            <button type="button" className={`button secondary${previewMode ? " active" : ""}`} onClick={() => setPreviewMode((v) => !v)}>
              <Eye size={14} /> {previewMode ? "Edit" : "Preview"}
            </button>
            <button type="button" className="button secondary" onClick={resetToDefault} disabled={!hasChanges}>
              <RotateCcw size={14} /> Reset
            </button>
            <button type="button" className="button" onClick={save} disabled={!hasChanges}>
              {saved ? <><Check size={14} /> Opgeslagen</> : <><Save size={14} /> Opslaan</>}
            </button>
          </div>
        </div>

        {previewMode ? (
          <div className="templates-preview">
            <div className="templates-preview-meta">
              <small><strong>Onderwerp:</strong> {previewSubject}</small>
            </div>
            <div className="templates-preview-body">
              {previewBody.split("\n").map((line, i) => (
                <p key={i}>{line || " "}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="templates-edit-area">
            <label>
              <span>Onderwerp</span>
              <input type="text" value={editSubject} onChange={(e) => setEditSubject(e.target.value)} />
            </label>

            <label>
              <span>Inhoud</span>
              <textarea rows={18} value={editBody} onChange={(e) => setEditBody(e.target.value)} />
            </label>

            <div className="templates-vars">
              <strong>Beschikbare variabelen</strong>
              <div className="templates-vars-list">
                {active.variables.map((v) => (
                  <button
                    type="button"
                    key={v}
                    className="templates-var-pill"
                    onClick={() => setEditBody((b) => b + ` {{${v}}}`)}
                    title="Klik om in te voegen op huidige positie"
                  >
                    {"{{"}{v}{"}}"}
                  </button>
                ))}
              </div>
              <small>Klik op een variabele om hem aan het eind in te voegen. In productie wordt deze vervangen door echte data.</small>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function fillSample(text: string, variables: string[]): string {
  const samples: Record<string, string> = {
    firstName: "Nudi",
    creatorName: "Hazenco Studio",
    recipientName: "Nudi",
    senderName: "Hazenco Studio",
    catalogusUrl: "https://hazenco.nl/catalogus",
    libraryUrl: "https://hazenco.nl/account/bibliotheek",
    dashboardUrl: "https://hazenco.nl/seller",
    listingUrl: "https://hazenco.nl/tools/woocommerce-cross-sell",
    editUrl: "https://hazenco.nl/seller/listings",
    appointmentUrl: "https://hazenco.nl/account/support",
    invoiceUrl: "https://hazenco.nl/account/orders/INV-2026",
    orderId: "ORD-001284",
    totalEur: "199,00",
    orderDate: "17 mei 2026",
    itemList: "  • Bol.com Order Sync ×1 → €99,00\n  • Stripe Webhook Bridge ×1 → €100,00",
    toolTitle: "WooCommerce Cross-Sell Plugin",
    netAmount: "89,10",
    pendingBalance: "412,30",
    amount: "412,30",
    expectedDate: "22 mei 2026",
    ibanLast4: "•••• 6789",
    date: "21 mei 2026",
    time: "14:30",
    duration: "30",
    topic: "Setup walkthrough voor nieuwe webhook",
    reason: "Beschrijving onvolledig — voeg minimaal 3 use-cases toe.",
  };
  let out = text;
  for (const v of variables) {
    const re = new RegExp(`\\{\\{\\s*${v}\\s*\\}\\}`, "g");
    out = out.replace(re, samples[v] ?? `[${v}]`);
  }
  return out;
}
