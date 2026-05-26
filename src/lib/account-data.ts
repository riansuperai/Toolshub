"use client";

import { useMemo } from "react";
import { useMarketplace } from "./marketplace-store";

export function useAccountData() {
  const { state, activeUser } = useMarketplace();

  const myOrders = useMemo(
    () => state.orders.filter((order) => order.buyerId === activeUser.id),
    [activeUser.id, state.orders]
  );
  const paidOrders = useMemo(() => myOrders.filter((order) => order.status === "paid"), [myOrders]);

  const purchasedListings = useMemo(() => {
    const ids = new Set(paidOrders.flatMap((order) => order.items.map((item) => item.listingId)));
    return state.listings.filter((listing) => ids.has(listing.id));
  }, [paidOrders, state.listings]);

  const savedListings = useMemo(
    () => state.listings.filter((listing) => activeUser.savedListings.includes(listing.id)),
    [activeUser.savedListings, state.listings]
  );

  const serviceRequests = useMemo(
    () => state.serviceRequests.filter((request) => request.buyerId === activeUser.id),
    [activeUser.id, state.serviceRequests]
  );

  const myReviewListingIds = useMemo(
    () =>
      new Set(
        state.reviews.filter((review) => review.buyerId === activeUser.id).map((review) => review.listingId)
      ),
    [activeUser.id, state.reviews]
  );

  const listingsToReview = useMemo(
    () => purchasedListings.filter((listing) => !myReviewListingIds.has(listing.id)),
    [purchasedListings, myReviewListingIds]
  );

  const openSupport = useMemo(
    () => serviceRequests.filter((request) => request.status !== "completed"),
    [serviceRequests]
  );

  return {
    myOrders,
    paidOrders,
    purchasedListings,
    savedListings,
    serviceRequests,
    listingsToReview,
    openSupport
  };
}
