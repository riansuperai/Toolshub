"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Calendar, Clock, MessageSquare, User } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { AppointmentActions } from "@/components/appointment-actions";

type Props = {
  perspective: "buyer" | "seller";
  limit?: number;
};

function formatDayShort(d: Date) {
  return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

export function UpcomingAppointmentsWidget({ perspective, limit = 4 }: Props) {
  const { state, activeUser } = useMarketplace();

  const items = useMemo(() => {
    const all = (state.appointments ?? [])
      .filter((a) => a.status === "proposed" || a.status === "approved")
      .filter((a) => new Date(a.startsAt).getTime() + a.durationMinutes * 60_000 >= Date.now());

    // Filter by perspective: seller sees only their own requests, buyer sees their own
    const relevant = all.filter((a) => {
      const req = state.serviceRequests.find((r) => r.id === a.requestId);
      if (!req) return false;
      if (perspective === "seller") return req.sellerId === activeUser.sellerId;
      return req.buyerId === activeUser.id;
    });

    relevant.sort((x, y) => +new Date(x.startsAt) - +new Date(y.startsAt));
    return relevant.slice(0, limit);
  }, [state.appointments, state.serviceRequests, perspective, activeUser, limit]);

  const counts = useMemo(() => {
    const all = (state.appointments ?? []).filter((a) => {
      const req = state.serviceRequests.find((r) => r.id === a.requestId);
      if (!req) return false;
      return perspective === "seller" ? req.sellerId === activeUser.sellerId : req.buyerId === activeUser.id;
    });
    return {
      proposed: all.filter((a) => a.status === "proposed").length,
      approved: all.filter((a) => a.status === "approved").length
    };
  }, [state.appointments, state.serviceRequests, perspective, activeUser]);

  const settingsHref = perspective === "seller" ? "/seller/services" : "/account/support";

  return (
    <div className="widget upcoming-appts-widget" style={{ marginTop: 18, animationDelay: "0.66s" }}>
      <div className="widget-head">
        <div>
          <span className="eyebrow"><Calendar size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Agenda</span>
          <h3>Komende afspraken
            {counts.proposed > 0 ? (
              <span className="services-tab-badge accent" style={{ marginLeft: 8 }}>{counts.proposed} wachten op je</span>
            ) : null}
          </h3>
        </div>
        <Link className="text-action" href={settingsHref} style={{ fontSize: 12 }}>
          Alle ({counts.proposed + counts.approved})
        </Link>
      </div>

      {items.length === 0 ? (
        <p style={{ color: "var(--green-500)", fontSize: 13, margin: "8px 0 0" }}>
          Geen komende afspraken. Stel er een voor vanuit een gesprek.
        </p>
      ) : (
        <div className="upcoming-appts-list">
          {items.map((a) => {
            const req = state.serviceRequests.find((r) => r.id === a.requestId);
            const listing = req ? state.listings.find((l) => l.id === req.listingId) : null;
            const other = req
              ? perspective === "seller"
                ? state.users.find((u) => u.id === req.buyerId)
                : state.sellers.find((s) => s.id === req.sellerId)
              : null;
            const startDate = new Date(a.startsAt);
            return (
              <div className="upcoming-appt-row" key={a.id}>
                <div className="upcoming-appt-date">
                  <strong>{formatDayShort(startDate)}</strong>
                  <small><Clock size={11} /> {formatTime(startDate)} · {a.durationMinutes}m</small>
                </div>
                <div className="upcoming-appt-body">
                  <strong>{a.note ?? listing?.title ?? "Support afspraak"}</strong>
                  <small><User size={11} /> {other?.name ?? "Onbekend"}{listing ? ` · ${listing.title}` : ""}</small>
                </div>
                <span className={`appointment-status ${a.status}`}>
                  {a.status === "proposed" && "Voorgesteld"}
                  {a.status === "approved" && "Goedgekeurd"}
                </span>
                {req ? (
                  <AppointmentActions appointment={a} request={req} perspective={perspective} compact />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
