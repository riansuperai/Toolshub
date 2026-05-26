"use client";

import { useMemo, useState } from "react";
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, MessageSquare, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { getAvailableSlots, isWorkingDay } from "@/lib/appointment-slots";
import type { Appointment, ServiceRequest } from "@/lib/types";

type Props = {
  request: ServiceRequest;
  perspective: "buyer" | "seller";
  onClose: () => void;
  /** When supplied, the modal acts as 'reschedule' — old one is cancelled, new proposal created. */
  existing?: Appointment;
};

const dayLabels = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const monthLabels = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"
];

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

function formatLongDate(d: Date) {
  return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

type Step = 0 | 1 | 2;

export function BookingStepperModal({ request, perspective, onClose, existing }: Props) {
  const { state, proposeAppointment, updateAppointmentStatus } = useMarketplace();
  const seller = state.sellers.find((s) => s.id === request.sellerId);
  const listing = state.listings.find((l) => l.id === request.listingId);
  const isReschedule = !!existing;

  const initial = existing ? new Date(existing.startsAt) : null;
  const [step, setStep] = useState<Step>(0);
  const [cursor, setCursor] = useState(() => {
    const base = initial ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(initial ? new Date(initial.getFullYear(), initial.getMonth(), initial.getDate()) : null);
  const [duration, setDuration] = useState(existing?.durationMinutes ?? 30);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(initial);
  const [note, setNote] = useState(existing?.note ?? "");

  const requestAppointments = useMemo(
    () => (state.appointments ?? []).filter((a) => a.requestId === request.id),
    [state.appointments, request.id]
  );

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const shift = (first.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - shift);
    const days: { date: Date; inMonth: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({ date: d, inMonth: d.getMonth() === month });
    }
    return days;
  }, [cursor]);

  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return getAvailableSlots(seller, selectedDate, duration, requestAppointments);
  }, [seller, selectedDate, duration, requestAppointments]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function confirm() {
    if (!selectedSlot) return;
    if (existing) {
      updateAppointmentStatus(existing.id, "cancelled");
    }
    proposeAppointment({
      requestId: request.id,
      startsAt: selectedSlot.toISOString(),
      durationMinutes: duration,
      note: note.trim() || undefined
    });
    onClose();
  }

  const stepDoneDate = !!selectedDate && !!selectedSlot;
  const stepDoneConfirm = false;

  return (
    <div className="booking-stepper-backdrop" onClick={onClose}>
      <div className="booking-stepper-modal" onClick={(e) => e.stopPropagation()}>
        {/* Left stepper sidebar */}
        <aside className="booking-stepper-sidebar">
          <div className="booking-stepper-context">
            <span className="eyebrow"><Calendar size={11} /> {isReschedule ? "Afspraak verzetten" : "Afspraak voorstellen"}</span>
            <strong>{listing?.title ?? "Support sessie"}</strong>
            <small>{seller?.name ?? "Creator"}</small>
          </div>

          <button
            type="button"
            className={`booking-step ${step === 0 ? "current" : ""} ${stepDoneDate ? "done" : ""}`}
            onClick={() => setStep(0)}
          >
            <span className="booking-step-icon">
              {stepDoneDate ? <Check size={13} /> : <Calendar size={13} />}
            </span>
            <span className="booking-step-body">
              <strong>Datum & tijd</strong>
              {selectedSlot ? (
                <small>{formatLongDate(selectedSlot)} · {formatTime(selectedSlot)}</small>
              ) : (
                <small>Kies een moment</small>
              )}
            </span>
          </button>

          <button
            type="button"
            className={`booking-step ${step === 1 ? "current" : ""} ${stepDoneConfirm ? "done" : ""}`}
            disabled={!stepDoneDate}
            onClick={() => stepDoneDate && setStep(1)}
          >
            <span className="booking-step-icon">
              <MessageSquare size={13} />
            </span>
            <span className="booking-step-body">
              <strong>Onderwerp</strong>
              <small>{note ? note.slice(0, 28) : "Optioneel"}</small>
            </span>
          </button>

          <button
            type="button"
            className={`booking-step ${step === 2 ? "current" : ""}`}
            disabled={!stepDoneDate}
            onClick={() => stepDoneDate && setStep(2)}
          >
            <span className="booking-step-icon">
              <Check size={13} />
            </span>
            <span className="booking-step-body">
              <strong>Bevestigen</strong>
              <small>Voorstellen aan {perspective === "buyer" ? "creator" : "koper"}</small>
            </span>
          </button>
        </aside>

        {/* Right content panel */}
        <div className="booking-stepper-panel">
          <div className="booking-stepper-head">
            <h3>
              {step === 0 ? "Datum & tijd" : step === 1 ? "Onderwerp" : "Bevestigen"}
            </h3>
            <button type="button" className="composer-icon-btn" onClick={onClose} aria-label="Sluiten">
              <X size={14} />
            </button>
          </div>

          <div className="booking-stepper-body">
            {step === 0 ? (
              <div className="booking-step-date">
                <div className="booking-duration-row">
                  <Clock size={14} />
                  <span>Duur:</span>
                  {[15, 30, 45, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`booking-duration-pill ${duration === d ? "active" : ""}`}
                      onClick={() => { setDuration(d); setSelectedSlot(null); }}
                    >
                      {d} min
                    </button>
                  ))}
                </div>

                <div className="booking-date-grid">
                  <div className="service-calendar-grid" style={{ flex: 1 }}>
                    <div className="service-calendar-head">
                      <button type="button" className="composer-icon-btn" onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}>
                        <ChevronLeft size={16} />
                      </button>
                      <strong>{monthLabels[cursor.getMonth()]} {cursor.getFullYear()}</strong>
                      <button type="button" className="composer-icon-btn" onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="service-calendar-weekdays">
                      {dayLabels.map((d) => <span key={d}>{d}</span>)}
                    </div>
                    <div className="service-calendar-cells">
                      {cells.map(({ date, inMonth }) => {
                        const working = isWorkingDay(seller, date);
                        const past = date < today;
                        const disabled = past || !working || !inMonth;
                        const isSelected = selectedDate ? sameDay(selectedDate, date) : false;
                        const isToday = sameDay(date, new Date());
                        return (
                          <button
                            key={dayKey(date)}
                            type="button"
                            disabled={disabled}
                            className={`calendar-cell booking-date-cell${inMonth ? " in-month" : " out-month"}${disabled ? " disabled" : " available"}${isToday ? " today" : ""}${isSelected ? " selected" : ""}`}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedSlot(null);
                            }}
                          >
                            <span className="calendar-day-num">{date.getDate()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="booking-slots">
                    <strong className="booking-slots-head">
                      {selectedDate ? formatLongDate(selectedDate) : "Selecteer een dag"}
                    </strong>
                    {selectedDate ? (
                      slots.length > 0 ? (
                        <div className="booking-slots-grid">
                          {slots.map((slot) => {
                            const isSel = selectedSlot && slot.getTime() === selectedSlot.getTime();
                            return (
                              <button
                                key={slot.toISOString()}
                                type="button"
                                className={`booking-slot${isSel ? " selected" : ""}`}
                                onClick={() => setSelectedSlot(slot)}
                              >
                                {formatTime(slot)}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="booking-slots-empty">Geen vrije slots op deze dag. Kies een andere datum of duur.</p>
                      )
                    ) : (
                      <p className="booking-slots-empty">Kies een datum in de kalender om beschikbare tijden te zien.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="booking-step-note">
                <label>
                  Onderwerp (optioneel)
                  <textarea
                    rows={5}
                    placeholder="Bijv. 'Hulp bij configuratie van de Slack integratie'"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </label>
                <small className="booking-step-hint">
                  Geef kort aan waar je het over wilt hebben. De {perspective === "buyer" ? "creator" : "koper"} ziet dit direct in de bevestiging.
                </small>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="booking-step-confirm">
                <div className="booking-summary-row">
                  <Calendar size={16} />
                  <div>
                    <strong>{selectedSlot ? formatLongDate(selectedSlot) : "—"}</strong>
                    <small>{selectedSlot ? `${formatTime(selectedSlot)} · ${duration} min` : ""}</small>
                  </div>
                </div>
                <div className="booking-summary-row">
                  <MessageSquare size={16} />
                  <div>
                    <strong>Onderwerp</strong>
                    <small>{note || "Geen onderwerp opgegeven"}</small>
                  </div>
                </div>
                <p className="booking-confirm-hint">
                  De {perspective === "buyer" ? "creator" : "koper"} krijgt dit voorstel direct in de chat. Zodra de andere kant het goedkeurt, verschijnt de afspraak in de agenda en kun je de videoknop gebruiken.
                </p>
              </div>
            ) : null}
          </div>

          <div className="booking-stepper-foot">
            {step > 0 ? (
              <button type="button" className="button secondary" onClick={() => setStep((s) => (s - 1) as Step)}>
                <ChevronLeft size={14} /> Terug
              </button>
            ) : <span />}
            {step < 2 ? (
              <button
                type="button"
                className="button"
                disabled={step === 0 ? !stepDoneDate : false}
                onClick={() => setStep((s) => (s + 1) as Step)}
              >
                Volgende <ChevronRight size={14} />
              </button>
            ) : (
              <button type="button" className="button" onClick={confirm} disabled={!selectedSlot}>
                <Check size={14} /> Versturen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
