"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Package,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Store,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { RoleSwitcher } from "@/components/role-switcher";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";

const STORAGE_KEY = "hazenco-admin-sidebar-collapsed";

type NavEntry = {
  href: string;
  label: string;
  icon: LucideIcon;
  count?: number | null;
};

type SectionMeta = {
  title: string;
  subtitle: string;
};

const sectionMeta: Record<string, SectionMeta> = {
  "/admin": { title: "Dashboard", subtitle: "Marketplace overzicht & live KPI's" },
  "/admin/sellers": { title: "Creators", subtitle: "Aanvragen, top-creators & creator-beheer" },
  "/admin/listings": { title: "Listings", subtitle: "Catalogus, review-wachtrij & uitgelicht beheer" },
  "/admin/orders": { title: "Bestellingen", subtitle: "Alle transacties en bestelling-trechter" },
  "/admin/reviews": { title: "Reviews", subtitle: "Reviewmoderatie en publicatie" },
  "/admin/kopers": { title: "Kopers", subtitle: "Top kopers en koperstatistieken" },
  "/admin/activity": { title: "Activiteitenlog", subtitle: "Recente beheeracties en moderatie-historie" },
  "/admin/templates": { title: "E-mail templates", subtitle: "Pas notificatie- en transactionele mails aan" },
  "/admin/banners": { title: "Site banners", subtitle: "Site-brede aankondigingen beheren" }
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = (usePathname() ?? "").replace(/\/$/, "") || "/";
  const { state, activeUser, setActiveUser } = useMarketplace();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "1") setCollapsed(true);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed, hydrated]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const pendingApps = state.sellerApplications.filter((a) => a.status === "pending").length;
  const pendingListings = state.listings.filter((l) => l.status === "pending").length;
  const pendingReviews = state.reviews.filter((r) => !r.approved).length;

  const navEntries: NavEntry[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/sellers", label: "Creators", icon: Store, count: pendingApps || null },
    { href: "/admin/listings", label: "Listings", icon: Package, count: pendingListings || null },
    { href: "/admin/orders", label: "Bestellingen", icon: Receipt },
    { href: "/admin/reviews", label: "Reviews", icon: Star, count: pendingReviews || null },
    { href: "/admin/kopers", label: "Kopers", icon: Users },
    { href: "/admin/templates", label: "Templates", icon: Mail },
    { href: "/admin/banners", label: "Banners", icon: Megaphone },
    { href: "/admin/activity", label: "Activiteit", icon: Activity }
  ];

  const meta = sectionMeta[pathname] ?? { title: "Admin", subtitle: "" };
  const initial = activeUser.name.slice(0, 1).toUpperCase();
  const shellClass = [
    "dashboard-shell admin-shell",
    collapsed ? "collapsed" : "",
    mobileOpen ? "mobile-open" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={shellClass}>
      {mobileOpen ? <div className="dashboard-sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-hidden /> : null}

      <aside className="dashboard-sidebar">
        <Link href="/admin" className="dashboard-sidebar-brand">
          <span className="brand-mark"><ShieldCheck size={18} /></span>
          <div className="dashboard-sidebar-brand-text">
            <strong>Hazenco</strong>
            <small>Admin console</small>
          </div>
        </Link>

        <div className="dashboard-sidebar-section">Beheer</div>
        <nav className="dashboard-sidebar-nav" aria-label="Admin navigatie">
          {navEntries.map((entry) => {
            const Icon = entry.icon;
            const isActive = pathname === entry.href;
            return (
              <Link key={entry.href} href={entry.href} className={isActive ? "active" : ""} title={entry.label}>
                <Icon size={17} />
                <span className="label">{entry.label}</span>
                {typeof entry.count === "number" && entry.count > 0
                  ? <span className="nav-count accent">{entry.count}</span>
                  : null}
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-foot">
          <Link href="/" title="Naar marketplace">
            <Home size={16} />
            <span>Naar marketplace</span>
          </Link>
          <Link href="/account/profiel" title="Instellingen">
            <Settings size={16} />
            <span>Instellingen</span>
          </Link>
          <button type="button" onClick={() => setActiveUser("user_visitor")} title="Uitloggen">
            <LogOut size={16} />
            <span>Uitloggen</span>
          </button>
        </div>

        <button
          type="button"
          className="dashboard-sidebar-edge-toggle"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth <= 980) {
              setMobileOpen((value) => !value);
            } else {
              setCollapsed((value) => !value);
            }
          }}
          aria-label={collapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-title">
            <strong>{meta.title}</strong>
            <span>{meta.subtitle}</span>
          </div>

          <div className="dashboard-topbar-search">
            <Search size={15} />
            <input placeholder="Zoek creators, listings, bestellingen..." />
          </div>

          <div className="dashboard-topbar-actions">
            <ThemeToggle />
            <NotificationBell />
            <span className="dashboard-topbar-avatar">
              <span className="dashboard-topbar-avatar-mark">{initial}</span>
              <span>{activeUser.name.split(" ")[0]}</span>
            </span>
          </div>
        </header>

        <div className="dashboard-content">{children}</div>
      </div>

      <RoleSwitcher />
    </div>
  );
}
