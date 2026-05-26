"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Compass, Home, Search, Sparkles, Store } from "lucide-react";
import { Shell } from "@/components/shell";
import { ProductCard } from "@/components/product-card";
import { useMarketplace } from "@/lib/marketplace-store";

export default function NotFound() {
  const { state } = useMarketplace();

  const popular = useMemo(
    () => state.listings
      .filter((l) => l.status === "published")
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 3),
    [state.listings]
  );

  return (
    <Shell>
      <div className="not-found-page">
        <div className="not-found-illustration">
          <div className="not-found-code">404</div>
          <div className="not-found-blob" />
          <Compass size={48} className="not-found-compass" />
        </div>

        <div className="not-found-content">
          <span className="eyebrow"><Sparkles size={11} /> Oeps</span>
          <h1>Deze pagina is verdwaald</h1>
          <p>
            De link werkt niet meer of de pagina is verplaatst. Geen zorgen — gebruik onderstaande snelkoppelingen om weer op pad te komen.
          </p>

          <div className="not-found-actions">
            <Link href="/" className="button">
              <Home size={15} /> Naar home
            </Link>
            <Link href="/catalogus" className="button secondary">
              <Search size={15} /> Bekijk catalogus
            </Link>
            <button type="button" className="button secondary" onClick={() => history.back()}>
              <ArrowLeft size={15} /> Vorige pagina
            </button>
          </div>
        </div>

        {popular.length > 0 ? (
          <section className="not-found-popular">
            <h2><Store size={16} /> Populaire tools</h2>
            <div className="product-grid">
              {popular.map((l) => <ProductCard key={l.id} listing={l} />)}
            </div>
          </section>
        ) : null}
      </div>
    </Shell>
  );
}
