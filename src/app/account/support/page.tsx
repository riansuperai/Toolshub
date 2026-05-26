"use client";

import { useMemo, useState } from "react";
import { Calendar, Inbox, MessageSquare, Wrench } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useAccountData } from "@/lib/account-data";
import { ServiceConversation } from "@/components/service-conversation";
import { ServiceCalendar } from "@/components/service-calendar";
import type { ServiceRequest } from "@/lib/types";

type Tab = "requests" | "messages" | "calendar";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function AccountSupportPage() {
  const { state, activeUser } = useMarketplace();
  const { serviceRequests } = useAccountData();
  const [tab, setTab] = useState<Tab>("requests");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const messageCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of state.serviceMessages ?? []) {
      map.set(m.requestId, (map.get(m.requestId) ?? 0) + 1);
    }
    return map;
  }, [state.serviceMessages]);

  const pendingAppointments = useMemo(
    () =>
      (state.appointments ?? []).filter(
        (a) => serviceRequests.some((r) => r.id === a.requestId) && a.status === "proposed" && a.proposedBy === "seller"
      ).length,
    [state.appointments, serviceRequests]
  );

  if (activeUser.role === "visitor") return null;

  const active = activeRequestId
    ? serviceRequests.find((r) => r.id === activeRequestId)
    : serviceRequests[0];

  return (
    <>
      <div className="services-tabs">
        <button
          type="button"
          className={tab === "requests" ? "active" : ""}
          onClick={() => setTab("requests")}
        >
          <Inbox size={14} /> Aanvragen
          {serviceRequests.length > 0 ? <span className="services-tab-badge">{serviceRequests.length}</span> : null}
        </button>
        <button
          type="button"
          className={tab === "messages" ? "active" : ""}
          onClick={() => setTab("messages")}
        >
          <MessageSquare size={14} /> Berichten
        </button>
        <button
          type="button"
          className={tab === "calendar" ? "active" : ""}
          onClick={() => setTab("calendar")}
        >
          <Calendar size={14} /> Afspraken
          {pendingAppointments > 0 ? <span className="services-tab-badge accent">{pendingAppointments}</span> : null}
        </button>
      </div>

      {tab === "requests" ? (
        <section className="section-card" style={{ marginTop: 0 }}>
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow">Support</span>
              <h2>Service aanvragen ({serviceRequests.length})</h2>
            </div>
          </div>
          {serviceRequests.length ? (
            serviceRequests.map((request) => {
              const listing = state.listings.find((item) => item.id === request.listingId);
              const msgs = messageCounts.get(request.id) ?? 0;
              return (
                <div className="support-row" key={request.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 12, alignItems: "center" }}>
                  <div>
                    <strong>{listing?.title ?? "Onbekende tool"}</strong>
                    <p>{request.message}</p>
                    <p style={{ color: "var(--green-500)", fontSize: 12, marginTop: 4 }}>
                      <Wrench size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
                      {request.scope} · {formatDate(request.createdAt)}
                      {msgs > 0 ? <> · <MessageSquare size={11} style={{ verticalAlign: -1 }} /> {msgs}</> : null}
                    </p>
                  </div>
                  <span className={`status-badge ${request.status}`}>
                    {request.status === "new" && "Nieuw"}
                    {request.status === "in_progress" && "In behandeling"}
                    {request.status === "waiting_for_buyer" && "Wacht op jou"}
                    {request.status === "completed" && "Afgerond"}
                  </span>
                  <button
                    type="button"
                    className="button secondary"
                    style={{ minHeight: 32, padding: "0 10px", fontSize: 12 }}
                    onClick={() => { setActiveRequestId(request.id); setTab("messages"); }}
                  >
                    <MessageSquare size={13} /> Berichten
                  </button>
                </div>
              );
            })
          ) : (
            <p>Geen open supportaanvragen. Vraag hulp aan vanuit de bibliotheek of de tool-detailpagina.</p>
          )}
        </section>
      ) : null}

      {tab === "messages" ? (
        <section className="section-card" style={{ marginTop: 0, padding: 0, overflow: "hidden" }}>
          <div className="messages-split">
            <aside className="messages-list">
              <div className="messages-list-head">
                <strong>Gesprekken</strong>
                <small>{serviceRequests.length}</small>
              </div>
              {serviceRequests.length ? serviceRequests.map((request) => {
                const listing = state.listings.find((item) => item.id === request.listingId);
                const seller = state.sellers.find((s) => s.id === request.sellerId);
                const msgs = (state.serviceMessages ?? []).filter((m) => m.requestId === request.id);
                const lastMsg = msgs[msgs.length - 1];
                return (
                  <button
                    type="button"
                    key={request.id}
                    className={`messages-list-row${active?.id === request.id ? " active" : ""}`}
                    onClick={() => setActiveRequestId(request.id)}
                  >
                    <div className="customer-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                      {(seller?.name ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong>{seller?.name ?? "Creator"}</strong>
                      <small>{listing?.title ?? "Onbekende tool"}</small>
                      <p>{lastMsg?.text ?? request.message}</p>
                    </div>
                    {msgs.length > 0 ? <span className="messages-count-pill">{msgs.length}</span> : null}
                  </button>
                );
              }) : <p style={{ padding: 16, color: "var(--green-500)", fontSize: 13 }}>Geen aanvragen.</p>}
            </aside>
            <div className="messages-main">
              {active ? (
                <>
                  <ConversationHeader request={active} />
                  <ServiceConversation request={active} perspective="buyer" />
                </>
              ) : (
                <div className="messages-empty">
                  <MessageSquare size={28} />
                  <p>Selecteer een gesprek om berichten te lezen of een afspraak voor te stellen.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "calendar" ? (
        <section className="section-card" style={{ marginTop: 0 }}>
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow"><Calendar size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Mijn afspraken</span>
              <h2>Sessies met creators</h2>
            </div>
          </div>
          <ServiceCalendar perspective="buyer" requestIds={serviceRequests.map((r) => r.id)} />
        </section>
      ) : null}
    </>
  );
}

function ConversationHeader({ request }: { request: ServiceRequest }) {
  const { state } = useMarketplace();
  const listing = state.listings.find((l) => l.id === request.listingId);
  const seller = state.sellers.find((s) => s.id === request.sellerId);
  return (
    <div className="conversation-header">
      <div className="customer-avatar" style={{ width: 38, height: 38 }}>
        {(seller?.name ?? "?").slice(0, 1).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong>{seller?.name ?? "Creator"}</strong>
        <small>{listing?.title ?? "Onbekende tool"} · {request.scope}</small>
      </div>
      <span className={`status-badge ${request.status}`}>
        {request.status === "new" && "Nieuw"}
        {request.status === "in_progress" && "In behandeling"}
        {request.status === "waiting_for_buyer" && "Wacht op jou"}
        {request.status === "completed" && "Afgerond"}
      </span>
    </div>
  );
}
