"use client";

import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { ListingForm } from "../listing-form";

export default function SellerNewListingPage() {
  const { activeUser } = useMarketplace();
  const data = useSellerData();

  if (activeUser.role !== "seller" || !data.seller) return null;

  return <ListingForm />;
}
