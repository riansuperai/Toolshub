"use client";

import { Heart } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";

export function LikeButton({
  listingId,
  size = "md",
  showCount = true
}: {
  listingId: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}) {
  const { state, activeUser, toggleLike } = useMarketplace();
  const toast = useToast();
  const likes = (state.likes ?? []).filter((l) => l.listingId === listingId);
  const liked = likes.some((l) => l.userId === activeUser.id);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (activeUser.role === "visitor") {
      toast.info("Log in om tools te liken");
      return;
    }
    toggleLike(listingId);
    if (!liked) toast.success("Toegevoegd aan je favorieten");
  }

  const iconSize = size === "sm" ? 13 : size === "lg" ? 18 : 15;

  return (
    <button
      type="button"
      className={`like-button size-${size}${liked ? " liked" : ""}`}
      onClick={handleClick}
      aria-label={liked ? "Verwijder like" : "Voeg toe aan favorieten"}
    >
      <Heart size={iconSize} fill={liked ? "currentColor" : "none"} />
      {showCount && likes.length > 0 ? <span>{likes.length}</span> : null}
    </button>
  );
}
