"use client";

import { useMarketplace } from "@/lib/marketplace-store";
import { AdminShell } from "./admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { activeUser } = useMarketplace();

  if (activeUser.role !== "admin") {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", padding: 40 }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <h1 style={{ color: "var(--green-900)", fontSize: 28 }}>Admin toegang vereist</h1>
          <p style={{ color: "var(--green-700)", marginTop: 12 }}>
            Wissel rechtsonder via Demo profielen naar &quot;Admin&quot; om de Hazenco admin console te bekijken.
          </p>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
