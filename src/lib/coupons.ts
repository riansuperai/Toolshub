/** Coupon-systeem — geseede codes met geldigheid en max gebruik. */

export type CouponKind = "percentage" | "flat";

export type Coupon = {
  code: string;
  kind: CouponKind;
  /** Percentage: 0-100. Flat: cents */
  value: number;
  description: string;
  minSubtotalCents?: number;
  expiresAt?: string;
  maxUses?: number;
};

/** In productie komen deze uit Postgres. Voor demo zijn ze gehardcoded. */
export const SEEDED_COUPONS: Coupon[] = [
  {
    code: "WELKOM10",
    kind: "percentage",
    value: 10,
    description: "10% korting voor nieuwe kopers",
    expiresAt: "2026-12-31"
  },
  {
    code: "ZOMER25",
    kind: "percentage",
    value: 25,
    description: "Zomeractie: 25% korting boven €100",
    minSubtotalCents: 10000,
    expiresAt: "2026-09-30"
  },
  {
    code: "HAZENCO5",
    kind: "flat",
    value: 500,
    description: "€5 korting op je bestelling"
  },
  {
    code: "GRATIS",
    kind: "percentage",
    value: 100,
    description: "DEMO: 100% korting (gratis aankoop)"
  }
];

export type CouponValidation =
  | { valid: true; coupon: Coupon; discountCents: number }
  | { valid: false; error: string };

export function validateCoupon(input: string, subtotalCents: number): CouponValidation {
  const code = input.trim().toUpperCase();
  if (!code) return { valid: false, error: "Voer een code in." };

  const coupon = SEEDED_COUPONS.find((c) => c.code === code);
  if (!coupon) return { valid: false, error: "Code onbekend of niet meer geldig." };

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: "Deze code is verlopen." };
  }

  if (coupon.minSubtotalCents && subtotalCents < coupon.minSubtotalCents) {
    return {
      valid: false,
      error: `Minimum bestelbedrag: €${(coupon.minSubtotalCents / 100).toFixed(2)}.`
    };
  }

  const discountCents = coupon.kind === "percentage"
    ? Math.round((subtotalCents * coupon.value) / 100)
    : Math.min(coupon.value, subtotalCents);

  return { valid: true, coupon, discountCents };
}

export function formatCouponDiscount(coupon: Coupon): string {
  return coupon.kind === "percentage"
    ? `${coupon.value}%`
    : `€${(coupon.value / 100).toFixed(2)}`;
}
