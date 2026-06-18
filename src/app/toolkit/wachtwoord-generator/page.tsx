import type { Metadata } from "next";
import { WachtwoordGeneratorClient } from "./wachtwoord-generator-client";

export const metadata: Metadata = {
  title: "Wachtwoord generator — veilig wachtwoord maken",
  description:
    "Genereer cryptografisch sterke wachtwoorden. Kies lengte en tekens, krijg een veilig wachtwoord en kopieer het direct. Alles in je browser, niks wordt opgeslagen."
};

export default function WachtwoordGeneratorPage() {
  return <WachtwoordGeneratorClient />;
}
