"use client";

import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { SellerApplicationView } from "./seller-application";
import { SellerShell } from "./seller-shell";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { activeUser } = useMarketplace();
  const data = useSellerData();

  if (activeUser.role !== "seller" || !data.seller) {
    return <SellerApplicationView />;
  }

  return <SellerShell>{children}</SellerShell>;
}
