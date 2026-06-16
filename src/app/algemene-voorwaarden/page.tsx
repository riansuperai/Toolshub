import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description:
    "De algemene voorwaarden waaronder Hazenco Toolshub diensten en producten worden aangeboden."
};

export default function AlgemeneVoorwaardenPage() {
  return (
    <Shell>
      <div className="page" style={{ maxWidth: 760 }}>
        <h1>Algemene voorwaarden</h1>
        <p className="lead-sm" style={{ color: "var(--green-700)", marginBottom: 24 }}>
          Hieronder staan de algemene voorwaarden voor het gebruik van
          Hazenco Toolshub en de aankoop van tools en diensten via dit
          platform.
        </p>

        <section className="section-card">
          <h2>1. Wie zijn wij</h2>
          <p>
            Hazenco Toolshub wordt aangeboden door Hazenco (KvK 94215316),
            gevestigd in Nederland. Contact:{" "}
            <a href="mailto:info@hazenco.nl">info@hazenco.nl</a>.
          </p>
        </section>

        <section className="section-card">
          <h2>2. Toepasselijkheid</h2>
          <p>
            Deze voorwaarden gelden voor elke bezoeker, koper en creator van
            Hazenco Toolshub. Door gebruik te maken van het platform ga je
            akkoord met deze voorwaarden.
          </p>
        </section>

        <section className="section-card">
          <h2>3. Aanbod en aankoop</h2>
          <p>
            Het aanbod op Toolshub bevat tools, diensten en servicepakketten
            van Hazenco zelf en van geverifieerde creators. Prijzen zijn
            exclusief btw tenzij anders aangegeven. Na aankoop ontvang je
            een factuur per e-mail.
          </p>
        </section>

        <section className="section-card">
          <h2>4. Levering</h2>
          <p>
            Digitale producten worden direct na betaling beschikbaar
            gesteld. Voor diensten en maatwerk geldt de in de
            listing-omschrijving genoemde levertijd. Bij vertraging nemen we
            contact met je op.
          </p>
        </section>

        <section className="section-card">
          <h2>5. Herroepingsrecht</h2>
          <p>
            Bij digitale producten geldt: zodra je toegang hebt gekregen tot
            de bestanden of cloud-toegang, vervalt het herroepingsrecht.
            Voor diensten geldt het standaard herroepingsrecht van 14
            dagen, tenzij de dienst binnen die termijn op verzoek is
            uitgevoerd.
          </p>
        </section>

        <section className="section-card">
          <h2>6. Aansprakelijkheid</h2>
          <p>
            Hazenco doet zijn best om alleen werkende, betrouwbare tools en
            services aan te bieden. We zijn echter niet aansprakelijk voor
            indirecte of gevolgschade als gevolg van het gebruik van een
            tool of dienst, behalve voor zover wettelijk vereist.
          </p>
        </section>

        <section className="section-card">
          <h2>7. Persoonsgegevens</h2>
          <p>
            Lees onze{" "}
            <Link href="/privacy">privacy- en cookieverklaring</Link> voor
            informatie over welke gegevens we verzamelen en hoe we ermee
            omgaan.
          </p>
        </section>

        <section className="section-card">
          <h2>8. Toepasselijk recht</h2>
          <p>
            Op deze voorwaarden is Nederlands recht van toepassing.
            Geschillen worden voorgelegd aan de bevoegde rechter in
            Nederland.
          </p>
        </section>
      </div>
    </Shell>
  );
}
