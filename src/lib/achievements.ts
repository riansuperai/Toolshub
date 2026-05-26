import type { LucideIcon } from "lucide-react";
import { Award, Crown, Flame, Heart, MessageCircleQuestion, Package, Rocket, Sparkles, Star, TrendingUp, Trophy, Users } from "lucide-react";
import type { MarketplaceState } from "./types";

export type AchievementTier = "bronze" | "silver" | "gold" | "diamond";

export type Achievement = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tier: AchievementTier;
};

const ALL: ((state: MarketplaceState, sellerId: string) => Achievement | null)[] = [
  // First sale
  (state, sellerId) => {
    const sales = state.orders.filter((o) =>
      o.status === "paid" && o.items.some((i) => i.sellerId === sellerId)
    ).length;
    if (sales === 0) return null;
    return { id: "first_sale", label: "Eerste verkoop", description: "Eerste betaalde bestelling binnen", icon: Sparkles, tier: "bronze" };
  },
  // 10 sales
  (state, sellerId) => {
    const sales = state.orders.filter((o) =>
      o.status === "paid" && o.items.some((i) => i.sellerId === sellerId)
    ).length;
    if (sales < 10) return null;
    return { id: "ten_sales", label: "10 verkopen", description: "Eerste tien bestellingen", icon: TrendingUp, tier: "silver" };
  },
  // 100 sales
  (state, sellerId) => {
    const sales = state.orders.filter((o) =>
      o.status === "paid" && o.items.some((i) => i.sellerId === sellerId)
    ).length;
    if (sales < 100) return null;
    return { id: "hundred_sales", label: "Top 100", description: "Honderd betaalde bestellingen", icon: Trophy, tier: "gold" };
  },
  // 100 downloads
  (state, sellerId) => {
    const listings = state.listings.filter((l) => l.sellerId === sellerId);
    const downloads = listings.reduce((s, l) => s + l.downloads, 0);
    if (downloads < 100) return null;
    return { id: "downloads_100", label: "100 downloads", description: "Tools werden 100 keer gedownload", icon: Package, tier: "bronze" };
  },
  // 1000 downloads
  (state, sellerId) => {
    const listings = state.listings.filter((l) => l.sellerId === sellerId);
    const downloads = listings.reduce((s, l) => s + l.downloads, 0);
    if (downloads < 1000) return null;
    return { id: "downloads_1k", label: "1K downloads", description: "Tools werden 1000 keer gedownload", icon: Rocket, tier: "silver" };
  },
  // 10k downloads
  (state, sellerId) => {
    const listings = state.listings.filter((l) => l.sellerId === sellerId);
    const downloads = listings.reduce((s, l) => s + l.downloads, 0);
    if (downloads < 10_000) return null;
    return { id: "downloads_10k", label: "Viral creator", description: "10.000+ downloads — wow!", icon: Flame, tier: "diamond" };
  },
  // Top rated
  (state, sellerId) => {
    const listings = state.listings.filter((l) => l.sellerId === sellerId && l.rating >= 4.5 && l.reviewCount >= 3);
    if (listings.length === 0) return null;
    return { id: "top_rated", label: "Top rated", description: "Minimaal één tool met 4.5+ sterren", icon: Star, tier: "gold" };
  },
  // Multi-tool
  (state, sellerId) => {
    const published = state.listings.filter((l) => l.sellerId === sellerId && l.status === "published").length;
    if (published < 5) return null;
    return { id: "five_listings", label: "Volle bibliotheek", description: "Vijf of meer tools live", icon: Award, tier: "silver" };
  },
  // 10+ followers
  (state, sellerId) => {
    const followers = (state.follows ?? []).filter((f) => f.sellerId === sellerId).length;
    if (followers < 10) return null;
    return { id: "ten_followers", label: "Community-favoriet", description: "10+ kopers volgen je", icon: Users, tier: "silver" };
  },
  // Got a tip
  (state, sellerId) => {
    const tips = (state.tips ?? []).filter((t) => t.sellerId === sellerId);
    if (tips.length === 0) return null;
    return { id: "first_tip", label: "Bedankjes ontvangen", description: "Eerste tip van een dankbare koper", icon: Heart, tier: "bronze" };
  },
  // Q&A engagement
  (state, sellerId) => {
    const listings = state.listings.filter((l) => l.sellerId === sellerId).map((l) => l.id);
    const answeredQs = (state.toolQuestions ?? []).filter((q) => listings.includes(q.listingId) && q.answer).length;
    if (answeredQs < 3) return null;
    return { id: "qa_helper", label: "Vraagbaak", description: "3+ klantvragen beantwoord", icon: MessageCircleQuestion, tier: "silver" };
  },
  // Hazenco OG (creator van het eerste uur)
  (state, sellerId) => {
    const seller = state.sellers.find((s) => s.id === sellerId);
    if (!seller?.joinedAt) return null;
    const months = (Date.now() - new Date(seller.joinedAt).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (months < 6) return null;
    return { id: "veteran", label: "Veteraan", description: "Al 6+ maanden actief op Hazenco", icon: Crown, tier: "gold" };
  }
];

export function computeAchievements(state: MarketplaceState, sellerId: string): Achievement[] {
  return ALL
    .map((fn) => fn(state, sellerId))
    .filter((a): a is Achievement => a !== null);
}
