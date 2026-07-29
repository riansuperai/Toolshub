import type { Metadata } from "next";
import { Globe } from "lucide-react";
import { ServicePage, type ServicePageData } from "@/components/service-page";

export const metadata: Metadata = {
  title: "Website laten maken — custom Next.js door Hazenco",
  description:
    "Een custom Next.js-website die snel laadt, converteert en meegroeit. Wij bouwen, hosten en onderhouden — geen builders, geen plugin-drama."
};

const data: ServicePageData = {
  eyebrow: "Webdesign",
  title: "Een website die je bedrijf serieus laat ogen.",
  lead:
    "Custom Next.js-sites die snel laden, converteren en meegroeien. Wij bouwen, hosten en onderhouden — jij hoeft je niet druk te maken over builders, plugins of hosting.",
  intro:
    "De meeste MKB-websites zijn een compromis tussen wat een template kan en wat een ondernemer eigenlijk wil. Wij bouwen custom — dezelfde stack die grote SaaS-bedrijven gebruiken (Next.js, TypeScript, Vercel/eigen VPS). Dat is niet duurder dan een goede WordPress-build met alle plugins, en het levert een site op die daadwerkelijk snel is, veilig blijft en niet omvalt bij een update.",
  wat: {
    heading: "Wat er onder de motorkap zit",
    items: [
      {
        title: "Volledig op maat",
        text: "Geen builder, geen template. Elke pagina precies zoals jij 'm wilt — inclusief dark mode als je dat wilt."
      },
      {
        title: "Snel op elk apparaat",
        text: "Sub-100ms page-load op mobiel én desktop. Google's Core Web Vitals in het groen vanaf dag 1."
      },
      {
        title: "SEO-fundament",
        text: "Correcte meta-tags, sitemap.xml, robots.txt, Open Graph — geen los SEO-plugin nodig."
      },
      {
        title: "Hosting & SSL inbegrepen",
        text: "Wij regelen hosting op onze eigen VPS of Vercel, SSL-certificaten, backups. Geen aparte facturen."
      },
      {
        title: "Contactformulier + integraties",
        text: "Resend voor betrouwbare e-mail. Cookie-consent + Google Analytics 4. WhatsApp-integratie."
      },
      {
        title: "Onderhoud & support",
        text: "Wij zijn je vaste contact. Bugfixes, kleine wijzigingen en updates worden binnen 1-2 werkdagen opgelost."
      }
    ]
  },
  proces: {
    heading: "Van gesprek tot live in 2-4 weken",
    steps: [
      {
        title: "Intake (30 min)",
        text: "We bespreken wat je nu hebt, wat je zoekt, en welke pagina's essentieel zijn. Meestal met screen-share."
      },
      {
        title: "Wireframes + copy-strategie (week 1)",
        text: "Structuur, opbouw en tekst-strategie per pagina. Jij levert de inhoud (of laat 'm door ons schrijven, tegen extra vergoeding)."
      },
      {
        title: "Design + build (week 2-3)",
        text: "We bouwen direct in code — geen Figma-mock die daarna nog vertaald moet worden. Je krijgt een preview-link waar je continu op kunt reageren."
      },
      {
        title: "Testen, launch en meten (week 3-4)",
        text: "Mobile testen, formulieren testen, Analytics + Search Console koppelen. Dan live."
      }
    ]
  },
  prijs: {
    heading: "Twee manieren om het te doen",
    lead: "Eenmalige investering of maandelijkse partnership — kies wat past bij je cashflow.",
    packages: [
      {
        name: "Eenmalig",
        price: "vanaf € 1.425",
        text: "Eenmalige investering, oplevering binnen 2-4 weken. Hosting en onderhoud daarna apart per maand (€49/mnd).",
        primary: false
      },
      {
        name: "All-in maandelijks",
        price: "vanaf € 89",
        period: "/mnd",
        text: "Setup, hosting, updates, backups, security en support — allemaal inbegrepen. Vanaf 24 maanden.",
        primary: true
      }
    ],
    note: "Definitieve prijs hangt af van aantal pagina's, integraties en of je content zelf aanlevert."
  },
  cases: {
    heading: "Wat we voor anderen bouwden",
    items: [
      {
        result: "Sub-100ms pageload",
        title: "Deze site zelf",
        text: "Custom Next.js 16, dark mode, mobiel-first, SEO-clean. Wat je hier ziet is wat je kunt krijgen."
      },
      {
        result: "TechPanda.nl",
        title: "Volledige e-commerce build",
        text: "Onze eigen B2C IT-webshop draait op dezelfde stack. Product-catalogus, checkout, Mollie-integratie, dagelijkse backups."
      },
      {
        result: "3 dagen live",
        title: "Blogstudio-demo",
        text: "Content-heavy site met Jinja-templates en real-time updates. Van intake tot live binnen 3 dagen."
      }
    ]
  },
  faq: [
    {
      q: "Waarom custom en niet WordPress of Webflow?",
      a: "WordPress is 20 jaar oud en heeft plugins nodig voor alles — die worden je grootste onderhoudsprobleem. Webflow is te beperkt zodra je iets custom wilt (integraties, formulieren met logica, meertalig). Custom Next.js kost nauwelijks meer bij oplevering, en veel minder in onderhoud."
    },
    {
      q: "Kan ik zelf de content aanpassen?",
      a: "Ja — we bouwen een lightweight admin-panel of gebruiken een CMS (Sanity of Contentful) als je regelmatig content wilt bijwerken. Voor sites die niet vaak veranderen, doen we tekstwijzigingen zelf binnen 1-2 werkdagen."
    },
    {
      q: "Hoe zit het met mijn bestaande SEO?",
      a: "Als je van een oude site komt, maken we een redirect-map zodat al je bestaande URLs behouden blijven of correct doorverwezen worden naar de nieuwe pagina's. Rankings blijven zo intact."
    },
    {
      q: "Wat als de site down gaat?",
      a: "Wij zijn 24/7 bereikbaar via een monitoring-alert. Onze VPS heeft 99.9% uptime SLA. Voor kritieke sites hebben we een backup-server als fallback."
    }
  ]
};

export default function WebdesignPage() {
  return <ServicePage data={data} icon={Globe} />;
}
