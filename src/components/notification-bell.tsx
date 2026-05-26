"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Calendar,
  CheckCheck,
  MessageSquare,
  Package,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
  XCircle
} from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { deriveNotifications, getReadIds, setReadIds, type DerivedNotification, type NotificationKind } from "@/lib/notifications";

const ICON_MAP: Record<NotificationKind, React.ComponentType<{ size?: number }>> = {
  order_paid: ShoppingBag,
  new_sale: Sparkles,
  new_message: MessageSquare,
  appointment_proposed: Calendar,
  appointment_approved: Calendar,
  listing_approved: Package,
  listing_rejected: XCircle,
  review_approved: Star,
  refund_issued: RotateCcw,
  support_request: MessageSquare
};

function formatAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "zojuist";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} u`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} d`;
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export function NotificationBell() {
  const { state, activeUser } = useMarketplace();
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => setRead(getReadIds()), []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const notifications: DerivedNotification[] = useMemo(
    () => deriveNotifications(state, activeUser).slice(0, 20),
    [state, activeUser]
  );

  const unread = notifications.filter((n) => !read.has(n.id));
  const unreadCount = unread.length;

  function markAsRead(id: string) {
    const next = new Set(read);
    next.add(id);
    setRead(next);
    setReadIds(next);
  }

  function markAllRead() {
    const next = new Set(read);
    notifications.forEach((n) => next.add(n.id));
    setRead(next);
    setReadIds(next);
  }

  if (activeUser.role === "visitor") return null;

  return (
    <div className="notification-bell-wrap" ref={ref}>
      <button
        type="button"
        className="notification-bell-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificaties${unreadCount > 0 ? ` (${unreadCount} ongelezen)` : ""}`}
      >
        <Bell size={16} />
        {unreadCount > 0 ? (
          <span className="notification-bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        ) : null}
      </button>

      {open ? (
        <div className="notification-panel" role="dialog">
          <div className="notification-panel-head">
            <strong>Notificaties</strong>
            {unreadCount > 0 ? (
              <button type="button" className="notification-mark-all" onClick={markAllRead}>
                <CheckCheck size={12} /> Alles gelezen
              </button>
            ) : null}
          </div>

          <div className="notification-panel-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={28} />
                <strong>Alles is rustig</strong>
                <small>Je hebt geen nieuwe notificaties.</small>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = ICON_MAP[n.kind] ?? Bell;
                const isUnread = !read.has(n.id);
                const content = (
                  <>
                    <span className={`notification-row-icon kind-${n.kind}`}>
                      <Icon size={15} />
                    </span>
                    <div className="notification-row-body">
                      <strong>{n.title}</strong>
                      <small>{n.body}</small>
                      <small className="notification-row-time">{formatAgo(n.createdAt)}</small>
                    </div>
                    {isUnread ? <span className="notification-row-dot" aria-label="Ongelezen" /> : null}
                  </>
                );
                return n.link ? (
                  <Link
                    key={n.id}
                    href={n.link}
                    className={`notification-row${isUnread ? " unread" : ""}`}
                    onClick={() => { markAsRead(n.id); setOpen(false); }}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={n.id}
                    type="button"
                    className={`notification-row${isUnread ? " unread" : ""}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
