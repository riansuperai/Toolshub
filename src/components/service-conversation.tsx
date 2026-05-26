"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Phone, Send, Video, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { BookingStepperModal } from "@/components/booking-stepper";
import { AppointmentActions } from "@/components/appointment-actions";
import type { ServiceRequest } from "@/lib/types";

type Props = {
  request: ServiceRequest;
  perspective: "buyer" | "seller";
};

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("nl-NL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "zojuist";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} u`;
  const d = Math.floor(h / 24);
  return `${d} d`;
}

export function ServiceConversation({ request, perspective }: Props) {
  const { state, sendServiceMessage } = useMarketplace();
  const [text, setText] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const [showAppt, setShowAppt] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(
    () =>
      (state.serviceMessages ?? [])
        .filter((m) => m.requestId === request.id)
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [state.serviceMessages, request.id]
  );

  const appointments = useMemo(
    () =>
      (state.appointments ?? [])
        .filter((a) => a.requestId === request.id)
        .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)),
    [state.appointments, request.id]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, appointments.length]);

  function send() {
    if (!text.trim()) return;
    sendServiceMessage(request.id, text.trim());
    setText("");
  }

  return (
    <div className="service-conversation">
      <div className="service-conversation-thread" ref={scrollRef}>
        {messages.length === 0 && appointments.length === 0 ? (
          <div className="service-conversation-empty">
            <p>Nog geen berichten of afspraken.</p>
            <small>Start het gesprek of stel een afspraak voor.</small>
          </div>
        ) : null}

        {messages.map((m) => {
          const isMine = m.sender === perspective;
          return (
            <div key={m.id} className={`chat-bubble-row ${isMine ? "mine" : "theirs"}`}>
              <div className={`chat-bubble ${isMine ? "mine" : "theirs"}`}>
                <p>{m.text}</p>
                <small>{formatTimeAgo(m.createdAt)}</small>
              </div>
            </div>
          );
        })}

        {appointments.map((a) => {
          const isActionable = a.status !== "rejected" && a.status !== "cancelled" && a.status !== "completed";
          return (
            <div key={a.id} className={`appointment-card status-${a.status}`}>
              <div className="appointment-card-head">
                <span className="appointment-icon"><Calendar size={16} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{formatDateTime(a.startsAt)}</strong>
                  <small>{a.durationMinutes} min · voorgesteld door {a.proposedBy === "seller" ? "creator" : "koper"}</small>
                </div>
                <span className={`appointment-status ${a.status}`}>
                  {a.status === "proposed" && "Voorgesteld"}
                  {a.status === "approved" && "Goedgekeurd"}
                  {a.status === "rejected" && "Afgewezen"}
                  {a.status === "cancelled" && "Geannuleerd"}
                  {a.status === "completed" && "Afgerond"}
                </span>
              </div>
              {a.note ? <p className="appointment-note">{a.note}</p> : null}
              {isActionable ? (
                <AppointmentActions
                  appointment={a}
                  request={request}
                  perspective={perspective}
                  onVideo={() => setVideoOpen(true)}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {showAppt ? (
        <BookingStepperModal request={request} perspective={perspective} onClose={() => setShowAppt(false)} />
      ) : null}

      <div className="service-conversation-composer">
        <div className="composer-actions">
          <button type="button" className="composer-icon-btn" title="Afspraak voorstellen" onClick={() => setShowAppt((v) => !v)}>
            <Calendar size={16} />
          </button>
          <button type="button" className="composer-icon-btn" title="Videogesprek starten" onClick={() => setVideoOpen(true)}>
            <Video size={16} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Schrijf een bericht..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <button type="button" className="button" onClick={send} disabled={!text.trim()}>
          <Send size={14} /> Verstuur
        </button>
      </div>

      {videoOpen ? <VideoMockModal onClose={() => setVideoOpen(false)} /> : null}
    </div>
  );
}

function VideoMockModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="video-mock-backdrop" onClick={onClose}>
      <div className="video-mock-modal" onClick={(e) => e.stopPropagation()}>
        <div className="video-mock-screen">
          <div className="video-mock-avatar">
            <Phone size={42} />
          </div>
          <p>Videogesprek wordt opgestart...</p>
          <small>Mock-preview · echte verbinding volgt in productie</small>
        </div>
        <div className="video-mock-controls">
          <button type="button" className="video-mock-btn end" onClick={onClose}>
            <X size={18} /> Beëindigen
          </button>
        </div>
      </div>
    </div>
  );
}
