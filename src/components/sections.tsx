"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import type { Listing } from "@/lib/types";

export function SectionHeading({
  eyebrow,
  title,
  actionHref,
  actionLabel
}: {
  eyebrow: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {actionHref && actionLabel && (
        <Link className="text-action" href={actionHref}>
          {actionLabel} <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}

export function ProductRail({ listings }: { listings: Listing[] }) {
  return (
    <div className="product-grid">
      {listings.map((listing) => (
        <ProductCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export function KpiCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="kpi-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}
