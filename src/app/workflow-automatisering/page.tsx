import type { Metadata } from "next";
import { Workflow } from "lucide-react";
import { ServicePage, type ServicePageData } from "@/components/service-page";

export const metadata: Metadata = {
  title: "Workflow-automatisering, bedrijfsprocessen automatiseren | Hazenco",
  description:
    "Van handmatig Excel-werk naar systemen die vanzelf lopen. Wij bouwen custom tools die integreren met je bestaande stack en meetbaar tijd besparen."
};

const data: ServicePageData = {
  eyebrow: "Workflow-automatisering",
  title: "Van handmatig werk naar systemen die vanzelf lopen.",
  lead:
    "We bouwen custom tools die integreren met wat je al hebt, Magento, WordPress, Google Workspace, boekhoudpakketten, en meetbaar tijd besparen voor jou en je team.",
  intro:
    "Veel MKB'ers weten precies welke handmatige klussen dagelijks tijd kosten: orderstatussen kopiëren, voorraad synchroniseren, cross-sell instellen, m²-berekeningen doen voor klanten, contracten samenvoegen. Wij bouwen daar precies één tool voor die dat werk overneemt. Geen no-code lock-in, geen abonnements-hell, echte custom software die precies past bij hoe jouw processen lopen.",
  wat: {
    heading: "Wat we hebben gebouwd en kunnen bouwen",
    items: [
      {
        title: "Custom Magento-modules",
        text: "Cart popups, m²-calculators, cross-sell logic, price-tool sync, allemaal draaien nu bij shops."
      },
      {
        title: "Product management-systeem",
        text: "Complete back-office voor productbeheer, orderverwerking, sales-dashboard. Cross-store synchronisatie."
      },
      {
        title: "Integraties tussen tools",
        text: "Google Calendar ↔ WooCommerce, WhatsApp ↔ CRM, boekhouding ↔ e-commerce. Wij verbinden alles."
      },
      {
        title: "Bulk-verwerkingstools",
        text: "CSV-import, PDF-generatie, batch-updates, export naar meerdere formaten. Werk dat uren kost binnen minuten."
      },
      {
        title: "Custom dashboards",
        text: "Real-time inzicht in wat er in je bedrijf gebeurt. Alleen de cijfers die er voor jou toe doen."
      },
      {
        title: "Onderhoud + doorontwikkeling",
        text: "We stoppen niet bij oplevering. Kleine wijzigingen, nieuwe features, integraties: doorlopend."
      }
    ]
  },
  proces: {
    heading: "Van pijnpunt tot draaiende oplossing",
    steps: [
      {
        title: "Analyse (1-2 uur)",
        text: "We komen langs (of doen een screen-share) en kijken samen naar het proces. Waar zit de bottleneck, wat kost tijd, wat is de kern van de klus."
      },
      {
        title: "Voorstel + demo (week 1)",
        text: "We bouwen binnen een week een klikbare demo of proof-of-concept. Je ziet direct hoe de oplossing gaat werken, voor we serieus geld uitgeven."
      },
      {
        title: "Build + integraties (2-4 weken)",
        text: "We bouwen de tool en koppelen 'm aan je bestaande systemen. Testen met echte data, geen fake demo's."
      },
      {
        title: "Livegang + training",
        text: "We rollen 'm uit met jou erbij, trainen je team in 30-60 minuten, en zijn de eerste 2 weken extra bereikbaar."
      }
    ]
  },
  prijs: {
    heading: "Investering afhankelijk van scope",
    lead: "Elke automatisering is anders. Twee typische pakketten:",
    packages: [
      {
        name: "Enkelvoudige tool",
        price: "€ 2.500 – € 8.000",
        text: "Eén specifieke tool met beperkte integraties. Bijvoorbeeld een m²-calculator of cross-sell popup. Setup + eerste 3 maanden support.",
        primary: false
      },
      {
        name: "Systeem-partnership",
        price: "vanaf € 149",
        period: "/mnd",
        text: "Voor bedrijven met meerdere processen. Doorlopend onderhoud, nieuwe features, integraties, alles inbegrepen. Setup vanaf € 2.500.",
        primary: true
      }
    ],
    note: "We bespreken concreet in de intake wat het voor jouw situatie kost, geen ongepersonaliseerde prijslijsten."
  },
  cases: {
    heading: "Voorbeelden van live projecten",
    items: [
      {
        result: "60% minder telefoontjes",
        title: "m²-calculator voor tegelshop",
        text: "SanitairSuperShop: klanten voeren m² in, systeem berekent dozen + prijs. Klantenservice kreeg 60% minder 'hoeveel dozen voor X?' telefoontjes."
      },
      {
        result: "AOV +32%",
        title: "Cross-sell popup voor Magento",
        text: "AOV steeg van €167 naar €221 in 6 weken. €25k extra maandelijkse omzet uit dezelfde bezoekers."
      },
      {
        result: "Uren bespaard/week",
        title: "Product Management back-office",
        text: "Complete admin voor productbeheer, orderverwerking en sales. Team bespaart dagelijks uren aan Excel + copy-paste werk."
      }
    ]
  },
  faq: [
    {
      q: "Ik gebruik Zapier / Make, is dit hetzelfde?",
      a: "Nee. Zapier is handig voor simpele koppelingen, maar zodra je logica complex wordt (voorwaarden, custom UI, real-time), wordt Zapier duur én traag. Custom is dan sneller, betrouwbaarder en meestal goedkoper op lange termijn."
    },
    {
      q: "Wat als het proces later verandert?",
      a: "Systeem-partnership klanten mailen ons gewoon, we passen 't aan. Voor eenmalige projecten geldt een uurtarief voor wijzigingen, of je switcht naar het maandelijkse pakket."
    },
    {
      q: "Werkt dit ook voor 1 persoon of alleen grotere bedrijven?",
      a: "Beide. Sommige klanten zijn ZZP'ers met 1 specifieke pijnpunt (bijv. offerte-generator), andere zijn bedrijven met 50 medewerkers en meerdere processen tegelijk."
    }
  ]
};

export default function WorkflowAutomatiseringPage() {
  return <ServicePage data={data} icon={Workflow} />;
}
