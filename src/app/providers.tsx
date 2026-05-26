"use client";

import { MarketplaceProvider } from "@/lib/marketplace-store";
import { ToastProvider } from "@/components/toast";
import { PageProgress } from "@/components/page-progress";
import { KeyboardShortcutsProvider } from "@/components/keyboard-shortcuts";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <MarketplaceProvider>
      <ToastProvider>
        <KeyboardShortcutsProvider>
          <PageProgress />
          {children}
        </KeyboardShortcutsProvider>
      </ToastProvider>
    </MarketplaceProvider>
  );
}
