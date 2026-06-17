import type { Metadata } from "next";
import { BtwCalculatorClient } from "./btw-calculator-client";

export const metadata: Metadata = {
  title: "BTW calculator — bereken BTW snel en gratis",
  description:
    "Bereken het BTW-bedrag bij een prijs (21%, 9% of 0%). Switch tussen excl. ↔ incl. BTW. Gratis, geen account, direct in je browser."
};

export default function BtwCalculatorPage() {
  return <BtwCalculatorClient />;
}
