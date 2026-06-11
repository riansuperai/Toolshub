import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Privacy & cookies",
  description:
    "Welke gegevens Hazenco Toolshub verzamelt, hoe lang we ze bewaren en hoe je je toestemming intrekt."
};

export default function PrivacyPage() {
  return (
    <Shell>
      <div className="page" style={{ maxWidth: 760 }}>
        <h1>Privacy & cookies</h1>
        <p className="lead-sm" style={{ color: "var(--green-700)", marginBottom: 24 }}>
          Korte uitleg over welke gegevens we verzamelen op
          toolshub.hazenco.nl en hoe je daar controle over hebt.
        </p>

        <section className="section-card">
          <h2>Wat we verzamelen</h2>
          <p>
            We gebruiken <strong>Google Analytics 4</strong> om anoniem te
            meten hoe bezoekers onze tools vinden. Concreet:
          </p>
          <ul>
            <li>Welke pagina&apos;s je bekijkt</li>
            <li>Geanonimiseerd IP-adres (laatste octet weggehaald)</li>
            <li>Apparaattype en browser</li>
            <li>Land en stad (niet exact, op stadsniveau)</li>
            <li>Bron van bezoek (search, social, direct, etc.)</li>
          </ul>
          <p>
            <strong>Wat we niet doen:</strong> we plaatsen geen advertentie-
            cookies, we delen geen data met derden voor marketing, en we
            koppelen geen persoonsgegevens aan jouw bezoek.
          </p>
        </section>

        <section className="section-card">
          <h2>Cookies</h2>
          <p>
            Bij toestemming plaatst Google Analytics een paar first-party
            cookies (<code>_ga</code>, <code>_ga_*</code>) om sessies te
            herkennen. Deze worden maximaal <strong>2 jaar</strong> bewaard.
          </p>
          <p>
            We delen sessies tussen <code>hazenco.nl</code> en{" "}
            <code>toolshub.hazenco.nl</code> zodat een gebruiker die tussen
            beide klikt als één bezoeker wordt geteld. Dit gebeurt via een
            zogenaamde &quot;linker&quot; cookie.
          </p>
        </section>

        <section className="section-card">
          <h2>Toestemming intrekken</h2>
          <p>
            Wis de site-data van toolshub.hazenco.nl uit je browser. De
            cookie-banner verschijnt dan opnieuw bij je volgend bezoek en
            je kan een nieuwe keuze maken.
          </p>
          <p>
            Of leeg je <code>localStorage</code> voor deze site via
            DevTools (F12 → Application → Storage).
          </p>
        </section>

        <section className="section-card">
          <h2>Contact</h2>
          <p>
            Vragen over privacy? Stuur een bericht naar Hazenco via{" "}
            <Link
              href="https://wa.me/31643074303"
              className="footer-external-link"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </Link>{" "}
            of mail naar het adres op onze hoofdwebsite.
          </p>
        </section>
      </div>
    </Shell>
  );
}
