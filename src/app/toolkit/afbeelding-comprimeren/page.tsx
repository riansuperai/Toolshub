import type { Metadata } from "next";
import { AfbeeldingComprimerenClient } from "./afbeelding-comprimeren-client";

export const metadata: Metadata = {
  title: "Afbeelding comprimeren — JPG, PNG en WebP verkleinen",
  description:
    "Verklein meerdere afbeeldingen tegelijk (JPG, PNG, WebP) of converteer naar een ander formaat. Werkt 100% in je browser, je foto's blijven 100% privé."
};

export default function AfbeeldingComprimerenPage() {
  return <AfbeeldingComprimerenClient />;
}
