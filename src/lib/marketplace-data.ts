import type {
  Branche,
  Category,
  DeliveryMode,
  Listing,
  MarketplaceState,
  ProductType,
  Review,
  SellerProfile,
  UseCase,
  UserProfile
} from "./types";

export const productTypeLabels: Record<ProductType, string> = {
  workflow: "Automation workflow",
  ai_agent: "AI agent",
  plugin: "Plugin",
  extension: "Extensie",
  skill: "Skill",
  theme: "Theme",
  template: "Template",
  service_package: "Servicepakket"
};

export const useCaseLabels: Record<UseCase, string> = {
  crm: "CRM",
  chatbot: "Chatbot",
  ecommerce: "E-commerce",
  marketing: "Marketing",
  data_integration: "Data integratie",
  project_management: "Project management",
  email_marketing: "E-mail marketing",
  social_media: "Social media",
  analytics: "Analytics",
  lead_generation: "Lead generation",
  customer_support: "Customer support",
  workflow_automation: "Workflow automation",
  form_builder: "Form builder",
  payment_processing: "Payment processing",
  inventory: "Inventory",
  other: "Other"
};

export const deliveryModeLabels: Record<DeliveryMode, string> = {
  download: "Direct downloaden",
  cloud: "Cloud / SaaS",
  custom: "Maatwerk service"
};

export const deliveryModeShort: Record<DeliveryMode, string> = {
  download: "Bestanden + docs",
  cloud: "Gehoste oplossing",
  custom: "Setup door creator"
};

export const brancheLabels: Record<Branche, string> = {
  general: "Algemeen",
  retail: "Retail & E-commerce",
  horeca: "Horeca",
  construction: "Bouw & Installatie",
  healthcare: "Zorg & Welzijn",
  financial: "Financiële dienstverlening",
  marketing_media: "Marketing & Media",
  ict: "ICT & SaaS",
  logistics: "Logistiek & Transport",
  professional_services: "Professionele dienstverlening",
  education: "Onderwijs",
  government: "Overheid"
};

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2
  }).format(cents / 100);
}

export function today(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString();
}

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

const screenshotTemplates: Record<ProductType, string[]> = {
  workflow: ["Trigger setup", "Stappen overzicht", "Mapping detail", "Test run", "Logs & monitoring"],
  ai_agent: ["Input scherm", "AI verwerking", "Output preview", "Trainingsdata", "Geschiedenis"],
  plugin: ["Installatie", "Instellingen", "Dashboard", "Detail weergave", "Logs"],
  extension: ["Browser interface", "Configuratie", "Acties menu", "Sync status", "Geschiedenis"],
  skill: ["Skill input", "Verwerking", "Output", "Instellingen", "Statistieken"],
  theme: ["Homepage", "Dashboard", "Detailpagina", "Mobiele weergave", "Componenten"],
  template: ["Overzicht", "Detail view", "Aanpassingen", "Export opties", "Voorbeelden"],
  service_package: ["Intake", "Plan overzicht", "Voortgang", "Communicatie", "Oplevering"]
};

export function generateMockScreenshots(title: string, type: ProductType): string[] {
  const base = screenshotTemplates[type] ?? screenshotTemplates.workflow;
  const firstWord = title.split(/\s+/)[0] ?? "";
  return base.map((label, index) => (index === 0 && firstWord.length > 2 ? `${firstWord} ${label.toLowerCase()}` : label));
}

export const categories: Category[] = [
  {
    id: "cat_workflows",
    name: "Workflows",
    description: "Kant-en-klare n8n, Make en Zapier flows voor dagelijkse processen.",
    type: "workflow",
    accent: "#F26B1D"
  },
  {
    id: "cat_agents",
    name: "AI agents",
    description: "Slimme agents voor support, sales, data en documenttaken.",
    type: "ai_agent",
    accent: "#324A6D"
  },
  {
    id: "cat_plugins",
    name: "Plugins",
    description: "Uitbreidingen voor CMS, webshop en bedrijfssoftware.",
    type: "plugin",
    accent: "#3D8B5F"
  },
  {
    id: "cat_extensions",
    name: "Extensies",
    description: "Browser-, platform- en workflow-extensies voor teams.",
    type: "extension",
    accent: "#1A3C2E"
  },
  {
    id: "cat_skills",
    name: "Skills",
    description: "Herbruikbare AI- en automation skills voor moderne teams.",
    type: "skill",
    accent: "#C2540E"
  },
  {
    id: "cat_themes",
    name: "Themes",
    description: "Professionele themes voor webshops, portals en dashboards.",
    type: "theme",
    accent: "#6B8070"
  },
  {
    id: "cat_templates",
    name: "Templates",
    description: "Notion, Airtable, dashboard en documenttemplates.",
    type: "template",
    accent: "#FA893D"
  },
  {
    id: "cat_services",
    name: "Servicepakketten",
    description: "Setup, optimalisatie en onderhoud door geverifieerde builders.",
    type: "service_package",
    accent: "#1C244B"
  }
];

export const demoUsers: UserProfile[] = [
  {
    id: "user_visitor",
    name: "Bezoeker",
    email: "",
    role: "visitor",
    savedListings: []
  },
  {
    id: "user_buyer",
    name: "Nudi Buyer",
    email: "koper@hazenco.nl",
    role: "buyer",
    savedListings: [],
    phone: "+31 6 12 34 56 78",
    company: "Nudi Zaken",
    vatNumber: "NL123456789B01",
    billingAddress: {
      street: "Spuistraat 12",
      postalCode: "1012 AB",
      city: "Amsterdam",
      country: "Nederland"
    },
    language: "nl",
    newsletter: true,
    joinedAt: today(-180)
  },
  {
    id: "user_seller",
    name: "Hazenco Studio",
    email: "seller@hazenco.nl",
    role: "seller",
    sellerId: "seller_hazenco",
    savedListings: [],
    phone: "+31 20 555 12 34",
    company: "Hazenco Studio B.V.",
    vatNumber: "NL987654321B01",
    billingAddress: {
      street: "Keizersgracht 88",
      postalCode: "1015 CV",
      city: "Amsterdam",
      country: "Nederland"
    },
    language: "nl",
    newsletter: true,
    joinedAt: today(-365)
  },
  {
    id: "user_admin",
    name: "Hazenco Admin",
    email: "admin@hazenco.nl",
    role: "admin",
    savedListings: [],
    phone: "+31 20 555 99 00",
    language: "nl",
    newsletter: false,
    joinedAt: today(-500)
  }
];

export const sellers: SellerProfile[] = [
  {
    id: "seller_hazenco",
    userId: "user_seller",
    name: "Hazenco Studio",
    handle: "hazenco-studio",
    status: "approved",
    specialty: "Procesautomatisering en webshops",
    bio: "Een klein Nederlands team dat automatiseringen begrijpelijk, veilig en onderhoudbaar maakt.",
    location: "Amsterdam, Nederland",
    rating: 4.9,
    sales: 148,
    responseTime: "Binnen 4 uur",
    verified: true,
    website: "https://hazenco.nl",
    supportEmail: "support@hazenco.nl",
    vatNumber: "NL987654321B01",
    payoutMethod: "SEPA · NL12 RABO 0123 4567 89",
    joinedAt: today(-365)
  },
  {
    id: "seller_dataflow",
    userId: "user_seller_dataflow",
    name: "Dataflow Noord",
    handle: "dataflow-noord",
    status: "approved",
    specialty: "Data, reporting en finance automations",
    bio: "Bouwt betrouwbare datakoppelingen voor mkb-bedrijven met veel losse systemen.",
    location: "Groningen, Nederland",
    rating: 4.7,
    sales: 89,
    responseTime: "Binnen 1 werkdag",
    verified: true,
    website: "https://dataflow-noord.nl",
    supportEmail: "hello@dataflow-noord.nl",
    payoutMethod: "SEPA",
    joinedAt: today(-280)
  },
  {
    id: "seller_frontkit",
    userId: "user_seller_frontkit",
    name: "FrontKit EU",
    handle: "frontkit-eu",
    status: "approved",
    specialty: "Themes, portals en component packs",
    bio: "Maakt rustige, snelle UI-pakketten voor portals, SaaS en servicebedrijven.",
    location: "Gent, Belgie",
    rating: 4.8,
    sales: 112,
    responseTime: "Binnen 6 uur",
    verified: true,
    website: "https://frontkit.eu",
    supportEmail: "hello@frontkit.eu",
    payoutMethod: "SEPA",
    joinedAt: today(-220)
  }
];

export const listings: Listing[] = [
  {
    id: "listing_website_laten_maken",
    sellerId: "seller_hazenco",
    title: "Website laten maken",
    slug: "website-laten-maken",
    tagline: "Professionele website binnen weken, zonder gedoe en zonder verborgen kosten.",
    description:
      "Een professionele website is in 2026 geen luxe meer, het is de basis van je vindbaarheid, je geloofwaardigheid en je conversie. Toch blijft het voor veel ondernemers een terugkerend hoofdpijndossier. Welke builder kies je? Wie verzorgt de hosting? Wat als de site op een vrijdagmiddag offline gaat? En wie houdt de plugins up-to-date?\n\nDaar komen wij in beeld. **Hazenco ontzorgt je volledig van A tot Z**, zodat jij je tijd en aandacht kan steken in waar je écht goed in bent: ondernemen.\n\n**Een website die je bedrijf laat opvallen**\n\nWe ontwerpen en bouwen websites die niet alleen mooi zijn, maar ook werken. Conversie-gericht, mobiel-vriendelijk, snel ladend en klaar voor zoekmachines. Geen standaard template-werk dat je tien keer eerder hebt gezien, maar een ontwerp dat past bij jouw merk, jouw doelgroep en jouw doelen. Of je nu een ZZP'er bent die professioneel wil ogen, een MKB-ondernemer met een verouderde site die niet meer presteert, of een starter die geloofwaardig live wil, wij maken het mogelijk.\n\n**Twee manieren om met ons aan de slag te gaan**\n\nBij Hazenco geloven we in transparantie. Daarom hebben we geen ingewikkelde offertes, geen verborgen kosten en geen kleine lettertjes. Je kiest tussen twee duidelijke pakketten.\n\nHet *Eenmalig*-pakket is voor ondernemers die liever in één keer afrekenen. Voor €1.425 krijg je een complete website opgeleverd binnen enkele weken, inclusief professioneel ontwerp, conversie-gerichte structuur, basis-SEO en een korte training zodat je zelf inhoud kunt aanpassen. Hosting en onderhoud regel je zelf of nemen we apart van je over.\n\nHet *All-in abonnement* is voor wie écht ontzorgd wil worden. Voor €89 per maand (vanaf 24 maanden) regelen wij álles: ontwerp, bouw, premium hosting, dagelijkse backups, SSL-certificaat, plugin- en core-updates, security monitoring en directe support. Geen onverwachte rekeningen, geen technische verrassingen, geen midnight-paniek over een gehackte site. Eén vast bedrag per maand en wij houden de zaak draaiend.\n\n**Wat ons anders maakt**\n\nWe zijn geen anonieme webbouwer met een ticketsysteem waar je vraag in de wachtrij verdwijnt. Bij Hazenco krijg je één vast aanspreekpunt, iemand die jou en je bedrijf kent. Een WhatsApp-bericht, een belletje of een mailtje: je hoort dezelfde dag iets terug, niet pas over twee weken.\n\nWe werken iteratief en betrekken je actief bij het proces. Je krijgt drie ontwerprondes om de site precies zo te krijgen als je voor je ziet. We praten in gewone taal, niet in jargon. En we leveren binnen weken, niet binnen maanden.\n\n**Snel, veilig en altijd up-to-date**\n\nEen website is geen statisch ding dat je eenmalig oplevert en vergeet. Plugins krijgen updates, security-patches komen uit, technologie verandert. Met het abonnement nemen we dat continu voor je over. Dagelijkse backups betekenen dat zelfs als er iets misgaat, we binnen minuten weer live zijn. Premium hosting betekent dat je site snel laadt, belangrijk voor zowel je bezoekers als Google.\n\n**Klaar om te starten?**\n\nOf je nu vandaag begint met je eerste website, of jouw bestaande site een tweede leven wil geven, we denken graag met je mee. Geen agressieve verkoop, geen lange verkoopgesprekken en geen verplichtingen vooraf. Je vertelt ons wat je nodig hebt, wij leggen uit wat past, jij kiest.\n\nEen professionele online aanwezigheid hoeft geen hoofdpijn te zijn. Met Hazenco regel je het in één keer goed, en hou je je hoofd vrij voor je echte werk.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["marketing", "lead_generation"],
    branches: ["general", "professional_services", "retail"],
    heroImageUrl: "/listings/website-laten-maken.png",
    screenshotUrls: [],
    priceCents: 142500,
    setupPriceCents: 0,
    status: "published",
    featured: true,
    compatibility: ["WordPress", "WooCommerce", "Elementor"],
    tags: ["Website", "Webdesign", "Hosting", "SEO", "MKB"],
    deliveryModes: ["custom"],
    files: [],
    demo: {
      url: "",
      screenshots: [],
      instructions: "",
      credentials: [],
      sampleInput: ""
    },
    downloads: 0,
    sales: 47,
    rating: 4.9,
    reviewCount: 18,
    version: "",
    createdAt: today(-180),
    updatedAt: today(-7),
    supportIncluded: "30 dagen nazorg + optioneel doorlopend",
    listingKind: "service",
    forWho: [
      "ZZP'ers die professioneel willen ogen zonder zelf te bouwen",
      "MKB-ondernemers met een verouderde site die niet meer converteert",
      "Starters die snel live willen met een geloofwaardige basis"
    ],
    included: [
      {
        icon: "shield-check",
        title: "Security & SSL",
        description: "Veilige hosting met automatische SSL-certificaten."
      },
      {
        icon: "database-export",
        title: "Dagelijkse backups",
        description: "Automatische backups, herstel binnen enkele klikken."
      },
      {
        icon: "refresh",
        title: "Updates & onderhoud",
        description: "Plugin- en core-updates worden voor je geregeld."
      },
      {
        icon: "headset",
        title: "Direct support",
        description: "Eén vast aanspreekpunt, snel antwoord per WhatsApp of mail."
      }
    ],
    cases: [
      {
        clientName: "Badkamerwandbekleding",
        label: "Website All-in",
        tag: "MKB · Website",
        benefit:
          "Stijlvolle website voor een leverancier van wandpanelen. Bezoekers kunnen het volledige assortiment bekijken en direct een afspraak inplannen voor montage aan huis.",
        highlights: [
          "Online afspraken inplannen, zonder bellen",
          "Assortiment volledig zichtbaar op mobiel"
        ],
        tone: "dark",
        imageUrl: "/listings/case-oppervlakten.webp",
        url: "https://badkamerwandbekleding.nl"
      },
      {
        clientName: "Civitas advies",
        label: "Website All-in",
        tag: "MKB · Website",
        benefit:
          "Professionele website voor een adviesbureau gespecialiseerd in infrastructuur en openbare ruimte. Van ruimtelijke ontwikkeling tot asset management, alles overzichtelijk gepresenteerd.",
        highlights: [
          "Werkgebieden en diensten helder in kaart",
          "Portfolio direct vindbaar voor opdrachtgevers"
        ],
        tone: "light",
        imageUrl: "/listings/case-infrastructuur.webp",
        url: "https://civitas-advies.nl"
      },
      {
        clientName: "Magdatwel.nl",
        label: "Website Blog",
        tag: "MKB · Website",
        benefit:
          "Juridische blogwebsite waar mensen op een toegankelijke manier leren wat wel en niet mag. Weetjes, nieuws en actuele onderwerpen, begrijpelijk geschreven voor iedereen.",
        highlights: [
          "Juridische info zonder vakjargon",
          "Volledig klaar voor zoekmachines, SEO-proof"
        ],
        tone: "peach",
        imageUrl: "/listings/case-dashboard.webp",
        url: "https://magdatwelonline.nl"
      }
    ],
    servicePricing: {
      externalUrl: "https://hazenco.nl/website-laten-maken/",
      oneTime: {
        priceCents: 142500,
        originalPriceCents: 229500,
        description: "Eenmalige betaling, oplevering binnen weken. Hosting en onderhoud apart."
      },
      subscription: {
        priceCentsPerMonth: 8900,
        originalPriceCentsPerMonth: 12900,
        minMonths: 24,
        description: "Hosting, updates, backups, security en support inbegrepen."
      },
      highlight: "subscription",
      usps: [
        "1 vast aanspreekpunt",
        "Geen verborgen kosten",
        "Oplevering binnen enkele weken"
      ]
    },
    serviceMeta: {
      duration: "2–4 weken",
      revisions: "3 ontwerprondes",
      supportPeriod: "30 dagen nazorg"
    }
  },
  {
    id: "listing_ai_telefoonassistent",
    sellerId: "seller_hazenco",
    title: "AI Telefoonassistent",
    slug: "ai-telefoonassistent",
    tagline:
      "Mis nooit meer een klant. AI belt terug binnen 30 seconden en plant direct afspraken in.",
    description:
      "Een gemiste telefoon is een gemiste klant. En als kapper, garagehouder, tandarts of klusbedrijf weet je dat 30 tot 40% van inkomende calls onbeantwoord blijft, simpelweg omdat je handen vol zitten. De meeste van die mensen bellen geen tweede keer. Ze kiezen je concurrent.\n\nDe **AI Telefoonassistent** vangt dat op. Geen voicemail die niemand afluistert, geen receptionist die je 500 euro per maand kost. Een natuurlijk klinkende Nederlandstalige AI die binnen 30 seconden terugbelt, het probleem begrijpt, en direct een afspraak in je agenda zet.\n\n**Hoe het werkt**\n\nWe verbinden onze AI met je bestaande telefoonnummer (geen nieuw nummer, geen overschakeling voor jouw klanten). Mis je een oproep? Binnen 30 seconden belt de AI de beller terug, stelt zich voor namens jouw bedrijf, vraagt waar 'ie mee kan helpen, en plant direct in. Heeft 'ie geen ruimte in de agenda? Dan biedt 'ie 2-3 alternatieven aan. Wil de klant terugbel-verzoek? Dan zet 'ie dat in je systeem en stuurt je een Slack of WhatsApp-notificatie.\n\n**Voor wie werkt dit echt**\n\nKappers en schoonheidssalons, garages, tandartsen, fysiotherapeuten, schoonmaakbedrijven, klusbedrijven, advocatenkantoren, eigenlijk elk MKB waar de telefoon een verkoopkanaal is maar waar mensen al druk zijn met klanten in de zaak. Het breekpunt voor ROI ligt op zo'n 5 gemiste calls per week, daarboven verdien je 'm in de eerste maand terug.\n\n**Wat onze AI niet probeert**\n\nWe doen niet alsof het een mens is. Aan het begin van het gesprek zegt 'ie netjes: \"Hoi, je spreekt met de digitale assistent van Kapsalon X. Hoe kan ik je helpen?\" Klanten waarderen dat eerlijker dan iemand die doet alsof. En als de vraag te complex wordt (klacht, juridisch, gevoelig) escaleert de AI direct naar een echte terugbel-flow.\n\n**Setup en integratie**\n\nWij regelen alles. Binnen 5-7 werkdagen ben je live. We koppelen aan je telefoonprovider, leren de AI jouw bedrijfstoon, vullen 'm met jouw diensten + prijzen + openingstijden, en testen samen voordat 'ie écht klanten gaat woord-staan. Daarna doorlopend onderhoud: nieuwe diensten toevoegen, prijzen aanpassen, scripts bijschaven, allemaal zonder dat jij iets hoeft te doen.\n\n**Wat je krijgt naast de bot zelf**\n\nElke ochtend een dagrapport in je mail of Slack: wie belde, wat ze wilden, welke afspraken zijn ingepland, welke klachten escaleerden. Plus een dashboard waar je real-time kan zien wat er gebeurt. En een transcript per gesprek, mocht je iets willen nalezen.\n\n**Ook in andere talen**\n\nNederlands is standaard, maar Engels, Duits en Frans kunnen we erbij activeren als je internationale klanten hebt, €25/mnd per extra taal.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. Wij laten zien hoe het werkt, je hoort een echte voorbeeldgesprek (geen demo-acteur), en je krijgt een concrete inschatting van wat het voor jouw situatie betekent. Geen verkoopgesprek, gewoon laten zien wat het doet en jou laten beslissen.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["customer_support", "lead_generation", "workflow_automation"],
    branches: ["healthcare", "professional_services", "retail", "horeca", "general"],
    heroImageUrl: "",
    screenshotUrls: [
      "/demo-screenshots/ai-telefoonassistent/01-dashboard.png",
      "/demo-screenshots/ai-telefoonassistent/02-gesprekken.png",
      "/demo-screenshots/ai-telefoonassistent/03-transcript.png",
      "/demo-screenshots/ai-telefoonassistent/04-agenda.png",
      "/demo-screenshots/ai-telefoonassistent/05-kennisbank.png",
      "/demo-screenshots/ai-telefoonassistent/06-inzichten.png"
    ],
    priceCents: 14900,
    setupPriceCents: 99500,
    status: "published",
    featured: true,
    compatibility: ["Google Calendar", "Outlook", "Microsoft Teams", "Slack", "WhatsApp"],
    tags: ["AI", "Telefoon", "Voicebot", "Customer Service", "MKB"],
    deliveryModes: ["custom"],
    files: [],
    demo: {
      url: "",
      screenshots: [],
      instructions: "",
      credentials: [],
      sampleInput: ""
    },
    downloads: 0,
    sales: 23,
    rating: 4.9,
    reviewCount: 9,
    version: "",
    createdAt: today(-40),
    updatedAt: today(-3),
    supportIncluded: "Doorlopend, zolang het abonnement loopt",
    listingKind: "service",
    forWho: [
      "Kappers en schoonheidssalons die in de behandeling staan en niet kunnen opnemen",
      "Garages waar monteurs onder de auto liggen en de receptie vol is",
      "Praktijken (tandarts, fysio, huisarts) waar de receptie patiënten heeft staan",
      "Klusbedrijven en ZZP'ers die op de bouw of bij de klant zitten",
      "Iedereen die meer dan 5 calls per week mist, daar verdient 'ie zichzelf terug"
    ],
    included: [
      {
        icon: "phone",
        title: "Automatisch terugbellen",
        description:
          "Gemiste oproep? Onze AI belt binnen 30 seconden terug, 24/7, ook 's avonds en in het weekend."
      },
      {
        icon: "headset",
        title: "Nederlandstalig en natuurlijk",
        description:
          "Natuurlijke stem, herkent dialecten en accenten, vraagt door waar nodig. Wel eerlijk: 'je spreekt met de digitale assistent'."
      },
      {
        icon: "calendar",
        title: "Direct in je agenda",
        description:
          "Koppelt aan Google Calendar, Outlook of jouw boekingssysteem. Afspraken staan meteen op de juiste plek."
      },
      {
        icon: "mail",
        title: "Dagelijks transcript",
        description:
          "Elke ochtend in je mail of Slack: wie belde, wat ze wilden, welke afspraken zijn gemaakt."
      }
    ],
    cases: [
      {
        clientName: "Kapsalon Knip & Co",
        label: "Beauty & Wellness",
        tag: "MKB · Service",
        tone: "dark",
        benefit:
          "Verloor 12 calls per week voordat de AI live ging. Nu zijn dat er 0. Eigenares Suzanne berekende dat het zo'n €1.800 extra omzet per maand oplevert uit teruggewonnen afspraken.",
        highlights: [
          "12 → 0 gemiste calls per week",
          "+€1.800 omzet per maand uit teruggewonnen leads"
        ]
      },
      {
        clientName: "Garage Westerveld",
        label: "Automotive",
        tag: "MKB · Service",
        tone: "light",
        benefit:
          "Monteurs hoeven niet meer hun handen af te wassen voor elke telefoon. AI plant inspecties en onderhoud direct in, en stuurt de eigenaar een dagrapport per WhatsApp.",
        highlights: [
          "Monteurs kunnen onafgebroken doorwerken",
          "Afsprakenboek 30% voller binnen 2 maanden"
        ]
      },
      {
        clientName: "Tandartspraktijk DentaalNL",
        label: "Healthcare",
        tag: "Praktijk · Service",
        tone: "peach",
        benefit:
          "Receptie kan focus houden op patiënten in de praktijk. AI vangt alle inkomende calls op en belt actief terug bij no-shows met een nieuw voorstel. Resultaat: agenda-bezetting van 78% naar 95%.",
        highlights: [
          "Bezetting agenda 78% → 95%",
          "Receptie beschikbaar voor patiënten in de wachtruimte"
        ]
      }
    ],
    servicePricing: {
      externalUrl: "https://hazenco.nl/contact/",
      oneTime: {
        priceCents: 99500,
        originalPriceCents: 149500,
        description:
          "Eenmalige setup + integratie met je bestaande nummer. Daarna €49/mnd voor hosting, AI-credits (tot 200 calls/mnd) en updates."
      },
      subscription: {
        priceCentsPerMonth: 14900,
        originalPriceCentsPerMonth: 19900,
        minMonths: 12,
        description:
          "All-in: setup, hosting, AI-credits (tot 500 calls/mnd), agenda-koppeling, dagelijkse rapportages en doorlopende script-updates."
      },
      highlight: "subscription",
      usps: [
        "Live binnen 5-7 werkdagen",
        "Geen technische kennis nodig",
        "Maandelijks opzegbaar na minimumperiode",
        "Eerlijk: AI noemt zich digitale assistent"
      ]
    },
    serviceMeta: {
      duration: "5-7 werkdagen tot live",
      revisions: "Onbeperkt scripts bijschaven",
      supportPeriod: "Doorlopend zolang abonnement loopt"
    }
  },
  {
    id: "listing_whatsapp_business_chatbot",
    sellerId: "seller_hazenco",
    title: "WhatsApp Business Chatbot",
    slug: "whatsapp-business-chatbot",
    tagline:
      "Klanten vragen, je bot antwoordt direct, 24/7. Jouw team grijpt alleen in bij wat echt aandacht nodig heeft.",
    description:
      "WhatsApp is voor de meeste Nederlandse MKB-bedrijven het belangrijkste klantkanaal geworden. Het probleem: één persoon kan niet 200 chats per dag bijhouden, zeker niet buiten kantooruren. De gevolgen zien we elke week, trage antwoorden, klanten die afhaken, omzet die naar concurrenten verdwijnt.\n\nDe **WhatsApp Business Chatbot** vangt dat op. Een AI die je producten kent, je orderstatus kan opvragen, retouren kan starten, en bestellingen kan plaatsen, allemaal via een gesprek dat aanvoelt als chatten met een vriendelijke collega.\n\n**Wat de bot daadwerkelijk doet**\n\nNiet alleen FAQ-antwoorden. Bij een vraag \"waar is mijn bestelling\" haalt 'ie real-time de status uit WooCommerce of Shopify en stuurt direct een track & trace link. Bij \"hebben jullie dit ook in zwart\" zoekt 'ie in je catalogus en stuurt foto + prijs + URL. Bij \"ik wil dit bestellen\" maakt 'ie een betaal-link via Mollie. Bij een klacht escaleert 'ie binnen 4 minuten naar je team, met de volledige context erbij.\n\n**Voor wie werkt dit echt**\n\nWebshops met meer dan 10 chats per dag, dienstverleners (kappers, garages, makelaars, klusbedrijven) die veel via WhatsApp werken, en B2B-bedrijven waar klanten complexe vragen via chat stellen. Niet voor pure spam-volume operaties, wel voor bedrijven die elke klant een goed gesprek willen geven, alleen niet de tijd hebben om 'm zelf te voeren.\n\n**Volgens Meta-regels, op je eigen nummer**\n\nWe gebruiken de officiële **WhatsApp Business API** (geen grijze workarounds, geen schorsing-risico). Je bestaande zakelijke nummer wordt verbonden. Klanten zien gewoon jouw bedrijfsnaam, jouw logo. Geen \"powered by\"-rommel.\n\n**De bot weet niet alles, en dat is goed**\n\nWij stoppen er JOUW kennis in: productcatalogus, openingstijden, verzendkosten, retourbeleid, FAQ. Wat 'ie niet weet vraagt 'ie netjes na of escaleert 'ie. We trainen 'm op jouw toon (formeel/informeel, met of zonder emoji's) en je merknaam. Het voelt als jouw bedrijf, niet als een generieke bot.\n\n**Setup**\n\nBinnen 7-10 werkdagen ben je live. Eerste week vooral testen met fake chats; tweede week parallel met je huidige flow zodat je kunt vergelijken. We koppelen aan je bestaande webshop (WooCommerce, Shopify, Magento, Lightspeed), betaalprovider (Mollie, Stripe), en CRM (HubSpot, Pipedrive, of gewoon mail/Slack).\n\n**Wat je krijgt naast de bot**\n\nDashboard waarin je elke chat ziet, kunt overnemen, en analytics bekijkt (top vragen, conversie via chat, omzet via chat, klant-tevredenheid). Plus per ochtend een dagrapport in Slack of mail.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten zien hoe het werkt voor een soortgelijke webshop of dienstverlener, je hoort exacte voorbeeldgesprekken, en je krijgt een eerlijke schatting voor jouw situatie. Geen verkooppraatjes, gewoon laten zien wat het doet.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["customer_support", "ecommerce", "lead_generation"],
    branches: ["retail", "professional_services", "horeca", "general"],
    heroImageUrl: "",
    screenshotUrls: [
      "/demo-screenshots/whatsapp-business-chatbot/01-dashboard.png",
      "/demo-screenshots/whatsapp-business-chatbot/02-inbox.png",
      "/demo-screenshots/whatsapp-business-chatbot/03-conversatie.png",
      "/demo-screenshots/whatsapp-business-chatbot/04-flows.png",
      "/demo-screenshots/whatsapp-business-chatbot/05-antwoorden.png",
      "/demo-screenshots/whatsapp-business-chatbot/06-analytics.png"
    ],
    priceCents: 8900,
    setupPriceCents: 59500,
    status: "published",
    featured: true,
    compatibility: ["WhatsApp Business API", "WooCommerce", "Shopify", "Mollie", "HubSpot", "Slack"],
    tags: ["WhatsApp", "Chatbot", "AI", "E-commerce", "Customer Service"],
    deliveryModes: ["custom"],
    files: [],
    demo: { url: "", screenshots: [], instructions: "", credentials: [], sampleInput: "" },
    downloads: 0,
    sales: 31,
    rating: 4.8,
    reviewCount: 14,
    version: "",
    createdAt: today(-55),
    updatedAt: today(-2),
    supportIncluded: "Doorlopend, zolang het abonnement loopt",
    listingKind: "service",
    forWho: [
      "Webshops met meer dan 10 chats per dag (Magento, WooCommerce, Shopify)",
      "Dienstverleners die veel via WhatsApp werken, kappers, garages, klusbedrijven",
      "Makelaars en advocaten met klanten die complexe vragen via chat stellen",
      "B2B-bedrijven die bestaande klanten snel en persoonlijk willen helpen",
      "Iedereen die buiten kantooruren omzet misloopt door late reacties"
    ],
    included: [
      {
        icon: "message-circle",
        title: "Officiële WhatsApp Business API",
        description:
          "Op je bestaande nummer, met je bedrijfsnaam en groene vinkje. Geen schorsings-risico, volgens Meta-regels."
      },
      {
        icon: "zap",
        title: "AI met JOUW kennis",
        description:
          "Kent je productcatalogus, prijzen, openingstijden, retourbeleid. Geen generieke antwoorden."
      },
      {
        icon: "refresh",
        title: "Real-time koppelingen",
        description:
          "WooCommerce, Shopify, Mollie, Pipedrive, bot haalt orderstatus en stuurt track & trace direct uit je systeem."
      },
      {
        icon: "users",
        title: "Slim overdragen naar mens",
        description:
          "Bij klachten of complexe vragen escaleert de bot naar je team, mét de volledige chat-context erbij."
      }
    ],
    cases: [
      {
        clientName: "TuinThuis",
        label: "Webshop · Tuinmeubels",
        tag: "MKB · E-commerce",
        tone: "dark",
        benefit:
          "Webshop voor tuinmeubels, 3.247 chats per maand waarvan 94% volledig door bot afgehandeld. Bot plaatste 192 bestellingen direct via chat (AOV €149) en bespaarde het team 128 uur per maand.",
        highlights: [
          "94% chats zonder mens afgehandeld",
          "€28.640 maandelijkse omzet via chat",
          "128u/mnd tijd bespaard"
        ]
      },
      {
        clientName: "Klusbedrijf De Vakman",
        label: "Dienstverlening · Bouw",
        tag: "MKB · Service",
        tone: "light",
        benefit:
          "Voor een klusbedrijf vangt de bot offerte-aanvragen op via WhatsApp, stelt 5 verduidelijkende vragen, en plant direct een opname-afspraak in. Resultaat: 3x meer leads door snellere reactietijd.",
        highlights: [
          "Reactietijd van 4 uur → 8 seconden",
          "3x meer offerte-aanvragen converteren"
        ]
      },
      {
        clientName: "Makelaardij Vermeer",
        label: "Vastgoed · Service",
        tag: "Makelaar · Service",
        tone: "peach",
        benefit:
          "Bot beantwoordt 24/7 vragen over woningen in het bestand, plant bezichtigingen via Calendly, en stuurt brochures direct in de chat. Klanten waarderen vooral de snelheid 's avonds, meeste interesse komt na 19:00.",
        highlights: [
          "Bezichtigingen ingepland 's avonds: +47%",
          "Brochures via chat: 78% open-rate"
        ]
      }
    ],
    servicePricing: {
      externalUrl: "https://hazenco.nl/contact/",
      oneTime: {
        priceCents: 59500,
        originalPriceCents: 89500,
        description:
          "Eenmalige setup + API-verificatie + integratie met je webshop. Daarna €39/mnd voor hosting, AI-credits (tot 1.000 chats/mnd) en updates."
      },
      subscription: {
        priceCentsPerMonth: 8900,
        originalPriceCentsPerMonth: 12900,
        minMonths: 6,
        description:
          "All-in: setup, hosting, AI-credits (tot 3.000 chats/mnd), webshop-koppeling, dagelijkse rapportages en doorlopende flow-updates."
      },
      highlight: "subscription",
      usps: [
        "Live binnen 7-10 werkdagen",
        "Officiële WhatsApp Business API",
        "Op je bestaande nummer",
        "Maandelijks opzegbaar na minimumperiode"
      ]
    },
    serviceMeta: {
      duration: "7-10 werkdagen tot live",
      revisions: "Onbeperkt flows bijschaven",
      supportPeriod: "Doorlopend zolang abonnement loopt"
    }
  },
  {
    id: "listing_google_reviews_ai_responder",
    sellerId: "seller_hazenco",
    title: "Google Reviews AI-responder",
    slug: "google-reviews-ai-responder",
    tagline:
      "Reageert binnen 14 minuten op elke review, in jouw toon, en zorgt dat klagers terugkomen.",
    description:
      "97% van de potentiële klanten checkt je Google reviews voordat ze besluiten. En wat ze zien is niet alleen wat anderen zeggen, ze zien ook hoe JIJ reageert. Een eigenaar die binnen een uur persoonlijk antwoordt, ongeacht de score, straalt zorg uit. Een eigenaar die niks zegt, of generiek \"bedankt voor uw feedback\" plaatst, straalt onverschilligheid uit.\n\nDe **Google Reviews AI-responder** zorgt dat je altijd reageert, binnen 14 minuten gemiddeld, 24/7, in jouw eigen toon, en met écht persoonlijke teksten die niet aanvoelen als een copy-paste.\n\n**Niet \"bedankt voor uw feedback\"**\n\nDe meeste auto-reply tools spuwen generieke onzin. \"Bedankt voor uw feedback, we waarderen het zeer.\" Iedereen ziet dat het AI is. Erger nog: het laat zien dat je niet eens de moeite hebt genomen om te lezen wat de klant schreef.\n\nWij doen het omgekeerd. De AI **leest elke review woord voor woord**, herkent waar de klant het over had (de gerookte makreel, de wachttijd, de bediening), en bouwt daar een persoonlijk antwoord omheen. Voorbeeld: \"Wat fijn om te lezen, Lieke, die gerookte makreel geven we zeker door aan onze keuken. Je punt over de wachttijd nemen we serieus; doordeweeks zou dat soepeler moeten gaan.\"\n\n**Jouw brand voice, niet die van een bot**\n\nIn de setup leggen we jouw toon vast: u-vorm of je-vorm, formeel of warm, met of zonder emoji's, hoe je gewoonlijk afsluit. Plus een lijst van **woorden die de AI nooit gebruikt**, \"streven naar\", \"ongemak\", corporate jargon dat klanten direct afschrikt. De AI vermijdt het, jij blijft authentiek.\n\n**Klagers terugbrengen**\n\nBij negatieve reviews (1-2 sterren) escaleert de AI niet stilletjes, 'ie bereidt al een conceptantwoord voor en stuurt jou een notificatie met de context. Je beslist of je 'm met één klik plaatst, aanpast, of zelf belt. **Bij 71% van onze klanten verandert een 2★ review in een 4★ binnen 30 dagen** na een persoonlijk telefoontje.\n\n**Voor wie werkt dit echt**\n\nRestaurants, hotels, kappers, schoonheidssalons, fysiotherapeuten, autobedrijven, klusbedrijven, makelaars, eigenlijk elk lokaal MKB waar Google reviews bepalen of nieuwe klanten überhaupt naar je gaan kijken. Het effect is sterkst bij bedrijven met 30+ reviews die niet alles handmatig kunnen bijhouden.\n\n**SEO-effect**\n\nGoogle weegt review-respons mee in het Maps-algoritme. Bedrijven die actief reageren, ranken hoger in de \"Map Pack\" (de top-3 op kaart). Bij onze klanten zagen we gemiddeld **+18% lokale zichtbaarheid** binnen 3 maanden, meetbaar in Google Business Profile insights.\n\n**Setup**\n\nBinnen 5 werkdagen ben je live. Eerste 7 dagen draait 'ie in \"voorstel-modus\" (alles wacht op jouw akkoord), zodat je kunt zien of de toon klopt. Daarna kun je per categorie (5★, 4★, 3★, 2★) instellen of de AI direct plaatst of jouw akkoord vraagt. Klachten escaleren altijd naar jou.\n\n**Wat je krijgt**\n\nDashboard met alle reviews (Google, Tripadvisor, Facebook), AI-voorstellen, sentiment-analyse en topic-tracking (wat noemen klanten het vaakst?). Plus per maand een rapport met inzichten: \"wachttijd\" wordt vaker positief genoemd, \"steak\" vaker negatief, bruikbare signalen voor je team.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten je drie eigen reviews zien zoals de bot zou antwoorden, geen verkooppraat, gewoon concrete teksten op je echte data.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["customer_support", "marketing", "analytics"],
    branches: ["horeca", "retail", "healthcare", "professional_services", "general"],
    heroImageUrl: "",
    screenshotUrls: [
      "/demo-screenshots/google-reviews-ai-responder/01-dashboard.png",
      "/demo-screenshots/google-reviews-ai-responder/02-reviews.png",
      "/demo-screenshots/google-reviews-ai-responder/03-reply-editor.png",
      "/demo-screenshots/google-reviews-ai-responder/04-brand-voice.png",
      "/demo-screenshots/google-reviews-ai-responder/05-templates.png",
      "/demo-screenshots/google-reviews-ai-responder/06-analytics.png"
    ],
    priceCents: 4900,
    setupPriceCents: 39500,
    status: "published",
    featured: true,
    compatibility: ["Google Business Profile", "Tripadvisor", "Facebook", "Slack", "Mail"],
    tags: ["AI", "Reviews", "Reputatie", "SEO", "MKB"],
    deliveryModes: ["custom"],
    files: [],
    demo: { url: "", screenshots: [], instructions: "", credentials: [], sampleInput: "" },
    downloads: 0,
    sales: 47,
    rating: 4.9,
    reviewCount: 22,
    version: "",
    createdAt: today(-70),
    updatedAt: today(-1),
    supportIncluded: "Doorlopend, zolang het abonnement loopt",
    listingKind: "service",
    forWho: [
      "Restaurants en hotels die 30+ Google reviews per maand krijgen",
      "Kappers, garages en praktijken met klanten die actief reviews achterlaten",
      "Webshops en lokale dienstverleners die in Maps gevonden willen worden",
      "Eigenaren die nu te druk zijn om elke review persoonlijk te beantwoorden",
      "Iedereen met 1-2 sterren reviews die nu onbeantwoord blijven"
    ],
    included: [
      {
        icon: "zap",
        title: "Persoonlijke antwoorden, geen jargon",
        description:
          "AI leest elke review woord voor woord en bouwt een antwoord op specifieke punten, niet 'bedankt voor uw feedback'."
      },
      {
        icon: "shield-check",
        title: "Jouw brand voice vastgelegd",
        description:
          "Toon, lengte, emoji-gebruik en woorden die je nooit wilt gebruiken, wij stoppen het allemaal in de AI tijdens setup."
      },
      {
        icon: "headset",
        title: "Klachten escaleren naar jou",
        description:
          "Bij 1-2★ bereidt de bot het antwoord voor, maar plaatst pas na jouw akkoord. Inclusief context en suggestie voor terugbel-actie."
      },
      {
        icon: "refresh",
        title: "Multi-platform",
        description:
          "Google, Tripadvisor en Facebook in één dashboard. Slack/mail notificaties bij belangrijke reviews."
      }
    ],
    cases: [
      {
        clientName: "Brasserie 't Kompas",
        label: "Restaurant · Amsterdam",
        tag: "Horeca · Service",
        tone: "dark",
        benefit:
          "Restaurant in centrum Amsterdam ging van 4.4 naar 4.6 sterren gemiddeld binnen 3 maanden. Eigenaar Daan ziet nu elke review binnen 14 minuten beantwoord verschijnen, en hoeft alleen 2-sterren reviews zelf op te pakken. Map-pack zichtbaarheid +18%.",
        highlights: [
          "Score 4.4 → 4.6 in 3 maanden",
          "+18% lokale zichtbaarheid in Google Maps",
          "100% reviews beantwoord, geen achterstand"
        ]
      },
      {
        clientName: "Schoonheidssalon Belle",
        label: "Beauty · Den Haag",
        tag: "MKB · Service",
        tone: "light",
        benefit:
          "Salon met 380 reviews kreeg gemiddeld 2-3 nieuwe reviews per week. Onmogelijk om bij te houden naast klanten in de stoel. Bot beantwoordt 5★ direct, 4★ binnen het uur, 1-2★ wacht op akkoord, eigenaar bespaart 4u per week.",
        highlights: [
          "4u per week bespaard aan reviews",
          "Reactie binnen 1u op alle 4-5★ reviews"
        ]
      },
      {
        clientName: "Autobedrijf Vermeer",
        label: "Automotive · Utrecht",
        tag: "MKB · Service",
        tone: "peach",
        benefit:
          "Bij een 2★ review over een te dure reparatie belde Vermeer binnen 30 min persoonlijk terug. Klant kwam terug voor de APK een maand later en updatete naar 5★. Bot detecteerde de escalatie automatisch en triggerde de actie.",
        highlights: [
          "71% van 2★ reviews wordt 4-5★ binnen 30 dagen",
          "Automatische escalatie bij klachten"
        ]
      }
    ],
    servicePricing: {
      externalUrl: "https://hazenco.nl/contact/",
      oneTime: {
        priceCents: 39500,
        originalPriceCents: 59500,
        description:
          "Eenmalige setup + brand voice training + koppeling Google/Tripadvisor/Facebook. Daarna €29/mnd voor hosting, AI-credits (tot 200 reviews/mnd) en updates."
      },
      subscription: {
        priceCentsPerMonth: 4900,
        originalPriceCentsPerMonth: 7900,
        minMonths: 6,
        description:
          "All-in: setup, hosting, AI-credits (tot 500 reviews/mnd), maandrapportages, sentiment-analyse en doorlopende brand voice updates."
      },
      highlight: "subscription",
      usps: [
        "Live binnen 5 werkdagen",
        "Werkt op Google, Tripadvisor, Facebook",
        "Jouw toon, geen generiek jargon",
        "Klachten escaleren altijd naar jou"
      ]
    },
    serviceMeta: {
      duration: "5 werkdagen tot live",
      revisions: "Onbeperkt brand voice bijschaven",
      supportPeriod: "Doorlopend zolang abonnement loopt"
    }
  },
  {
    id: "listing_online_afsprakensysteem",
    sellerId: "seller_hazenco",
    title: "Online Afsprakensysteem",
    slug: "online-afsprakensysteem",
    tagline:
      "Klanten boeken zelf 24/7, jij houdt focus op het werk. Geen gemiste afspraken, geen heen-en-weer mailtjes meer.",
    description:
      "Telefoonafspraken maken is anno 2026 het grootste obstakel tussen jouw klant en de boeking. 67% van de Nederlandse consumenten geeft aan dat ze liever een dienst overslaan dan een telefoontje plegen, vooral 's avonds en in het weekend. En jij ondertussen: bellen, mailen, opnieuw bellen, no-shows, dubbel-boekingen.\n\nHet **Online Afsprakensysteem** lost dat op. Klanten zien jouw beschikbaarheid 24/7 op je website, kiezen de dienst + tijd + medewerker, betalen direct, en krijgen automatische bevestiging + herinnering. Jij ziet alles overzichtelijk in één dashboard.\n\n**Niet \"nog een agenda-plugin\"**\n\nEr zijn genoeg tools die dit kunnen, Amelia, Calendly, Salonized, Trafft. Het probleem: jij moet ze zelf installeren, koppelen aan je website, integreren met Mollie, e-mail templates schrijven, openingstijden + lunchpauzes invoeren per medewerker, no-show beleid instellen, GDPR-compliant maken. Voor de meeste MKB-ers is dat 2-3 dagen werk waar ze nooit aan toekomen.\n\n**Wij doen het, jij gebruikt het**\n\nHazenco zet alles voor je op binnen 5 werkdagen. Volledig op maat: jouw kleuren, jouw merknaam, jouw diensten, jouw medewerkers, jouw werktijden. Wij koppelen aan Mollie (of een andere betaalprovider naar keuze), Google Calendar, je bestaande website, en de WhatsApp Business Chatbot of AI Telefoonassistent als je die ook hebt.\n\n**Wat je krijgt**\n\nEen volwaardig boekingsplatform: agenda (week/maand/dag), klantbeheer, diensten met prijs + duur + buffer, medewerkers met eigen rooster, betaal-integratie, automatische SMS/mail bevestiging + herinnering, no-show systeem met aanbetaling-vereisten, reactivering-flow voor inactieve klanten. Plus een dashboard met de cijfers die er toe doen: bezetting per medewerker, no-show ratio, omzet via online boekingen.\n\n**No-show op 2,4% in plaats van 18%**\n\nDe combinatie van vooraf-betalen + 24u SMS-herinnering + verzet-link (klant kan zelf kosteloos verzetten tot 4u vooraf) brengt no-shows in onze klantenbestand gemiddeld terug van 18% naar 2,4%. Bij een fysiopraktijk met 200 afspraken per week scheelt dat 30+ afspraken per week aan verloren omzet.\n\n**Voor wie werkt dit echt**\n\nFysiotherapeuten, tandartsen, huisartsen-praktijken, kappers, schoonheidssalons, sport-coaches, klusbedrijven, advocaten, consultants, eigenlijk elk MKB waar klanten afspraken maken. Werkt voor 1 ZZP'er tot teams van 30+ medewerkers.\n\n**Werkt samen met onze andere tools**\n\nHeb je de **AI Telefoonassistent**? Die plant automatisch in dit systeem zolang er beschikbaarheid is. **WhatsApp Chatbot**? Die kan ook afspraken plaatsen via chat. **Google Reviews AI-responder**? Die stuurt na elke afspraak een mail-vraag om een review. Alle Hazenco-tools praten met elkaar.\n\n**Setup**\n\nDag 1-2: intake + opzet diensten/medewerkers/tijden. Dag 3-4: koppeling betaal + agenda, testen. Dag 5: live, met jou meekijken bij eerste echte boekingen. Daarna doorlopend: nieuwe diensten toevoegen, prijzen aanpassen, medewerkers in/uit, wij doen het of leren je het in 10 minuten.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten je het systeem zien zoals het zou werken voor jouw zaak, met jouw diensten en jouw scenario. Geen verkoopgesprek, gewoon laten zien wat het doet.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["workflow_automation", "customer_support", "payment_processing"],
    branches: ["healthcare", "professional_services", "retail", "horeca", "general"],
    heroImageUrl: "",
    screenshotUrls: [
      "/demo-screenshots/online-afsprakensysteem/01-dashboard.png",
      "/demo-screenshots/online-afsprakensysteem/02-agenda.png",
      "/demo-screenshots/online-afsprakensysteem/03-diensten.png",
      "/demo-screenshots/online-afsprakensysteem/04-bookingflow.png",
      "/demo-screenshots/online-afsprakensysteem/05-medewerkers.png",
      "/demo-screenshots/online-afsprakensysteem/06-notificaties.png"
    ],
    priceCents: 7900,
    setupPriceCents: 79500,
    status: "published",
    featured: true,
    compatibility: ["Mollie", "Stripe", "Google Calendar", "Outlook", "WordPress", "WhatsApp Business"],
    tags: ["Bookings", "Afspraken", "SaaS", "MKB", "Healthcare"],
    deliveryModes: ["custom"],
    files: [],
    demo: { url: "", screenshots: [], instructions: "", credentials: [], sampleInput: "" },
    downloads: 0,
    sales: 19,
    rating: 4.9,
    reviewCount: 8,
    version: "",
    createdAt: today(-25),
    updatedAt: today(-1),
    supportIncluded: "Doorlopend, zolang het abonnement loopt",
    listingKind: "service",
    forWho: [
      "Praktijken (fysio, tandarts, huisarts) waar elke gemiste afspraak omzet kost",
      "Kappers en salons die avond/weekend boekingen willen vangen zonder telefoon",
      "Sport-coaches, klusbedrijven en consultants met 1-op-1 afspraken",
      "Eigenaren die nu vooraan in de zaak staan, niet bij de telefoon",
      "Iedereen met een no-show ratio die pijn doet (>5%)"
    ],
    included: [
      {
        icon: "calendar",
        title: "Volledig op maat ingericht",
        description:
          "Jouw diensten, prijzen, medewerkers en werktijden. Wij setupen alles binnen 5 werkdagen, jij hoeft alleen mee te kijken."
      },
      {
        icon: "zap",
        title: "Vooraf betalen + auto-herinnering",
        description:
          "Klanten betalen via Mollie of iDEAL bij de boeking, krijgen SMS-herinnering 24u vooraf. No-shows van 18% naar 2,4%."
      },
      {
        icon: "users",
        title: "Per-medewerker beschikbaarheid",
        description:
          "Iedere therapeut/medewerker eigen rooster, eigen diensten, eigen pauzes. Klanten zien alleen écht vrije slots."
      },
      {
        icon: "refresh",
        title: "Praat met andere Hazenco-tools",
        description:
          "Integreert met AI Telefoonassistent, WhatsApp Chatbot en Google Reviews. Eén klant-flow, alle kanalen."
      }
    ],
    cases: [
      {
        clientName: "Fysio Vital",
        label: "Fysiotherapie · Utrecht",
        tag: "Healthcare · Service",
        tone: "dark",
        benefit:
          "Fysiopraktijk met 5 therapeuten en 200 afspraken per week. Eigenaresse Sara zag no-show ratio dalen van 18% naar 2,4% binnen 2 maanden. 7 nieuwe klanten per week komen nu binnen via de online bookingflow, vooral 's avonds geboekt.",
        highlights: [
          "No-show ratio 18% → 2,4%",
          "7 nieuwe klanten per week via website",
          "87% van alle bookings vooraf betaald"
        ]
      },
      {
        clientName: "Kapsalon Lumière",
        label: "Beauty · Amsterdam",
        tag: "MKB · Service",
        tone: "light",
        benefit:
          "Kapsalon met 3 stoelen. Sinds online boekingen: 40% van alle boekingen komt 's avonds binnen, ergo telefoongesprekken halveren. Eigenaresse kan zich focussen op haar klanten ipv telefoon opnemen.",
        highlights: [
          "40% van bookings buiten kantooruren",
          "Telefoontijd halved"
        ]
      },
      {
        clientName: "Sport-coach Vincent Hooft",
        label: "Coaching · Eindhoven",
        tag: "ZZP · Service",
        tone: "peach",
        benefit:
          "1-op-1 personal trainer. Klanten boeken zelf hun PT-sessie via gepersonaliseerde booking-pagina, betalen direct, krijgen 24u vooraf reminder. Vincent bespaart 6u per week aan plan-administratie.",
        highlights: [
          "6u per week bespaard aan admin",
          "100% vooraf betaald, geen facturatie-werk"
        ]
      }
    ],
    servicePricing: {
      externalUrl: "https://hazenco.nl/contact/",
      oneTime: {
        priceCents: 79500,
        originalPriceCents: 119500,
        description:
          "Eenmalige setup + integratie met website + Mollie + Google Calendar. Daarna €39/mnd voor hosting, updates en backups."
      },
      subscription: {
        priceCentsPerMonth: 7900,
        originalPriceCentsPerMonth: 11900,
        minMonths: 12,
        description:
          "All-in: setup, hosting, onbeperkt boekingen, alle integraties, SMS-credits (tot 500/mnd), maandelijkse rapportages en wijzigingen."
      },
      highlight: "subscription",
      usps: [
        "Live binnen 5 werkdagen",
        "Onbeperkt boekingen",
        "Werkt met Mollie, iDEAL, Stripe",
        "Maandelijks opzegbaar na minimumperiode"
      ]
    },
    serviceMeta: {
      duration: "5 werkdagen tot live",
      revisions: "Onbeperkt diensten/medewerkers wijzigen",
      supportPeriod: "Doorlopend zolang abonnement loopt"
    }
  },
  {
    id: "listing_magento_cart_popup",
    sellerId: "seller_hazenco",
    title: "Verzending & Cross-sell Popup (Magento)",
    slug: "verzending-cross-sell-popup-magento",
    tagline:
      "Verhoog je gemiddelde orderwaarde bij elke bestelling. Slimme add-to-cart popup voor Magento 2 / Hyvä.",
    description:
      "Elk product dat je klant in de winkelwagen legt is een kans. Een kans om te laten zien dat er nog €40 tot gratis verzending zit, en dat 68% van de klanten daarna nog iets extra's bijboekt. Een kans om te tonen welke montage-schroeven, accessoires of consumables passen bij wat ze net kochten.\n\nDe meeste Magento webshops laten die kans letterlijk uit hun handen glippen: klant klikt \"in winkelwagen\" → refresh naar de cart-pagina → klant is uit de flow → checkout begint. Elke tussen-stap = kans op afhaak.\n\nDe **Verzending & Cross-sell Popup** vangt dat op. Zodra je klant een product toevoegt, opent er een popup met:\n\n1. **Gratis-verzending voortgangsbalk**, \"Nog €162,60 tot gratis verzending\" met een visueel vrachtwagentje dat naar rechts loopt. Zet ontzettende drempel-druk. Gemiddelde AOV-stijging bij onze klanten: +18 tot +34%.\n2. **Cross-sell producten** met directe \"+\"-knoppen, Magento native \"toebehoren\" (up-sells / related products) worden getoond met levertijd, prijs en 1-klik toevoegen. Geen doorklikken, geen nieuwe pagina.\n3. **Verder winkelen / Naar winkelwagen**, klant behoudt regie.\n\n**Voor wie werkt dit echt**\n\nElke Magento 2 / Hyvä webshop met €50+ AOV en producten die logische cross-sells hebben (sanitair + accessoires, electronica + kabels, meubels + verzorging, tuin + montage). Werkt vooral goed als je al \"toebehoren\" of \"related products\" hebt ingesteld in Magento, dan pakt de popup dat automatisch op.\n\n**Volledig customizable, geen dev-team nodig**\n\nDe vormgeving beheer je in onze **Product Manager Cart Popup Builder**: kleuren (accent, voortgangsbalk, tekst, prijzen), teksten (titel, verzendtekst, cross-sell titel, knop-labels), aantal cross-sells, layout (gecentreerd / hoek). Live preview terwijl je aanpast. Klik \"Naar Magento pushen\" en de popup is binnen 30 seconden live op je shop.\n\n**Technisch schoon**\n\n- Native Magento 2 module (installatie via Composer)\n- **Hyvä Tailwind-compatible**, geen fallback op oude Luma-styling\n- Storefront leest config lokaal, geen runtime API-calls, geen performance-hit\n- Werkt met bestaande Magento cart / checkout, geen aanpassingen daaraan\n- GDPR-safe (geen tracking, geen third party)\n\n**Wat Hazenco doet**\n\n- Module installatie op jouw Magento shop (Composer + Hyvä Tailwind build)\n- Koppeling met Product Manager Cart Popup Builder\n- Initial styling passend bij jouw shop-huisstijl\n- Cross-sell strategie advies (welke producten koppelen aan welke?)\n- Doorlopend onderhoud + updates\n\n**Setup**\n\nWithin 3-5 werkdagen live. Dag 1: module installatie + Hyvä build. Dag 2: styling instellen samen met jou (kleuren + teksten). Dag 3-4: cross-sell mapping voor top 100 producten. Dag 5: A/B testen tegen huidige flow om conversion-effect te meten.\n\n**Wat het je oplevert (echte cijfers)**\n\nBij een sanitair-webshop met €95k/mnd omzet: AOV steeg van €167 naar €221 in 6 weken (+32%). Dat is €25k extra omzet per maand uit dezelfde bezoekers. Terugverdientijd van de eenmalige investering: **binnen 2 weken**.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. Wij tonen je een demo op een test-Magento shop, laten je de Cart Popup Builder zien, en geven een eerlijke schatting voor jouw shop.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["ecommerce", "workflow_automation"],
    branches: ["retail", "general"],
    heroImageUrl: "",
    screenshotUrls: [
      "/demo-screenshots/magento-cart-popup/01-popup-basic.png",
      "/demo-screenshots/magento-cart-popup/02-popup-op-productpagina.png",
      "/demo-screenshots/magento-cart-popup/03-cart-popup-builder.png"
    ],
    priceCents: 4900,
    setupPriceCents: 49500,
    status: "published",
    featured: true,
    compatibility: ["Magento 2", "Hyvä Themes", "Composer", "Product Manager"],
    tags: ["Magento", "Hyvä", "Cross-sell", "AOV", "E-commerce"],
    deliveryModes: ["custom"],
    files: [],
    demo: { url: "", screenshots: [], instructions: "", credentials: [], sampleInput: "" },
    downloads: 0,
    sales: 12,
    rating: 4.9,
    reviewCount: 6,
    version: "1.0.0",
    createdAt: today(-15),
    updatedAt: today(-1),
    supportIncluded: "Doorlopend, zolang het abonnement loopt",
    listingKind: "service",
    forWho: [
      "Magento 2 / Hyvä webshops met €50+ AOV en herhalings-koopgedrag",
      "Sanitair, elektro, meubel, tuin, DIY, alles met logische accessoires",
      "Shops met bestaande \"toebehoren\" of \"related products\" in Magento",
      "Eigenaren zonder eigen dev-team die geen weken willen wachten op maatwerk",
      "Iedereen die gemiddelde orderwaarde wil verhogen zonder meer traffic te kopen"
    ],
    included: [
      {
        icon: "zap",
        title: "Gratis-verzending voortgangsbalk",
        description:
          "Visueel vrachtwagentje toont hoeveel klant nog te gaan heeft. Bewezen effect op AOV (+18 tot +34%)."
      },
      {
        icon: "shield-check",
        title: "Native cross-sells met 1-klik",
        description:
          "Magento \"toebehoren\" met directe +-knop, prijs en levertijd. Geen doorklikken, geen nieuwe pagina."
      },
      {
        icon: "refresh",
        title: "Volledig customizable in Product Manager",
        description:
          "Kleuren, teksten, aantal cross-sells, layout. Live preview. Push naar Magento binnen 30 seconden."
      },
      {
        icon: "headset",
        title: "Wij regelen installatie + strategie",
        description:
          "Module installatie, Hyvä Tailwind build, cross-sell mapping voor je top 100 producten. Jij hoeft niks."
      }
    ],
    cases: [
      {
        clientName: "SanitairSuperShop",
        label: "Sanitair · Webshop",
        tag: "E-commerce · Magento 2 / Hyvä",
        tone: "dark",
        benefit:
          "Sanitair-webshop met €95k/mnd omzet. AOV steeg van €167 naar €221 in 6 weken (+32%) na live gaan van de cart popup. Cross-sells van accessoires (bevestigingssets, borstels, montage-lijm) worden nu bij 41% van de bestellingen mee gekocht, voorheen was dat 8%.",
        highlights: [
          "AOV +32% in 6 weken (€167 → €221)",
          "€25k extra omzet per maand uit dezelfde bezoekers",
          "Cross-sell conversie 8% → 41%"
        ]
      },
      {
        clientName: "Elektro Van der Berg",
        label: "Elektro · Webshop",
        tag: "E-commerce · Magento 2",
        tone: "light",
        benefit:
          "Webshop voor elektro-materialen. Klanten die een stopcontact bestellen krijgen nu automatisch de bijpassende afdekplaat, kabels en montage-schroeven in de popup. Verzending-drempel op €75 zorgde voor drempel-effect: klanten kopen bewust net een productje bij om gratis-verzending te halen.",
        highlights: [
          "Verzending-drempel effect: +€14 gemiddeld per order",
          "Cross-sell click-rate 38%"
        ]
      },
      {
        clientName: "Tuin & Meer",
        label: "Tuinbenodigdheden · Webshop",
        tag: "E-commerce · Magento 2 / Hyvä",
        tone: "peach",
        benefit:
          "Tuincentrum-webshop. Cross-sells van potgrond bij planten, verzorgingsvoeding bij kunstmest, en tuintools bij zaden. AOV +21% seizoensmatig hoger tijdens voorjaar-piek dankzij drempel-effect op €50 gratis-verzending.",
        highlights: [
          "AOV +21% in voorjaar-seizoen",
          "Automatische cross-sell op productcategorie"
        ]
      }
    ],
    servicePricing: {
      externalUrl: "https://hazenco.nl/contact/",
      oneTime: {
        priceCents: 49500,
        originalPriceCents: 79500,
        description:
          "Eenmalige installatie + Hyvä Tailwind build + styling in jouw huisstijl + cross-sell mapping top 100 producten. Daarna €19/mnd voor updates en support."
      },
      subscription: {
        priceCentsPerMonth: 4900,
        originalPriceCentsPerMonth: 7900,
        minMonths: 12,
        description:
          "All-in: installatie, hosting van Cart Popup Builder, doorlopende cross-sell optimalisatie op basis van je bestellingen, updates en support."
      },
      highlight: "subscription",
      usps: [
        "Live binnen 3-5 werkdagen",
        "Native Magento 2 / Hyvä module",
        "Geen performance-impact op storefront",
        "Cross-sells beheerbaar in Product Manager"
      ]
    },
    serviceMeta: {
      duration: "3-5 werkdagen tot live",
      revisions: "Onbeperkt styling + cross-sell wijzigingen",
      supportPeriod: "Doorlopend zolang abonnement loopt"
    }
  },
  {
    id: "listing_magento_tile_calculator",
    sellerId: "seller_hazenco",
    title: "m² Calculator voor Tegels & Vloeren (Magento)",
    slug: "m2-calculator-tegels-vloeren-magento",
    tagline:
      "Klanten voeren m² in, jij verkoopt dozen. Automatische berekening + juiste hoeveelheid direct in de winkelwagen.",
    description:
      "Wie een badkamer of woonkamer betegelt, denkt in **vierkante meters**. Wie een tegel-webshop runt, verkoopt in **dozen**. Dat verschil is de #1 reden dat tegel-shoppers afhaken tijdens het kopen: ze weten niet hoeveel dozen ze moeten bestellen voor hun 12,5m² badkamer, laten hun laptop dicht, en zijn de deal kwijt.\n\nOf erger: ze bestellen te weinig, moeten navorderen (nieuwe verzendkosten, kleurverschil tussen productie-batches, project stopt), en laten een 2-sterren review achter.\n\nDe **m² Calculator** lost dat op. Op elke tegelpagina zien klanten een simpele input: \"hoeveel m² heb je nodig?\", plus een dropdown voor snijverlies (5% / 10%). Direct wordt getoond: **aantal dozen, werkelijk m², prijs per m², totaalprijs.** \"In winkelwagen\" legt automatisch het juiste aantal dozen erin. Geen afhaakmoment, geen verkeerde bestellingen.\n\n**Voor wie werkt dit echt**\n\nElke Magento 2 / Hyvä webshop die **producten per doos verkoopt maar klanten per m² denken**:\n- Tegels (keramisch, natuursteen, mozaïek)\n- Laminaat, PVC, vinyl\n- Houten vloeren, parket\n- Behang (per rol, klant denkt per m²)\n- Gipsplaten, isolatie, dakbedekking\n\nWerkt vanaf 20 tegel/vloer-SKU's; wordt lucratief vanaf 100+.\n\n**Alleen zichtbaar waar het moet**\n\nDe calculator verschijnt **alleen** op producten met het attribuut `sss_tegels_m2` (m² per doos). Op alle andere producten in je shop rendert 'ie niets, geen dubbele knoppen, geen verwarring. De native \"in winkelwagen\" wordt op tegelproducten netjes verstopt en vervangen door de calculator, alles via één JS-observer die op elke Hyvä-theme werkt.\n\n**Extras die er standaard bij zitten**\n\n- **Doorgestreepte adviesprijs** (kortinglook), laat kortingen visueel zien, exact als de native Magento buy-box\n- **Voorraad-fallback**, \"Tijdelijk niet op voorraad\" i.p.v. de calculator als product uitverkocht is\n- **GA4 tracking**, automatisch `add_to_cart`-event met correcte quantities (in dozen én m²) naar je dataLayer\n- **Optionele levertijd-display**, standaard uit zodat 'ie niet dubbel toont naast je bestaande PDP-levertijd\n- **Dynamische kleuren**, accent, tekst, prijs, allemaal via CSS-variabelen, past bij jouw huisstijl\n\n**Technisch schoon**\n\nNative Magento 2 module. Hyvä Tailwind-compatible (Tailwind-registratie via observer op `hyva_config_generate_before` event, zelfde patroon als onze Cart Popup module). Alle data server-side uit het product gelezen, geen GraphQL, geen extra API-calls, geen performance-hit. De berekening zelf draait client-side in Alpine.js.\n\n**Wat Hazenco doet**\n\n- Module installatie op jouw Magento shop (Composer + Hyvä Tailwind build)\n- Product-attribuut `sss_tegels_m2` toevoegen aan je catalogus\n- Bulk-vullen van dit attribuut voor je bestaande SKU's (m² per doos per product)\n- Styling passend bij jouw shop-huisstijl (accentkleuren, teksten, labels)\n- GA4-tracking configureren + verificatie in je Tag Manager\n- Doorlopend onderhoud + updates\n\n**Setup**\n\nBinnen 5-7 werkdagen live. Dag 1-2: module installatie + Hyvä Tailwind build + attribuut aanmaken. Dag 3-4: bulk-vullen `sss_tegels_m2` voor je top 200 SKU's (of alle als je catalogus kleiner is). Dag 5: styling + tekst-configuratie in Product Manager. Dag 6-7: GA4-integratie + A/B testen tegen huidige flow.\n\n**Wat het je oplevert (echte cijfers)**\n\nBij een tegel-webshop met 850 tegel-SKU's: **conversion-rate op tegelpagina's steeg van 1,8% naar 4,2%** (+133%) binnen 8 weken. Reden: klanten die eerst afhaakten om zelf te rekenen, kopen nu direct. Return-rate wegens verkeerde hoeveelheid daalde van 12% naar 3%, grote besparing op retour-verwerking en klantcontact.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. Wij tonen je een live demo op een test-Magento shop met echte tegelproducten, laten zien hoe klanten het gebruiken, en geven een eerlijke schatting voor jouw shop.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["ecommerce", "workflow_automation"],
    branches: ["retail", "general"],
    heroImageUrl: "",
    screenshotUrls: [
      "/demo-screenshots/magento-tile-calculator/01-calculator-op-productpagina.png",
      "/demo-screenshots/magento-tile-calculator/02-berekening-resultaat.png",
      "/demo-screenshots/magento-tile-calculator/03-config-in-product-manager.png",
      "/demo-screenshots/magento-tile-calculator/04-config-in-product-manager.png"
    ],
    priceCents: 4900,
    setupPriceCents: 79500,
    status: "published",
    featured: true,
    compatibility: ["Magento 2", "Hyvä Themes", "Alpine.js", "GA4", "Composer"],
    tags: ["Magento", "Hyvä", "Tegels", "Vloeren", "Calculator", "AOV"],
    deliveryModes: ["custom"],
    files: [],
    demo: { url: "", screenshots: [], instructions: "", credentials: [], sampleInput: "" },
    downloads: 0,
    sales: 9,
    rating: 5.0,
    reviewCount: 5,
    version: "1.0.0",
    createdAt: today(-20),
    updatedAt: today(-1),
    supportIncluded: "Doorlopend, zolang het abonnement loopt",
    listingKind: "service",
    forWho: [
      "Tegel-webshops (keramisch, natuursteen, mozaïek) met 20+ SKU's",
      "Vloeren-shops: laminaat, PVC, vinyl, houten vloeren, parket",
      "Behang-, gipsplaat-, isolatie-, dakbedekking-verkopers",
      "Iedereen die klanten laat berekenen \"hoeveel dozen voor mijn m²?\"",
      "Shops met hoge return-rate wegens verkeerd bestelde hoeveelheden"
    ],
    included: [
      {
        icon: "zap",
        title: "m² invullen → dozen berekenen",
        description:
          "Klant vult 12,5m² in, ziet direct aantal dozen, prijs per m², totaal, inclusief snijverlies-optie (5/10%)."
      },
      {
        icon: "shield-check",
        title: "Alleen op tegel-/vloerproducten",
        description:
          "Verschijnt uitsluitend op producten met sss_tegels_m2 attribuut. Rest van je shop blijft intact."
      },
      {
        icon: "refresh",
        title: "Native add-to-cart integratie",
        description:
          "Verbergt de standaard buy-box op tegels, plaatst calculator ervoor. Werkt op elk Hyvä-theme via één JS-observer."
      },
      {
        icon: "headset",
        title: "GA4 tracking + kortinglook",
        description:
          "Automatisch add_to_cart events naar dataLayer + doorgestreepte adviesprijs voor visuele kortinglook."
      }
    ],
    cases: [
      {
        clientName: "SanitairSuperShop",
        label: "Tegels & Sanitair · Webshop",
        tag: "E-commerce · Magento 2 / Hyvä",
        tone: "dark",
        benefit:
          "Tegel-webshop met 850 SKU's. Conversion-rate op tegelpagina's steeg van 1,8% naar 4,2% (+133%) binnen 8 weken. Return-rate wegens verkeerd bestelde hoeveelheden daalde van 12% naar 3%. Klantenservice krijgt 60% minder telefoontjes met de vraag 'hoeveel dozen voor X m²?'.",
        highlights: [
          "Conversion op tegelpagina's 1,8% → 4,2% (+133%)",
          "Return-rate verkeerde hoeveelheid 12% → 3%",
          "60% minder klantenservice-telefoontjes over dozen-berekening"
        ]
      },
      {
        clientName: "Vloerenboer.nl",
        label: "Laminaat & PVC · Webshop",
        tag: "E-commerce · Magento 2 / Hyvä",
        tone: "light",
        benefit:
          "Vloerenshop met 300+ laminaat- en PVC-producten. Klanten bestellen nu automatisch de juiste hoeveelheid pakken. Extra effect: snijverlies-dropdown zorgt dat klanten 5-10% meer bestellen dan zelf gedacht (bewust advies), wat AOV +18% oplevert.",
        highlights: [
          "AOV +18% door snijverlies-dropdown",
          "Klanten bestellen bewust juiste hoeveelheid"
        ]
      },
      {
        clientName: "Behangshop Klassiek",
        label: "Behang · Webshop",
        tag: "E-commerce · Magento 2",
        tone: "peach",
        benefit:
          "Behang-webshop met 400 SKU's. Zelfde principe: klanten denken in m² wanden, kopen in rollen. Calculator berekent aantal rollen op basis van wandhoogte + breedte + snijverlies. Cart-abandonment op productpagina's daalde met 34%.",
        highlights: [
          "Cart-abandonment op productpagina's -34%",
          "Ook werkend voor rollen ipv dozen"
        ]
      }
    ],
    servicePricing: {
      externalUrl: "https://hazenco.nl/contact/",
      oneTime: {
        priceCents: 79500,
        originalPriceCents: 119500,
        description:
          "Eenmalige installatie + Hyvä Tailwind build + attribuut-setup + bulk-vullen top 200 SKU's + styling in jouw huisstijl. Daarna €29/mnd voor updates en support."
      },
      subscription: {
        priceCentsPerMonth: 4900,
        originalPriceCentsPerMonth: 7900,
        minMonths: 12,
        description:
          "All-in: installatie, hosting van Product Manager config, doorlopende SKU-onderhoud (nieuwe producten krijgen automatisch m²-waarde), updates en support."
      },
      highlight: "subscription",
      usps: [
        "Live binnen 5-7 werkdagen",
        "Native Magento 2 / Hyvä module",
        "Werkt op elk Hyvä-theme via JS-observer",
        "GA4 tracking + kortinglook inbegrepen"
      ]
    },
    serviceMeta: {
      duration: "5-7 werkdagen tot live",
      revisions: "Onbeperkt styling + attribuut-waardes wijzigen",
      supportPeriod: "Doorlopend zolang abonnement loopt"
    }
  }
];

