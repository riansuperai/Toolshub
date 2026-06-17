import type { Metadata } from "next";
import { AchtergrondVerwijderenClient } from "./achtergrond-verwijderen-client";

export const metadata: Metadata = {
  title: "Achtergrond verwijderen — direct in je browser, gratis",
  description:
    "Verwijder de achtergrond van een foto met AI — alles draait in je eigen browser. Geen account, geen upload naar servers, je foto blijft 100% privé."
};

export default function AchtergrondVerwijderenPage() {
  return <AchtergrondVerwijderenClient />;
}
