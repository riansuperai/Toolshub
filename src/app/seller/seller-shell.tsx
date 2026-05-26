"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  PackagePlus,
  Search,
  Settings,
  Store,
  User,
  Wallet,
  Webhook,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { RoleSwitcher } from "@/components/role-switcher";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";

const STORAGE_KEY = "hazenco-seller-sidebar-collapsed";

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
  "/seller": { title: "Dashboard", subtitle: "Overzicht van je verkoopprestaties" },
  "/seller/listings": { title: "Mijn listings", subtitle: "Beheer al je gepubliceerde tools" },
  "/seller/orders": { title: "Bestellingen", subtitle: "Alle verkopen en omzet" },
  "/seller/services": { title: "Service", subtitle: "Setup en support aanvragen" },
  "/seller/bundles": { title: "Bundles", subtitle: "Combineer tools tot een pakket met korting" },
  "/seller/financien": { title: "Financiën", subtitle: "Uitbetalingen, omzet en opnames" },
  "/seller/new": { title: "Nieuwe listing", subtitle: "Upload een tool voor admin-review" },
  "/seller/broadcasts": { title: "Broadcasts", subtitle: "E-mail je kopers over updates en kortingen" },
  "/seller/import": { title: "Bulk import", subtitle: "Importeer meerdere listings via CSV" },
  "/seller/webhooks": { title: "Webhooks", subtitle: "Verbind je systemen met live events" },
  "/seller/profiel": { title: "Profiel", subtitle: "Beheer je creatorgegevens" }
};

export function SellerShell({ children }: { children: React.ReactNode }) {
  const pathname = (usePathname() ?? "").replace(/\/$/, "") || "/";
  const { activeUser, setActiveUser } = useMarketplace();
  const data = useSellerData();
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

  const navEntries: NavEntry[] = [
    { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
    { href: "/seller/listings", label: "Listings", icon: Store, count: data.myListings.length },
    { href: "/seller/orders", label: "Bestellingen", icon: Package, count: data.paidOrders.length },
    { href: "/seller/services", label: "Service", icon: Wrench, count: data.openServices.length },
    { href: "/seller/bundles", label: "Bundles", icon: Boxes },
    { href: "/seller/financien", label: "Financiën", icon: Wallet },
    { href: "/seller/new", label: "Nieuwe listing", icon: PackagePlus },
    { href: "/seller/import", label: "Bulk import", icon: FileSpreadsheet },
    { href: "/seller/broadcasts", label: "Broadcasts", icon: Megaphone },
    { href: "/seller/webhooks", label: "Webhooks", icon: Webhook },
    { href: "/seller/profiel", label: "Profiel", icon: User }
  ];

  const meta = sectionMeta[pathname] ?? { title: "Creator workspace", subtitle: "" };
  const initial = (data.seller?.name ?? activeUser.name).slice(0, 1).toUpperCase();
  const shellClass = [
    "dashboard-shell",
    collapsed ? "collapsed" : "",
    mobileOpen ? "mobile-open" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={shellClass}>
      {mobileOpen ? <div className="dashboard-sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-hidden /> : null}

      <aside className="dashboard-sidebar">
        <Link href="/seller" className="dashboard-sidebar-brand">
          <span className="brand-mark">H</span>
          <div className="dashboard-sidebar-brand-text">
            <strong>Hazenco</strong>
            <small>Creator workspace</small>
          </div>
        </Link>

        <div className="dashboard-sidebar-section">Beheer</div>
        <nav className="dashboard-sidebar-nav" aria-label="Creator navigatie">
          {navEntries.map((entry) => {
            const Icon = entry.icon;
            const isActive = pathname === entry.href;
            return (
              <Link
                key={entry.href}
                href={entry.href}
                className={isActive ? "active" : ""}
                title={entry.label}
              >
                <Icon size={17} />
                <span className="label">{entry.label}</span>
                {typeof entry.count === "number" ? <span className="nav-count">{entry.count}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-foot">
          <Link href="/" title="Naar marketplace">
            <Home size={16} />
            <span>Naar marketplace</span>
          </Link>
          <Link href="/seller/profiel" title="Instellingen">
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
            <input placeholder="Zoek in jouw listings, orders of services" />
          </div>

          <div className="dashboard-topbar-actions">
            <ThemeToggle />
            <NotificationBell />
            <Link href="/seller/profiel" className="dashboard-topbar-avatar">
              <span className="dashboard-topbar-avatar-mark">{initial}</span>
              <span>{(data.seller?.name ?? activeUser.name).split(" ")[0]}</span>
            </Link>
          </div>
        </header>

        <div className="dashboard-content">{children}</div>
      </div>

      <RoleSwitcher />
    </div>
  );
}
