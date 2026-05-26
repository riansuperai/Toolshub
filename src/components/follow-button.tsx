"use client";

import { Bell, BellOff, UserPlus } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";

export function FollowButton({ sellerId, sellerName, variant = "primary" }: { sellerId: string; sellerName: string; variant?: "primary" | "compact" }) {
  const { state, activeUser, toggleFollow } = useMarketplace();
  const toast = useToast();
  const isFollowing = (state.follows ?? []).some((f) => f.followerId === activeUser.id && f.sellerId === sellerId);

  function handleClick() {
    if (activeUser.role === "visitor") {
      toast.info("Log in om creators te volgen");
      return;
    }
    toggleFollow(sellerId);
    toast.success(isFollowing ? `${sellerName} ontvolgd` : `Je volgt nu ${sellerName}`, isFollowing ? undefined : "Je krijgt een melding bij nieuwe tools.");
  }

  if (variant === "compact") {
    return (
      <button type="button" className={`follow-btn-compact${isFollowing ? " following" : ""}`} onClick={handleClick}>
        {isFollowing ? <BellOff size={12} /> : <Bell size={12} />}
        {isFollowing ? "Volgend" : "Volg"}
      </button>
    );
  }

  return (
    <button type="button" className={`follow-btn${isFollowing ? " following" : ""}`} onClick={handleClick}>
      {isFollowing ? <><BellOff size={14} /> Volgend</> : <><UserPlus size={14} /> Volg creator</>}
    </button>
  );
}
