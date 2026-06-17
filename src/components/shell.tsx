"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  Clock,
  ExternalLink,
  LogIn,
  Mail,
  Menu,
  Phone,
  Rocket,
  ShoppingBag,
  User,
  X
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
    { href: "/toolkit", label: "Toolkit" }
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
        <div className="footer-grid-wrap">
          <div className="footer-brand-col">
            <Link className="brand footer-brand" href="/">
              <span className="brand-mark">H</span>
              <span>
                <strong>Hazenco</strong>
                <small>Toolshub</small>
              </span>
            </Link>
            <p>
              Een betrouwbare plek voor digitale tools, automatiseringen en
              servicepakketten die ondernemers echt tijd besparen.
            </p>
            <Link className="footer-creator-cta" href="/creators">
              <Rocket size={15} /> Creator worden?
            </Link>
          </div>

          <div className="footer-col">
            <h3>Informatie</h3>
            <ul className="footer-link-list">
              <li><Link href="/over-ons">Over ons</Link></li>
              <li><Link href="/veelgestelde-vragen">Veelgestelde vragen</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/algemene-voorwaarden">Algemene voorwaarden</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Onze tools</h3>
            <ul className="footer-link-list">
              <li><Link href="/tools/hazenco-cep">Customer Engagement</Link></li>
              <li><Link href="/tools/hazenco-price-tool">Price Tool</Link></li>
              <li><Link href="/tools/hazenco-voorraad-tool">Voorraad Beheer</Link></li>
              <li><Link href="/creators/hazenco-studio">Bekijk alles</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact</h3>
            <ul className="footer-contact-list">
              <li>
                <Phone size={15} aria-hidden="true" />
                <a href="tel:+31643074303">+31 6 4307403</a>
              </li>
              <li>
                <Mail size={15} aria-hidden="true" />
                <a href="mailto:info@hazenco.nl">info@hazenco.nl</a>
              </li>
              <li>
                <Building2 size={15} aria-hidden="true" />
                <span>KvK: 94215316</span>
              </li>
              <li>
                <Clock size={15} aria-hidden="true" />
                <span>Ma–Vr 09:00 – 17:00</span>
              </li>
            </ul>
            <a
              className="footer-external-link"
              href="https://hazenco.nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              hazenco.nl <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>&copy; 2026 Hazenco. Alle rechten voorbehouden.</p>
        </div>
      </footer>

      <RoleSwitcher />
    </div>
  );
}
