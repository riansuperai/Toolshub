import type { Appointment } from "./types";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Format a Date as UTC for iCalendar: YYYYMMDDTHHMMSSZ */
function toICalUtc(date: Date): string {
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

/** Format a Date as Google Calendar URL param: YYYYMMDDTHHMMSSZ */
function toGoogleParam(date: Date): string {
  return toICalUtc(date);
}

export type ExportContext = {
  title: string;
  description?: string;
  location?: string;
};

export function buildGoogleCalendarUrl(appointment: Appointment, ctx: ExportContext): string {
  const start = new Date(appointment.startsAt);
  const end = new Date(start.getTime() + appointment.durationMinutes * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ctx.title,
    dates: `${toGoogleParam(start)}/${toGoogleParam(end)}`,
    details: ctx.description ?? "",
    location: ctx.location ?? ""
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl(appointment: Appointment, ctx: ExportContext): string {
  const start = new Date(appointment.startsAt);
  const end = new Date(start.getTime() + appointment.durationMinutes * 60_000);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ctx.title,
    body: ctx.description ?? "",
    location: ctx.location ?? "",
    startdt: start.toISOString(),
    enddt: end.toISOString()
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function buildIcsContent(appointment: Appointment, ctx: ExportContext): string {
  const start = new Date(appointment.startsAt);
  const end = new Date(start.getTime() + appointment.durationMinutes * 60_000);
  const now = new Date();
  const uid = `${appointment.id}@hazenco-marketplace`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hazenco Marketplace//Support afspraak//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICalUtc(now)}`,
    `DTSTART:${toICalUtc(start)}`,
    `DTEND:${toICalUtc(end)}`,
    `SUMMARY:${escapeICalText(ctx.title)}`,
    ctx.description ? `DESCRIPTION:${escapeICalText(ctx.description)}` : "",
    ctx.location ? `LOCATION:${escapeICalText(ctx.location)}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].filter(Boolean);
  return lines.join("\r\n");
}

function escapeICalText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function downloadIcs(appointment: Appointment, ctx: ExportContext) {
  const ics = buildIcsContent(appointment, ctx);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hazenco-afspraak-${appointment.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
