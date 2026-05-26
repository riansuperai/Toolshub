"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  LayoutDashboard,
  LogIn,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Store,
  User,
  Zap
} from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { RoleSwitcher } from "@/components/role-switcher";
import { HeaderSearch } from "@/components/header-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { SiteBanner } from "@/components/site-banner";

function buildNav() {
  return [
    { href: "/", label: "Home" },
    { href: "/catalogus", label: "Catalogus" },
    { href: "/creators", label: "Voor Creators" }
  ];
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, activeUser } = useMarketplace();
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const nav = buildNav();
  const isVisitor = activeUser.role === "visitor";
  const accountHref = activeUser.role === "admin" ? "/admin" : activeUser.role === "seller" || activeUser.role === "seller_pending" ? "/seller" : "/account";

  return (
    <div className="app-shell">
      <SiteBanner />
      <header className="site-header">
        <div className="top-strip">
          <span>Digitale probleemoplossers voor ondernemers</span>
          <span>Testmodus actief: betalingen zijn veilig gesimuleerd</span>
        </div>
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Hazenco Marketplace home">
            <span className="brand-mark">H</span>
            <span>
              <strong>Hazenco</strong>
              <small>Marketplace</small>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Hoofdnavigatie">
            {nav.map((item) => (
              <Link key={item.href} className={pathname === item.href.split("#")[0] ? "active" : ""} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <HeaderSearch />

          <div className="header-actions">
            <ThemeToggle />
            <NotificationBell />
            {isVisitor ? (
              <Link className="header-creator-cta" href="/onboarding">
                <Rocket size={15} /> Creator worden?
              </Link>
            ) : null}
            {isVisitor ? (
              <Link className="header-account-link" href="/account">
                <LogIn size={15} /> Inloggen
              </Link>
            ) : (
              <Link className="header-account-link" href={accountHref}>
                <User size={15} /> {activeUser.name.split(" ")[0]}
              </Link>
            )}
            <Link className="cart-button" href="/winkelwagen" aria-label="Winkelwagen">
              <ShoppingBag size={18} />
              <span>{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark">H</span>
            <span>
              <strong>Hazenco</strong>
              <small>Marketplace</small>
            </span>
          </Link>
          <p>
            Een betrouwbare plek voor digitale tools, automatiseringen en servicepakketten die ondernemers echt tijd
            besparen.
          </p>
        </div>
        <div className="footer-grid">
          <div>
            <h3>Kwaliteit</h3>
            <p><BadgeCheck size={16} /> Creator keuring</p>
            <p><ShieldCheck size={16} /> Demo en review-flow</p>
          </div>
          <div>
            <h3>Platform</h3>
            <p><Store size={16} /> Brede catalogus</p>
            <p><LayoutDashboard size={16} /> Koper, creator en admin</p>
            <p><Zap size={16} /> Automatisering-eerst ervaring</p>
          </div>
        </div>
      </footer>

      <RoleSwitcher />
    </div>
  );
}
