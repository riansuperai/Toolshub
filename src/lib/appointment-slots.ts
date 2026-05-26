import type { Appointment, SellerAvailability, SellerProfile } from "./types";

export const DEFAULT_AVAILABILITY: SellerAvailability = {
  // Mon–Fri 09:00–17:00
  weekly: {
    1: [{ from: "09:00", to: "17:00" }],
    2: [{ from: "09:00", to: "17:00" }],
    3: [{ from: "09:00", to: "17:00" }],
    4: [{ from: "09:00", to: "17:00" }],
    5: [{ from: "09:00", to: "17:00" }]
  },
  slotMinutes: 30
};

function parseHM(value: string): { h: number; m: number } {
  const [h, m] = value.split(":").map((x) => parseInt(x, 10));
  return { h: h || 0, m: m || 0 };
}

function setHM(date: Date, hm: { h: number; m: number }): Date {
  const d = new Date(date);
  d.setHours(hm.h, hm.m, 0, 0);
  return d;
}

export function getAvailability(seller: SellerProfile | undefined | null): SellerAvailability {
  return seller?.availability ?? DEFAULT_AVAILABILITY;
}

export function isWorkingDay(seller: SellerProfile | undefined | null, date: Date): boolean {
  const av = getAvailability(seller);
  const day = date.getDay();
  const blocks = av.weekly[day];
  return Array.isArray(blocks) && blocks.length > 0;
}

/** Generate all slot start times for a given day based on availability + duration. */
export function generateSlotsForDate(
  seller: SellerProfile | undefined | null,
  date: Date,
  durationMinutes: number
): Date[] {
  const av = getAvailability(seller);
  const day = date.getDay();
  const blocks = av.weekly[day] ?? [];
  if (blocks.length === 0) return [];
  const slotStep = av.slotMinutes;
  const slots: Date[] = [];
  for (const block of blocks) {
    const start = setHM(date, parseHM(block.from));
    const end = setHM(date, parseHM(block.to));
    let cur = start.getTime();
    while (cur + durationMinutes * 60_000 <= end.getTime()) {
      slots.push(new Date(cur));
      cur += slotStep * 60_000;
    }
  }
  return slots;
}

/** Filter out slots that overlap with existing (non-cancelled) appointments. */
export function filterAvailableSlots(
  slots: Date[],
  durationMinutes: number,
  appointments: Appointment[]
): Date[] {
  const active = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "rejected"
  );
  const ranges = active.map((a) => {
    const s = new Date(a.startsAt).getTime();
    return { s, e: s + a.durationMinutes * 60_000 };
  });
  const durMs = durationMinutes * 60_000;
  return slots.filter((slot) => {
    const s = slot.getTime();
    const e = s + durMs;
    return !ranges.some((r) => s < r.e && e > r.s);
  });
}

export function getAvailableSlots(
  seller: SellerProfile | undefined | null,
  date: Date,
  durationMinutes: number,
  appointments: Appointment[]
): Date[] {
  return filterAvailableSlots(generateSlotsForDate(seller, date, durationMinutes), durationMinutes, appointments);
}
