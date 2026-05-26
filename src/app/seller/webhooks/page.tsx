"use client";

import { useState } from "react";
import { Activity, Copy, Eye, EyeOff, Pause, Play, PlusCircle, Send, ShieldCheck, Trash2, Webhook, X, Zap } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import type { SellerWebhook } from "@/lib/types";

const EVENTS: { value: SellerWebhook["events"][number]; label: string; description: string }[] = [
  { value: "sale", label: "Nieuwe verkoop", description: "Tool wordt gekocht" },
  { value: "refund", label: "Refund verleend", description: "Admin keurt refund goed" },
  { value: "review", label: "Review goedgekeurd", description: "Nieuwe publieke review op een tool" },
  { value: "subscription_started", label: "Abonnement gestart", description: "Iemand start een nieuw abonnement" },
  { value: "subscription_cancelled", label: "Abonnement opgezegd", description: "Abonnement wordt beëindigd" }
];

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
}

export default function SellerWebhooksPage() {
  const { state, activeUser, upsertWebhook, deleteWebhook, fireWebhookTest } = useMarketplace();
  const data = useSellerData();
  const toast = useToast();
  const [editing, setEditing] = useState<SellerWebhook | null>(null);
  const [creating, setCreating] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  if (activeUser.role !== "seller" || !data.seller) return null;

  const myHooks = (state.webhooks ?? []).filter((w) => w.sellerId === data.seller?.id);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} gekopieerd`);
  }

  function toggleActive(wh: SellerWebhook) {
    upsertWebhook({ id: wh.id, url: wh.url, events: wh.events, active: !wh.active });
    toast.success(wh.active ? "Webhook gepauzeerd" : "Webhook actief");
  }

  function remove(id: string) {
    if (!confirm("Webhook verwijderen?")) return;
    deleteWebhook(id);
    toast.info("Webhook verwijderd");
  }

  function fireTest(id: string) {
    fireWebhookTest(id);
    toast.success("Test-event verstuurd", "POST naar webhook URL — check logs.");
  }

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Webhook size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Webhooks</span>
            <h2>Automatiseer met externe systemen ({myHooks.length})</h2>
          </div>
          <button type="button" className="button" onClick={() => setCreating(true)}>
            <PlusCircle size={14} /> Nieuwe webhook
          </button>
        </div>

        <div className="webhook-intro">
          <Zap size={16} />
          <div>
            <strong>Wat zijn webhooks?</strong>
            <p>
              Bij elke gebeurtenis (verkoop, refund, etc.) doen we een <code>POST</code> naar jouw URL met JSON-payload.
              Verbind met n8n, Zapier, Make.com of je eigen API om automatisch op events te reageren.
            </p>
          </div>
        </div>

        {myHooks.length === 0 ? (
          <EmptyState
            icon={Webhook}
            title="Nog geen webhooks"
            description="Maak een endpoint URL aan en kies welke events je wilt ontvangen. Hazenco signt elk request met je geheim — verifieer dat in je server."
            action={<button type="button" className="button" onClick={() => setCreating(true)}><PlusCircle size={14} /> Webhook toevoegen</button>}
          />
        ) : (
          <div className="webhook-list">
            {myHooks.map((wh) => (
              <div className="webhook-card" key={wh.id}>
                <div className="webhook-card-head">
                  <div>
                    <strong>{wh.url}</strong>
                    <small>
                      {wh.events.length} event{wh.events.length === 1 ? "" : "s"} ·{" "}
                      Laatst gevuurd: {formatDateTime(wh.lastFiredAt)}
                    </small>
                  </div>
                  <span className={`status-badge ${wh.active ? "paid" : "new"}`}>
                    {wh.active ? "Actief" : "Gepauzeerd"}
                  </span>
                </div>

                <div className="webhook-secret">
                  <div className="webhook-secret-label">
                    <ShieldCheck size={12} /> Signing secret
                  </div>
                  <code>{revealed.has(wh.id) ? wh.secret : wh.secret.replace(/./g, "•")}</code>
                  <button type="button" onClick={() => toggleReveal(wh.id)} title={revealed.has(wh.id) ? "Verberg" : "Toon"}>
                    {revealed.has(wh.id) ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button type="button" onClick={() => copy(wh.secret, "Secret")} title="Kopieer">
                    <Copy size={12} />
                  </button>
                </div>

                <div className="webhook-events">
                  {wh.events.map((e) => (
                    <span key={e} className="webhook-event-pill">{EVENTS.find((x) => x.value === e)?.label ?? e}</span>
                  ))}
                </div>

                <div className="webhook-actions">
                  <button type="button" className="button secondary" onClick={() => fireTest(wh.id)}>
                    <Send size={13} /> Test
                  </button>
                  <button type="button" className="button secondary" onClick={() => setEditing(wh)}>
                    Bewerken
                  </button>
                  <button type="button" className="button secondary" onClick={() => toggleActive(wh)}>
                    {wh.active ? <><Pause size={13} /> Pauzeer</> : <><Play size={13} /> Activeer</>}
                  </button>
                  <button type="button" className="button secondary" onClick={() => remove(wh.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activity log */}
      {myHooks.some((w) => w.lastFiredAt) ? (
        <section className="section-card" style={{ marginTop: 18 }}>
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow"><Activity size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Activity</span>
              <h2>Recente firings</h2>
            </div>
          </div>
          <div className="webhook-activity">
            {myHooks.filter((w) => w.lastFiredAt).map((w) => (
              <div className="webhook-activity-row" key={w.id}>
                <span className="webhook-activity-status success">200 OK</span>
                <div>
                  <strong>{w.url}</strong>
                  <small>{formatDateTime(w.lastFiredAt)} · test.fire</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {(creating || editing) ? (
        <WebhookEditor
          webhook={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={(input) => {
            upsertWebhook({ ...input, id: editing?.id });
            toast.success(editing ? "Webhook bijgewerkt" : "Webhook aangemaakt");
            setCreating(false);
            setEditing(null);
          }}
        />
      ) : null}
    </>
  );
}

function WebhookEditor({
  webhook,
  onClose,
  onSave
}: {
  webhook: SellerWebhook | null;
  onClose: () => void;
  onSave: (input: { url: string; events: SellerWebhook["events"]; active: boolean }) => void;
}) {
  const [url, setUrl] = useState(webhook?.url ?? "");
  const [events, setEvents] = useState<Set<SellerWebhook["events"][number]>>(new Set(webhook?.events ?? ["sale"]));
  const [active, setActive] = useState(webhook?.active ?? true);

  const valid = url.startsWith("https://") && events.size > 0;

  function toggleEvent(ev: SellerWebhook["events"][number]) {
    setEvents((prev) => {
      const next = new Set(prev);
      if (next.has(ev)) next.delete(ev);
      else next.add(ev);
      return next;
    });
  }

  return (
    <div className="changelog-backdrop" onClick={onClose}>
      <div className="publish-version-modal" onClick={(e) => e.stopPropagation()} style={{ width: "min(560px, 96vw)" }}>
        <div className="changelog-head">
          <div>
            <span className="eyebrow"><Webhook size={11} /> Webhook</span>
            <h2>{webhook ? "Bewerken" : "Nieuwe webhook"}</h2>
            <small>POST request met JSON payload bij elke event</small>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="publish-version-body">
          <label className="publish-version-field">
            <span>Endpoint URL</span>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://my-app.com/webhooks/hazenco"
            />
            <small className="publish-version-hint">Moet HTTPS zijn · we verwachten een <code>200 OK</code> binnen 5s</small>
          </label>

          <div className="publish-version-field">
            <span>Events ({events.size} geselecteerd)</span>
            <div className="webhook-events-grid">
              {EVENTS.map((ev) => {
                const selected = events.has(ev.value);
                return (
                  <button
                    type="button"
                    key={ev.value}
                    className={`webhook-event-toggle${selected ? " selected" : ""}`}
                    onClick={() => toggleEvent(ev.value)}
                  >
                    <div>
                      <strong>{ev.label}</strong>
                      <small>{ev.description}</small>
                    </div>
                    {selected ? <span className="webhook-event-check">✓</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="publish-version-checkbox">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            <span>Direct activeren</span>
          </label>
        </div>

        <div className="publish-version-foot">
          <button type="button" className="button secondary" onClick={onClose}>Annuleren</button>
          <button type="button" className="button" disabled={!valid} onClick={() => onSave({ url, events: [...events], active })}>
            {webhook ? "Opslaan" : "Webhook aanmaken"}
          </button>
        </div>
      </div>
    </div>
  );
}
