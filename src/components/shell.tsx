"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  Menu,
  Phone,
  Sparkles,
  Workflow,
  X
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";

type SimpleLink = { href: string; label: string; description?: string };
type NavItem =
  | { type: "link"; href: string; label: string }
  | { type: "mega"; label: string; href?: string; groups: { title: string; links: SimpleLink[] }[]; featured?: SimpleLink };

const NAV: NavItem[] = [
  { type: "link", href: "/", label: "Home" },
  {
    type: "mega",
    label: "Diensten",
    href: "/diensten",
    groups: [
      {
        title: "Onze drie diensten",
        links: [
          { href: "/website-laten-maken", label: "Webdesign", description: "Custom sites, klaar voor conversie en SEO" },
          { href: "/workflow-automatisering", label: "Workflow-automatisering", description: "Handmatig werk uit je proces halen" },
          { href: "/ai-workflows", label: "AI-workflows & integraties", description: "AI die echt werk uit handen neemt" }
        ]
      }
    ],
    featured: { href: "/diensten", label: "Alle diensten bekijken", description: "Overzicht met scope, doorlooptijd en prijs-indicatie" }
  },
  {
    type: "mega",
    label: "Oplossingen",
    href: "/oplossingen",
    groups: [
      {
        title: "Hazenco tools",
        links: [
          { href: "/oplossingen/hazenco-price-tool", label: "Price Tool", description: "Dynamic pricing + concurrentie-scraping" },
          { href: "/oplossingen/hazenco-voorraad-tool", label: "Voorraad Tool", description: "Voorraad-sync tussen leveranciers en shop" },
          { href: "/oplossingen/hazenco-cep", label: "Customer Engagement Platform", description: "Mailchimp-alternatief voor MKB" },
          { href: "/oplossingen/hazenco-blog-tool", label: "Blog Studio", description: "AI-blog van idee tot live" },
          { href: "/oplossingen/hazenco-product-manager", label: "Product Manager", description: "PIM, sales en stock in één" }
        ]
      },
      {
        title: "Productized services",
        links: [
          { href: "/oplossingen/ai-telefoonassistent", label: "AI-telefoonassistent" },
          { href: "/oplossingen/whatsapp-business-chatbot", label: "WhatsApp chatbot" },
          { href: "/oplossingen/google-reviews-ai-responder", label: "Google Reviews AI-responder" },
          { href: "/oplossingen/online-afsprakensysteem", label: "Online afsprakensysteem" },
          { href: "/oplossingen/website-laten-maken", label: "Website laten maken" }
        ]
      }
    ],
    featured: { href: "/oplossingen", label: "Alle oplossingen bekijken", description: "12 productized oplossingen, klaar om af te nemen" }
  },
  { type: "link", href: "/cases", label: "Cases" },
  { type: "link", href: "/toolkit", label: "Toolkit" },
  {
    type: "mega",
    label: "Over ons",
    href: "/over-ons",
    groups: [
      {
        title: "Hazenco",
        links: [
          { href: "/over-ons", label: "Over ons", description: "Wie we zijn en waar we in geloven" },
          { href: "/blog", label: "Blog", description: "Praktijk-artikelen over software en automatisering" },
          { href: "/veelgestelde-vragen", label: "Veelgestelde vragen", description: "Antwoord op de meest gestelde vragen" }
        ]
      }
    ],
    featured: { href: "/contact", label: "Plan een gesprek", description: "15 minuten kennismaken, vrijblijvend" }
  },
  { type: "link", href: "/contact", label: "Contact" }
];

const MEGA_ICON: Record<string, typeof Globe> = {
  Diensten: Workflow,
  Oplossingen: Sparkles,
  "Over ons": Globe
};

function activeFor(pathname: string, item: NavItem): boolean {
  if (item.type === "link") return pathname === item.href;
  if (item.href && pathname === item.href) return true;
  return item.groups.some((g) => g.links.some((l) => pathname === l.href));
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenMega(null);
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

          <nav
            className="main-nav"
            aria-label="Hoofdnavigatie"
            onMouseLeave={() => setOpenMega(null)}
          >
            {NAV.map((item) => {
              if (item.type === "link") {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={activeFor(pathname, item) ? "active" : ""}
                    onMouseEnter={() => setOpenMega(null)}
                  >
                    {item.label}
                  </Link>
                );
              }
              const isOpen = openMega === item.label;
              const Icon = MEGA_ICON[item.label] ?? Globe;
              return (
                <div
                  key={item.label}
                  className={`main-nav-item has-mega${isOpen ? " is-open" : ""}`}
                  onMouseEnter={() => setOpenMega(item.label)}
                >
                  <button
                    type="button"
                    className={`main-nav-trigger${activeFor(pathname, item) ? " active" : ""}`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setOpenMega(isOpen ? null : item.label)}
                  >
                    {item.label} <ChevronDown size={14} />
                  </button>
                  {isOpen ? (
                    <div className="mega-panel" role="menu">
                      <div className="mega-panel-inner">
                        <div className="mega-groups">
                          {item.groups.map((group) => (
                            <div key={group.title} className="mega-group">
                              <p className="mega-group-title">{group.title}</p>
                              <ul>
                                {group.links.map((link) => (
                                  <li key={link.href}>
                                    <Link href={link.href} onClick={() => setOpenMega(null)}>
                                      <span className="mega-link-title">{link.label}</span>
                                      {link.description ? (
                                        <span className="mega-link-desc">{link.description}</span>
                                      ) : null}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        {item.featured ? (
                          <Link
                            href={item.featured.href}
                            className="mega-featured"
                            onClick={() => setOpenMega(null)}
                          >
                            <div className="mega-featured-icon"><Icon size={16} /></div>
                            <div>
                              <strong>{item.featured.label}</strong>
                              {item.featured.description ? <p>{item.featured.description}</p> : null}
                            </div>
                            <ArrowRight size={16} />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
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
                {NAV.flatMap((item) => {
                  if (item.type === "link") {
                    return [
                      <Link key={item.label} href={item.href} className={pathname === item.href ? "active" : ""}>
                        {item.label}
                      </Link>
                    ];
                  }
                  return [
                    item.href ? (
                      <Link key={item.label + "-head"} href={item.href} className="mobile-menu-section-title">
                        {item.label}
                      </Link>
                    ) : (
                      <span key={item.label + "-head"} className="mobile-menu-section-title">{item.label}</span>
                    ),
                    ...item.groups.flatMap((g) =>
                      g.links.map((l) => (
                        <Link key={l.href} href={l.href} className={`mobile-menu-sub${pathname === l.href ? " active" : ""}`}>
                          {l.label}
                        </Link>
                      ))
                    )
                  ];
                })}
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
                <a href="mailto:info@hazenco.nl">info@hazenco.nl</a>
              </li>
              <li>
                <Building2 size={15} aria-hidden="true" />
                <span>KvK-nummer: 42121114</span>
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
              TechPanda, onze B2C tak <ExternalLink size={14} />
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
