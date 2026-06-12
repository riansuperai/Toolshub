"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { createId, generateMockScreenshots, seedState, today } from "./marketplace-data";
import { fetchCatalog } from "./supabase-queries";
import { isSupabaseConfigured } from "./supabase";
import type {
  Appointment,
  AppointmentStatus,
  Branche,
  CartItem,
  DeliveryMode,
  Listing,
  MarketplaceState,
  Order,
  ProductType,
  Review,
  SellerApplication,
  SellerProfile,
  ServiceMessage,
  ServiceRequest,
  ToolAsset,
  UseCase,
  UserProfile
} from "./types";

const STORAGE_KEY = "hazenco-marketplace-state-v8";
const DEFAULT_VISITOR_ID = "user_visitor";

type ListingInput = {
  title: string;
  tagline: string;
  description: string;
  categoryId: string;
  type: ProductType;
  priceCents: number;
  setupPriceCents: number;
  compatibility: string[];
  tags: string[];
  deliveryModes: DeliveryMode[];
  files: ToolAsset[];
  demoUrl: string;
  demoInstructions: string;
  sampleInput: string;
  supportIncluded: string;
  screenshots?: string[];
  branches?: Branche[];
  useCases?: UseCase[];
};

type Store = {
  state: MarketplaceState;
  activeUser: MarketplaceState["users"][number];
  setActiveUser: (id: string) => void;
  resetDemo: () => void;
  updateUser: (userId: string, patch: Partial<UserProfile>) => void;
  updateSeller: (sellerId: string, patch: Partial<SellerProfile>) => void;
  addToCart: (listingId: string, serviceAddOn?: boolean) => void;
  updateCartItem: (listingId: string, patch: Partial<CartItem>) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  createTestOrder: () => Order | null;
  resolveTestPayment: (orderId: string, status: "paid" | "failed" | "cancelled") => void;
  toggleSavedListing: (listingId: string) => void;
  submitSellerApplication: (input: Omit<SellerApplication, "id" | "userId" | "status" | "createdAt">) => void;
  approveSellerApplication: (applicationId: string) => void;
  rejectSellerApplication: (applicationId: string) => void;
  createListing: (input: ListingInput) => Listing | null;
  approveListing: (listingId: string) => void;
  rejectListing: (listingId: string) => void;
  toggleFeatured: (listingId: string) => void;
  addReview: (listingId: string, rating: number, comment: string, screenshots?: string[]) => void;
  approveReview: (reviewId: string) => void;
  publishListingVersion: (listingId: string, input: { version: string; changelog: string; breaking?: boolean }) => void;
  upsertListingPlans: (listingId: string, plans: import("./types").PricingPlan[]) => void;
  startSubscription: (listingId: string, planId: string, withTrial?: boolean) => string | null;
  cancelSubscription: (subscriptionId: string) => void;
  pauseSubscription: (subscriptionId: string) => void;
  resumeSubscription: (subscriptionId: string) => void;
  purchaseGiftCard: (input: { amountCents: number; recipientEmail?: string; recipientName?: string; message?: string }) => import("./types").GiftCard | null;
  redeemGiftCard: (code: string) => { ok: boolean; amountCents?: number; error?: string };
  sendBroadcast: (input: { subject: string; body: string; audience: import("./types").Broadcast["audience"] }) => void;
  upsertWebhook: (input: Omit<import("./types").SellerWebhook, "id" | "createdAt" | "sellerId" | "secret"> & { id?: string }) => void;
  deleteWebhook: (id: string) => void;
  fireWebhookTest: (webhookId: string) => void;
  upsertBanner: (banner: Omit<import("./types").SiteBanner, "id" | "createdAt"> & { id?: string }) => void;
  deleteBanner: (id: string) => void;
  toggleLike: (listingId: string) => void;
  toggleFollow: (sellerId: string) => void;
  sendTip: (sellerId: string, amountCents: number, message?: string) => void;
  createBundle: (input: { title: string; description: string; listingIds: string[]; discountPercent: number }) => void;
  updateBundle: (id: string, patch: Partial<{ title: string; description: string; listingIds: string[]; discountPercent: number; status: "draft" | "published" }>) => void;
  deleteBundle: (id: string) => void;
  refundOrder: (orderId: string, reason: string) => void;
  askQuestion: (listingId: string, question: string) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  toggleHelpfulQuestion: (questionId: string) => void;
  createServiceRequest: (input: Omit<ServiceRequest, "id" | "buyerId" | "createdAt" | "status">) => void;
  updateServiceStatus: (requestId: string, status: ServiceRequest["status"]) => void;
  sendServiceMessage: (requestId: string, text: string) => void;
  proposeAppointment: (input: { requestId: string; startsAt: string; durationMinutes: number; note?: string }) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
};

const MarketplaceContext = createContext<Store | null>(null);

function loadState(): MarketplaceState {
  if (typeof window === "undefined") return seedState;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return seedState;
  try {
    const parsed = JSON.parse(stored) as MarketplaceState;
    return {
      ...parsed,
      serviceMessages: parsed.serviceMessages ?? [],
      appointments: parsed.appointments ?? []
    };
  } catch {
    return seedState;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function MarketplaceProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<MarketplaceState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState({ ...loaded, activeUserId: loaded.activeUserId ?? DEFAULT_VISITOR_ID });
    setHydrated(true);
  }, []);

  // Hazenco Toolshub data-laag: vervang listings/sellers/categories met
  // Supabase data zodra die binnen is. Cart, orders en sessie blijven
  // voorlopig uit localStorage komen (zie tasks #15-#18).
  useEffect(() => {
    if (!hydrated || !isSupabaseConfigured) return;
    let cancelled = false;
    fetchCatalog().then((catalog) => {
      if (cancelled || !catalog) return;
      setState((prev) => {
        // Supabase wins voor gedeelde slugs, mock-only listings blijven zichtbaar
        // tijdens overgang naar Supabase. Voorkomt dat nieuwe mock-listings
        // (zoals "Website laten maken" pre-migratie) onzichtbaar worden.
        const supabaseSlugs = new Set(catalog.listings.map((l) => l.slug));
        const mockOnly = prev.listings.filter((l) => !supabaseSlugs.has(l.slug));
        return {
          ...prev,
          listings: [...catalog.listings, ...mockOnly],
          sellers: catalog.sellers,
          categories: catalog.categories
        };
      });
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const activeUser = useMemo(
    () =>
      state.users.find((user) => user.id === state.activeUserId) ??
      state.users.find((user) => user.id === DEFAULT_VISITOR_ID) ??
      state.users[0],
    [state.activeUserId, state.users]
  );

  const log = useCallback((draft: MarketplaceState, action: string, entity: string, entityId: string) => {
    draft.moderationLogs = [
      {
        id: createId("log"),
        actorId: draft.activeUserId,
        action,
        entity,
        entityId,
        createdAt: today()
      },
      ...draft.moderationLogs
    ];
  }, []);

  const mutate = useCallback((updater: (draft: MarketplaceState) => void) => {
    setState((current) => {
      const draft = structuredClone(current);
      updater(draft);
      return draft;
    });
  }, []);

  const store = useMemo<Store>(() => {
    return {
      state,
      activeUser,
      setActiveUser: (id) => mutate((draft) => {
        draft.activeUserId = id;
      }),
      resetDemo: () => {
        setState(seedState);
        if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
      },
      updateUser: (userId, patch) => mutate((draft) => {
        const user = draft.users.find((item) => item.id === userId);
        if (!user) return;
        Object.assign(user, patch);
      }),
      updateSeller: (sellerId, patch) => mutate((draft) => {
        const seller = draft.sellers.find((item) => item.id === sellerId);
        if (!seller) return;
        Object.assign(seller, patch);
      }),
      upsertListingPlans: (listingId, plans) => mutate((draft) => {
        const listing = draft.listings.find((l) => l.id === listingId);
        if (!listing) return;
        listing.plans = plans;
        listing.updatedAt = today();
      }),
      startSubscription: (listingId, planId, withTrial = false) => {
        let subId: string | null = null;
        mutate((draft) => {
          const listing = draft.listings.find((l) => l.id === listingId);
          if (!listing) return;
          const plan = listing.plans?.find((p) => p.id === planId);
          if (!plan) return;
          if (!draft.subscriptions) draft.subscriptions = [];
          const now = new Date();
          const cycleMs = plan.cycle === "yearly" ? 365 * 86400_000 : 30 * 86400_000;
          const trialMs = withTrial && plan.trialDays ? plan.trialDays * 86400_000 : 0;
          const sub = {
            id: createId("sub"),
            buyerId: draft.activeUserId,
            listingId,
            planId,
            cycle: plan.cycle,
            status: (trialMs > 0 ? "trialing" : "active") as "trialing" | "active",
            startedAt: today(),
            nextBillingAt: new Date(now.getTime() + trialMs + cycleMs).toISOString(),
            trialEndsAt: trialMs > 0 ? new Date(now.getTime() + trialMs).toISOString() : undefined
          };
          draft.subscriptions.push(sub);
          subId = sub.id;
          log(draft, `Abonnement gestart op ${listing.title} (${plan.name})`, "subscription", sub.id);
        });
        return subId;
      },
      cancelSubscription: (subscriptionId) => mutate((draft) => {
        const sub = draft.subscriptions?.find((s) => s.id === subscriptionId);
        if (!sub) return;
        sub.status = "cancelled";
        sub.cancelledAt = today();
        log(draft, "Abonnement opgezegd", "subscription", subscriptionId);
      }),
      pauseSubscription: (subscriptionId) => mutate((draft) => {
        const sub = draft.subscriptions?.find((s) => s.id === subscriptionId);
        if (sub) sub.status = "paused";
      }),
      resumeSubscription: (subscriptionId) => mutate((draft) => {
        const sub = draft.subscriptions?.find((s) => s.id === subscriptionId);
        if (sub) sub.status = "active";
      }),
      purchaseGiftCard: (input) => {
        let card: import("./types").GiftCard | null = null;
        mutate((draft) => {
          if (!draft.giftCards) draft.giftCards = [];
          const code = `HZN-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
          card = {
            id: createId("gc"),
            code,
            amountCents: input.amountCents,
            initialAmountCents: input.amountCents,
            purchasedBy: draft.activeUserId,
            recipientEmail: input.recipientEmail,
            recipientName: input.recipientName,
            message: input.message,
            status: "active",
            createdAt: today()
          };
          draft.giftCards.push(card);
        });
        return card;
      },
      redeemGiftCard: (code) => {
        let result: { ok: boolean; amountCents?: number; error?: string } = { ok: false, error: "Code onbekend" };
        mutate((draft) => {
          const card = draft.giftCards?.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
          if (!card) { result = { ok: false, error: "Code onbekend" }; return; }
          if (card.status !== "active") { result = { ok: false, error: "Code al verzilverd of verlopen" }; return; }
          card.status = "redeemed";
          card.redeemedAt = today();
          result = { ok: true, amountCents: card.amountCents };
        });
        return result;
      },
      sendBroadcast: (input) => mutate((draft) => {
        const user = draft.users.find((u) => u.id === draft.activeUserId);
        if (!user?.sellerId) return;
        if (!draft.broadcasts) draft.broadcasts = [];
        // bereken doelgroep
        let recipientCount = 0;
        if (input.audience === "all_buyers") {
          const buyerIds = new Set<string>();
          for (const order of draft.orders) {
            if (order.status !== "paid") continue;
            if (order.items.some((i) => i.sellerId === user.sellerId)) buyerIds.add(order.buyerId);
          }
          recipientCount = buyerIds.size;
        } else if (input.audience === "followers") {
          recipientCount = (draft.follows ?? []).filter((f) => f.sellerId === user.sellerId).length;
        } else if (input.audience === "active_subscribers") {
          const activeSubs = (draft.subscriptions ?? []).filter((s) => s.status === "active" || s.status === "trialing");
          const buyerIds = new Set(activeSubs
            .filter((s) => {
              const listing = draft.listings.find((l) => l.id === s.listingId);
              return listing?.sellerId === user.sellerId;
            })
            .map((s) => s.buyerId));
          recipientCount = buyerIds.size;
        }
        draft.broadcasts.push({
          id: createId("bc"),
          sellerId: user.sellerId,
          subject: input.subject.trim(),
          body: input.body.trim(),
          audience: input.audience,
          recipientCount,
          openCount: Math.floor(recipientCount * (0.35 + Math.random() * 0.25)),
          sentAt: today()
        });
        log(draft, `Broadcast verstuurd naar ${recipientCount} kopers`, "broadcast", "");
      }),
      upsertWebhook: (input) => mutate((draft) => {
        const user = draft.users.find((u) => u.id === draft.activeUserId);
        if (!user?.sellerId) return;
        if (!draft.webhooks) draft.webhooks = [];
        if (input.id) {
          const existing = draft.webhooks.find((w) => w.id === input.id);
          if (existing) {
            existing.url = input.url;
            existing.events = input.events;
            existing.active = input.active;
          }
        } else {
          draft.webhooks.push({
            id: createId("wh"),
            sellerId: user.sellerId,
            secret: `whsec_${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 14)}`,
            url: input.url,
            events: input.events,
            active: input.active,
            createdAt: today()
          });
        }
      }),
      deleteWebhook: (id) => mutate((draft) => {
        if (!draft.webhooks) return;
        draft.webhooks = draft.webhooks.filter((w) => w.id !== id);
      }),
      fireWebhookTest: (webhookId) => mutate((draft) => {
        const wh = draft.webhooks?.find((w) => w.id === webhookId);
        if (!wh) return;
        wh.lastFiredAt = today();
        log(draft, `Test-webhook verstuurd naar ${wh.url}`, "webhook", webhookId);
      }),
      upsertBanner: (banner) => mutate((draft) => {
        if (!draft.banners) draft.banners = [];
        if (banner.id) {
          const existing = draft.banners.find((b) => b.id === banner.id);
          if (existing) Object.assign(existing, banner);
        } else {
          draft.banners.push({
            id: createId("banner"),
            message: banner.message,
            cta: banner.cta,
            tone: banner.tone,
            active: banner.active,
            createdAt: today()
          });
        }
      }),
      deleteBanner: (id) => mutate((draft) => {
        if (!draft.banners) return;
        draft.banners = draft.banners.filter((b) => b.id !== id);
      }),
      toggleLike: (listingId) => mutate((draft) => {
        const userId = draft.activeUserId;
        if (!draft.likes) draft.likes = [];
        const existing = draft.likes.find((l) => l.userId === userId && l.listingId === listingId);
        if (existing) {
          draft.likes = draft.likes.filter((l) => !(l.userId === userId && l.listingId === listingId));
        } else {
          draft.likes.push({ userId, listingId, createdAt: today() });
        }
      }),
      toggleFollow: (sellerId) => mutate((draft) => {
        const followerId = draft.activeUserId;
        if (!draft.follows) draft.follows = [];
        const existing = draft.follows.find((f) => f.followerId === followerId && f.sellerId === sellerId);
        if (existing) {
          draft.follows = draft.follows.filter((f) => !(f.followerId === followerId && f.sellerId === sellerId));
        } else {
          draft.follows.push({ followerId, sellerId, createdAt: today() });
        }
      }),
      sendTip: (sellerId, amountCents, message) => mutate((draft) => {
        if (amountCents <= 0) return;
        if (!draft.tips) draft.tips = [];
        draft.tips.push({
          id: createId("tip"),
          fromUserId: draft.activeUserId,
          sellerId,
          amountCents,
          message,
          createdAt: today()
        });
      }),
      createBundle: (input) => mutate((draft) => {
        const user = draft.users.find((u) => u.id === draft.activeUserId);
        if (!user?.sellerId) return;
        if (!draft.bundles) draft.bundles = [];
        const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        draft.bundles.push({
          id: createId("bundle"),
          sellerId: user.sellerId,
          title: input.title.trim(),
          slug: `${slug}-${Date.now().toString(36)}`,
          description: input.description.trim(),
          listingIds: input.listingIds,
          discountPercent: Math.max(0, Math.min(80, input.discountPercent)),
          status: "draft",
          createdAt: today()
        });
      }),
      updateBundle: (id, patch) => mutate((draft) => {
        const bundle = draft.bundles?.find((b) => b.id === id);
        if (!bundle) return;
        Object.assign(bundle, patch);
      }),
      deleteBundle: (id) => mutate((draft) => {
        if (!draft.bundles) return;
        draft.bundles = draft.bundles.filter((b) => b.id !== id);
      }),
      askQuestion: (listingId, question) => mutate((draft) => {
        const user = draft.users.find((u) => u.id === draft.activeUserId);
        if (!user) return;
        if (!draft.toolQuestions) draft.toolQuestions = [];
        draft.toolQuestions.push({
          id: createId("q"),
          listingId,
          userId: user.id,
          userName: user.name,
          question: question.trim(),
          createdAt: today(),
          helpfulCount: 0
        });
      }),
      answerQuestion: (questionId, answer) => mutate((draft) => {
        const q = draft.toolQuestions?.find((x) => x.id === questionId);
        if (!q) return;
        const user = draft.users.find((u) => u.id === draft.activeUserId);
        const listing = draft.listings.find((l) => l.id === q.listingId);
        q.answer = {
          text: answer.trim(),
          answeredAt: today(),
          bySeller: user?.sellerId === listing?.sellerId,
          sellerId: listing?.sellerId
        };
      }),
      toggleHelpfulQuestion: (questionId) => mutate((draft) => {
        const q = draft.toolQuestions?.find((x) => x.id === questionId);
        if (!q) return;
        q.helpfulCount = (q.helpfulCount ?? 0) + 1;
      }),
      refundOrder: (orderId, reason) => mutate((draft) => {
        const order = draft.orders.find((o) => o.id === orderId);
        if (!order || order.status !== "paid") return;
        order.status = "refunded";
        order.downloadUnlocked = false;
        // Reverse stats per listing
        for (const item of order.items) {
          const listing = draft.listings.find((l) => l.id === item.listingId);
          if (listing) {
            listing.sales = Math.max(0, listing.sales - item.quantity);
            listing.downloads = Math.max(0, listing.downloads - item.quantity);
          }
        }
        if (!draft.refunds) draft.refunds = [];
        draft.refunds.push({
          id: createId("refund"),
          orderId,
          amountCents: order.totalCents,
          reason,
          createdAt: today(),
          refundedBy: draft.activeUserId
        });
        log(draft, `Refund verleend: ${(order.totalCents / 100).toFixed(2)} EUR`, "order", orderId);
      }),
      publishListingVersion: (listingId: string, input: { version: string; changelog: string; breaking?: boolean }) => mutate((draft) => {
        const listing = draft.listings.find((l) => l.id === listingId);
        if (!listing) return;
        const entry = {
          version: input.version,
          changelog: input.changelog,
          breaking: input.breaking ?? false,
          releasedAt: today()
        };
        listing.versions = [entry, ...(listing.versions ?? [])];
        listing.version = input.version;
        listing.updatedAt = today();
        log(draft, `Versie ${input.version} gepubliceerd`, "listing", listingId);
      }),
      addToCart: (listingId, serviceAddOn = false) => mutate((draft) => {
        const listing = draft.listings.find((item) => item.id === listingId);
        if (!listing || listing.status !== "published") return;
        const existing = draft.cart.find((item) => item.listingId === listingId);
        if (existing) {
          existing.quantity += 1;
          existing.serviceAddOn = existing.serviceAddOn || serviceAddOn;
        } else {
          draft.cart.push({ listingId, quantity: 1, serviceAddOn });
        }
      }),
      updateCartItem: (listingId, patch) => mutate((draft) => {
        const item = draft.cart.find((cartItem) => cartItem.listingId === listingId);
        if (!item) return;
        Object.assign(item, patch);
      }),
      removeFromCart: (listingId) => mutate((draft) => {
        draft.cart = draft.cart.filter((item) => item.listingId !== listingId);
      }),
      clearCart: () => mutate((draft) => {
        draft.cart = [];
      }),
      createTestOrder: () => {
        let createdOrder: Order | null = null;
        mutate((draft) => {
          if (draft.cart.length === 0) return;
          const items = draft.cart
            .map((cartItem) => {
              const listing = draft.listings.find((item) => item.id === cartItem.listingId);
              if (!listing) return null;
              return {
                listingId: listing.id,
                sellerId: listing.sellerId,
                title: listing.title,
                quantity: cartItem.quantity,
                priceCents: listing.priceCents,
                serviceAddOn: cartItem.serviceAddOn,
                serviceAddOnPriceCents: cartItem.serviceAddOn ? listing.setupPriceCents : 0,
                versionAtPurchase: listing.version
              };
            })
            .filter(Boolean) as Order["items"];

          const totalCents = items.reduce(
            (sum, item) => sum + item.quantity * item.priceCents + item.serviceAddOnPriceCents,
            0
          );
          createdOrder = {
            id: createId("order"),
            buyerId: draft.activeUserId,
            items,
            status: "pending",
            totalCents,
            paymentProvider: "test",
            downloadUnlocked: false,
            createdAt: today()
          };
          draft.orders = [createdOrder, ...draft.orders];
          draft.cart = [];
        });
        return createdOrder;
      },
      resolveTestPayment: (orderId, status) => mutate((draft) => {
        const order = draft.orders.find((item) => item.id === orderId);
        if (!order || order.status !== "pending") return;
        order.status = status;
        order.downloadUnlocked = status === "paid";
        if (status === "paid") {
          order.items.forEach((item) => {
            const listing = draft.listings.find((entry) => entry.id === item.listingId);
            if (!listing) return;
            listing.sales += item.quantity;
            listing.downloads += item.quantity;
            if (item.serviceAddOn) {
              draft.serviceRequests = [
                {
                  id: createId("service"),
                  listingId: item.listingId,
                  buyerId: order.buyerId,
                  sellerId: item.sellerId,
                  orderId: order.id,
                  status: "new",
                  scope: "Setup service bij aankoop",
                  message: `Koper wil hulp bij ${item.title}.`,
                  createdAt: today()
                },
                ...draft.serviceRequests
              ];
            }
          });
        }
      }),
      toggleSavedListing: (listingId) => mutate((draft) => {
        const user = draft.users.find((item) => item.id === draft.activeUserId);
        if (!user) return;
        user.savedListings = user.savedListings.includes(listingId)
          ? user.savedListings.filter((id) => id !== listingId)
          : [listingId, ...user.savedListings];
      }),
      submitSellerApplication: (input) => mutate((draft) => {
        const existing = draft.sellerApplications.find((item) => item.userId === draft.activeUserId);
        if (existing) {
          Object.assign(existing, input, { status: "pending" });
        } else {
          draft.sellerApplications = [
            {
              ...input,
              id: createId("app"),
              userId: draft.activeUserId,
              status: "pending",
              createdAt: today()
            },
            ...draft.sellerApplications
          ];
        }
        const user = draft.users.find((item) => item.id === draft.activeUserId);
        if (user && user.role === "buyer") user.role = "seller_pending";
      }),
      approveSellerApplication: (applicationId) => mutate((draft) => {
        const application = draft.sellerApplications.find((item) => item.id === applicationId);
        if (!application) return;
        application.status = "approved";
        const user = draft.users.find((item) => item.id === application.userId);
        const sellerId = createId("seller");
        if (user) {
          user.role = "seller";
          user.sellerId = sellerId;
        }
        draft.sellers = [
          {
            id: sellerId,
            userId: application.userId,
            name: application.name,
            handle: slugify(application.business || application.name),
            status: "approved",
            specialty: application.business,
            bio: application.experience,
            location: "Europa",
            rating: 0,
            sales: 0,
            responseTime: "Nog niet bekend",
            verified: true
          },
          ...draft.sellers
        ];
        log(draft, "Seller goedgekeurd", "seller_application", applicationId);
      }),
      rejectSellerApplication: (applicationId) => mutate((draft) => {
        const application = draft.sellerApplications.find((item) => item.id === applicationId);
        if (!application) return;
        application.status = "rejected";
        log(draft, "Seller afgewezen", "seller_application", applicationId);
      }),
      createListing: (input) => {
        let createdListing: Listing | null = null;
        mutate((draft) => {
          const user = draft.users.find((item) => item.id === draft.activeUserId);
          if (!user?.sellerId) return;
          const autoScreenshots = input.screenshots && input.screenshots.length > 0
            ? input.screenshots.slice(0, 5)
            : generateMockScreenshots(input.title, input.type);
          createdListing = {
            id: createId("listing"),
            sellerId: user.sellerId,
            title: input.title,
            slug: `${slugify(input.title)}-${Date.now().toString(36)}`,
            tagline: input.tagline,
            description: input.description,
            categoryId: input.categoryId,
            type: input.type,
            useCases: input.useCases ?? [],
            branches: input.branches ?? [],
            priceCents: input.priceCents,
            setupPriceCents: input.setupPriceCents,
            status: "pending",
            featured: false,
            compatibility: input.compatibility,
            tags: input.tags,
            deliveryModes: input.deliveryModes,
            files: input.files,
            demo: {
              url: input.demoUrl,
              screenshots: autoScreenshots,
              instructions: input.demoInstructions,
              credentials: [{ label: "Demo toegang", value: "Instructies in listing" }],
              sampleInput: input.sampleInput
            },
            downloads: 0,
            sales: 0,
            rating: 0,
            reviewCount: 0,
            version: "1.0.0",
            createdAt: today(),
            updatedAt: today(),
            supportIncluded: input.supportIncluded
          };
          draft.listings = [createdListing, ...draft.listings];
          log(draft, "Listing ingediend", "listing", createdListing.id);
        });
        return createdListing;
      },
      approveListing: (listingId) => mutate((draft) => {
        const listing = draft.listings.find((item) => item.id === listingId);
        if (!listing) return;
        listing.status = "published";
        listing.updatedAt = today();
        log(draft, "Listing gepubliceerd", "listing", listingId);
      }),
      rejectListing: (listingId) => mutate((draft) => {
        const listing = draft.listings.find((item) => item.id === listingId);
        if (!listing) return;
        listing.status = "rejected";
        listing.updatedAt = today();
        log(draft, "Listing afgewezen", "listing", listingId);
      }),
      toggleFeatured: (listingId) => mutate((draft) => {
        const listing = draft.listings.find((item) => item.id === listingId);
        if (!listing) return;
        listing.featured = !listing.featured;
        log(draft, listing.featured ? "Listing uitgelicht" : "Uitgelicht verwijderd", "listing", listingId);
      }),
      addReview: (listingId, rating, comment, screenshots) => mutate((draft) => {
        const user = draft.users.find((item) => item.id === draft.activeUserId);
        if (!user) return;
        const review: Review = {
          id: createId("review"),
          listingId,
          buyerId: user.id,
          buyerName: user.name,
          rating,
          comment,
          approved: false,
          createdAt: today(),
          screenshots: screenshots?.length ? screenshots : undefined
        };
        draft.reviews = [review, ...draft.reviews];
        log(draft, "Review wacht op moderatie", "review", review.id);
      }),
      approveReview: (reviewId) => mutate((draft) => {
        const review = draft.reviews.find((item) => item.id === reviewId);
        if (!review) return;
        review.approved = true;
        const listing = draft.listings.find((item) => item.id === review.listingId);
        if (listing) {
          const approved = draft.reviews.filter((item) => item.listingId === listing.id && item.approved);
          listing.reviewCount = approved.length;
          listing.rating = approved.reduce((sum, item) => sum + item.rating, 0) / Math.max(approved.length, 1);
        }
        log(draft, "Review goedgekeurd", "review", reviewId);
      }),
      createServiceRequest: (input) => mutate((draft) => {
        draft.serviceRequests = [
          {
            ...input,
            id: createId("service"),
            buyerId: draft.activeUserId,
            status: "new",
            createdAt: today()
          },
          ...draft.serviceRequests
        ];
      }),
      updateServiceStatus: (requestId, status) => mutate((draft) => {
        const request = draft.serviceRequests.find((item) => item.id === requestId);
        if (!request) return;
        request.status = status;
      }),
      sendServiceMessage: (requestId, text) => mutate((draft) => {
        const request = draft.serviceRequests.find((item) => item.id === requestId);
        if (!request) return;
        const user = draft.users.find((u) => u.id === draft.activeUserId);
        const sender: ServiceMessage["sender"] = user?.role === "seller" ? "seller" : "buyer";
        if (!draft.serviceMessages) draft.serviceMessages = [];
        draft.serviceMessages.push({
          id: createId("msg"),
          requestId,
          sender,
          text,
          createdAt: today()
        });
        // Mark request as in-progress if a seller replies to a new request
        if (sender === "seller" && request.status === "new") request.status = "in_progress";
        if (sender === "buyer" && request.status === "waiting_for_buyer") request.status = "in_progress";
      }),
      proposeAppointment: ({ requestId, startsAt, durationMinutes, note }) => mutate((draft) => {
        const request = draft.serviceRequests.find((item) => item.id === requestId);
        if (!request) return;
        const user = draft.users.find((u) => u.id === draft.activeUserId);
        const proposedBy: Appointment["proposedBy"] = user?.role === "seller" ? "seller" : "buyer";
        if (!draft.appointments) draft.appointments = [];
        draft.appointments.push({
          id: createId("appt"),
          requestId,
          proposedBy,
          startsAt,
          durationMinutes,
          status: "proposed",
          note,
          createdAt: today()
        });
      }),
      updateAppointmentStatus: (appointmentId, status) => mutate((draft) => {
        const appointment = draft.appointments?.find((a) => a.id === appointmentId);
        if (!appointment) return;
        appointment.status = status;
      })
    };
  }, [activeUser, log, mutate, state]);

  return <MarketplaceContext.Provider value={store}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return context;
}

export function useListing(slug: string) {
  const { state } = useMarketplace();
  return state.listings.find((listing) => listing.slug === slug);
}

export function userHasPurchased(state: MarketplaceState, buyerId: string, listingId: string) {
  return state.orders.some(
    (order) =>
      order.buyerId === buyerId &&
      order.status === "paid" &&
      order.downloadUnlocked &&
      order.items.some((item) => item.listingId === listingId)
  );
}
