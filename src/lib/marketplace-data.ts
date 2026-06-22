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
    savedListings: ["listing_invoice_agent", "listing_bol_sync"],
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
    id: "listing_invoice_agent",
    sellerId: "seller_hazenco",
    title: "Factuur AI Verwerker",
    slug: "factuur-ai-verwerker",
    tagline: "Laat inkomende facturen automatisch lezen, controleren en klaarzetten.",
    description:
      "Een AI-agent workflow die inkomende facturen uit mailboxen haalt, kerngegevens controleert, afwijkingen markeert en alles overzichtelijk naar je boekhoudproces doorzet.",
    categoryId: "cat_agents",
    type: "ai_agent",
    useCases: ["workflow_automation", "data_integration", "email_marketing"],
    branches: ["financial", "professional_services", "general"],
    priceCents: 14900,
    setupPriceCents: 24900,
    status: "published",
    featured: true,
    compatibility: ["n8n", "Gmail", "Outlook", "Google Drive", "Moneybird"],
    tags: ["Finance", "Documenten", "OCR", "MKB"],
    deliveryModes: ["download", "cloud", "custom"],
    files: [
      { id: "asset_invoice_json", name: "n8n-workflow-factuur-ai.json", kind: "workflow-json", sizeLabel: "84 KB", private: true },
      { id: "asset_invoice_docs", name: "installatiehandleiding.pdf", kind: "documentation", sizeLabel: "1.4 MB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/factuur-ai",
      screenshots: ["Inbox check", "Factuur extractie", "Controle dashboard"],
      instructions: "Gebruik de voorbeeldfactuur en bekijk hoe velden, fouten en exports worden gevuld.",
      credentials: [
        { label: "Demo login", value: "demo@hazenco.nl" },
        { label: "Wachtwoord", value: "hazenco-demo" }
      ],
      sampleInput: "PDF factuur met leverancier, totaalbedrag, btw en IBAN."
    },
    downloads: 1280,
    sales: 214,
    rating: 4.9,
    reviewCount: 38,
    version: "1.6.0",
    createdAt: today(-72),
    updatedAt: today(-8),
    supportIncluded: "30 dagen hulp bij installatie"
  },
  {
    id: "listing_bol_sync",
    sellerId: "seller_hazenco",
    title: "Bol.com Order Sync",
    slug: "bol-order-sync",
    tagline: "Synchroniseer Bol.com orders met Sheets, Slack en je fulfilmentproces.",
    description:
      "Een automation pack voor Nederlandse webshops die Bol.com orders willen volgen, verrijken en doorzetten zonder handwerk.",
    categoryId: "cat_workflows",
    type: "workflow",
    useCases: ["ecommerce", "workflow_automation", "inventory"],
    branches: ["retail", "logistics"],
    priceCents: 9900,
    setupPriceCents: 19900,
    status: "published",
    featured: true,
    compatibility: ["Make", "Bol.com", "Google Sheets", "Slack", "Webhook"],
    tags: ["E-commerce", "Orders", "Bol.com", "Fulfilment"],
    deliveryModes: ["download", "cloud", "custom"],
    files: [
      { id: "asset_bol_make", name: "make-scenario-bol-sync.json", kind: "workflow-json", sizeLabel: "62 KB", private: true },
      { id: "asset_bol_docs", name: "setup-checklist.pdf", kind: "documentation", sizeLabel: "890 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/bol-sync",
      screenshots: [
        "Order import overzicht",
        "Make scenario flow",
        "Status mapping configuratie",
        "Slack melding preview",
        "Foutlog & monitoring"
      ],
      instructions: "Bekijk een order die automatisch door de controles loopt en in de juiste status eindigt.",
      credentials: [{ label: "Demo workspace", value: "Alleen lezen" }],
      sampleInput: "Bol.com order webhook met verzendstatus en klantreferentie."
    },
    downloads: 934,
    sales: 176,
    rating: 4.8,
    reviewCount: 29,
    version: "2.1.3",
    createdAt: today(-60),
    updatedAt: today(-4),
    supportIncluded: "14 dagen support"
  },
  {
    id: "listing_wp_speed_plugin",
    sellerId: "seller_dataflow",
    title: "WP Speed Check Plugin",
    slug: "wp-speed-check-plugin",
    tagline: "Monitor WordPress performance en krijg praktische optimalisatie-acties.",
    description:
      "Een lichtgewicht plugin die periodiek snelheid, cache-status en zware scripts controleert en concrete verbeterpunten toont.",
    categoryId: "cat_plugins",
    type: "plugin",
    useCases: ["analytics", "ecommerce"],
    branches: ["retail", "marketing_media", "ict"],
    priceCents: 5900,
    setupPriceCents: 12900,
    status: "published",
    featured: false,
    compatibility: ["WordPress", "WooCommerce", "PHP 8+"],
    tags: ["WordPress", "Performance", "Monitoring"],
    deliveryModes: ["download", "custom"],
    files: [
      { id: "asset_wp_zip", name: "wp-speed-check.zip", kind: "plugin-zip", sizeLabel: "420 KB", private: true },
      { id: "asset_wp_docs", name: "readme.pdf", kind: "documentation", sizeLabel: "510 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/wp-speed",
      screenshots: ["Score overzicht", "Script analyse", "Advieslijst"],
      instructions: "Klik door de rapportage en bekijk de prioriteitenlijst voor een testsite.",
      credentials: [{ label: "Demo modus", value: "Geen login nodig" }],
      sampleInput: "WordPress site URL met WooCommerce checkout."
    },
    downloads: 522,
    sales: 94,
    rating: 4.6,
    reviewCount: 14,
    version: "1.2.0",
    createdAt: today(-35),
    updatedAt: today(-2),
    supportIncluded: "7 dagen installatievragen"
  },
  {
    id: "listing_support_skill",
    sellerId: "seller_hazenco",
    title: "Klantenservice Triage Skill",
    slug: "klantenservice-triage-skill",
    tagline: "Classificeer vragen, prioriteiten en conceptantwoorden in duidelijke taal.",
    description:
      "Een herbruikbare skill pack voor AI-assistenten die supportmails samenvat, prioriteert en een nette conceptherhaling opstelt.",
    categoryId: "cat_skills",
    type: "skill",
    useCases: ["customer_support", "chatbot", "email_marketing"],
    branches: ["general", "ict", "professional_services"],
    priceCents: 7900,
    setupPriceCents: 14900,
    status: "published",
    featured: false,
    compatibility: ["OpenAI", "Claude", "Gmail", "Zendesk", "Freshdesk"],
    tags: ["Support", "AI", "E-mail", "SLA"],
    deliveryModes: ["download", "cloud"],
    files: [
      { id: "asset_support_pack", name: "support-triage-skill-pack.zip", kind: "skill-pack", sizeLabel: "310 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/support-skill",
      screenshots: ["Inbox triage", "SLA label", "Antwoord concept"],
      instructions: "Plak een voorbeeldmail en bekijk hoe prioriteit, toon en actiepunten worden bepaald.",
      credentials: [{ label: "Demo", value: "Voorbeelddata inbegrepen" }],
      sampleInput: "Klantmail met klacht, ordernummer en urgent verzoek."
    },
    downloads: 418,
    sales: 73,
    rating: 4.7,
    reviewCount: 11,
    version: "1.4.1",
    createdAt: today(-22),
    updatedAt: today(-1),
    supportIncluded: "30 dagen prompt-afstemming"
  },
  {
    id: "listing_portal_theme",
    sellerId: "seller_frontkit",
    title: "Service Portal Theme",
    slug: "service-portal-theme",
    tagline: "Een rustige portal theme voor support, downloads en klantomgevingen.",
    description:
      "Een moderne theme set met dashboard, ticketlijst, bestandenbibliotheek en statuspagina. Gericht op servicebedrijven in Europa.",
    categoryId: "cat_themes",
    type: "theme",
    useCases: ["customer_support", "crm"],
    branches: ["professional_services", "ict"],
    priceCents: 8900,
    setupPriceCents: 18900,
    status: "published",
    featured: true,
    compatibility: ["Next.js", "Tailwind", "React", "Supabase"],
    tags: ["Portal", "Theme", "Dashboard", "Support"],
    deliveryModes: ["download", "custom"],
    files: [
      { id: "asset_portal_theme", name: "service-portal-theme.zip", kind: "theme-zip", sizeLabel: "2.8 MB", private: true },
      { id: "asset_portal_docs", name: "theme-documentatie.pdf", kind: "documentation", sizeLabel: "1.1 MB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/service-portal",
      screenshots: ["Klantdashboard", "Tickets", "Bestanden"],
      instructions: "Loop door de klantportal met voorbeeldtickets en een downloadbibliotheek.",
      credentials: [
        { label: "Demo login", value: "portal@demo.nl" },
        { label: "Wachtwoord", value: "portal-demo" }
      ],
      sampleInput: "Klantaccount met drie open tickets en twee contractdocumenten."
    },
    downloads: 803,
    sales: 121,
    rating: 4.8,
    reviewCount: 22,
    version: "3.0.0",
    createdAt: today(-45),
    updatedAt: today(-6),
    supportIncluded: "14 dagen theme support"
  },
  {
    id: "listing_meeting_template",
    sellerId: "seller_dataflow",
    title: "Meeting naar Actielijst Template",
    slug: "meeting-naar-actielijst-template",
    tagline: "Van transcript naar besluiten, taken en opvolgmail in een paar minuten.",
    description:
      "Een template pack voor teams die vergadernotities automatisch willen omzetten naar taken, besluiten en nette follow-ups.",
    categoryId: "cat_templates",
    type: "template",
    useCases: ["project_management", "workflow_automation"],
    branches: ["general", "professional_services", "education"],
    priceCents: 3900,
    setupPriceCents: 9900,
    status: "published",
    featured: false,
    compatibility: ["Notion", "Google Docs", "Teams", "Zoom", "OpenAI"],
    tags: ["Productiviteit", "Meeting", "Notion", "Teams"],
    deliveryModes: ["download", "cloud"],
    files: [
      { id: "asset_meeting_template", name: "meeting-actielijst-template.zip", kind: "template-file", sizeLabel: "740 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/meeting-template",
      screenshots: ["Transcript input", "Actielijst", "Follow-up mail"],
      instructions: "Gebruik het voorbeeldtranscript en bekijk de gegenereerde actielijst.",
      credentials: [{ label: "Demo", value: "Voorbeeld transcript inbegrepen" }],
      sampleInput: "Meeting transcript met besluiten, acties en eigenaren."
    },
    downloads: 612,
    sales: 158,
    rating: 4.5,
    reviewCount: 17,
    version: "1.1.0",
    createdAt: today(-14),
    updatedAt: today(-3),
    supportIncluded: "7 dagen vragen over gebruik"
  },
  {
    id: "listing_browser_extension",
    sellerId: "seller_frontkit",
    title: "CRM Quick Note Extensie",
    slug: "crm-quick-note-extensie",
    tagline: "Maak vanuit je browser direct CRM-notities met context en follow-up.",
    description:
      "Een browserextensie die geselecteerde tekst omzet naar nette CRM-notities, inclusief follow-updatum en samenvatting.",
    categoryId: "cat_extensions",
    type: "extension",
    useCases: ["crm", "lead_generation"],
    branches: ["professional_services", "marketing_media"],
    priceCents: 6900,
    setupPriceCents: 14900,
    status: "pending",
    featured: false,
    compatibility: ["Chrome", "Edge", "HubSpot", "Pipedrive"],
    tags: ["CRM", "Browser", "Sales"],
    deliveryModes: ["download", "custom"],
    files: [
      { id: "asset_crm_ext", name: "crm-quick-note-extension.zip", kind: "plugin-zip", sizeLabel: "1.2 MB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/crm-note",
      screenshots: ["Contextmenu", "CRM veldmapping", "Follow-up"],
      instructions: "Selecteer tekst in het voorbeeldscherm en bekijk de notitie-preview.",
      credentials: [{ label: "Demo", value: "Geen login nodig" }],
      sampleInput: "Geselecteerde tekst uit LinkedIn of e-mail."
    },
    downloads: 0,
    sales: 0,
    rating: 0,
    reviewCount: 0,
    version: "0.9.0",
    createdAt: today(-2),
    updatedAt: today(-2),
    supportIncluded: "14 dagen support na publicatie"
  },
  {
    id: "listing_horeca_reservation_bot",
    sellerId: "seller_hazenco",
    title: "Horeca Reservering AI Bot",
    slug: "horeca-reservering-ai-bot",
    tagline: "AI-bot die reserveringsvragen 24/7 beantwoordt en boekingen synchroniseert.",
    description:
      "Een meertalige AI-assistent voor restaurants en hotels die reserveringsvragen via WhatsApp en mail oppakt en direct in je agenda zet.",
    categoryId: "cat_agents",
    type: "ai_agent",
    useCases: ["chatbot", "customer_support"],
    branches: ["horeca"],
    priceCents: 12900,
    setupPriceCents: 24900,
    status: "published",
    featured: true,
    compatibility: ["OpenAI", "WhatsApp", "Google Calendar", "Resengo"],
    tags: ["Horeca", "Reserveringen", "AI", "Chatbot"],
    deliveryModes: ["cloud", "custom"],
    files: [
      { id: "asset_horeca_bot", name: "horeca-bot-config.zip", kind: "skill-pack", sizeLabel: "640 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/horeca-bot",
      screenshots: ["WhatsApp gesprek", "Agenda sync", "Talen"],
      instructions: "Stuur een reservering naar de demo en bekijk hoe de bot bevestigt.",
      credentials: [{ label: "Demo nummer", value: "+31 6 00 00 00 00" }],
      sampleInput: "Klant vraagt om tafel voor 4 personen vrijdag 19:30."
    },
    downloads: 312,
    sales: 87,
    rating: 4.8,
    reviewCount: 13,
    version: "1.3.0",
    createdAt: today(-30),
    updatedAt: today(-3),
    supportIncluded: "30 dagen support"
  },
  {
    id: "listing_notion_crm_pack",
    sellerId: "seller_frontkit",
    title: "Notion CRM Template Pack",
    slug: "notion-crm-template-pack",
    tagline: "Een lichtgewicht CRM in Notion met pipeline, contacten en follow-ups.",
    description:
      "Een uitgebreid Notion-template pakket voor mkb-teams die een eenvoudige CRM willen zonder dure tools.",
    categoryId: "cat_templates",
    type: "template",
    useCases: ["crm", "lead_generation"],
    branches: ["professional_services", "general"],
    priceCents: 2900,
    setupPriceCents: 7900,
    status: "published",
    featured: false,
    compatibility: ["Notion"],
    tags: ["CRM", "Notion", "MKB", "Pipeline"],
    deliveryModes: ["download"],
    files: [
      { id: "asset_notion_crm", name: "notion-crm-pack.zip", kind: "template-file", sizeLabel: "420 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/notion-crm",
      screenshots: ["Pipeline", "Contacten", "Follow-up"],
      instructions: "Duplicate het Notion template en vul je eerste deals in.",
      credentials: [{ label: "Demo", value: "Read-only Notion link" }],
      sampleInput: "Voorbeelddeals en contactgegevens."
    },
    downloads: 720,
    sales: 198,
    rating: 4.6,
    reviewCount: 24,
    version: "2.0.0",
    createdAt: today(-50),
    updatedAt: today(-7),
    supportIncluded: "7 dagen vragen"
  },
  {
    id: "listing_healthcare_agenda_sync",
    sellerId: "seller_dataflow",
    title: "Zorg Agenda Sync Workflow",
    slug: "zorg-agenda-sync-workflow",
    tagline: "Synchroniseer behandelagenda's tussen praktijksoftware en patiëntportaal.",
    description:
      "Een Make-scenario voor zorginstellingen dat agenda's, afspraken en herinneringen netjes synchroniseert volgens AVG-richtlijnen.",
    categoryId: "cat_workflows",
    type: "workflow",
    useCases: ["workflow_automation", "data_integration"],
    branches: ["healthcare"],
    priceCents: 14900,
    setupPriceCents: 29900,
    status: "published",
    featured: false,
    compatibility: ["Make", "Google Calendar", "Outlook", "Webhook"],
    tags: ["Zorg", "Agenda", "AVG", "Synchronisatie"],
    deliveryModes: ["download", "custom"],
    files: [
      { id: "asset_zorg_sync", name: "zorg-agenda-sync.json", kind: "workflow-json", sizeLabel: "72 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/zorg-agenda",
      screenshots: ["Sync flow", "Patient view", "Audit log"],
      instructions: "Bekijk hoe een afspraak van praktijksysteem naar patiëntenportaal stroomt.",
      credentials: [{ label: "Demo", value: "Read-only voorbeelddata" }],
      sampleInput: "Nieuwe afspraak in praktijksysteem."
    },
    downloads: 184,
    sales: 42,
    rating: 4.7,
    reviewCount: 8,
    version: "1.0.2",
    createdAt: today(-40),
    updatedAt: today(-5),
    supportIncluded: "14 dagen support"
  },
  {
    id: "listing_woocommerce_cross_sell",
    sellerId: "seller_hazenco",
    title: "WooCommerce Cross-Sell Plugin",
    slug: "woocommerce-cross-sell-plugin",
    tagline: "Automatisch passende producten tonen bij de checkout om je AOV te verhogen.",
    description:
      "Een lichtgewicht plugin die op basis van bestelhistorie en producteigenschappen relevante aanvullende producten suggereert.",
    categoryId: "cat_plugins",
    type: "plugin",
    useCases: ["ecommerce", "marketing"],
    branches: ["retail"],
    priceCents: 4900,
    setupPriceCents: 11900,
    status: "published",
    featured: true,
    compatibility: ["WordPress", "WooCommerce", "PHP 8+"],
    tags: ["WooCommerce", "Cross-sell", "Conversie"],
    deliveryModes: ["download", "cloud"],
    files: [
      { id: "asset_woo_cross", name: "woo-cross-sell.zip", kind: "plugin-zip", sizeLabel: "380 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/woo-cross-sell",
      screenshots: ["Productpagina", "Checkout block", "Rapportage"],
      instructions: "Bekijk hoe het algoritme producten kiest op basis van wagencombinaties.",
      credentials: [{ label: "Demo", value: "Geen login nodig" }],
      sampleInput: "Winkelmand met twee producten."
    },
    downloads: 1042,
    sales: 263,
    rating: 4.7,
    reviewCount: 31,
    version: "2.4.1",
    createdAt: today(-65),
    updatedAt: today(-2),
    supportIncluded: "30 dagen plugin support"
  },
  {
    id: "listing_bouw_offerte_ai",
    sellerId: "seller_hazenco",
    title: "Bouw Offerte Generator AI",
    slug: "bouw-offerte-generator-ai",
    tagline: "Snelle, professionele offertes voor aannemers op basis van werkomschrijving.",
    description:
      "Een AI-agent voor bouw- en installatiebedrijven die uit een korte projectbeschrijving een nette offerte met posten en kosten opstelt.",
    categoryId: "cat_agents",
    type: "ai_agent",
    useCases: ["form_builder", "workflow_automation"],
    branches: ["construction"],
    priceCents: 19900,
    setupPriceCents: 39900,
    status: "published",
    featured: true,
    compatibility: ["OpenAI", "Word", "Google Docs", "Exact"],
    tags: ["Bouw", "Offertes", "AI", "MKB"],
    deliveryModes: ["cloud", "custom"],
    files: [
      { id: "asset_bouw_offerte", name: "bouw-offerte-template.zip", kind: "skill-pack", sizeLabel: "520 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/bouw-offerte",
      screenshots: ["Project input", "Offerte preview", "Posten lijst"],
      instructions: "Geef een korte werkbeschrijving en zie hoe de offerte wordt opgebouwd.",
      credentials: [{ label: "Demo", value: "Voorbeeldproject inbegrepen" }],
      sampleInput: "Renovatie badkamer 8m² met sanitair en tegelwerk."
    },
    downloads: 246,
    sales: 64,
    rating: 4.8,
    reviewCount: 11,
    version: "1.2.0",
    createdAt: today(-25),
    updatedAt: today(-4),
    supportIncluded: "30 dagen support + 1 maatwerksessie"
  },
  {
    id: "listing_mollie_status_workflow",
    sellerId: "seller_dataflow",
    title: "Mollie Payment Status Workflow",
    slug: "mollie-payment-status-workflow",
    tagline: "Houd je teams direct op de hoogte van betaalstatussen in Slack of Teams.",
    description:
      "Een gratis n8n workflow die Mollie webhooks vertaalt naar overzichtelijke meldingen in Slack of Microsoft Teams.",
    categoryId: "cat_workflows",
    type: "workflow",
    useCases: ["payment_processing", "workflow_automation"],
    branches: ["general", "retail"],
    priceCents: 0,
    setupPriceCents: 5900,
    status: "published",
    featured: false,
    compatibility: ["n8n", "Mollie", "Slack", "Microsoft Teams"],
    tags: ["Betalingen", "Mollie", "Gratis", "Notificaties"],
    deliveryModes: ["download"],
    files: [
      { id: "asset_mollie_flow", name: "mollie-status-flow.json", kind: "workflow-json", sizeLabel: "28 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/mollie-status",
      screenshots: ["Webhook ontvangst", "Slack melding", "Statusbord"],
      instructions: "Trigger een test-betaalstatus en zie de melding verschijnen.",
      credentials: [{ label: "Demo", value: "Geen login nodig" }],
      sampleInput: "Mollie webhook met betaalstatus 'paid'."
    },
    downloads: 2410,
    sales: 0,
    rating: 4.5,
    reviewCount: 42,
    version: "1.4.0",
    createdAt: today(-90),
    updatedAt: today(-9),
    supportIncluded: "Community support"
  },
  {
    id: "listing_marketing_dashboard",
    sellerId: "seller_dataflow",
    title: "Marketing Performance Dashboard",
    slug: "marketing-performance-dashboard",
    tagline: "Eén dashboard met je belangrijkste marketingmetrieken uit alle kanalen.",
    description:
      "Een Looker Studio template dat data uit Google Ads, Meta, LinkedIn en GA4 samenvoegt tot een overzichtelijk weekrapport.",
    categoryId: "cat_templates",
    type: "template",
    useCases: ["analytics", "marketing"],
    branches: ["marketing_media", "retail"],
    priceCents: 7900,
    setupPriceCents: 16900,
    status: "published",
    featured: false,
    compatibility: ["Looker Studio", "Google Ads", "Meta", "LinkedIn Ads", "GA4"],
    tags: ["Marketing", "Dashboard", "Reporting", "Looker"],
    deliveryModes: ["download", "custom"],
    files: [
      { id: "asset_mkt_dash", name: "marketing-dashboard-template.zip", kind: "template-file", sizeLabel: "1.1 MB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/marketing-dashboard",
      screenshots: ["Overzicht", "Channel breakdown", "Trend grafieken"],
      instructions: "Open het dashboard en wissel tussen kanalen en periodes.",
      credentials: [{ label: "Demo", value: "Read-only Looker link" }],
      sampleInput: "Verbonden marketing accounts met 90 dagen data."
    },
    downloads: 530,
    sales: 142,
    rating: 4.6,
    reviewCount: 19,
    version: "3.1.0",
    createdAt: today(-58),
    updatedAt: today(-6),
    supportIncluded: "14 dagen support"
  },
  {
    id: "listing_shopify_inventory_sync",
    sellerId: "seller_hazenco",
    title: "Shopify Inventory Sync",
    slug: "shopify-inventory-sync",
    tagline: "Houd voorraden in Shopify gelijk met je magazijn en marketplaces.",
    description:
      "Een Make-scenario dat voorraadwijzigingen vanuit Shopify doorzet naar Bol.com, Amazon en je magazijnsysteem.",
    categoryId: "cat_workflows",
    type: "workflow",
    useCases: ["inventory", "ecommerce"],
    branches: ["retail", "logistics"],
    priceCents: 11900,
    setupPriceCents: 22900,
    status: "published",
    featured: false,
    compatibility: ["Make", "Shopify", "Bol.com", "Amazon", "Picqer"],
    tags: ["Shopify", "Voorraad", "E-commerce", "Marketplace"],
    deliveryModes: ["download", "cloud", "custom"],
    files: [
      { id: "asset_shopify_sync", name: "shopify-inventory-sync.json", kind: "workflow-json", sizeLabel: "58 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/shopify-inventory",
      screenshots: ["Sync overzicht", "Marketplace status", "Foutlog"],
      instructions: "Pas een voorraad aan in de demo Shopify en zie de sync.",
      credentials: [{ label: "Demo", value: "Voorbeeld winkel" }],
      sampleInput: "Voorraadwijziging op productvariant."
    },
    downloads: 612,
    sales: 138,
    rating: 4.7,
    reviewCount: 21,
    version: "1.5.0",
    createdAt: today(-42),
    updatedAt: today(-3),
    supportIncluded: "21 dagen support"
  },
  {
    id: "listing_education_quiz_builder",
    sellerId: "seller_frontkit",
    title: "Education Quiz Builder",
    slug: "education-quiz-builder",
    tagline: "Snel interactieve toetsen bouwen voor klas of online lesomgeving.",
    description:
      "Een lichte React-toepassing voor docenten om quizzen, automatische nakijking en feedback per leerling te beheren.",
    categoryId: "cat_templates",
    type: "template",
    useCases: ["form_builder", "other"],
    branches: ["education"],
    priceCents: 1900,
    setupPriceCents: 4900,
    status: "published",
    featured: false,
    compatibility: ["React", "Next.js", "Supabase"],
    tags: ["Onderwijs", "Quiz", "Toetsing"],
    deliveryModes: ["download", "cloud"],
    files: [
      { id: "asset_quiz_builder", name: "quiz-builder.zip", kind: "template-file", sizeLabel: "830 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/quiz-builder",
      screenshots: ["Quiz aanmaken", "Resultatenview", "Feedback"],
      instructions: "Maak een quiz en speel hem af in de demo.",
      credentials: [{ label: "Demo docent", value: "demo@school.nl" }],
      sampleInput: "Quiz met 10 meerkeuzevragen."
    },
    downloads: 388,
    sales: 96,
    rating: 4.5,
    reviewCount: 14,
    version: "1.1.0",
    createdAt: today(-32),
    updatedAt: today(-8),
    supportIncluded: "14 dagen support"
  },
  {
    id: "listing_feedback_survey_ai",
    sellerId: "seller_hazenco",
    title: "Klantfeedback Samenvatting AI",
    slug: "klantfeedback-samenvatting-ai",
    tagline: "Vat duizenden reviews en surveys samen tot actiepunten.",
    description:
      "Een AI-agent die ongestructureerde klantfeedback uit Typeform, Trustpilot en Google reviews verwerkt tot thema's en aanbevelingen.",
    categoryId: "cat_agents",
    type: "ai_agent",
    useCases: ["customer_support", "analytics"],
    branches: ["general", "retail"],
    priceCents: 9900,
    setupPriceCents: 18900,
    status: "published",
    featured: false,
    compatibility: ["OpenAI", "Typeform", "Trustpilot", "Google Business"],
    tags: ["Feedback", "AI", "Reviews", "Survey"],
    deliveryModes: ["cloud", "custom"],
    files: [
      { id: "asset_feedback_ai", name: "feedback-ai-config.zip", kind: "skill-pack", sizeLabel: "290 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/feedback-ai",
      screenshots: ["Bronselectie", "Thema's", "Actielijst"],
      instructions: "Laad een sample dataset en bekijk de gegenereerde thema's.",
      credentials: [{ label: "Demo", value: "Voorbeelddata inbegrepen" }],
      sampleInput: "500 mixed reviews uit 3 bronnen."
    },
    downloads: 462,
    sales: 108,
    rating: 4.6,
    reviewCount: 16,
    version: "2.0.0",
    createdAt: today(-48),
    updatedAt: today(-5),
    supportIncluded: "21 dagen support"
  },
  {
    id: "listing_linkedin_outreach_skill",
    sellerId: "seller_dataflow",
    title: "LinkedIn Outreach Skill",
    slug: "linkedin-outreach-skill",
    tagline: "Persoonlijke connectieverzoeken en follow-ups voor sales teams.",
    description:
      "Een AI skill pack die op basis van LinkedIn-profielen relevante openers en opvolgberichten schrijft, afgestemd op je tone of voice.",
    categoryId: "cat_skills",
    type: "skill",
    useCases: ["lead_generation", "social_media"],
    branches: ["marketing_media", "professional_services"],
    priceCents: 5900,
    setupPriceCents: 11900,
    status: "published",
    featured: false,
    compatibility: ["OpenAI", "Claude", "LinkedIn", "HubSpot"],
    tags: ["LinkedIn", "Sales", "Outreach", "AI"],
    deliveryModes: ["download", "cloud"],
    files: [
      { id: "asset_linkedin_skill", name: "linkedin-outreach-skill.zip", kind: "skill-pack", sizeLabel: "180 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/linkedin-outreach",
      screenshots: ["Profiel input", "Concept message", "Follow-up reeks"],
      instructions: "Plak een LinkedIn URL en bekijk de gegenereerde openers.",
      credentials: [{ label: "Demo", value: "Geen login nodig" }],
      sampleInput: "LinkedIn profiel URL van prospect."
    },
    downloads: 794,
    sales: 187,
    rating: 4.7,
    reviewCount: 28,
    version: "1.6.2",
    createdAt: today(-38),
    updatedAt: today(-2),
    supportIncluded: "14 dagen support"
  },
  {
    id: "listing_whatsapp_chatbot",
    sellerId: "seller_hazenco",
    title: "WhatsApp Business Chatbot",
    slug: "whatsapp-business-chatbot",
    tagline: "AI-chatbot die WhatsApp-vragen 24/7 oppakt en sales doorzet.",
    description:
      "Een complete WhatsApp Business chatbot die FAQ's beantwoordt, leads kwalificeert en sales handover naar je team doet.",
    categoryId: "cat_agents",
    type: "ai_agent",
    useCases: ["chatbot", "customer_support", "lead_generation"],
    branches: ["retail", "general", "horeca"],
    priceCents: 14900,
    setupPriceCents: 29900,
    status: "published",
    featured: true,
    compatibility: ["WhatsApp Business", "OpenAI", "HubSpot", "Pipedrive"],
    tags: ["WhatsApp", "Chatbot", "AI", "Sales"],
    deliveryModes: ["cloud", "custom"],
    files: [
      { id: "asset_wa_bot", name: "whatsapp-bot-pack.zip", kind: "skill-pack", sizeLabel: "740 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/whatsapp-bot",
      screenshots: ["WhatsApp UI", "Intent flow", "Handover"],
      instructions: "Stuur een bericht naar het demo nummer en doorloop een scenario.",
      credentials: [{ label: "Demo nummer", value: "+31 6 12 34 56 78" }],
      sampleInput: "Klantvraag over openingstijden en levertijd."
    },
    downloads: 1180,
    sales: 224,
    rating: 4.9,
    reviewCount: 36,
    version: "2.3.0",
    createdAt: today(-55),
    updatedAt: today(-1),
    supportIncluded: "30 dagen support"
  },
  {
    id: "listing_logistics_track_trace",
    sellerId: "seller_frontkit",
    title: "Track & Trace Klantpagina",
    slug: "track-trace-klantpagina",
    tagline: "Witlabel track & trace pagina voor logistieke partners.",
    description:
      "Een Next.js theme met een complete track & trace ervaring die meerdere koeriers koppelt en alerts naar klanten stuurt.",
    categoryId: "cat_themes",
    type: "theme",
    useCases: ["other", "ecommerce"],
    branches: ["logistics", "retail"],
    priceCents: 10900,
    setupPriceCents: 22900,
    status: "published",
    featured: false,
    compatibility: ["Next.js", "Tailwind", "PostNL", "DHL", "DPD"],
    tags: ["Logistiek", "Track & Trace", "Theme", "Klantenportaal"],
    deliveryModes: ["download", "custom"],
    files: [
      { id: "asset_track_theme", name: "track-trace-theme.zip", kind: "theme-zip", sizeLabel: "2.4 MB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/track-trace",
      screenshots: ["Klantweergave", "Koppelingen", "Mail alerts"],
      instructions: "Voer een voorbeeld trackingnummer in en bekijk de updates.",
      credentials: [{ label: "Demo", value: "Geen login" }],
      sampleInput: "PostNL tracking nummer."
    },
    downloads: 318,
    sales: 71,
    rating: 4.5,
    reviewCount: 10,
    version: "1.0.4",
    createdAt: today(-28),
    updatedAt: today(-7),
    supportIncluded: "14 dagen theme support"
  },
  {
    id: "listing_govt_procurement_template",
    sellerId: "seller_dataflow",
    title: "Aanbesteding Tracking Template",
    slug: "aanbesteding-tracking-template",
    tagline: "Volg openbare aanbestedingen overzichtelijk in een Airtable-base.",
    description:
      "Een Airtable template voor overheids- en non-profitteams die meerdere aanbestedingen tegelijk willen volgen met deadlines en taakverdeling.",
    categoryId: "cat_templates",
    type: "template",
    useCases: ["project_management", "other"],
    branches: ["government", "professional_services"],
    priceCents: 3900,
    setupPriceCents: 8900,
    status: "published",
    featured: false,
    compatibility: ["Airtable", "Google Drive"],
    tags: ["Overheid", "Aanbesteding", "Tracking", "Project"],
    deliveryModes: ["download"],
    files: [
      { id: "asset_govt_tender", name: "aanbesteding-tracker.zip", kind: "template-file", sizeLabel: "210 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/aanbesteding",
      screenshots: ["Overzicht", "Detail aanbesteding", "Deadlines"],
      instructions: "Bekijk een base met 5 lopende aanbestedingen.",
      credentials: [{ label: "Demo", value: "Read-only Airtable link" }],
      sampleInput: "Lijst met aanbestedingen uit TenderNed."
    },
    downloads: 168,
    sales: 44,
    rating: 4.4,
    reviewCount: 7,
    version: "1.0.0",
    createdAt: today(-22),
    updatedAt: today(-10),
    supportIncluded: "7 dagen support"
  },
  {
    id: "listing_ict_onboarding_service",
    sellerId: "seller_hazenco",
    title: "ICT Onboarding Service Pack",
    slug: "ict-onboarding-service-pack",
    tagline: "Begeleidde IT-onboarding voor nieuwe medewerkers bij scale-ups.",
    description:
      "Een maatwerkpakket voor IT-teams: accountprovisioning, hardware setup checklist en eerste-week handover, uitgevoerd door onze consultants.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["project_management", "customer_support"],
    branches: ["ict", "general"],
    priceCents: 49900,
    setupPriceCents: 0,
    status: "published",
    featured: false,
    compatibility: ["Google Workspace", "Microsoft 365", "Okta", "Jamf"],
    tags: ["IT", "Onboarding", "Servicepakket"],
    deliveryModes: ["custom"],
    files: [
      { id: "asset_ict_onb", name: "ict-onboarding-playbook.pdf", kind: "documentation", sizeLabel: "1.8 MB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/ict-onboarding",
      screenshots: ["Playbook", "Checklist", "Tooling overzicht"],
      instructions: "Bekijk het playbook en het tooling-overzicht voor scale-ups.",
      credentials: [{ label: "Demo", value: "PDF preview" }],
      sampleInput: "Team van 10 nieuwe medewerkers."
    },
    downloads: 92,
    sales: 28,
    rating: 4.9,
    reviewCount: 6,
    version: "1.0.0",
    createdAt: today(-18),
    updatedAt: today(-4),
    supportIncluded: "Inclusief 3 sessies van 1 uur"
  },
  {
    id: "listing_email_marketing_skill",
    sellerId: "seller_dataflow",
    title: "Email Marketing AI Schrijver",
    slug: "email-marketing-ai-schrijver",
    tagline: "Variantrijke campagne-emails met juiste tone-of-voice.",
    description:
      "Een AI skill pack die op basis van je merkrichtlijnen en campagnedoel meerdere e-mailvarianten met onderwerpregels schrijft.",
    categoryId: "cat_skills",
    type: "skill",
    useCases: ["email_marketing", "marketing"],
    branches: ["marketing_media", "retail"],
    priceCents: 4900,
    setupPriceCents: 9900,
    status: "published",
    featured: false,
    compatibility: ["OpenAI", "Claude", "Mailchimp", "Klaviyo", "Brevo"],
    tags: ["E-mail", "Marketing", "AI", "Copy"],
    deliveryModes: ["download", "cloud"],
    files: [
      { id: "asset_mail_skill", name: "email-marketing-skill.zip", kind: "skill-pack", sizeLabel: "150 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/email-skill",
      screenshots: ["Brief input", "Mailvarianten", "Subject lines"],
      instructions: "Geef een briefing en bekijk 5 mailvarianten.",
      credentials: [{ label: "Demo", value: "Voorbeeld merkrichtlijnen" }],
      sampleInput: "Black Friday promotie 30% korting."
    },
    downloads: 982,
    sales: 241,
    rating: 4.7,
    reviewCount: 33,
    version: "1.8.0",
    createdAt: today(-44),
    updatedAt: today(-2),
    supportIncluded: "14 dagen support"
  },
  {
    id: "listing_real_estate_lead_form",
    sellerId: "seller_frontkit",
    title: "Makelaar Lead Form Extensie",
    slug: "makelaar-lead-form-extensie",
    tagline: "Slimme contactformulieren voor makelaars met automatische lead scoring.",
    description:
      "Een browserextensie die op makelaarsites slimme lead formulieren injecteert met directe doorzetting naar je CRM en lead-score.",
    categoryId: "cat_extensions",
    type: "extension",
    useCases: ["lead_generation", "form_builder"],
    branches: ["professional_services"],
    priceCents: 7900,
    setupPriceCents: 14900,
    status: "published",
    featured: false,
    compatibility: ["Chrome", "Edge", "Pipedrive", "HubSpot"],
    tags: ["Makelaar", "Leads", "Form"],
    deliveryModes: ["download", "custom"],
    files: [
      { id: "asset_re_form", name: "makelaar-lead-form.zip", kind: "plugin-zip", sizeLabel: "920 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/makelaar-form",
      screenshots: ["Formulier injectie", "CRM mapping", "Lead score"],
      instructions: "Open de demo makelaarsite en vul een lead in.",
      credentials: [{ label: "Demo", value: "Voorbeeldsite ingebed" }],
      sampleInput: "Bezoeker vraagt bezichtiging aan."
    },
    downloads: 264,
    sales: 58,
    rating: 4.5,
    reviewCount: 9,
    version: "1.1.1",
    createdAt: today(-20),
    updatedAt: today(-6),
    supportIncluded: "14 dagen support"
  },
  {
    id: "listing_stripe_dashboard_theme",
    sellerId: "seller_frontkit",
    title: "Stripe Payments Dashboard Theme",
    slug: "stripe-payments-dashboard-theme",
    tagline: "Een rustig financieel dashboard voor Stripe-data, klaar voor klanten.",
    description:
      "Een Next.js theme met Stripe-koppeling voor SaaS bedrijven: omzet, MRR, churn en grafieken met een professionele look.",
    categoryId: "cat_themes",
    type: "theme",
    useCases: ["payment_processing", "analytics"],
    branches: ["financial", "ict"],
    priceCents: 12900,
    setupPriceCents: 24900,
    status: "published",
    featured: true,
    compatibility: ["Next.js", "Tailwind", "Stripe", "Supabase"],
    tags: ["Stripe", "Dashboard", "SaaS", "Finance"],
    deliveryModes: ["download", "custom"],
    files: [
      { id: "asset_stripe_theme", name: "stripe-dashboard-theme.zip", kind: "theme-zip", sizeLabel: "3.2 MB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/stripe-dashboard",
      screenshots: ["MRR overzicht", "Customer view", "Churn analyse"],
      instructions: "Klik door het dashboard met voorbeelddata.",
      credentials: [{ label: "Demo login", value: "demo@saas.nl" }],
      sampleInput: "SaaS met 200 betalende klanten."
    },
    downloads: 596,
    sales: 134,
    rating: 4.8,
    reviewCount: 22,
    version: "2.0.1",
    createdAt: today(-36),
    updatedAt: today(-3),
    supportIncluded: "21 dagen theme support"
  },
  {
    id: "listing_restaurant_menu_social",
    sellerId: "seller_hazenco",
    title: "Restaurant Menu Social Workflow",
    slug: "restaurant-menu-social-workflow",
    tagline: "Eén menu-update, automatisch overal: site, Instagram en Facebook.",
    description:
      "Een Zapier-workflow voor restaurants die menukaarten centraal beheert en alle online kanalen ineens bijwerkt.",
    categoryId: "cat_workflows",
    type: "workflow",
    useCases: ["social_media", "marketing"],
    branches: ["horeca"],
    priceCents: 0,
    setupPriceCents: 6900,
    status: "published",
    featured: false,
    compatibility: ["Zapier", "Airtable", "Instagram", "Facebook", "Webflow"],
    tags: ["Horeca", "Menu", "Social", "Gratis"],
    deliveryModes: ["download", "cloud"],
    files: [
      { id: "asset_menu_flow", name: "menu-social-workflow.json", kind: "workflow-json", sizeLabel: "34 KB", private: true }
    ],
    demo: {
      url: "https://demo.hazenco.nl/restaurant-menu",
      screenshots: ["Menu basis", "Social posts", "Site update"],
      instructions: "Pas een menu-item aan en zie hoe alle kanalen meegaan.",
      credentials: [{ label: "Demo", value: "Voorbeeldrestaurant" }],
      sampleInput: "Nieuwe specialiteit toegevoegd aan menu."
    },
    downloads: 1820,
    sales: 0,
    rating: 4.6,
    reviewCount: 51,
    version: "1.2.0",
    createdAt: today(-70),
    updatedAt: today(-4),
    supportIncluded: "Community support"
  },
  {
    id: "listing_website_laten_maken",
    sellerId: "seller_hazenco",
    title: "Website laten maken",
    slug: "website-laten-maken",
    tagline: "Professionele website binnen weken, zonder gedoe en zonder verborgen kosten.",
    description:
      "Een professionele website is in 2026 geen luxe meer — het is de basis van je vindbaarheid, je geloofwaardigheid en je conversie. Toch blijft het voor veel ondernemers een terugkerend hoofdpijndossier. Welke builder kies je? Wie verzorgt de hosting? Wat als de site op een vrijdagmiddag offline gaat? En wie houdt de plugins up-to-date?\n\nDaar komen wij in beeld. **Hazenco ontzorgt je volledig van A tot Z**, zodat jij je tijd en aandacht kan steken in waar je écht goed in bent: ondernemen.\n\n**Een website die je bedrijf laat opvallen**\n\nWe ontwerpen en bouwen websites die niet alleen mooi zijn, maar ook werken. Conversie-gericht, mobiel-vriendelijk, snel ladend en klaar voor zoekmachines. Geen standaard template-werk dat je tien keer eerder hebt gezien, maar een ontwerp dat past bij jouw merk, jouw doelgroep en jouw doelen. Of je nu een ZZP'er bent die professioneel wil ogen, een MKB-ondernemer met een verouderde site die niet meer presteert, of een starter die geloofwaardig live wil — wij maken het mogelijk.\n\n**Twee manieren om met ons aan de slag te gaan**\n\nBij Hazenco geloven we in transparantie. Daarom hebben we geen ingewikkelde offertes, geen verborgen kosten en geen kleine lettertjes. Je kiest tussen twee duidelijke pakketten.\n\nHet *Eenmalig*-pakket is voor ondernemers die liever in één keer afrekenen. Voor €1.425 krijg je een complete website opgeleverd binnen enkele weken, inclusief professioneel ontwerp, conversie-gerichte structuur, basis-SEO en een korte training zodat je zelf inhoud kunt aanpassen. Hosting en onderhoud regel je zelf of nemen we apart van je over.\n\nHet *All-in abonnement* is voor wie écht ontzorgd wil worden. Voor €89 per maand (vanaf 24 maanden) regelen wij álles: ontwerp, bouw, premium hosting, dagelijkse backups, SSL-certificaat, plugin- en core-updates, security monitoring en directe support. Geen onverwachte rekeningen, geen technische verrassingen, geen midnight-paniek over een gehackte site. Eén vast bedrag per maand en wij houden de zaak draaiend.\n\n**Wat ons anders maakt**\n\nWe zijn geen anonieme webbouwer met een ticketsysteem waar je vraag in de wachtrij verdwijnt. Bij Hazenco krijg je één vast aanspreekpunt — iemand die jou en je bedrijf kent. Een WhatsApp-bericht, een belletje of een mailtje: je hoort dezelfde dag iets terug, niet pas over twee weken.\n\nWe werken iteratief en betrekken je actief bij het proces. Je krijgt drie ontwerprondes om de site precies zo te krijgen als je voor je ziet. We praten in gewone taal, niet in jargon. En we leveren binnen weken — niet binnen maanden.\n\n**Snel, veilig en altijd up-to-date**\n\nEen website is geen statisch ding dat je eenmalig oplevert en vergeet. Plugins krijgen updates, security-patches komen uit, technologie verandert. Met het abonnement nemen we dat continu voor je over. Dagelijkse backups betekenen dat zelfs als er iets misgaat, we binnen minuten weer live zijn. Premium hosting betekent dat je site snel laadt — belangrijk voor zowel je bezoekers als Google.\n\n**Klaar om te starten?**\n\nOf je nu vandaag begint met je eerste website, of jouw bestaande site een tweede leven wil geven — we denken graag met je mee. Geen agressieve verkoop, geen lange verkoopgesprekken en geen verplichtingen vooraf. Je vertelt ons wat je nodig hebt, wij leggen uit wat past, jij kiest.\n\nEen professionele online aanwezigheid hoeft geen hoofdpijn te zijn. Met Hazenco regel je het in één keer goed — en hou je je hoofd vrij voor je echte werk.",
    categoryId: "cat_services",
    type: "service_package",
    useCases: ["marketing", "lead_generation"],
    branches: ["general", "professional_services", "retail"],
    heroImageUrl: "https://hazenco.nl/wp-content/uploads/2026/02/Website-laten-maken.png",
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
          "Online afspraken inplannen — zonder bellen",
          "Assortiment volledig zichtbaar op mobiel"
        ],
        tone: "dark",
        imageUrl: "https://hazenco.nl/wp-content/uploads/2026/03/Oppervlakten-768x358.webp",
        url: "https://badkamerwandbekleding.nl"
      },
      {
        clientName: "Civitas advies",
        label: "Website All-in",
        tag: "MKB · Website",
        benefit:
          "Professionele website voor een adviesbureau gespecialiseerd in infrastructuur en openbare ruimte. Van ruimtelijke ontwikkeling tot asset management — alles overzichtelijk gepresenteerd.",
        highlights: [
          "Werkgebieden en diensten helder in kaart",
          "Portfolio direct vindbaar voor opdrachtgevers"
        ],
        tone: "light",
        imageUrl: "https://hazenco.nl/wp-content/uploads/2026/03/infrastructure-urbaine-genie-routier-768x768.jpg.webp",
        url: "https://civitas-advies.nl"
      },
      {
        clientName: "Magdatwel.nl",
        label: "Website Blog",
        tag: "MKB · Website",
        benefit:
          "Juridische blogwebsite waar mensen op een toegankelijke manier leren wat wel en niet mag. Weetjes, nieuws en actuele onderwerpen — begrijpelijk geschreven voor iedereen.",
        highlights: [
          "Juridische info zonder vakjargon",
          "Volledig klaar voor zoekmachines — SEO-proof"
        ],
        tone: "peach",
        imageUrl: "https://hazenco.nl/wp-content/uploads/2026/03/Screenshot-2026-03-21-190124-768x568.png.webp",
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
      "Een gemiste telefoon is een gemiste klant. En als kapper, garagehouder, tandarts of klusbedrijf weet je dat 30 tot 40% van inkomende calls onbeantwoord blijft — simpelweg omdat je handen vol zitten. De meeste van die mensen bellen geen tweede keer. Ze kiezen je concurrent.\n\nDe **AI Telefoonassistent** vangt dat op. Geen voicemail die niemand afluistert, geen receptionist die je 500 euro per maand kost. Een natuurlijk klinkende Nederlandstalige AI die binnen 30 seconden terugbelt, het probleem begrijpt, en direct een afspraak in je agenda zet.\n\n**Hoe het werkt**\n\nWe verbinden onze AI met je bestaande telefoonnummer (geen nieuw nummer, geen overschakeling voor jouw klanten). Mis je een oproep? Binnen 30 seconden belt de AI de beller terug, stelt zich voor namens jouw bedrijf, vraagt waar 'ie mee kan helpen, en plant direct in. Heeft 'ie geen ruimte in de agenda? Dan biedt 'ie 2-3 alternatieven aan. Wil de klant terugbel-verzoek? Dan zet 'ie dat in je systeem en stuurt je een Slack of WhatsApp-notificatie.\n\n**Voor wie werkt dit echt**\n\nKappers en schoonheidssalons, garages, tandartsen, fysiotherapeuten, schoonmaakbedrijven, klusbedrijven, advocatenkantoren — eigenlijk elk MKB waar de telefoon een verkoopkanaal is maar waar mensen al druk zijn met klanten in de zaak. Het breekpunt voor ROI ligt op zo'n 5 gemiste calls per week — daarboven verdien je 'm in de eerste maand terug.\n\n**Wat onze AI niet probeert**\n\nWe doen niet alsof het een mens is. Aan het begin van het gesprek zegt 'ie netjes: \"Hoi, je spreekt met de digitale assistent van Kapsalon X. Hoe kan ik je helpen?\" Klanten waarderen dat eerlijker dan iemand die doet alsof. En als de vraag te complex wordt (klacht, juridisch, gevoelig) escaleert de AI direct naar een echte terugbel-flow.\n\n**Setup en integratie**\n\nWij regelen alles. Binnen 5-7 werkdagen ben je live. We koppelen aan je telefoonprovider, leren de AI jouw bedrijfstoon, vullen 'm met jouw diensten + prijzen + openingstijden, en testen samen voordat 'ie écht klanten gaat woord-staan. Daarna doorlopend onderhoud: nieuwe diensten toevoegen, prijzen aanpassen, scripts bijschaven — allemaal zonder dat jij iets hoeft te doen.\n\n**Wat je krijgt naast de bot zelf**\n\nElke ochtend een dagrapport in je mail of Slack: wie belde, wat ze wilden, welke afspraken zijn ingepland, welke klachten escaleerden. Plus een dashboard waar je real-time kan zien wat er gebeurt. En een transcript per gesprek, mocht je iets willen nalezen.\n\n**Ook in andere talen**\n\nNederlands is standaard, maar Engels, Duits en Frans kunnen we erbij activeren als je internationale klanten hebt — €25/mnd per extra taal.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. Wij laten zien hoe het werkt, je hoort een echte voorbeeldgesprek (geen demo-acteur), en je krijgt een concrete inschatting van wat het voor jouw situatie betekent. Geen verkoopgesprek — gewoon laten zien wat het doet en jou laten beslissen.",
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
      "Iedereen die meer dan 5 calls per week mist — daar verdient 'ie zichzelf terug"
    ],
    included: [
      {
        icon: "phone",
        title: "Automatisch terugbellen",
        description:
          "Gemiste oproep? Onze AI belt binnen 30 seconden terug — 24/7, ook 's avonds en in het weekend."
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
      "Klanten vragen, je bot antwoordt direct — 24/7. Jouw team grijpt alleen in bij wat echt aandacht nodig heeft.",
    description:
      "WhatsApp is voor de meeste Nederlandse MKB-bedrijven het belangrijkste klantkanaal geworden. Het probleem: één persoon kan niet 200 chats per dag bijhouden, zeker niet buiten kantooruren. De gevolgen zien we elke week — trage antwoorden, klanten die afhaken, omzet die naar concurrenten verdwijnt.\n\nDe **WhatsApp Business Chatbot** vangt dat op. Een AI die je producten kent, je orderstatus kan opvragen, retouren kan starten, en bestellingen kan plaatsen — allemaal via een gesprek dat aanvoelt als chatten met een vriendelijke collega.\n\n**Wat de bot daadwerkelijk doet**\n\nNiet alleen FAQ-antwoorden. Bij een vraag \"waar is mijn bestelling\" haalt 'ie real-time de status uit WooCommerce of Shopify en stuurt direct een track & trace link. Bij \"hebben jullie dit ook in zwart\" zoekt 'ie in je catalogus en stuurt foto + prijs + URL. Bij \"ik wil dit bestellen\" maakt 'ie een betaal-link via Mollie. Bij een klacht escaleert 'ie binnen 4 minuten naar je team — met de volledige context erbij.\n\n**Voor wie werkt dit echt**\n\nWebshops met meer dan 10 chats per dag, dienstverleners (kappers, garages, makelaars, klusbedrijven) die veel via WhatsApp werken, en B2B-bedrijven waar klanten complexe vragen via chat stellen. Niet voor pure spam-volume operaties — wel voor bedrijven die elke klant een goed gesprek willen geven, alleen niet de tijd hebben om 'm zelf te voeren.\n\n**Volgens Meta-regels, op je eigen nummer**\n\nWe gebruiken de officiële **WhatsApp Business API** (geen grijze workarounds, geen schorsing-risico). Je bestaande zakelijke nummer wordt verbonden. Klanten zien gewoon jouw bedrijfsnaam, jouw logo. Geen \"powered by\"-rommel.\n\n**De bot weet niet alles — en dat is goed**\n\nWij stoppen er JOUW kennis in: productcatalogus, openingstijden, verzendkosten, retourbeleid, FAQ. Wat 'ie niet weet vraagt 'ie netjes na of escaleert 'ie. We trainen 'm op jouw toon (formeel/informeel, met of zonder emoji's) en je merknaam. Het voelt als jouw bedrijf, niet als een generieke bot.\n\n**Setup**\n\nBinnen 7-10 werkdagen ben je live. Eerste week vooral testen met fake chats; tweede week parallel met je huidige flow zodat je kunt vergelijken. We koppelen aan je bestaande webshop (WooCommerce, Shopify, Magento, Lightspeed), betaalprovider (Mollie, Stripe), en CRM (HubSpot, Pipedrive, of gewoon mail/Slack).\n\n**Wat je krijgt naast de bot**\n\nDashboard waarin je elke chat ziet, kunt overnemen, en analytics bekijkt (top vragen, conversie via chat, omzet via chat, klant-tevredenheid). Plus per ochtend een dagrapport in Slack of mail.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten zien hoe het werkt voor een soortgelijke webshop of dienstverlener, je hoort exacte voorbeeldgesprekken, en je krijgt een eerlijke schatting voor jouw situatie. Geen verkooppraatjes — gewoon laten zien wat het doet.",
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
      "Dienstverleners die veel via WhatsApp werken — kappers, garages, klusbedrijven",
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
          "WooCommerce, Shopify, Mollie, Pipedrive — bot haalt orderstatus en stuurt track & trace direct uit je systeem."
      },
      {
        icon: "users",
        title: "Slim overdragen naar mens",
        description:
          "Bij klachten of complexe vragen escaleert de bot naar je team — mét de volledige chat-context erbij."
      }
    ],
    cases: [
      {
        clientName: "TuinThuis",
        label: "Webshop · Tuinmeubels",
        tag: "MKB · E-commerce",
        tone: "dark",
        benefit:
          "Webshop voor tuinmeubels — 3.247 chats per maand waarvan 94% volledig door bot afgehandeld. Bot plaatste 192 bestellingen direct via chat (AOV €149) en bespaarde het team 128 uur per maand.",
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
          "Bot beantwoordt 24/7 vragen over woningen in het bestand, plant bezichtigingen via Calendly, en stuurt brochures direct in de chat. Klanten waarderen vooral de snelheid 's avonds — meeste interesse komt na 19:00.",
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
      "Reageert binnen 14 minuten op elke review — in jouw toon, en zorgt dat klagers terugkomen.",
    description:
      "97% van de potentiële klanten checkt je Google reviews voordat ze besluiten. En wat ze zien is niet alleen wat anderen zeggen — ze zien ook hoe JIJ reageert. Een eigenaar die binnen een uur persoonlijk antwoordt, ongeacht de score, straalt zorg uit. Een eigenaar die niks zegt, of generiek \"bedankt voor uw feedback\" plaatst, straalt onverschilligheid uit.\n\nDe **Google Reviews AI-responder** zorgt dat je altijd reageert — binnen 14 minuten gemiddeld, 24/7, in jouw eigen toon, en met écht persoonlijke teksten die niet aanvoelen als een copy-paste.\n\n**Niet \"bedankt voor uw feedback\"**\n\nDe meeste auto-reply tools spuwen generieke onzin. \"Bedankt voor uw feedback, we waarderen het zeer.\" Iedereen ziet dat het AI is. Erger nog: het laat zien dat je niet eens de moeite hebt genomen om te lezen wat de klant schreef.\n\nWij doen het omgekeerd. De AI **leest elke review woord voor woord**, herkent waar de klant het over had (de gerookte makreel, de wachttijd, de bediening), en bouwt daar een persoonlijk antwoord omheen. Voorbeeld: \"Wat fijn om te lezen, Lieke — die gerookte makreel geven we zeker door aan onze keuken. Je punt over de wachttijd nemen we serieus; doordeweeks zou dat soepeler moeten gaan.\"\n\n**Jouw brand voice, niet die van een bot**\n\nIn de setup leggen we jouw toon vast: u-vorm of je-vorm, formeel of warm, met of zonder emoji's, hoe je gewoonlijk afsluit. Plus een lijst van **woorden die de AI nooit gebruikt** — \"streven naar\", \"ongemak\", corporate jargon dat klanten direct afschrikt. De AI vermijdt het, jij blijft authentiek.\n\n**Klagers terugbrengen**\n\nBij negatieve reviews (1-2 sterren) escaleert de AI niet stilletjes — 'ie bereidt al een conceptantwoord voor en stuurt jou een notificatie met de context. Je beslist of je 'm met één klik plaatst, aanpast, of zelf belt. **Bij 71% van onze klanten verandert een 2★ review in een 4★ binnen 30 dagen** na een persoonlijk telefoontje.\n\n**Voor wie werkt dit echt**\n\nRestaurants, hotels, kappers, schoonheidssalons, fysiotherapeuten, autobedrijven, klusbedrijven, makelaars — eigenlijk elk lokaal MKB waar Google reviews bepalen of nieuwe klanten überhaupt naar je gaan kijken. Het effect is sterkst bij bedrijven met 30+ reviews die niet alles handmatig kunnen bijhouden.\n\n**SEO-effect**\n\nGoogle weegt review-respons mee in het Maps-algoritme. Bedrijven die actief reageren, ranken hoger in de \"Map Pack\" (de top-3 op kaart). Bij onze klanten zagen we gemiddeld **+18% lokale zichtbaarheid** binnen 3 maanden — meetbaar in Google Business Profile insights.\n\n**Setup**\n\nBinnen 5 werkdagen ben je live. Eerste 7 dagen draait 'ie in \"voorstel-modus\" (alles wacht op jouw akkoord), zodat je kunt zien of de toon klopt. Daarna kun je per categorie (5★, 4★, 3★, 2★) instellen of de AI direct plaatst of jouw akkoord vraagt. Klachten escaleren altijd naar jou.\n\n**Wat je krijgt**\n\nDashboard met alle reviews (Google, Tripadvisor, Facebook), AI-voorstellen, sentiment-analyse en topic-tracking (wat noemen klanten het vaakst?). Plus per maand een rapport met inzichten: \"wachttijd\" wordt vaker positief genoemd, \"steak\" vaker negatief — bruikbare signalen voor je team.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten je drie eigen reviews zien zoals de bot zou antwoorden — geen verkooppraat, gewoon concrete teksten op je echte data.",
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
          "AI leest elke review woord voor woord en bouwt een antwoord op specifieke punten — niet 'bedankt voor uw feedback'."
      },
      {
        icon: "shield-check",
        title: "Jouw brand voice vastgelegd",
        description:
          "Toon, lengte, emoji-gebruik en woorden die je nooit wilt gebruiken — wij stoppen het allemaal in de AI tijdens setup."
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
          "Restaurant in centrum Amsterdam ging van 4.4 naar 4.6 sterren gemiddeld binnen 3 maanden. Eigenaar Daan ziet nu elke review binnen 14 minuten beantwoord verschijnen — en hoeft alleen 2-sterren reviews zelf op te pakken. Map-pack zichtbaarheid +18%.",
        highlights: [
          "Score 4.4 → 4.6 in 3 maanden",
          "+18% lokale zichtbaarheid in Google Maps",
          "100% reviews beantwoord — geen achterstand"
        ]
      },
      {
        clientName: "Schoonheidssalon Belle",
        label: "Beauty · Den Haag",
        tag: "MKB · Service",
        tone: "light",
        benefit:
          "Salon met 380 reviews kreeg gemiddeld 2-3 nieuwe reviews per week. Onmogelijk om bij te houden naast klanten in de stoel. Bot beantwoordt 5★ direct, 4★ binnen het uur, 1-2★ wacht op akkoord — eigenaar bespaart 4u per week.",
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
      "Telefoonafspraken maken is anno 2026 het grootste obstakel tussen jouw klant en de boeking. 67% van de Nederlandse consumenten geeft aan dat ze liever een dienst overslaan dan een telefoontje plegen — vooral 's avonds en in het weekend. En jij ondertussen: bellen, mailen, opnieuw bellen, no-shows, dubbel-boekingen.\n\nHet **Online Afsprakensysteem** lost dat op. Klanten zien jouw beschikbaarheid 24/7 op je website, kiezen de dienst + tijd + medewerker, betalen direct, en krijgen automatische bevestiging + herinnering. Jij ziet alles overzichtelijk in één dashboard.\n\n**Niet \"nog een agenda-plugin\"**\n\nEr zijn genoeg tools die dit kunnen — Amelia, Calendly, Salonized, Trafft. Het probleem: jij moet ze zelf installeren, koppelen aan je website, integreren met Mollie, e-mail templates schrijven, openingstijden + lunchpauzes invoeren per medewerker, no-show beleid instellen, GDPR-compliant maken. Voor de meeste MKB-ers is dat 2-3 dagen werk waar ze nooit aan toekomen.\n\n**Wij doen het, jij gebruikt het**\n\nHazenco zet alles voor je op binnen 5 werkdagen. Volledig op maat: jouw kleuren, jouw merknaam, jouw diensten, jouw medewerkers, jouw werktijden. Wij koppelen aan Mollie (of een andere betaalprovider naar keuze), Google Calendar, je bestaande website, en de WhatsApp Business Chatbot of AI Telefoonassistent als je die ook hebt.\n\n**Wat je krijgt**\n\nEen volwaardig boekingsplatform: agenda (week/maand/dag), klantbeheer, diensten met prijs + duur + buffer, medewerkers met eigen rooster, betaal-integratie, automatische SMS/mail bevestiging + herinnering, no-show systeem met aanbetaling-vereisten, reactivering-flow voor inactieve klanten. Plus een dashboard met de cijfers die er toe doen: bezetting per medewerker, no-show ratio, omzet via online boekingen.\n\n**No-show op 2,4% in plaats van 18%**\n\nDe combinatie van vooraf-betalen + 24u SMS-herinnering + verzet-link (klant kan zelf kosteloos verzetten tot 4u vooraf) brengt no-shows in onze klantenbestand gemiddeld terug van 18% naar 2,4%. Bij een fysiopraktijk met 200 afspraken per week scheelt dat 30+ afspraken per week aan verloren omzet.\n\n**Voor wie werkt dit echt**\n\nFysiotherapeuten, tandartsen, huisartsen-praktijken, kappers, schoonheidssalons, sport-coaches, klusbedrijven, advocaten, consultants — eigenlijk elk MKB waar klanten afspraken maken. Werkt voor 1 ZZP'er tot teams van 30+ medewerkers.\n\n**Werkt samen met onze andere tools**\n\nHeb je de **AI Telefoonassistent**? Die plant automatisch in dit systeem zolang er beschikbaarheid is. **WhatsApp Chatbot**? Die kan ook afspraken plaatsen via chat. **Google Reviews AI-responder**? Die stuurt na elke afspraak een mail-vraag om een review. Alle Hazenco-tools praten met elkaar.\n\n**Setup**\n\nDag 1-2: intake + opzet diensten/medewerkers/tijden. Dag 3-4: koppeling betaal + agenda, testen. Dag 5: live, met jou meekijken bij eerste echte boekingen. Daarna doorlopend: nieuwe diensten toevoegen, prijzen aanpassen, medewerkers in/uit — wij doen het of leren je het in 10 minuten.\n\n**Klaar om te starten?**\n\nPlan een gesprek van 15 minuten. We laten je het systeem zien zoals het zou werken voor jouw zaak — met jouw diensten en jouw scenario. Geen verkoopgesprek, gewoon laten zien wat het doet.",
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
          "Fysiopraktijk met 5 therapeuten en 200 afspraken per week. Eigenaresse Sara zag no-show ratio dalen van 18% naar 2,4% binnen 2 maanden. 7 nieuwe klanten per week komen nu binnen via de online bookingflow — vooral 's avonds geboekt.",
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
          "100% vooraf betaald — geen facturatie-werk"
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
  }
];

export const reviews: Review[] = [
  {
    id: "review_1",
    listingId: "listing_invoice_agent",
    buyerId: "user_buyer",
    buyerName: "Nudi Buyer",
    rating: 5,
    comment: "Duidelijke setup en precies genoeg controlepunten voor onze administratie.",
    approved: true,
    createdAt: today(-7)
  },
  {
    id: "review_2",
    listingId: "listing_bol_sync",
    buyerId: "user_buyer",
    buyerName: "Nudi Buyer",
    rating: 5,
    comment: "De wizard maakte het koppelen veel minder spannend. Fijn product.",
    approved: true,
    createdAt: today(-12)
  }
];

export const seedState: MarketplaceState = {
  activeUserId: "user_visitor",
  users: demoUsers,
  categories,
  sellers,
  listings,
  cart: [],
  orders: [
    {
      id: "order_demo_paid",
      buyerId: "user_buyer",
      items: [
        {
          listingId: "listing_meeting_template",
          sellerId: "seller_dataflow",
          title: "Meeting naar Actielijst Template",
          quantity: 1,
          priceCents: 3900,
          serviceAddOn: false,
          serviceAddOnPriceCents: 0
        }
      ],
      status: "paid",
      totalCents: 3900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-4)
    },
    {
      id: "order_invoice_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_invoice_agent", sellerId: "seller_hazenco", title: "Factuur AI Verwerker", quantity: 1, priceCents: 14900, serviceAddOn: true, serviceAddOnPriceCents: 24900 }
      ],
      status: "paid",
      totalCents: 39800,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-1)
    },
    {
      id: "order_bol_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_bol_sync", sellerId: "seller_hazenco", title: "Bol.com Order Sync", quantity: 1, priceCents: 9900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 9900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-3)
    },
    {
      id: "order_whatsapp_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_whatsapp_chatbot", sellerId: "seller_hazenco", title: "WhatsApp Business Chatbot", quantity: 1, priceCents: 14900, serviceAddOn: true, serviceAddOnPriceCents: 29900 }
      ],
      status: "paid",
      totalCents: 44800,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-6)
    },
    {
      id: "order_horeca_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_horeca_reservation_bot", sellerId: "seller_hazenco", title: "Horeca Reservering AI Bot", quantity: 1, priceCents: 12900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 12900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-8)
    },
    {
      id: "order_woo_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_woocommerce_cross_sell", sellerId: "seller_hazenco", title: "WooCommerce Cross-Sell Plugin", quantity: 1, priceCents: 4900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 4900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-10)
    },
    {
      id: "order_marketing_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_marketing_dashboard", sellerId: "seller_dataflow", title: "Marketing Performance Dashboard", quantity: 1, priceCents: 7900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 7900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-12)
    },
    {
      id: "order_shopify_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_shopify_inventory_sync", sellerId: "seller_hazenco", title: "Shopify Inventory Sync", quantity: 1, priceCents: 11900, serviceAddOn: true, serviceAddOnPriceCents: 22900 }
      ],
      status: "paid",
      totalCents: 34800,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-15)
    },
    {
      id: "order_stripe_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_stripe_dashboard_theme", sellerId: "seller_frontkit", title: "Stripe Payments Dashboard Theme", quantity: 1, priceCents: 12900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 12900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-18)
    },
    {
      id: "order_portal_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_portal_theme", sellerId: "seller_frontkit", title: "Service Portal Theme", quantity: 1, priceCents: 8900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 8900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-22)
    },
    {
      id: "order_email_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_email_marketing_skill", sellerId: "seller_dataflow", title: "Email Marketing AI Schrijver", quantity: 1, priceCents: 4900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 4900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-25)
    },
    {
      id: "order_feedback_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_feedback_survey_ai", sellerId: "seller_hazenco", title: "Klantfeedback Samenvatting AI", quantity: 1, priceCents: 9900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 9900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-29)
    },
    {
      id: "order_bouw_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_bouw_offerte_ai", sellerId: "seller_hazenco", title: "Bouw Offerte Generator AI", quantity: 1, priceCents: 19900, serviceAddOn: true, serviceAddOnPriceCents: 39900 }
      ],
      status: "paid",
      totalCents: 59800,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-34)
    },
    {
      id: "order_linkedin_paid",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_linkedin_outreach_skill", sellerId: "seller_dataflow", title: "LinkedIn Outreach Skill", quantity: 1, priceCents: 5900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "paid",
      totalCents: 5900,
      paymentProvider: "test",
      downloadUnlocked: true,
      createdAt: today(-40)
    },
    {
      id: "order_failed_demo",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_notion_crm_pack", sellerId: "seller_frontkit", title: "Notion CRM Template Pack", quantity: 1, priceCents: 2900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "failed",
      totalCents: 2900,
      paymentProvider: "test",
      downloadUnlocked: false,
      createdAt: today(-7)
    },
    {
      id: "order_cancelled_demo",
      buyerId: "user_buyer",
      items: [
        { listingId: "listing_zorg_agenda_sync", sellerId: "seller_dataflow", title: "Zorg Agenda Sync Workflow", quantity: 1, priceCents: 14900, serviceAddOn: false, serviceAddOnPriceCents: 0 }
      ],
      status: "cancelled",
      totalCents: 14900,
      paymentProvider: "test",
      downloadUnlocked: false,
      createdAt: today(-11)
    }
  ],
  reviews,
  sellerApplications: [
    {
      id: "app_pending_one",
      userId: "user_pending_seller",
      name: "Automatia BCN",
      email: "hello@automatia.example",
      business: "AI automations voor marketingteams",
      experience: "Meer dan 30 n8n workflows gebouwd voor leadgeneratie en content.",
      status: "pending",
      createdAt: today(-1)
    }
  ],
  serviceRequests: [],
  serviceMessages: [],
  appointments: [],
  moderationLogs: [
    {
      id: "log_seed",
      actorId: "user_admin",
      action: "Demo marketplace klaargezet",
      entity: "system",
      entityId: "seed",
      createdAt: today(-1)
    }
  ]
};
