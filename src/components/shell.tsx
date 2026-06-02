"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  LayoutDashboard,
  LogIn,
  Menu,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Store,
  User,
  X,
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
    { href: "/catalogus", label: "Catalogus" }
  ];
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, activeUser } = useMarketplace();
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const nav = buildNav();
  const isVisitor = activeUser.role === "visitor";
  const accountHref = activeUser.role === "admin" ? "/admin" : activeUser.role === "seller" || activeUser.role === "seller_pending" ? "/seller" : "/account";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sluit mobile menu bij navigatie
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll wanneer drawer open is
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <div className="app-shell">
      <SiteBanner />
      <header className="site-header">
        <div className="top-strip">
          <span>Digitale probleemoplossers voor ondernemers</span>
          <span>Testmodus actief: betalingen zijn veilig gesimuleerd</span>
        </div>
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Hazenco Toolshub home">
            <span className="brand-mark">H</span>
            <span>
              <strong>Hazenco</strong>
              <small>Toolshub</small>
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
              <Link className="header-creator-cta" href="/creators">
                <Rocket size={15} /> Creator worden?
              </Link>
            ) : null}
            {isVisitor ? (
              <Link className="header-account-link" href="/account" aria-label="Inloggen">
                <LogIn size={15} /> <span className="account-link-label">Inloggen</span>
              </Link>
            ) : (
              <Link className="header-account-link" href={accountHref} aria-label={activeUser.name}>
                <User size={15} /> <span className="account-link-label">{activeUser.name.split(" ")[0]}</span>
              </Link>
            )}
            <Link className="cart-button" href="/winkelwagen" aria-label="Winkelwagen">
              <ShoppingBag size={18} />
              <span>{cartCount}</span>
            </Link>
          </div>

          {/* Hamburger als sibling van header-actions — op mobile zit deze
              op rij 1 naast brand, header-actions wrappen naar rij 2 */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-drawer"
            aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu drawer — alleen zichtbaar < 980px (via CSS) */}
        {mobileMenuOpen ? (
          <>
            <div
              className="mobile-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div id="mobile-menu-drawer" className="mobile-menu-drawer" role="dialog" aria-label="Menu">
              <div className="mobile-menu-search">
                <HeaderSearch />
              </div>
              <nav className="mobile-menu-nav" aria-label="Hoofdnavigatie">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={pathname === item.href.split("#")[0] ? "active" : ""}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mobile-menu-actions">
                {isVisitor ? (
                  <Link className="header-creator-cta" href="/creators">
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
              </div>
            </div>
          </>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark">H</span>
            <span>
              <strong>Hazenco</strong>
              <small>Toolshub</small>
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
