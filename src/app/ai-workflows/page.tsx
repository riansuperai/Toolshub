import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ServicePage, type ServicePageData } from "@/components/service-page";

export const metadata: Metadata = {
  title: "AI-workflows & integraties, slimme agents voor je bedrijf | Hazenco",
  description:
    "Nederlandse AI-agents die met je klanten praten. Telefoonbot, WhatsApp-chatbot, review-responder, online afsprakensysteem. In jouw toon-of-voice, 24/7 aan."
};

const data: ServicePageData = {
  eyebrow: "AI-workflows & integraties",
  title: "AI-agents die écht werk voor je doen.",
  lead:
    "Nederlandse AI-workflows die met jouw klanten praten, via telefoon, WhatsApp, e-mail of chat. In jouw toon-of-voice, 24/7 aan, escalatie naar mens waar nodig.",
  intro:
    "AI voor MKB is inmiddels volwassen. Een goed geconfigureerde telefoonbot beantwoordt 70% van de veel-voorkomende vragen zelfstandig. Een WhatsApp-chatbot met jouw kennisbank kan een groot deel van je klantenservice overnemen. Een reviews-responder houdt je Google-profiel actief zonder dat jij er dagelijks tijd in stopt. Wij zetten deze workflows op, inclusief training, integraties en het intelligent doorzetten naar een echte medewerker wanneer nodig.",
  wat: {
    heading: "Wat we voor klanten hebben opgezet",
    items: [
      {
        title: "AI Telefoonassistent",
        text: "Vervangt of ondersteunt je receptioniste. Neemt aan, kwalificeert, plant afspraken in Google Calendar."
      },
      {
        title: "WhatsApp Business Chatbot",
        text: "Beantwoordt product- en dienst-vragen op basis van jouw kennisbank. Doorschakel naar mens bij complexe vragen."
      },
      {
        title: "Google Reviews AI-responder",
        text: "Reageert automatisch op reviews in jouw toon, escaleert negatieve reviews naar jou voor persoonlijke reactie."
      },
      {
        title: "Online Afsprakensysteem",
        text: "Amelia-alternatief zonder plugin-drama. Klanten boeken zelf, jij ziet 't in je agenda. Herinneringen automatisch."
      },
      {
        title: "AI-integraties op maat",
        text: "OpenAI, Claude, Whisper, HuggingFace, we koppelen wat het beste past aan jouw stack."
      },
      {
        title: "Onderhoud + fine-tuning",
        text: "AI is niet 'zet 'm aan en klaar'. We monitoren, updaten de kennisbank, fine-tunen op basis van echte gesprekken."
      }
    ]
  },
  proces: {
    heading: "Van idee tot draaiende agent",
    steps: [
      {
        title: "Use-case verkennen (30 min)",
        text: "Waar ligt de meeste tijdsbesparing? Wat wil je dat de agent wél en niet doet? Wat is het escalatie-punt?"
      },
      {
        title: "Kennisbank + persona opzetten (week 1)",
        text: "We vertalen jouw diensten, prijzen, FAQ en toon-of-voice naar een AI-configuratie. Je krijgt eerst een test-omgeving."
      },
      {
        title: "Integraties + training (week 2-3)",
        text: "Koppeling aan telefoon/WhatsApp/mail. Fine-tuning met echte voorbeeld-gesprekken. Escalatie-flow instellen."
      },
      {
        title: "Live in schaduw-modus (week 3)",
        text: "Agent draait mee met echte gesprekken maar antwoordt nog niet. Je ziet wat 'ie zou zeggen, geeft feedback, we tunen."
      },
      {
        title: "Livegang + monitoring",
        text: "Volledig live. Wij houden de eerste 4 weken dagelijks een oogje op de kwaliteit en tunen bij."
      }
    ]
  },
  prijs: {
    heading: "Vanaf een paar honderd euro per maand",
    lead: "All-in modellen, setup, hosting, AI-credits, updates.",
    packages: [
      {
        name: "Eén AI-workflow",
        price: "vanaf € 149",
        period: "/mnd",
        text: "Bijvoorbeeld alleen een telefoonassistent of alleen een WhatsApp-chatbot. Setup inbegrepen, minimum 12 maanden.",
        primary: false
      },
      {
        name: "AI-suite (2-3 workflows)",
        price: "vanaf € 299",
        period: "/mnd",
        text: "Meerdere workflows die met elkaar praten. Bijvoorbeeld telefoon + WhatsApp + reviews responder, in één beheeromgeving.",
        primary: true
      }
    ],
    note: "Volume van gesprekken bepaalt de definitieve prijs. Bij hogere volumes gaat de prijs per gesprek omlaag."
  },
  cases: {
    heading: "Actief bij klanten",
    items: [
      {
        result: "24/7 bereikbaar",
        title: "AI Telefoonassistent Kapsalon",
        text: "Neemt op wanneer de eigenaar bezig is met klanten. Kwalificeert nieuwe afspraken, plant direct in Google Calendar."
      },
      {
        result: "80% afgehandeld",
        title: "WhatsApp Chatbot webshop",
        text: "80% van klantvragen wordt door de bot afgehandeld. Complexe vragen (retour, garantie) worden netjes doorgezet."
      },
      {
        result: "0 gemiste reviews",
        title: "Reviews-responder Brasserie",
        text: "Elke review krijgt binnen een uur een persoonlijke reactie. Negatieve reviews escaleren direct naar de eigenaar."
      }
    ]
  },
  faq: [
    {
      q: "Klinkt de AI niet nep?",
      a: "De huidige generatie (GPT-4/Claude) is écht niet te onderscheiden van een goed getrainde medewerker voor 90% van de gesprekken. Wij testen dat expliciet in de schaduw-modus voordat je live gaat. Als je in twijfel bent, luister eerst een demo-gesprek."
    },
    {
      q: "Wat als de AI iets fout zegt?",
      a: "Alle gesprekken worden opgeslagen. Wij monitoren de eerste weken dagelijks, jij kunt achteraf altijd terugluisteren/lezen. Verkeerde antwoorden worden meteen gefixt via een update aan de kennisbank."
    },
    {
      q: "Is dit AVG-proof?",
      a: "Ja. Wij gebruiken EU-hosting voor alle klantdata, hebben verwerkersovereenkomsten met alle AI-leveranciers, en anonimiseren gesprekken voor training. Volledige AVG-audit-trail beschikbaar."
    },
    {
      q: "Kan de AI ook in het Engels?",
      a: "Ja, meertalig (NL, EN, DE) is standaard. Sommige klanten draaien 'm ook in het Fries of dialect als de doelgroep dat spreekt."
    }
  ]
};

export default function AiWorkflowsPage() {
  return <ServicePage data={data} icon={Sparkles} />;
}
