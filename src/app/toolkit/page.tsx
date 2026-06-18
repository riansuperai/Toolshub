import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
  Lock,
  MessageCircle,
  Pencil,
  Zap
} from "lucide-react";
import { Shell } from "@/components/shell";
import { ToolkitIconRender } from "@/components/mini-tool-page";
import { TOOLKIT_REGISTRY } from "@/lib/toolkit-registry";

export const metadata: Metadata = {
  title: "Toolkit",
  description:
    "Gratis browser-tools van Hazenco voor Nederlandse ondernemers — factuur maken, BTW berekenen, IBAN checken en meer. Geen account, alles direct te gebruiken."
};

// 4 tools voor de 'Snelle start'-lijst in de hero, in vaste volgorde
const QUICK_LAUNCH_SLUGS = [
  "factuur-generator",
  "btw-calculator",
  "qr-code-generator",
  "pdf-samenvoegen"
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Zijn alle tools écht gratis?",
    a: "Ja, alle tools in de toolkit zijn 100% gratis te gebruiken. Geen verborgen kosten, geen 'pro upgrade', geen trial die afloopt. We bouwen ze om Nederlandse ondernemers te helpen — en omdat ze in je browser draaien zijn de hostingkosten voor ons minimaal."
  },
  {
    q: "Heb ik een account nodig?",
    a: "Nee. Je opent de tool, je gebruikt 'm, je sluit het tabblad. Geen registratie, geen e-mail, geen wachtwoord. Sommige tools onthouden optioneel je gegevens in je eigen browser (zoals factuur-bedrijfsgegevens) — dat blijft op jouw apparaat."
  },
  {
    q: "Is mijn data veilig? Slaan jullie iets op?",
    a: "Alles draait in je eigen browser. Wij ontvangen geen documenten, foto's, klantgegevens of betaalinfo. Voor analytics gebruiken we alleen anoniem bezoek-niveau (Google Analytics, alleen met jouw cookie-toestemming)."
  },
  {
    q: "Werken de tools ook op mijn telefoon?",
    a: "Ja. Alle tools zijn responsive en werken op mobiel, tablet en desktop. Sommige tools (zoals de achtergrond verwijderaar met AI) zijn op een snelle laptop net wat vlotter dan op telefoon, maar werken op beide."
  },
  {
    q: "Kan ik een tool voorstellen die ik mis?",
    a: "Ja, graag zelfs. Op elke tool-pagina staat onderaan een 'Werkt iets niet of mis je iets?' knop — daar kan je via WhatsApp of e-mail je idee delen. Als meerdere mensen 'm vragen, bouwen we 'm."
  },
  {
    q: "Waarom geen advertenties of pop-ups?",
    a: "Omdat we 't ook irritant vinden. De toolkit is een visitekaartje van Hazenco — bezoekers die deze tools fijn vinden, kiezen later vaak voor onze betaalde diensten (website, automation, CRM-koppelingen). Dat is voldoende."
  },
  {
    q: "Hoe vaak komen er nieuwe tools bij?",
    a: "Onregelmatig, gemiddeld 1-2 per maand. De toolkit is begonnen met een handvol en groeit op basis van wat bezoekers vragen of waar Hazenco zelf behoefte aan heeft. Volg ons op LinkedIn om updates te zien."
  },
  {
    q: "Wie zit er achter Toolshub?",
    a: "Toolshub is gebouwd door Hazenco — een Nederlands team dat zich richt op automation, webontwikkeling en MKB-tools. Meer over wie wij zijn vind je op hazenco.nl of via onze contactpagina."
  }
];

export default function ToolkitIndexPage() {
  const available = TOOLKIT_REGISTRY.filter((t) => t.available);
  const quickLaunch = QUICK_LAUNCH_SLUGS.map((slug) =>
    available.find((t) => t.slug === slug)
  ).filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <Shell>
      <div className="page">
        <section className="toolkit-hero">
          <div className="toolkit-hero-copy">
            <span className="eyebrow">Toolkit</span>
            <h1>
              <span className="accent">Snelle tools</span>
              <br />
              voor het Nederlandse MKB.
            </h1>
            <p className="lead">
              Gratis, in je browser, geen gedoe. Door Hazenco gemaakt voor
              ondernemers die liever ondernemen dan knutselen.
            </p>
            <div className="toolkit-hero-trust">
              <div>
                <Lock size={16} />
                <span>100% in je browser</span>
              </div>
              <div>
                <Zap size={16} />
                <span>Geen account, direct te gebruiken</span>
              </div>
              <div>
                <BadgeCheck size={16} />
                <span>Door Hazenco voor MKB gemaakt</span>
              </div>
            </div>
          </div>

          <aside className="toolkit-hero-card">
            <div className="toolkit-hero-stats">
              <div>
                <strong>{available.length}</strong>
                <span>Tools live</span>
              </div>
              <div>
                <strong>0</strong>
                <span>Accounts nodig</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>In je browser</span>
              </div>
            </div>
            <p className="toolkit-hero-card-label">Snelle start</p>
            <ul className="toolkit-hero-quick">
              {quickLaunch.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/toolkit/${tool.slug}`}>
                    <span className="toolkit-hero-quick-icon">
                      <ToolkitIconRender name={tool.iconName} size={16} />
                    </span>
                    <span className="toolkit-hero-quick-label">{tool.title}</span>
                    <ArrowRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <h2 className="toolkit-grid-heading">Meest gebruikte tools</h2>
        <div className="toolkit-grid">
          {TOOLKIT_REGISTRY.map((entry) => {
            const isAvailable = entry.available;
            const inner = (
              <>
                <div className="toolkit-card-icon">
                  <ToolkitIconRender name={entry.iconName} size={24} />
                </div>
                <div className="toolkit-card-body">
                  <div className="toolkit-card-head">
                    <strong>{entry.title}</strong>
                    {!isAvailable ? (
                      <span className="toolkit-card-soon">Binnenkort</span>
                    ) : null}
                  </div>
                  <p>{entry.tagline}</p>
                  {isAvailable ? (
                    <span className="toolkit-card-link">
                      Open tool <ArrowRight size={14} />
                    </span>
                  ) : null}
                </div>
              </>
            );

            if (!isAvailable) {
              return (
                <div key={entry.slug} className="toolkit-card disabled">
                  {inner}
                </div>
              );
            }

            return (
              <Link
                key={entry.slug}
                className="toolkit-card"
                href={`/toolkit/${entry.slug}`}
              >
                {inner}
              </Link>
            );
          })}
        </div>

        <section className="toolkit-howto" id="hoe-het-werkt">
          <div className="toolkit-howto-head">
            <h2>Hoe het werkt</h2>
            <p>Drie stappen om je resultaat te krijgen.</p>
          </div>
          <ol className="toolkit-howto-steps">
            <li>
              <span className="toolkit-howto-num">1</span>
              <div className="toolkit-howto-icon">
                <LayoutGrid size={22} />
              </div>
              <strong>Kies een tool</strong>
              <p>
                Pick uit onze gratis browser-tools voor het Nederlandse
                MKB — facturen, PDFs, calculaties en meer.
              </p>
            </li>
            <li>
              <span className="toolkit-howto-num">2</span>
              <div className="toolkit-howto-icon">
                <Pencil size={22} />
              </div>
              <strong>Vul je gegevens in</strong>
              <p>
                Plak tekst, upload een bestand of vul een formulier in.
                Alles draait in je eigen browser — geen account, geen
                upload naar servers.
              </p>
            </li>
            <li>
              <span className="toolkit-howto-num">3</span>
              <div className="toolkit-howto-icon">
                <CheckCircle2 size={22} />
              </div>
              <strong>Direct resultaat</strong>
              <p>
                Download, kopieer of gebruik het resultaat meteen.
                Geen wachttijd, geen verborgen kosten.
              </p>
            </li>
          </ol>
        </section>

        <section className="toolkit-faq">
          <div className="toolkit-faq-head">
            <span className="eyebrow">FAQ</span>
            <h2>Veelgestelde vragen</h2>
            <p>Alles wat we vaak horen over de toolkit.</p>
          </div>
          <div className="toolkit-faq-list">
            {FAQ.map((item) => (
              <details key={item.q} className="toolkit-faq-item">
                <summary>
                  <span>{item.q}</span>
                  <ChevronDown size={18} />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="toolkit-cta">
          <span className="eyebrow">Voor als het complexer wordt</span>
          <h2>
            Meer nodig dan een <span className="accent">quick tool</span>?
          </h2>
          <p>
            Wij bouwen ook websites, automation en workflows op maat — geen
            templates, geen workarounds. Hazenco-kwaliteit met een vast
            aanspreekpunt.
          </p>
          <div className="toolkit-cta-actions">
            <a
              className="button"
              href="https://hazenco.nl/contact/"
              target="_blank"
              rel="noreferrer"
            >
              Plan een gesprek <ArrowRight size={15} />
            </a>
            <a
              className="button secondary"
              href="https://hazenco.nl"
              target="_blank"
              rel="noreferrer"
            >
              Bekijk diensten
            </a>
          </div>
          <p className="toolkit-cta-foot">
            <MessageCircle size={14} />
            Mis je een tool? Suggesties altijd welkom — stuur ons een{" "}
            <a
              href="https://wa.me/31643074303?text=Hi%20Hazenco%2C%20ik%20mis%20een%20tool%20in%20de%20toolkit%3A%20"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
}
