"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Video, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import type { Appointment } from "@/lib/types";

type Props = {
  perspective: "buyer" | "seller";
  /** Filter appointments by request IDs belonging to the perspective owner */
  requestIds: string[];
};

type View = "month" | "week" | "day";

const dayLabels = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const monthLabels = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"
];

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

function startOfWeek(d: Date) {
  const day = (d.getDay() + 6) % 7; // 0 = Mon
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  return start;
}

export function ServiceCalendar({ perspective, requestIds }: Props) {
  const { state, updateAppointmentStatus } = useMarketplace();
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string>(dayKey(new Date()));

  const appointments = useMemo(
    () => (state.appointments ?? []).filter((a) => requestIds.includes(a.requestId)),
    [state.appointments, requestIds]
  );

  const byDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      const key = dayKey(new Date(a.startsAt));
      const arr = map.get(key) ?? [];
      arr.push(a);
      map.set(key, arr);
    }
    for (const arr of map.values()) {
      arr.sort((x, y) => +new Date(x.startsAt) - +new Date(y.startsAt));
    }
    return map;
  }, [appointments]);

  const todayKey = dayKey(new Date());
  const selectedAppointments = selectedDay ? byDay.get(selectedDay) ?? [] : [];

  const upcoming = useMemo(
    () => appointments
      .filter((a) => new Date(a.startsAt) >= new Date() && a.status !== "cancelled" && a.status !== "rejected")
      .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))
      .slice(0, 5),
    [appointments]
  );

  function goToday() {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(dayKey(now));
  }

  function shift(delta: number) {
    if (view === "month") {
      setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
    } else if (view === "week") {
      const base = startOfWeek(new Date(selectedDay));
      base.setDate(base.getDate() + delta * 7);
      setSelectedDay(dayKey(base));
      setCursor(new Date(base.getFullYear(), base.getMonth(), 1));
    } else {
      const d = new Date(selectedDay);
      d.setDate(d.getDate() + delta);
      setSelectedDay(dayKey(d));
      setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }

  const headerLabel = (() => {
    if (view === "month") return `${monthLabels[cursor.getMonth()]} ${cursor.getFullYear()}`;
    if (view === "week") {
      const start = startOfWeek(new Date(selectedDay));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.getDate()} ${monthLabels[start.getMonth()].slice(0, 3)} – ${end.getDate()} ${monthLabels[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
    }
    const d = new Date(selectedDay);
    return d.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  })();

  return (
    <div className="service-calendar">
      <div className="service-calendar-grid">
        <div className="service-calendar-toolbar">
          <button type="button" className="button secondary" onClick={goToday}>Vandaag</button>
          <div className="service-calendar-nav">
            <button type="button" className="composer-icon-btn" onClick={() => shift(-1)} aria-label="Vorige">
              <ChevronLeft size={16} />
            </button>
            <strong>{headerLabel}</strong>
            <button type="button" className="composer-icon-btn" onClick={() => shift(1)} aria-label="Volgende">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="service-calendar-view-toggle">
            {(["month", "week", "day"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                className={view === v ? "active" : ""}
                onClick={() => setView(v)}
              >
                {v === "month" ? "Maand" : v === "week" ? "Week" : "Dag"}
              </button>
            ))}
          </div>
        </div>

        {view === "month" ? <MonthView cursor={cursor} byDay={byDay} selectedDay={selectedDay} todayKey={todayKey} onSelect={setSelectedDay} /> : null}
        {view === "week" ? <WeekView selectedDay={selectedDay} byDay={byDay} onSelectDay={setSelectedDay} /> : null}
        {view === "day" ? <DayView selectedDay={selectedDay} byDay={byDay} /> : null}
      </div>

      <div className="service-calendar-side">
        <div>
          <div className="widget-head" style={{ marginBottom: 10 }}>
            <h3 style={{ fontSize: 14 }}>
              {selectedDay
                ? new Date(selectedDay).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })
                : "Selecteer een dag"}
            </h3>
          </div>
          {selectedAppointments.length ? (
            selectedAppointments.map((a) => (
              <AppointmentRow key={a.id} appointment={a} perspective={perspective} onAction={updateAppointmentStatus} />
            ))
          ) : (
            <p style={{ color: "var(--green-500)", fontSize: 13 }}>Geen afspraken op deze dag.</p>
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <div className="widget-head" style={{ marginBottom: 10 }}>
            <h3 style={{ fontSize: 14 }}>Komende afspraken</h3>
          </div>
          {upcoming.length ? (
            upcoming.map((a) => (
              <AppointmentRow key={a.id} appointment={a} perspective={perspective} onAction={updateAppointmentStatus} compact />
            ))
          ) : (
            <p style={{ color: "var(--green-500)", fontSize: 13 }}>Geen komende afspraken.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthView({
  cursor,
  byDay,
  selectedDay,
  todayKey,
  onSelect
}: {
  cursor: Date;
  byDay: Map<string, Appointment[]>;
  selectedDay: string;
  todayKey: string;
  onSelect: (k: string) => void;
}) {
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

  return (
    <>
      <div className="service-calendar-weekdays">
        {dayLabels.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="service-calendar-cells">
        {cells.map(({ date, inMonth }) => {
          const k = dayKey(date);
          const events = byDay.get(k) ?? [];
          const isToday = k === todayKey;
          const isSelected = k === selectedDay;
          return (
            <button
              key={k}
              type="button"
              className={`calendar-cell${inMonth ? " in-month" : " out-month"}${isToday ? " today" : ""}${isSelected ? " selected" : ""}`}
              onClick={() => onSelect(k)}
            >
              <span className="calendar-day-num">{date.getDate()}</span>
              {events.length ? (
                <span className="calendar-dots">
                  {events.slice(0, 3).map((e) => (
                    <span key={e.id} className={`dot ${e.status}`} />
                  ))}
                  {events.length > 3 ? <small>+{events.length - 3}</small> : null}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </>
  );
}

function WeekView({
  selectedDay,
  byDay,
  onSelectDay
}: {
  selectedDay: string;
  byDay: Map<string, Appointment[]>;
  onSelectDay: (k: string) => void;
}) {
  const start = startOfWeek(new Date(selectedDay));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00–19:00
  const todayKey = dayKey(new Date());

  return (
    <div className="calendar-week-view">
      <div className="calendar-week-head">
        <div className="calendar-week-corner" />
        {days.map((d) => {
          const k = dayKey(d);
          return (
            <button
              key={k}
              type="button"
              className={`calendar-week-day${k === todayKey ? " today" : ""}${k === selectedDay ? " selected" : ""}`}
              onClick={() => onSelectDay(k)}
            >
              <small>{dayLabels[i_of(d)]}</small>
              <strong>{d.getDate()}</strong>
            </button>
          );
        })}
      </div>
      <div className="calendar-week-body">
        <div className="calendar-week-hours">
          {hours.map((h) => (
            <div key={h} className="calendar-week-hour-label">{String(h).padStart(2, "0")}:00</div>
          ))}
        </div>
        {days.map((d) => {
          const k = dayKey(d);
          const events = (byDay.get(k) ?? []).filter((e) => {
            const eh = new Date(e.startsAt).getHours();
            return eh >= 8 && eh <= 19;
          });
          return (
            <div key={k} className="calendar-week-day-col">
              {hours.map((h) => <div key={h} className="calendar-week-hour-cell" />)}
              {events.map((e) => {
                const start = new Date(e.startsAt);
                const top = ((start.getHours() - 8) + start.getMinutes() / 60) * 44;
                const height = (e.durationMinutes / 60) * 44;
                return (
                  <div
                    key={e.id}
                    className={`calendar-week-event status-${e.status}`}
                    style={{ top, height }}
                    title={`${formatTime(e.startsAt)} · ${e.durationMinutes}m · ${e.note ?? "Ondersteuning"}`}
                  >
                    <strong>{formatTime(e.startsAt)}</strong>
                    <small>{e.note ?? "Ondersteuning"}</small>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function i_of(d: Date) {
  // Monday = 0 mapping for our dayLabels
  return (d.getDay() + 6) % 7;
}

function DayView({
  selectedDay,
  byDay
}: {
  selectedDay: string;
  byDay: Map<string, Appointment[]>;
}) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00–19:00
  const events = (byDay.get(selectedDay) ?? []).filter((e) => {
    const eh = new Date(e.startsAt).getHours();
    return eh >= 8 && eh <= 19;
  });
  return (
    <div className="calendar-day-view">
      <div className="calendar-week-hours">
        {hours.map((h) => (
          <div key={h} className="calendar-week-hour-label">{String(h).padStart(2, "0")}:00</div>
        ))}
      </div>
      <div className="calendar-day-col">
        {hours.map((h) => <div key={h} className="calendar-week-hour-cell" />)}
        {events.map((e) => {
          const start = new Date(e.startsAt);
          const top = ((start.getHours() - 8) + start.getMinutes() / 60) * 44;
          const height = (e.durationMinutes / 60) * 44;
          return (
            <div
              key={e.id}
              className={`calendar-week-event day-mode status-${e.status}`}
              style={{ top, height }}
            >
              <strong>{formatTime(e.startsAt)} · {e.durationMinutes}m</strong>
              <small>{e.note ?? "Support sessie"}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AppointmentRow({
  appointment,
  perspective,
  onAction,
  compact
}: {
  appointment: Appointment;
  perspective: "buyer" | "seller";
  onAction: (id: string, status: Appointment["status"]) => void;
  compact?: boolean;
}) {
  const a = appointment;
  const myProposal = a.proposedBy === perspective;
  const canRespond = !myProposal && a.status === "proposed";
  const canCancel = (a.status === "proposed" || a.status === "approved");
  return (
    <div className={`agenda-row status-${a.status}`}>
      <div className="agenda-time">
        <strong>{formatTime(a.startsAt)}</strong>
        <small>{a.durationMinutes}m</small>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong>{a.note ?? "Support afspraak"}</strong>
        <small>
          <span className={`appointment-status ${a.status}`}>
            {a.status === "proposed" && "Voorgesteld"}
            {a.status === "approved" && "Goedgekeurd"}
            {a.status === "rejected" && "Afgewezen"}
            {a.status === "cancelled" && "Geannuleerd"}
            {a.status === "completed" && "Afgerond"}
          </span>
        </small>
      </div>
      {!compact ? (
        <div className="agenda-actions">
          {canRespond ? (
            <>
              <button type="button" className="button" onClick={() => onAction(a.id, "approved")}>Akkoord</button>
              <button type="button" className="button secondary" onClick={() => onAction(a.id, "rejected")}><X size={13} /></button>
            </>
          ) : null}
          {!canRespond && canCancel ? (
            <button type="button" className="button secondary" onClick={() => onAction(a.id, "cancelled")}>Annuleren</button>
          ) : null}
          {a.status === "approved" ? (
            <button type="button" className="button" title="Video starten"><Video size={13} /></button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
