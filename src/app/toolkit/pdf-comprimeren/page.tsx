import type { Metadata } from "next";
import { PdfComprimerenClient } from "./pdf-comprimeren-client";

export const metadata: Metadata = {
  title: "PDF comprimeren — maak een PDF kleiner",
  description:
    "Verklein je PDF-bestand snel en gratis. Kies licht, gebalanceerd of maximaal. Werkt 100% in je browser, jouw bestand blijft op je eigen apparaat."
};

export default function PdfComprimerenPage() {
  return <PdfComprimerenClient />;
}
