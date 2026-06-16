import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden op de meest gestelde vragen over Hazenco Toolshub — kopen, demo's, support en creator worden."
};

export default function FaqPage() {
  return (
    <Shell>
      <div className="page" style={{ maxWidth: 760 }}>
        <h1>Veelgestelde vragen</h1>
        <p className="lead-sm" style={{ color: "var(--green-700)", marginBottom: 24 }}>
          Vind je vraag niet terug? Neem contact met ons op — we helpen graag.
        </p>

        <section className="section-card">
          <h2>Hoe weet ik of een tool bij mijn bedrijf past?</h2>
          <p>
            Bij elke tool hoort een demo, screenshots en een uitgebreide
            beschrijving. Twijfel je? Vraag eerst een gesprek aan via
            WhatsApp — we denken graag met je mee.
          </p>
        </section>

        <section className="section-card">
          <h2>Krijg ik direct toegang na aankoop?</h2>
          <p>
            Ja. Bij downloadbare tools en cloud-toegang krijg je direct na
            betaling toegang. Bij maatwerk-services neemt de creator binnen
            één werkdag contact met je op.
          </p>
        </section>

        <section className="section-card">
          <h2>Wat als de tool niet doet wat ik verwachtte?</h2>
          <p>
            Iedere creator biedt support tijdens de meegeleverde periode (zie
            het pakket). Als er een serieus probleem is, kan je contact
            opnemen met Hazenco — we helpen bemiddelen of refunden waar
            redelijk.
          </p>
        </section>

        <section className="section-card">
          <h2>Hoe wordt mijn betaling beveiligd?</h2>
          <p>
            Alle betalingen lopen via een beveiligde payment-provider. Wij
            slaan geen kaartgegevens op. Voor details over privacy, zie onze{" "}
            <Link href="/privacy">privacy- en cookieverklaring</Link>.
          </p>
        </section>

        <section className="section-card">
          <h2>Kan ik zelf creator worden?</h2>
          <p>
            Ja. Bouw je tools, services of automations die andere ondernemers
            zouden willen? Lees op de{" "}
            <Link href="/creators">creator-pagina</Link> hoe het werkt.
          </p>
        </section>

        <section className="section-card">
          <h2>Vraag niet beantwoord?</h2>
          <p>
            Stuur een bericht via WhatsApp (+31 6 4307403) of mail naar{" "}
            <a href="mailto:info@hazenco.nl">info@hazenco.nl</a> — we
            reageren meestal binnen één werkdag.
          </p>
        </section>
      </div>
    </Shell>
  );
}
