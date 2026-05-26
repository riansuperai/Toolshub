"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gift,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Package,
  Receipt,
  Repeat,
  Star,
  User
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Shell } from "@/components/shell";
import { useMarketplace } from "@/lib/marketplace-store";
import { useAccountData } from "@/lib/account-data";
import { AccountVisitorView } from "./visitor-view";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  count: number | null;
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = (usePathname() ?? "").replace(/\/$/, "") || "/";
  const { activeUser } = useMarketplace();
  const data = useAccountData();

  if (activeUser.role === "visitor") {
    return <AccountVisitorView />;
  }

  const navItems: NavItem[] = [
    { href: "/account", label: "Overzicht", icon: LayoutDashboard, count: null },
    { href: "/account/bibliotheek", label: "Bibliotheek", icon: Package, count: data.purchasedListings.length },
    { href: "/account/orders", label: "Orders", icon: Receipt, count: data.myOrders.length },
    { href: "/account/subscriptions", label: "Abonnementen", icon: Repeat, count: null },
    { href: "/account/giftcards", label: "Cadeaubonnen", icon: Gift, count: null },
    ...(data.listingsToReview.length > 0
      ? [{ href: "/account/reviews", label: "Reviews", icon: Star, count: data.listingsToReview.length } as NavItem]
      : []),
    { href: "/account/bewaard", label: "Bewaard", icon: Heart, count: data.savedListings.length },
    { href: "/account/support", label: "Support", icon: MessageSquare, count: data.serviceRequests.length },
    { href: "/account/profiel", label: "Profiel", icon: User, count: null }
  ];

  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Mijn account</span>
        <h1>Welkom terug, {activeUser.name.split(" ")[0]}</h1>
        <p className="lead">Beheer je gekochte tools, downloads, reviews en supportaanvragen.</p>

        <div className="account-kpis">
          <div className="account-kpi">
            <div className="account-kpi-icon"><Package size={20} /></div>
            <div>
              <span>Tools in bibliotheek</span>
              <strong>{data.purchasedListings.length}</strong>
            </div>
          </div>
          <div className="account-kpi">
            <div className="account-kpi-icon"><Heart size={20} /></div>
            <div>
              <span>Bewaarde tools</span>
              <strong>{data.savedListings.length}</strong>
            </div>
          </div>
          <div className="account-kpi">
            <div className="account-kpi-icon"><LifeBuoy size={20} /></div>
            <div>
              <span>Open supportzaken</span>
              <strong>{data.openSupport.length}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-layout">
          <aside className="account-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={isActive ? "active" : ""}>
                  <Icon size={16} /> {item.label}
                  {item.count !== null ? <span className="count">{item.count}</span> : null}
                </Link>
              );
            })}
          </aside>

          <div className="stack">{children}</div>
        </div>
      </div>
    </Shell>
  );
}
