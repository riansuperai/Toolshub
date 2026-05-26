"use client";

import { useMemo, useState } from "react";
import { Eye, Mail, Send, Users } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import type { Broadcast } from "@/lib/types";

const AUDIENCES: { value: Broadcast["audience"]; label: string; description: string }[] = [
  { value: "all_buyers", label: "Alle kopers", description: "Iedereen die ooit iets van je heeft gekocht" },
  { value: "followers", label: "Volgers", description: "Kopers die je expliciet volgen" },
  { value: "active_subscribers", label: "Actieve abonnees", description: "Met lopend maand/jaar abonnement" }
];

function formatDateTime(iso: string) {
  try { return new Date(iso).toLocaleString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
}

export default function SellerBroadcastsPage() {
  const { state, activeUser, sendBroadcast } = useMarketplace();
  const data = useSellerData();
  const toast = useToast();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<Broadcast["audience"]>("all_buyers");
  const [preview, setPreview] = useState(false);

  if (activeUser.role !== "seller" || !data.seller) return null;

  const myBroadcasts = useMemo(
    () => (state.broadcasts ?? [])
      .filter((b) => b.sellerId === data.seller?.id)
      .sort((a, b) => +new Date(b.sentAt) - +new Date(a.sentAt)),
    [state.broadcasts, data.seller?.id]
  );

  // Bereken doelgroep-grootte live
  const audienceSize = useMemo(() => {
    if (!data.seller) return 0;
    if (audience === "all_buyers") {
      const ids = new Set<string>();
      for (const order of state.orders) {
        if (order.status !== "paid") continue;
        if (order.items.some((i) => i.sellerId === data.seller!.id)) ids.add(order.buyerId);
      }
      return ids.size;
    }
    if (audience === "followers") {
      return (state.follows ?? []).filter((f) => f.sellerId === data.seller!.id).length;
    }
    const active = (state.subscriptions ?? []).filter((s) => {
      if (s.status !== "active" && s.status !== "trialing") return false;
      const l = state.listings.find((x) => x.id === s.listingId);
      return l?.sellerId === data.seller!.id;
    });
    return new Set(active.map((s) => s.buyerId)).size;
  }, [audience, state, data.seller]);

  const valid = subject.trim().length >= 5 && body.trim().length >= 20;

  function send() {
    if (!valid) return;
    if (audienceSize === 0) {
      toast.error("Geen ontvangers", "Deze doelgroep heeft geen kopers.");
      return;
    }
    if (!confirm(`Versturen naar ${audienceSize} ontvangers?`)) return;
    sendBroadcast({ subject, body, audience });
    toast.success("Broadcast verstuurd!", `${audienceSize} kopers ontvangen je e-mail.`);
    setSubject("");
    setBody("");
    setPreview(false);
  }

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Mail size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Broadcast</span>
            <h2>Stuur een e-mail naar je kopers</h2>
          </div>
        </div>

        <div className="broadcast-audience">
          {AUDIENCES.map((a) => (
            <button
              key={a.value}
              type="button"
              className={`broadcast-audience-pill${audience === a.value ? " active" : ""}`}
              onClick={() => setAudience(a.value)}
            >
              <Users size={13} />
              <div>
                <strong>{a.label}</strong>
                <small>{a.description}</small>
              </div>
            </button>
          ))}
        </div>

        <div className="broadcast-count">
          <Users size={14} /> <strong>{audienceSize}</strong> {audienceSize === 1 ? "ontvanger" : "ontvangers"}
        </div>

        <label className="publish-version-field">
          <span>Onderwerp</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Nieuwe versie van Bol.com Order Sync is live!"
          />
        </label>

        <label className="publish-version-field">
          <span>Inhoud (Markdown toegestaan)</span>
          <textarea
            rows={preview ? 4 : 10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Hoi {{firstName}},&#10;&#10;Goed nieuws! De nieuwe versie..."
          />
          <small className="publish-version-hint">Beschikbare variabele: {"{{firstName}}"}</small>
        </label>

        {preview ? (
          <div className="broadcast-preview">
            <strong>Voorbeeld voor &ldquo;Nudi Buyer&rdquo;:</strong>
            <div className="broadcast-preview-body">
              <p><strong>Onderwerp:</strong> {subject || "(geen onderwerp)"}</p>
              <div>
                {body.split("\n").map((line, i) => (
                  <p key={i}>{line.replace(/\{\{\s*firstName\s*\}\}/g, "Nudi")}</p>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="broadcast-actions">
          <button type="button" className="button secondary" onClick={() => setPreview((v) => !v)}>
            <Eye size={14} /> {preview ? "Verberg preview" : "Toon preview"}
          </button>
          <button type="button" className="button" disabled={!valid || audienceSize === 0} onClick={send}>
            <Send size={14} /> Versturen naar {audienceSize}
          </button>
        </div>
      </section>

      <section className="section-card" style={{ marginTop: 18 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Historie</span>
            <h2>Verstuurde broadcasts ({myBroadcasts.length})</h2>
          </div>
        </div>
        {myBroadcasts.length === 0 ? (
          <EmptyState icon={Mail} title="Nog niets verstuurd" description="Stuur hierboven je eerste broadcast om alle kopers tegelijk te bereiken." />
        ) : (
          <div className="broadcast-list">
            {myBroadcasts.map((b) => {
              const openRate = b.openCount && b.recipientCount ? Math.round((b.openCount / b.recipientCount) * 100) : 0;
              return (
                <div className="broadcast-item" key={b.id}>
                  <div className="broadcast-item-head">
                    <strong>{b.subject}</strong>
                    <small>{formatDateTime(b.sentAt)}</small>
                  </div>
                  <p className="broadcast-item-preview">{b.body.slice(0, 120)}{b.body.length > 120 ? "..." : ""}</p>
                  <div className="broadcast-item-stats">
                    <span><Users size={11} /> {b.recipientCount} ontvangen</span>
                    <span><Eye size={11} /> {b.openCount} geopend</span>
                    <span className="broadcast-open-rate">{openRate}% open rate</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
