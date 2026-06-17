import type { Metadata } from "next";
import { FactuurGeneratorClient } from "./factuur-generator-client";

export const metadata: Metadata = {
  title: "Factuur generator — gratis NL-factuur maken",
  description:
    "Maak een professionele Nederlandse factuur met BTW (21%, 9%, 0%) en download direct als PDF. Geen account, geen registratie, je gegevens blijven in je eigen browser."
};

export default function FactuurGeneratorPage() {
  return <FactuurGeneratorClient />;
}
