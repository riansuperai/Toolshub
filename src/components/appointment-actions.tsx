"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Check, ChevronDown, Download, ExternalLink, RefreshCw, Video, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { BookingStepperModal } from "@/components/booking-stepper";
import { buildGoogleCalendarUrl, buildOutlookCalendarUrl, downloadIcs } from "@/lib/calendar-export";
import type { Appointment, ServiceRequest } from "@/lib/types";

type Props = {
  appointment: Appointment;
  request: ServiceRequest;
  perspective: "buyer" | "seller";
  onVideo?: () => void;
  compact?: boolean;
};

export function AppointmentActions({ appointment, request, perspective, onVideo, compact }: Props) {
  const { state, updateAppointmentStatus } = useMarketplace();
  const [exportOpen, setExportOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!exportOpen) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setExportOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [exportOpen]);

  const a = appointment;
  const myProposal = a.proposedBy === perspective;
  const canRespond = !myProposal && a.status === "proposed";
  const canCancel = a.status === "proposed" || a.status === "approved";
  const canReschedule = a.status === "proposed" || a.status === "approved";
  const canExport = a.status === "approved";
  const canComplete = a.status === "approved";

  const listing = state.listings.find((l) => l.id === request.listingId);
  const ctx = {
    title: `Hazenco · ${listing?.title ?? "Support sessie"}`,
    description: a.note ?? "Support afspraak via Hazenco Toolshub.",
    location: "Online (videogesprek via Hazenco)"
  };

  const btnSize = compact ? { minHeight: 28, padding: "0 8px", fontSize: 11 } : { minHeight: 30, padding: "0 12px", fontSize: 12 };

  return (
    <div className="appointment-actions" ref={ref}>
      {canRespond ? (
        <>
          <button type="button" className="button" style={btnSize} onClick={() => updateAppointmentStatus(a.id, "approved")}>
            <Check size={13} /> Goedkeuren
          </button>
          <button type="button" className="button secondary" style={btnSize} onClick={() => updateAppointmentStatus(a.id, "rejected")}>
            <X size={13} /> Afwijzen
          </button>
        </>
      ) : null}

      {a.status === "approved" && onVideo ? (
        <button type="button" className="button" style={btnSize} onClick={onVideo}>
          <Video size={13} /> Start video
        </button>
      ) : null}

      {canReschedule ? (
        <button type="button" className="button secondary" style={btnSize} onClick={() => setRescheduleOpen(true)}>
          <RefreshCw size={13} /> Verzetten
        </button>
      ) : null}

      {canCancel ? (
        <button type="button" className="button secondary" style={btnSize} onClick={() => updateAppointmentStatus(a.id, "cancelled")}>
          <X size={13} /> Annuleren
        </button>
      ) : null}

      {canComplete ? (
        <button type="button" className="button secondary" style={btnSize} onClick={() => updateAppointmentStatus(a.id, "completed")}>
          Afronden
        </button>
      ) : null}

      {canExport ? (
        <div className="appointment-export-wrap">
          <button
            type="button"
            className="button secondary"
            style={btnSize}
            onClick={() => setExportOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={exportOpen}
          >
            <Calendar size={13} /> Toevoegen <ChevronDown size={11} />
          </button>
          {exportOpen ? (
            <div className="appointment-export-menu" role="menu">
              <a
                href={buildGoogleCalendarUrl(a, ctx)}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => setExportOpen(false)}
              >
                <ExternalLink size={13} /> Google Agenda
              </a>
              <a
                href={buildOutlookCalendarUrl(a, ctx)}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => setExportOpen(false)}
              >
                <ExternalLink size={13} /> Outlook
              </a>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  downloadIcs(a, ctx);
                  setExportOpen(false);
                }}
              >
                <Download size={13} /> Apple / iCal (.ics)
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {rescheduleOpen ? (
        <BookingStepperModal
          request={request}
          perspective={perspective}
          existing={a}
          onClose={() => setRescheduleOpen(false)}
        />
      ) : null}
    </div>
  );
}
