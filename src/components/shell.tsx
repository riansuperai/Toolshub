"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Clock,
  ExternalLink,
  Mail,
  Menu,
  Phone,
  X
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";

function buildNav() {
  return [
    { href: "/", label: "Home" },
    { href: "/diensten", label: "Diensten" },
    { href: "/cases", label: "Cases" },
    { href: "/toolkit", label: "Toolkit" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" }
  ];
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = buildNav();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
      <header className="site-header">
        <div className="top-strip">
          <span>Wij automatiseren en bouwen wat jouw bedrijf sneller maakt</span>
          <span>Plan een gesprek van 15 minuten</span>
        </div>
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Hazenco home">
            <span className="brand-mark"><BrandMark /></span>
            <span>
              <strong>Hazenco.</strong>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Hoofdnavigatie">
            {nav.map((item) => (
              <Link key={item.href} className={pathname === item.href.split("#")[0] ? "active" : ""} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <Link className="header-cta" href="/contact">
              Plan een gesprek <ArrowRight size={14} />
            </Link>
          </div>

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

        {mobileMenuOpen ? (
          <>
            <div
              className="mobile-menu-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div id="mobile-menu-drawer" className="mobile-menu-drawer" role="dialog" aria-label="Menu">
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
                <Link className="header-cta" href="/contact">
                  Plan een gesprek <ArrowRight size={14} />
                </Link>
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
              <span className="brand-mark"><BrandMark /></span>
              <span>
                <strong>Hazenco.</strong>
              </span>
            </Link>
            <p>
              Wij bouwen custom software, automatiseren processen en zetten AI-workflows op voor het Nederlandse MKB.
              Klein team, direct contact, done-for-you levering.
            </p>
          </div>

          <div className="footer-col">
            <h3>Diensten</h3>
            <ul className="footer-link-list">
              <li><Link href="/website-laten-maken">Webdesign</Link></li>
              <li><Link href="/workflow-automatisering">Workflow-automatisering</Link></li>
              <li><Link href="/ai-workflows">AI-workflows &amp; integraties</Link></li>
              <li><Link href="/oplossingen">Alle oplossingen</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Informatie</h3>
            <ul className="footer-link-list">
              <li><Link href="/over-ons">Over ons</Link></li>
              <li><Link href="/toolkit">Gratis toolkit</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/veelgestelde-vragen">Veelgestelde vragen</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/algemene-voorwaarden">Algemene voorwaarden</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Contact</h3>
            <ul className="footer-contact-list">
              <li>
                <Phone size={15} aria-hidden="true" />
                <a href="tel:+31643074303">+31 6 4307 4303</a>
              </li>
              <li>
                <Mail size={15} aria-hidden="true" />
                <a href="mailto:hallo@hazenco.nl">hallo@hazenco.nl</a>
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
              href="https://techpanda.nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              TechPanda — onze B2C tak <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>&copy; 2026 Hazenco. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </div>
  );
}
