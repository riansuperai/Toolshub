import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Shell } from "@/components/shell";
import { InfoSidebar } from "@/components/info-sidebar";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Wie zit er achter Hazenco? Een klein Nederlands team dat custom software, automatisering en AI-workflows bouwt voor het MKB."
};

export default function OverOnsPage() {
  return (
    <Shell>
      <div className="page info-page">
        <div className="info-layout">
          <div className="info-main">
            <h1>Over ons</h1>
            <p className="lead-sm" style={{ color: "var(--green-700)", marginBottom: 24 }}>
              Hazenco is een klein Nederlands B2B-team dat custom software, workflow-automatisering en AI-workflows
              bouwt voor het MKB.
            </p>

            <section className="section-card">
              <h2>Wat we doen</h2>
              <p>
                Drie dingen — en niks anders. We bouwen websites op maat, we automatiseren processen die nu handmatig
                lopen, en we zetten AI-workflows op waar je klanten dagelijks mee praten (telefoonbots, chatbots,
                review-responders). Alles done-for-you: wij regelen installatie, integratie en onderhoud.
              </p>
            </section>

            <section className="section-card">
              <h2>Waarom Hazenco</h2>
              <p>
                Wij bouwen wat we ook zelf gebruiken. Onze eigen webshop TechPanda draait op dezelfde stack, onze
                gratis toolkit is ontstaan uit ons eigen dagelijkse werk, en deze site zelf is de showcase van wat
                we voor jou kunnen leveren. Geen theoretische adviezen — als iets bij ons breekt, weten we het als
                eerste.
              </p>
            </section>

            <section className="section-card">
              <h2>Voor wie</h2>
              <p>
                MKB-ondernemers die tijd willen besparen (automatisering), online willen groeien (webdesign) of AI
                willen inzetten zonder er zelf een developer voor te worden. Klein team, direct contact, geen
                account-managers of tussenlagen.
              </p>
            </section>

            <section className="section-card">
              <h2>Ook TechPanda</h2>
              <p>
                Naast Hazenco runnen we <a className="footer-external-link" href="https://techpanda.nl" target="_blank" rel="noopener noreferrer">TechPanda <ExternalLink size={14} /></a> — onze B2C-tak voor IT-webshop en computerhulp aan huis. Handig om te weten: als je in Hazenco investeert, krijg je een partij die zelf ook e-commerce en klantenservice draait.
              </p>
            </section>

            <section className="section-card">
              <h2>Contact</h2>
              <p>
                Vragen of wil je een gesprek plannen? Ga naar <Link href="/contact">de contactpagina</Link> voor
                WhatsApp, mail of het formulier.
              </p>
            </section>
          </div>
          <InfoSidebar />
        </div>
      </div>
    </Shell>
  );
}
