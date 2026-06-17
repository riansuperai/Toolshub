/**
 * Centrale lijst van alle mini-tools in /toolkit.
 *
 * Wordt gebruikt door:
 * - /toolkit/page.tsx voor de overzichtspagina
 * - MiniToolPage voor "related tools" suggesties
 * - Sitemap (eventueel later)
 *
 * Volgorde in dit array bepaalt volgorde op de index-pagina.
 */
export type ToolkitEntry = {
  slug: string;
  /** Display title — kort en helder, geen overbodige woorden. */
  title: string;
  /** Eén zin die direct uitlegt wat de tool doet voor wie. */
  tagline: string;
  /** Tabler/Lucide-style icon — hier alleen de string, het component
   *  resolved 't naar een lucide-react export in de MiniToolPage. */
  iconName: ToolkitIcon;
  /** Geschatte tijd om de tool te gebruiken, voor de eyebrow-chip. */
  estimatedMinutes: number;
  /** Set 'true' als de tool live is, 'false' als 'ie nog binnenkort komt. */
  available: boolean;
  /** Optionele tags voor filtering/grouping later. */
  tags?: string[];
};

export type ToolkitIcon =
  | "file-text"
  | "calculator"
  | "image-off"
  | "shield-check"
  | "credit-card"
  | "search"
  | "scissors"
  | "palette"
  | "file-archive"
  | "images";

export const TOOLKIT_REGISTRY: ToolkitEntry[] = [
  {
    slug: "factuur-generator",
    title: "Factuur generator",
    tagline: "Maak een professionele NL-factuur met BTW — in één minuut, geen account.",
    iconName: "file-text",
    estimatedMinutes: 2,
    available: true,
    tags: ["facturatie", "boekhouding", "mkb"]
  },
  {
    slug: "btw-calculator",
    title: "BTW calculator",
    tagline: "Bereken snel het BTW-bedrag bij een prijs (21%, 9% of 0%).",
    iconName: "calculator",
    estimatedMinutes: 1,
    available: true,
    tags: ["facturatie", "boekhouding"]
  },
  {
    slug: "iban-checker",
    title: "IBAN checker",
    tagline: "Controleer of een Nederlands of internationaal IBAN-nummer geldig is.",
    iconName: "credit-card",
    estimatedMinutes: 1,
    available: true,
    tags: ["betaling"]
  },
  {
    slug: "achtergrond-verwijderen",
    title: "Achtergrond verwijderen",
    tagline: "Verwijder de achtergrond van een product- of profielfoto met AI — gewoon in je browser.",
    iconName: "image-off",
    estimatedMinutes: 1,
    available: true,
    tags: ["beeld", "product"]
  },
  {
    slug: "pdf-comprimeren",
    title: "PDF comprimeren",
    tagline: "Maak je PDF kleiner zonder zichtbaar kwaliteitsverlies — direct in je browser.",
    iconName: "file-archive",
    estimatedMinutes: 1,
    available: true,
    tags: ["pdf", "bestand"]
  },
  {
    slug: "afbeelding-comprimeren",
    title: "Afbeelding comprimeren",
    tagline: "Verklein JPG, PNG of WebP — tot 10 tegelijk, converteer formaat, download als ZIP.",
    iconName: "images",
    estimatedMinutes: 1,
    available: true,
    tags: ["beeld", "bestand"]
  }
];

export function findToolkitEntry(slug: string): ToolkitEntry | undefined {
  return TOOLKIT_REGISTRY.find((entry) => entry.slug === slug);
}

export function relatedToolkitEntries(excludeSlug: string, limit = 3): ToolkitEntry[] {
  return TOOLKIT_REGISTRY.filter(
    (entry) => entry.slug !== excludeSlug && entry.available
  ).slice(0, limit);
}
