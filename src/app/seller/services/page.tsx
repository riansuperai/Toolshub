"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, BookOpen, Calendar, Inbox, MessageSquare, Wrench } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { ServiceConversation } from "@/components/service-conversation";
import { ServiceCalendar } from "@/components/service-calendar";
import { AppointmentActions } from "@/components/appointment-actions";
import { getMessageReadState, markRequestRead, unreadCountFor } from "@/lib/message-read-state";
import type { Appointment, ServiceRequest } from "@/lib/types";

type Tab = "requests" | "messages" | "calendar" | "bookings";
type SortKey = "date" | "customer" | "service" | "status";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function SellerServicesPage() {
  const { activeUser, state, updateServiceStatus } = useMarketplace();
  const data = useSellerData();
  const [tab, setTab] = useState<Tab>("requests");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [readMap, setReadMap] = useState<Record<string, string>>({});

  useEffect(() => setReadMap(getMessageReadState()), [state.serviceMessages]);

  function openConversation(id: string) {
    setActiveRequestId(id);
    markRequestRead(id);
    setReadMap(getMessageReadState());
  }

  const myRequests = data.myServices ?? [];
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
        (a) => myRequests.some((r) => r.id === a.requestId) && a.status === "proposed" && a.proposedBy === "buyer"
      ).length,
    [state.appointments, myRequests]
  );

  if (activeUser.role !== "seller" || !data.seller) return null;

  const active = activeRequestId
    ? myRequests.find((r) => r.id === activeRequestId)
    : myRequests[0];

  return (
    <>
      <div className="services-tabs">
        <button
          type="button"
          className={tab === "requests" ? "active" : ""}
          onClick={() => setTab("requests")}
        >
          <Inbox size={14} /> Aanvragen
          {myRequests.length > 0 ? <span className="services-tab-badge">{myRequests.length}</span> : null}
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
          <Calendar size={14} /> Agenda
          {pendingAppointments > 0 ? <span className="services-tab-badge accent">{pendingAppointments}</span> : null}
        </button>
        <button
          type="button"
          className={tab === "bookings" ? "active" : ""}
          onClick={() => setTab("bookings")}
        >
          <BookOpen size={14} /> Bookings
        </button>
      </div>

      {tab === "requests" ? (
        <section className="section-card" style={{ marginTop: 0 }}>
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow">Serviceaanvragen</span>
              <h2>Setup en support voor kopers ({myRequests.length})</h2>
            </div>
          </div>
          {myRequests.length ? myRequests.map((request) => {
            const listing = state.listings.find((item) => item.id === request.listingId);
            const buyer = state.users.find((u) => u.id === request.buyerId);
            const msgs = messageCounts.get(request.id) ?? 0;
            return (
              <div className="support-row" key={request.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", gap: 12, alignItems: "center" }}>
                <div>
                  <strong>{listing?.title ?? "Onbekende tool"}</strong>
                  <p>{request.message}</p>
                  <p style={{ color: "var(--green-500)", fontSize: 12, marginTop: 4 }}>
                    <Wrench size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
                    {request.scope} · {buyer?.name ?? "Anonieme koper"} · {formatDate(request.createdAt)}
                    {msgs > 0 ? <> · <MessageSquare size={11} style={{ verticalAlign: -1 }} /> {msgs}</> : null}
                  </p>
                </div>
                <span className={`status-badge ${request.status}`}>
                  {request.status === "new" && "Nieuw"}
                  {request.status === "in_progress" && "In behandeling"}
                  {request.status === "waiting_for_buyer" && "Wacht op koper"}
                  {request.status === "completed" && "Afgerond"}
                </span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    className="button secondary"
                    type="button"
                    style={{ minHeight: 32, padding: "0 10px", fontSize: 12 }}
                    onClick={() => { setActiveRequestId(request.id); setTab("messages"); }}
                  >
                    <MessageSquare size={13} /> Berichten
                  </button>
                  {request.status === "new" ? (
                    <button className="button secondary" type="button" style={{ minHeight: 32, padding: "0 10px", fontSize: 12 }} onClick={() => updateServiceStatus(request.id, "in_progress")}>Start</button>
                  ) : null}
                  {request.status !== "completed" ? (
                    <button className="button" type="button" style={{ minHeight: 32, padding: "0 10px", fontSize: 12 }} onClick={() => updateServiceStatus(request.id, "completed")}>Klaar</button>
                  ) : null}
                </div>
              </div>
            );
          }) : <p>Geen service-aanvragen.</p>}
        </section>
      ) : null}

      {tab === "messages" ? (
        <section className="section-card" style={{ marginTop: 0, padding: 0, overflow: "hidden" }}>
          <div className="messages-split">
            <aside className="messages-list">
              <div className="messages-list-head">
                <strong>Gesprekken</strong>
                <small>{myRequests.length}</small>
              </div>
              {myRequests.length ? myRequests.map((request) => {
                const listing = state.listings.find((item) => item.id === request.listingId);
                const buyer = state.users.find((u) => u.id === request.buyerId);
                const msgs = (state.serviceMessages ?? []).filter((m) => m.requestId === request.id);
                const lastMsg = msgs[msgs.length - 1];
                const unread = unreadCountFor(request.id, state.serviceMessages ?? [], "seller", readMap);
                return (
                  <button
                    type="button"
                    key={request.id}
                    className={`messages-list-row${active?.id === request.id ? " active" : ""}${unread > 0 ? " has-unread" : ""}`}
                    onClick={() => openConversation(request.id)}
                  >
                    <div className="customer-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                      {(buyer?.name ?? "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong>{buyer?.name ?? "Anoniem"}</strong>
                      <small>{listing?.title ?? "Onbekende tool"}</small>
                      <p>{lastMsg?.text ?? request.message}</p>
                    </div>
                    {unread > 0 ? <span className="messages-count-pill unread">{unread}</span>
                     : msgs.length > 0 ? <span className="messages-count-pill">{msgs.length}</span> : null}
                  </button>
                );
              }) : <p style={{ padding: 16, color: "var(--green-500)", fontSize: 13 }}>Geen aanvragen.</p>}
            </aside>
            <div className="messages-main">
              {active ? (
                <>
                  <ConversationHeader request={active} />
                  <ServiceConversation request={active} perspective="seller" />
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
              <span className="eyebrow"><Calendar size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Agenda</span>
              <h2>Afspraken & support-sessies</h2>
            </div>
          </div>
          <ServiceCalendar perspective="seller" requestIds={myRequests.map((r) => r.id)} />
        </section>
      ) : null}

      {tab === "bookings" ? (
        <section className="section-card" style={{ marginTop: 0 }}>
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
            <div>
              <span className="eyebrow"><BookOpen size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Bookings</span>
              <h2>Alle afspraken & sessies</h2>
            </div>
          </div>
          <BookingsTable requestIds={myRequests.map((r) => r.id)} />
        </section>
      ) : null}
    </>
  );
}

function BookingsTable({ requestIds }: { requestIds: string[] }) {
  const { state } = useMarketplace();
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "date", dir: "desc" });
  const [statusFilter, setStatusFilter] = useState<Appointment["status"] | "all">("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const items = (state.appointments ?? [])
      .filter((a) => requestIds.includes(a.requestId))
      .map((a) => {
        const req = state.serviceRequests.find((r) => r.id === a.requestId);
        const listing = state.listings.find((l) => l.id === req?.listingId);
        const buyer = state.users.find((u) => u.id === req?.buyerId);
        return { a, req, listing, buyer };
      });

    const filtered = items.filter(({ a, listing, buyer }) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !buyer?.name.toLowerCase().includes(q) &&
          !listing?.title.toLowerCase().includes(q) &&
          !(a.note ?? "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });

    filtered.sort((x, y) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "date") return (+new Date(x.a.startsAt) - +new Date(y.a.startsAt)) * dir;
      if (sort.key === "customer") return (x.buyer?.name ?? "").localeCompare(y.buyer?.name ?? "") * dir;
      if (sort.key === "service") return (x.listing?.title ?? "").localeCompare(y.listing?.title ?? "") * dir;
      return x.a.status.localeCompare(y.a.status) * dir;
    });

    return filtered;
  }, [state.appointments, state.serviceRequests, state.listings, state.users, requestIds, sort, statusFilter, query]);

  function toggleSort(key: SortKey) {
    setSort((prev) => prev.key === key
      ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
      : { key, dir: "asc" }
    );
  }

  const statuses: Array<Appointment["status"] | "all"> = ["all", "proposed", "approved", "completed", "rejected", "cancelled"];

  return (
    <>
      <div className="bookings-toolbar">
        <input
          type="search"
          placeholder="Zoek koper, tool of onderwerp..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="bookings-status-filter">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              className={statusFilter === s ? "active" : ""}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" && "Alle"}
              {s === "proposed" && "Voorgesteld"}
              {s === "approved" && "Goedgekeurd"}
              {s === "completed" && "Afgerond"}
              {s === "rejected" && "Afgewezen"}
              {s === "cancelled" && "Geannuleerd"}
            </button>
          ))}
        </div>
      </div>

      <div className="bookings-table-wrap">
        <table className="bookings-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort("date")} className="sortable">Datum & tijd <ArrowUpDown size={11} /></th>
              <th>Duur</th>
              <th onClick={() => toggleSort("customer")} className="sortable">Koper <ArrowUpDown size={11} /></th>
              <th onClick={() => toggleSort("service")} className="sortable">Tool <ArrowUpDown size={11} /></th>
              <th>Onderwerp</th>
              <th onClick={() => toggleSort("status")} className="sortable">Status <ArrowUpDown size={11} /></th>
              <th style={{ textAlign: "right" }}>Acties</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--green-500)", padding: 24 }}>Geen bookings gevonden.</td></tr>
            ) : rows.map(({ a, req, listing, buyer }) => (
              <tr key={a.id}>
                <td>
                  <strong>{new Date(a.startsAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}</strong>
                  <small>{new Date(a.startsAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</small>
                </td>
                <td>{a.durationMinutes}m</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="customer-avatar" style={{ width: 26, height: 26, fontSize: 11 }}>
                      {(buyer?.name ?? "?").slice(0, 1).toUpperCase()}
                    </span>
                    <strong>{buyer?.name ?? "—"}</strong>
                  </div>
                </td>
                <td>{listing?.title ?? "—"}</td>
                <td className="bookings-note">{a.note ?? <span style={{ opacity: 0.4 }}>—</span>}</td>
                <td>
                  <span className={`appointment-status ${a.status}`}>
                    {a.status === "proposed" && "Voorgesteld"}
                    {a.status === "approved" && "Goedgekeurd"}
                    {a.status === "completed" && "Afgerond"}
                    {a.status === "rejected" && "Afgewezen"}
                    {a.status === "cancelled" && "Geannuleerd"}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  {req ? <AppointmentActions appointment={a} request={req} perspective="seller" compact /> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ConversationHeader({ request }: { request: ServiceRequest }) {
  const { state } = useMarketplace();
  const listing = state.listings.find((l) => l.id === request.listingId);
  const buyer = state.users.find((u) => u.id === request.buyerId);
  return (
    <div className="conversation-header">
      <div className="customer-avatar" style={{ width: 38, height: 38 }}>
        {(buyer?.name ?? "?").slice(0, 1).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong>{buyer?.name ?? "Anonieme koper"}</strong>
        <small>{listing?.title ?? "Onbekende tool"} · {request.scope}</small>
      </div>
      <span className={`status-badge ${request.status}`}>
        {request.status === "new" && "Nieuw"}
        {request.status === "in_progress" && "In behandeling"}
        {request.status === "waiting_for_buyer" && "Wacht op koper"}
        {request.status === "completed" && "Afgerond"}
      </span>
    </div>
  );
}
