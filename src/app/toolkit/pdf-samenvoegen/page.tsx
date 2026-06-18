import type { Metadata } from "next";
import { PdfSamenvoegenClient } from "./pdf-samenvoegen-client";

export const metadata: Metadata = {
  title: "PDF samenvoegen — voeg meerdere PDFs samen tot één",
  description:
    "Combineer meerdere PDF-bestanden tot één document. Sleep PDFs in de juiste volgorde, klik samenvoegen en download. 100% in je browser, gratis."
};

export default function PdfSamenvoegenPage() {
  return <PdfSamenvoegenClient />;
}
