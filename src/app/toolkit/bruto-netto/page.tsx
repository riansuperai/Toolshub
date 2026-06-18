import type { Metadata } from "next";
import { BrutoNettoClient } from "./bruto-netto-client";

export const metadata: Metadata = {
  title: "Bruto-netto loon calculator — reken bruto naar netto",
  description:
    "Bereken je netto loon op basis van Nederlandse loonbelasting 2025 — inclusief heffingskortingen, AOW-leeftijd toggle, per maand of jaar. Direct in je browser, gratis."
};

export default function BrutoNettoPage() {
  return <BrutoNettoClient />;
}
