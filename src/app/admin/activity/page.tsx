"use client";

import { useMemo, useState } from "react";
import { Activity, Download } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("nl-NL", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  } catch {
    return iso;
  }
}

function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map((cell) => {
    const s = String(cell ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(",")).join("\n");
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminActivityPage() {
  const { state } = useMarketplace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const entities = useMemo(() => {
    const set = new Set<string>();
    state.moderationLogs.forEach((l) => set.add(l.entity));
    return ["all", ...Array.from(set)];
  }, [state.moderationLogs]);

  const filtered = useMemo(() => {
    let items = [...state.moderationLogs];
    if (filter !== "all") items = items.filter((l) => l.entity === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((l) =>
        l.action.toLowerCase().includes(q) ||
        l.entity.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [state.moderationLogs, filter, query]);

  function exportCsv() {
    const header = ["Tijdstip", "Actie", "Entity", "Entity-ID", "Actor"];
    const rows = filtered.map((log) => {
      const actor = state.users.find((u) => u.id === log.actorId);
      return [
        new Date(log.createdAt).toISOString(),
        log.action,
        log.entity,
        log.entityId,
        actor?.name ?? log.actorId
      ];
    });
    const csv = toCsv([header, ...rows]);
    downloadFile(`hazenco-audit-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  return (
    <section className="section-card" style={{ marginTop: 0 }}>
      <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
        <div>
          <span className="eyebrow"><Activity size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Activiteitenlog</span>
          <h2>Recente beheeracties ({filtered.length})</h2>
        </div>
        <button type="button" className="button secondary" onClick={exportCsv}>
          <Download size={14} /> Exporteer CSV
        </button>
      </div>

      <div className="bookings-toolbar">
        <input type="search" placeholder="Zoek actie, entity of ID..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="bookings-status-filter">
          {entities.map((e) => (
            <button key={e} type="button" className={filter === e ? "active" : ""} onClick={() => setFilter(e)}>
              {e === "all" ? "Alle" : e}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? <p style={{ color: "var(--green-500)" }}>Nog geen activiteit.</p> : filtered.map((log) => {
        const actor = state.users.find((u) => u.id === log.actorId);
        return (
          <div className="activity-row" key={log.id}>
            <span className="activity-dot" />
            <div>
              <strong>{log.action}</strong>
              <span className="small">{log.entity} · {log.entityId.slice(-10)}{actor ? ` · door ${actor.name}` : ""}</span>
            </div>
            <span className="small" style={{ color: "var(--green-500)" }}>{formatDateTime(log.createdAt)}</span>
          </div>
        );
      })}
    </section>
  );
}
