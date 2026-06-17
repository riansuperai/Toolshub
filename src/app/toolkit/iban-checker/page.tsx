import type { Metadata } from "next";
import { IbanCheckerClient } from "./iban-checker-client";

export const metadata: Metadata = {
  title: "IBAN checker — controleer of een rekeningnummer klopt",
  description:
    "Controleer of een IBAN-nummer (Nederlands of internationaal) geldig is. Herkent direct de bank. Gratis, geen account, direct in je browser."
};

export default function IbanCheckerPage() {
  return <IbanCheckerClient />;
}
