"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Building2,
  Calendar,
  CalendarClock,
  ChevronDown,
  Clock,
  Cpu,
  ExternalLink,
  Globe,
  HelpCircle,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  Package,
  PencilLine,
  Phone,
  Plug,
  ShoppingCart,
  Sparkles,
  Star,
  Users,
  Workflow,
  X
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";

type LucideIcon = ComponentType<{ size?: number }>;

type MegaLink = {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  tone: "orange" | "green" | "sky" | "violet" | "amber";
};

type MegaGroup = {
  title: string;
  bullet: "orange" | "green" | "sky" | "violet" | "amber";
  links: MegaLink[];
};

type FeaturedCard = {
  href: string;
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
  tone: "orange" | "green" | "sky" | "violet";
};

type NavItem =
  | { type: "link"; href: string; label: string }
  | {
      type: "mega";
      label: string;
      href?: string;
      groups: MegaGroup[];
      featured: FeaturedCard[];
    };

const NAV: NavItem[] = [
  { type: "link", href: "/", label: "Home" },
  {
    type: "mega",
    label: "Diensten",
    href: "/diensten",
    groups: [
      {
        title: "Onze drie diensten",
        bullet: "orange",
        links: [
          {
            href: "/website-laten-maken",
            label: "Webdesign",
            description: "Custom sites, klaar voor conversie en SEO",
            icon: Globe,
            tone: "sky"
          },
          {
            href: "/workflow-automatisering",
            label: "Workflow-automatisering",
            description: "Handmatig werk uit je proces halen",
            icon: Workflow,
            tone: "green"
          },
          {
            href: "/ai-workflows",
            label: "AI-workflows & integraties",
            description: "AI die echt werk uit handen neemt",
            icon: Sparkles,
            tone: "orange"
          }
        ]
      }
    ],
    featured: [
      {
        href: "/diensten",
        title: "Alle diensten bekijken",
        description: "Overzicht met scope, doorlooptijd en prijs-indicatie",
        cta: "Naar overzicht",
        icon: Workflow,
        tone: "orange"
      },
      {
        href: "/contact",
        title: "Plan een gesprek",
        description: "15 minuten, vrijblijvend. We denken direct mee.",
        cta: "Nu inplannen",
        icon: CalendarClock,
        tone: "green"
      }
    ]
  },
  {
    type: "mega",
    label: "Oplossingen",
    href: "/oplossingen",
    groups: [
      {
        title: "Hazenco tools",
        bullet: "orange",
        links: [
          {
            href: "/oplossingen/hazenco-price-tool",
            label: "Price Tool",
            description: "Dynamic pricing + concurrentie-scraping",
            icon: BarChart3,
            tone: "orange"
          },
          {
            href: "/oplossingen/hazenco-voorraad-tool",
            label: "Voorraad Tool",
            description: "Voorraad-sync tussen leveranciers en shop",
            icon: Boxes,
            tone: "sky"
          },
          {
            href: "/oplossingen/hazenco-cep",
            label: "Customer Engagement Platform",
            description: "Mailchimp-alternatief voor MKB",
            icon: Users,
            tone: "violet"
          },
          {
            href: "/oplossingen/hazenco-blog-tool",
            label: "Blog Studio",
            description: "AI-blog van idee tot live",
            icon: PencilLine,
            tone: "amber"
          },
          {
            href: "/oplossingen/hazenco-product-manager",
            label: "Product Manager",
            description: "PIM, sales en stock in één",
            icon: Package,
            tone: "green"
          }
        ]
      },
      {
        title: "Productized services",
        bullet: "sky",
        links: [
          {
            href: "/oplossingen/ai-telefoonassistent",
            label: "AI-telefoonassistent",
            description: "24/7 telefoon, altijd bereikbaar",
            icon: Phone,
            tone: "orange"
          },
          {
            href: "/oplossingen/whatsapp-business-chatbot",
            label: "WhatsApp chatbot",
            description: "Antwoord binnen seconden op WhatsApp",
            icon: MessageSquare,
            tone: "green"
          },
          {
            href: "/oplossingen/google-reviews-ai-responder",
            label: "Google Reviews responder",
            description: "AI reageert op elke review, in jouw toon",
            icon: Star,
            tone: "amber"
          },
          {
            href: "/oplossingen/online-afsprakensysteem",
            label: "Online afsprakensysteem",
            description: "24/7 zelf boeken, jij houdt focus",
            icon: Calendar,
            tone: "sky"
          },
          {
            href: "/oplossingen/website-laten-maken",
            label: "Website laten maken",
            description: "Custom, snel en SEO-first",
            icon: Globe,
            tone: "violet"
          }
        ]
      }
    ],
    featured: [
      {
        href: "/oplossingen",
        title: "Alle oplossingen",
        description: "12 productized oplossingen, klaar om af te nemen",
        cta: "Naar overzicht",
        icon: Sparkles,
        tone: "orange"
      },
      {
        href: "/contact",
        title: "Iets op maat?",
        description: "We bouwen ook custom, vertel wat je zoekt.",
        cta: "Plan een gesprek",
        icon: Cpu,
        tone: "sky"
      }
    ]
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
        bullet: "orange",
        links: [
          {
            href: "/over-ons",
            label: "Over ons",
            description: "Wie we zijn en waar we in geloven",
            icon: Users,
            tone: "green"
          },
          {
            href: "/blog",
            label: "Blog",
            description: "Praktijk-artikelen over software en automatisering",
            icon: Newspaper,
            tone: "orange"
          },
          {
            href: "/veelgestelde-vragen",
            label: "Veelgestelde vragen",
            description: "Antwoord op de meest gestelde vragen",
            icon: HelpCircle,
            tone: "sky"
          }
        ]
      }
    ],
    featured: [
      {
        href: "/contact",
        title: "Plan een gesprek",
        description: "15 minuten kennismaken, vrijblijvend",
        cta: "Nu inplannen",
        icon: CalendarClock,
        tone: "green"
      }
    ]
  },
  { type: "link", href: "/contact", label: "Contact" }
];

function activeFor(pathname: string, item: NavItem): boolean {
  if (item.type === "link") return pathname === item.href;
  if (item.href && pathname === item.href) return true;
  return item.groups.some((g) => g.links.some((l) => pathname === l.href));
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);

  // Korte vertraging op sluiten: vangt snelle diagonale muisbewegingen op
  // waarbij de cursor even buiten de nav valt onderweg naar het paneel.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }
  function openMegaNow(label: string | null) {
    cancelClose();
    setOpenMega(label);
  }
  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMega(null), 140);
  }

  useEffect(() => cancelClose, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    cancelClose();
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
            onMouseLeave={scheduleClose}
            onMouseEnter={cancelClose}
          >
            {NAV.map((item) => {
              if (item.type === "link") {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={activeFor(pathname, item) ? "active" : ""}
                    onMouseEnter={() => openMegaNow(null)}
                  >
                    {item.label}
                  </Link>
                );
              }
              const isOpen = openMega === item.label;
              return (
                <div
                  key={item.label}
                  className={`main-nav-item has-mega${isOpen ? " is-open" : ""}`}
                  onMouseEnter={() => openMegaNow(item.label)}
                >
                  <button
                    type="button"
                    className={`main-nav-trigger${activeFor(pathname, item) ? " active" : ""}`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => openMegaNow(isOpen ? null : item.label)}
                  >
                    {item.label} <ChevronDown size={14} />
                  </button>
                  {isOpen ? (
                    <div className="mega-panel" role="menu">
                      <div className="mega-panel-inner">
                        <div className="mega-groups">
                          {item.groups.map((group, gi) => (
                            <div
                              key={group.title}
                              className={`mega-group${gi > 0 ? " mega-group-divider" : ""}`}
                            >
                              <p className={`mega-group-title tone-${group.bullet}`}>
                                <span className="mega-group-bullet" /> {group.title}
                              </p>
                              <ul>
                                {group.links.map((link) => {
                                  const Icon = link.icon;
                                  return (
                                    <li key={link.href}>
                                      <Link href={link.href} onClick={() => setOpenMega(null)}>
                                        <span className={`mega-link-icon tone-${link.tone}`}>
                                          <Icon size={16} />
                                        </span>
                                        <span className="mega-link-text">
                                          <span className="mega-link-title">{link.label}</span>
                                          {link.description ? (
                                            <span className="mega-link-desc">{link.description}</span>
                                          ) : null}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="mega-featured-col">
                          {item.featured.map((f) => {
                            const Icon = f.icon;
                            return (
                              <Link
                                key={f.href + f.title}
                                href={f.href}
                                className={`mega-featured tone-${f.tone}`}
                                onClick={() => setOpenMega(null)}
                              >
                                <span className="mega-featured-title">
                                  <span className="mega-featured-dot" /> {f.title}
                                </span>
                                <span className="mega-featured-desc">{f.description}</span>
                                <span className="mega-featured-cta">
                                  {f.cta} <ArrowRight size={13} />
                                </span>
                              </Link>
                            );
                          })}
                        </div>
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
