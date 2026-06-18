import type { Metadata } from "next";
import { QrCodeGeneratorClient } from "./qr-code-generator-client";

export const metadata: Metadata = {
  title: "QR-code generator — gratis QR-code maken",
  description:
    "Maak direct een QR-code voor een URL, tekst, e-mail of telefoonnummer. Download als PNG of SVG. Werkt 100% in je browser, gratis."
};

export default function QrCodeGeneratorPage() {
  return <QrCodeGeneratorClient />;
}
