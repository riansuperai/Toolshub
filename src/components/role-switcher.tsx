"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, ShieldCheck, ShoppingBag, Store, UserCog } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";

type RoleOption = {
  userId: string;
  label: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  href: string;
};

const roleOptions: RoleOption[] = [
  {
    userId: "user_visitor",
    label: "Bezoeker",
    description: "Anonieme browser, nog niet ingelogd",
    icon: Eye,
    badge: "Niet ingelogd",
    href: "/"
  },
  {
    userId: "user_buyer",
    label: "Koper",
    description: "Nudi Buyer · bibliotheek, downloads, reviews",
    icon: ShoppingBag,
    badge: "Koper account",
    href: "/account"
  },
  {
    userId: "user_seller",
    label: "Creator",
    description: "Hazenco Studio · listings, bestellingen, service",
    icon: Store,
    badge: "Creator dashboard",
    href: "/seller"
  },
  {
    userId: "user_admin",
    label: "Admin",
    description: "Hazenco Admin · creators, listings, reviews, GMV",
    icon: ShieldCheck,
    badge: "Beheer",
    href: "/admin"
  }
];

export function RoleSwitcher() {
  const { state, setActiveUser } = useMarketplace();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  const current = roleOptions.find((option) => option.userId === state.activeUserId) ?? roleOptions[0];
  const CurrentIcon = current.icon;

  return (
    <div className={`role-switcher${open ? " open" : ""}`} aria-live="polite">
      {open ? (
        <div className="role-switcher-panel" role="dialog" aria-label="Wissel van profiel">
          <div className="role-switcher-head">
            <div>
              <span className="eyebrow"><UserCog size={12} /> Demo profielen</span>
              <strong>Bekijk de marketplace vanuit elk perspectief</strong>
            </div>
            <button type="button" className="role-switcher-close" onClick={() => setOpen(false)} aria-label="Sluiten">
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="role-switcher-options">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.userId === state.activeUserId;
              return (
                <button
                  key={option.userId}
                  type="button"
                  className={`role-switcher-option${isActive ? " active" : ""}`}
                  onClick={() => {
                    setActiveUser(option.userId);
                    setOpen(false);
                    router.push(option.href);
                  }}
                >
                  <span className="role-switcher-icon"><Icon size={16} /></span>
                  <span className="role-switcher-body">
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </span>
                  <span className="role-switcher-badge">{option.badge}</span>
                </button>
              );
            })}
          </div>
          <p className="role-switcher-foot">
            Wijzigingen blijven bewaard in je browser tot je een ander profiel kiest.
          </p>
        </div>
      ) : null}
      <button
        type="button"
        className="role-switcher-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Wissel demo profiel"
      >
        <span className="role-switcher-trigger-icon"><CurrentIcon size={16} /></span>
        <span className="role-switcher-trigger-body">
          <span className="eyebrow">Demo profiel</span>
          <strong>{current.label}</strong>
        </span>
        <ChevronDown size={14} className="role-switcher-trigger-caret" />
      </button>
    </div>
  );
}
