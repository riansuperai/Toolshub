/** Track per-gesprek wanneer een gebruiker voor het laatst de gesprekslijst opende. */

const KEY = "hazenco-msg-read";

export function getMessageReadState(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function markRequestRead(requestId: string) {
  if (typeof window === "undefined") return;
  const cur = getMessageReadState();
  cur[requestId] = new Date().toISOString();
  window.localStorage.setItem(KEY, JSON.stringify(cur));
}

export function unreadCountFor(
  requestId: string,
  messages: { requestId: string; sender: "buyer" | "seller"; createdAt: string }[],
  perspective: "buyer" | "seller",
  readMap: Record<string, string>
): number {
  const lastReadIso = readMap[requestId];
  const lastRead = lastReadIso ? new Date(lastReadIso).getTime() : 0;
  return messages.filter(
    (m) => m.requestId === requestId &&
           m.sender !== perspective &&
           new Date(m.createdAt).getTime() > lastRead
  ).length;
}
