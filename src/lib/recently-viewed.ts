/** Bewaart de laatst bekeken listing-IDs in localStorage. */

const KEY = "hazenco-recently-viewed";
const MAX = 8;

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function trackView(listingId: string) {
  if (typeof window === "undefined") return;
  const list = getRecentlyViewed();
  const next = [listingId, ...list.filter((id) => id !== listingId)].slice(0, MAX);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearRecentlyViewed() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
