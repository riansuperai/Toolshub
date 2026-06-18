import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  LayoutGrid,
  Lock,
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

        <section className="toolkit-howto">
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
      </div>
    </Shell>
  );
}
