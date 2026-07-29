"use client";

import { ToastProvider } from "@/components/toast";
import { PageProgress } from "@/components/page-progress";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ToastProvider>
      <PageProgress />
      {children}
    </ToastProvider>
  );
}
