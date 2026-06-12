export type UserRole = "visitor" | "buyer" | "seller_pending" | "seller" | "admin";

export type ProductType =
  | "workflow"
  | "ai_agent"
  | "plugin"
  | "extension"
  | "skill"
  | "theme"
  | "template"
  | "service_package";

export type ListingStatus = "draft" | "pending" | "published" | "rejected";
export type SellerStatus = "pending" | "approved" | "rejected";
export type DeliveryMode = "download" | "cloud" | "custom";

export type Branche =
  | "general"
  | "retail"
  | "horeca"
  | "construction"
  | "healthcare"
  | "financial"
  | "marketing_media"
  | "ict"
  | "logistics"
  | "professional_services"
  | "education"
  | "government";
export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

export type Refund = {
  id: string;
  orderId: string;
  amountCents: number;
  reason: string;
  createdAt: string;
  refundedBy: string; // admin user id
};
export type ServiceStatus = "new" | "in_progress" | "waiting_for_buyer" | "completed";

export type BillingAddress = {
  street: string;
  postalCode: string;
  city: string;
  country: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sellerId?: string;
  savedListings: string[];
  phone?: string;
  company?: string;
  vatNumber?: string;
  billingAddress?: BillingAddress;
  language?: "nl" | "en";
  newsletter?: boolean;
  joinedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  accent: string;
};

export type SellerAvailability = {
  /** 0 = Sunday, 1 = Monday, ... 6 = Saturday. Each day = list of working blocks. */
  weekly: Record<number, Array<{ from: string; to: string }>>;
  slotMinutes: number;
};

export type SellerProfile = {
  id: string;
  userId: string;
  name: string;
  handle: string;
  status: SellerStatus;
  specialty: string;
  bio: string;
  location: string;
  rating: number;
  sales: number;
  responseTime: string;
  verified: boolean;
  website?: string;
  supportEmail?: string;
  vatNumber?: string;
  payoutMethod?: string;
  joinedAt?: string;
  availability?: SellerAvailability;
};

export type ToolAsset = {
  id: string;
  name: string;
  kind: "workflow-json" | "documentation" | "plugin-zip" | "theme-zip" | "skill-pack" | "template-file";
  sizeLabel: string;
  private: boolean;
};

export type DemoStep = {
  label: string;
  value: string;
};

export type DemoSandbox = {
  url: string;
  screenshots: string[];
  instructions: string;
  credentials: DemoStep[];
  sampleInput: string;
};

export type UseCase =
  | "crm"
  | "chatbot"
  | "ecommerce"
  | "marketing"
  | "data_integration"
  | "project_management"
  | "email_marketing"
  | "social_media"
  | "analytics"
  | "lead_generation"
  | "customer_support"
  | "workflow_automation"
  | "form_builder"
  | "payment_processing"
  | "inventory"
  | "other";

export type PricingCycle = "one_time" | "monthly" | "yearly";

export type PricingPlan = {
  id: string;
  name: string;        // "Basic", "Pro", "Enterprise"
  tagline?: string;    // korte beschrijving
  priceCents: number;
  cycle: PricingCycle;
  features: string[];
  trialDays?: number;
  highlight?: boolean; // meest populair
};

export type Subscription = {
  id: string;
  buyerId: string;
  listingId: string;
  planId: string;
  cycle: PricingCycle;
  status: "trialing" | "active" | "paused" | "cancelled";
  startedAt: string;
  nextBillingAt?: string;
  trialEndsAt?: string;
  cancelledAt?: string;
};

export type ListingVersion = {
  version: string;
  releasedAt: string;
  changelog: string;
  breaking?: boolean;
};

/**
 * Onderscheid tussen een digitale tool (downloadbaar / SaaS) en een dienst
 * (Hazenco bouwt iets voor je, checkout loopt via hazenco.nl). Stuurt welke
 * detail-layout en welke sidebar getoond wordt. Defaults naar 'tool' als
 * niet ingevuld — bestaande listings blijven onveranderd.
 */
export type ListingKind = "tool" | "service";

export type ServiceIncludedItem = {
  /** Tabler icon name zonder 'ti-' prefix, bv. 'shield-check', 'refresh'. */
  icon: string;
  title: string;
  description: string;
};

/**
 * Visuele toon voor de band in een portfolio case card.
 * - 'dark'  : donker groen achtergrond, witte tekst (premium / corporate)
 * - 'light' : zachte sage achtergrond, donkere tekst (clean / startup)
 * - 'peach' : zachte oranje achtergrond, donkere tekst (warm / consumer)
 */
export type CaseTone = "dark" | "light" | "peach";

export type ServiceCase = {
  clientName: string;
  /** Hoofdomschrijving van het project (paragraph). */
  benefit: string;
  url?: string;
  imageUrl?: string;
  /** Eyebrow boven titel, bv. "WEBSITE ALL-IN" of "WEBSITE BLOG". */
  label?: string;
  /** Kleine pill onder titel, bv. "MKB - Website". */
  tag?: string;
  /** 2-3 korte resultaat-bullets met check-icon. */
  highlights?: string[];
  /** Visuele toon van de titel-band, default 'dark'. */
  tone?: CaseTone;
};

/**
 * Twee-pakket sidebar voor diensten. Beide pakketten optioneel — een dienst
 * met alleen abonnement of alleen eenmalig is geldig. externalUrl is verplicht
 * want bij Optie B gaat de daadwerkelijke checkout via hazenco.nl.
 */
export type ServicePackagePricing = {
  externalUrl: string;
  oneTime?: {
    priceCents: number;
    originalPriceCents?: number;
    description: string;
  };
  subscription?: {
    priceCentsPerMonth: number;
    originalPriceCentsPerMonth?: number;
    minMonths: number;
    description: string;
  };
  highlight?: "oneTime" | "subscription";
  usps?: string[];
};

export type ServiceMeta = {
  duration?: string;
  revisions?: string;
  supportPeriod?: string;
};

export type Listing = {
  id: string;
  sellerId: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  categoryId: string;
  type: ProductType;
  useCases: UseCase[];
  branches: Branche[];
  heroImageUrl?: string;
  screenshotUrls?: string[];
  priceCents: number;
  setupPriceCents: number;
  status: ListingStatus;
  featured: boolean;
  compatibility: string[];
  tags: string[];
  deliveryModes: DeliveryMode[];
  files: ToolAsset[];
  demo: DemoSandbox;
  downloads: number;
  sales: number;
  rating: number;
  reviewCount: number;
  version: string;
  versions?: ListingVersion[];
  plans?: PricingPlan[];
  createdAt: string;
  updatedAt: string;
  supportIncluded: string;
  listingKind?: ListingKind;
  forWho?: string[];
  included?: ServiceIncludedItem[];
  cases?: ServiceCase[];
  servicePricing?: ServicePackagePricing;
  serviceMeta?: ServiceMeta;
};

export type CartItem = {
  listingId: string;
  quantity: number;
  serviceAddOn: boolean;
};

export type OrderItem = {
  listingId: string;
  sellerId: string;
  title: string;
  quantity: number;
  priceCents: number;
  serviceAddOn: boolean;
  serviceAddOnPriceCents: number;
  versionAtPurchase?: string;
};

export type Order = {
  id: string;
  buyerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalCents: number;
  paymentProvider: "test";
  downloadUnlocked: boolean;
  createdAt: string;
};

export type GiftCard = {
  id: string;
  code: string;
  amountCents: number;
  initialAmountCents: number;
  purchasedBy?: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
  status: "active" | "redeemed" | "expired";
  createdAt: string;
  redeemedAt?: string;
};

export type Broadcast = {
  id: string;
  sellerId: string;
  subject: string;
  body: string;
  audience: "all_buyers" | "followers" | "active_subscribers";
  recipientCount: number;
  openCount?: number;
  sentAt: string;
};

export type SellerWebhook = {
  id: string;
  sellerId: string;
  url: string;
  secret: string;
  events: Array<"sale" | "refund" | "review" | "subscription_started" | "subscription_cancelled">;
  active: boolean;
  createdAt: string;
  lastFiredAt?: string;
};

export type SiteBanner = {
  id: string;
  message: string;
  cta?: { label: string; href: string };
  tone: "info" | "success" | "warn" | "promo";
  active: boolean;
  createdAt: string;
};

export type Bundle = {
  id: string;
  sellerId: string;
  title: string;
  slug: string;
  description: string;
  listingIds: string[];
  /** Korting in percent op de som van losse prijzen */
  discountPercent: number;
  status: "draft" | "published";
  createdAt: string;
};

export type ToolQuestion = {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  question: string;
  createdAt: string;
  helpfulCount?: number;
  answer?: {
    text: string;
    answeredAt: string;
    bySeller: boolean;
    sellerId?: string;
  };
};

export type Review = {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  /** Data-URLs van geüploade screenshots (max ~3, base64 in localStorage demo) */
  screenshots?: string[];
};

export type SellerApplication = {
  id: string;
  userId: string;
  name: string;
  email: string;
  business: string;
  experience: string;
  status: SellerStatus;
  createdAt: string;
  notes?: string;
};

export type ServiceMessage = {
  id: string;
  requestId: string;
  sender: "buyer" | "seller";
  text: string;
  createdAt: string;
};

export type AppointmentStatus = "proposed" | "approved" | "rejected" | "cancelled" | "completed";

export type Appointment = {
  id: string;
  requestId: string;
  proposedBy: "buyer" | "seller";
  startsAt: string; // ISO date-time
  durationMinutes: number;
  status: AppointmentStatus;
  note?: string;
  createdAt: string;
};

export type ServiceRequest = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  orderId?: string;
  status: ServiceStatus;
  scope: string;
  message: string;
  createdAt: string;
};

export type ModerationLog = {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
};

export type MarketplaceState = {
  activeUserId: string;
  users: UserProfile[];
  categories: Category[];
  sellers: SellerProfile[];
  listings: Listing[];
  cart: CartItem[];
  orders: Order[];
  reviews: Review[];
  sellerApplications: SellerApplication[];
  serviceRequests: ServiceRequest[];
  serviceMessages: ServiceMessage[];
  appointments: Appointment[];
  refunds?: Refund[];
  toolQuestions?: ToolQuestion[];
  bundles?: Bundle[];
  banners?: SiteBanner[];
  follows?: { followerId: string; sellerId: string; createdAt: string }[];
  likes?: { userId: string; listingId: string; createdAt: string }[];
  tips?: { id: string; fromUserId: string; sellerId: string; amountCents: number; message?: string; createdAt: string }[];
  subscriptions?: Subscription[];
  giftCards?: GiftCard[];
  broadcasts?: Broadcast[];
  webhooks?: SellerWebhook[];
  moderationLogs: ModerationLog[];
};
