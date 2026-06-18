import type { Metadata } from "next";
import { PdfSplitsenClient } from "./pdf-splitsen-client";

export const metadata: Metadata = {
  title: "PDF splitsen — pagina's uit een PDF halen",
  description:
    "Splits een PDF in losse pagina's of pak specifieke pagina's eruit. Werkt 100% in je browser, je bestand blijft op je eigen apparaat."
};

export default function PdfSplitsenPage() {
  return <PdfSplitsenClient />;
}
