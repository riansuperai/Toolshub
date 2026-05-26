"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Wrench
} from "lucide-react";
import { Shell } from "@/components/shell";
import { formatPrice, productTypeLabels } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";

export default function CartPage() {
  const router = useRouter();
  const { state, activeUser, updateCartItem, removeFromCart, createTestOrder, setActiveUser } = useMarketplace();
  const isVisitor = activeUser.role === "visitor";
  const rows = state.cart
    .map((cartItem) => {
      const listing = state.listings.find((item) => item.id === cartItem.listingId);
      return listing ? { cartItem, listing } : null;
    })
    .filter(Boolean) as { cartItem: typeof state.cart[number]; listing: typeof state.listings[number] }[];

  const subtotal = rows.reduce((sum, row) => sum + row.cartItem.quantity * row.listing.priceCents, 0);
  const addOnTotal = rows.reduce((sum, row) => sum + (row.cartItem.serviceAddOn ? row.listing.setupPriceCents : 0), 0);
  const total = subtotal + addOnTotal;
  const itemCount = rows.reduce((sum, row) => sum + row.cartItem.quantity, 0);

  function checkout() {
    if (isVisitor) {
      setActiveUser("user_buyer");
      return;
    }
    const order = createTestOrder();
    if (order) router.push(`/checkout?orderId=${encodeURIComponent(order.id)}`);
  }

  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Winkelwagen</span>
        <h1>{itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "tool" : "tools"} in je winkelwagen` : "Je winkelwagen"}</h1>
        <p className="lead">Controleer de inhoud, kies eventueel setup-service en reken veilig af.</p>

        {rows.length ? (
          <div className="detail-layout" style={{ marginTop: 14 }}>
            <div className="stack">
              {rows.map(({ cartItem, listing }) => {
                const lineTotal =
                  cartItem.quantity * listing.priceCents + (cartItem.serviceAddOn ? listing.setupPriceCents : 0);
                return (
                  <div className="cart-item" key={listing.id}>
                    <div className="cart-item-visual">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="cart-item-body">
                      <strong>{listing.title}</strong>
                      <span className="small">{productTypeLabels[listing.type]} · {formatPrice(listing.priceCents)} per stuk</span>
                      <span className="meta">{listing.tagline}</span>
                      {listing.setupPriceCents > 0 && listing.deliveryModes.includes("custom") ? (
                        <label className={`cart-item-addon${cartItem.serviceAddOn ? " checked" : ""}`}>
                          <input
                            type="checkbox"
                            checked={cartItem.serviceAddOn}
                            onChange={(event) => updateCartItem(listing.id, { serviceAddOn: event.target.checked })}
                          />
                          <Wrench size={13} />
                          Setup-service +{formatPrice(listing.setupPriceCents)}
                        </label>
                      ) : null}
                    </div>
                    <div className="cart-item-aside">
                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label="Minder"
                          onClick={() => updateCartItem(listing.id, { quantity: Math.max(1, cartItem.quantity - 1) })}
                        >
                          <Minus size={14} />
                        </button>
                        <strong>{cartItem.quantity}</strong>
                        <button
                          type="button"
                          aria-label="Meer"
                          onClick={() => updateCartItem(listing.id, { quantity: cartItem.quantity + 1 })}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="line-total">{formatPrice(lineTotal)}</span>
                      <button className="cart-remove" type="button" onClick={() => removeFromCart(listing.id)}>
                        <Trash2 size={13} /> Verwijder
                      </button>
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: 8 }}>
                <Link className="detail-back" href="/catalogus"><Plus size={14} /> Meer tools toevoegen</Link>
              </div>
            </div>

            <aside className="summary-card">
              <h2>Samenvatting</h2>
              <div className="summary-row">
                <span>{itemCount} {itemCount === 1 ? "tool" : "tools"}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {addOnTotal > 0 ? (
                <div className="summary-row">
                  <span>Setup-service</span>
                  <span>{formatPrice(addOnTotal)}</span>
                </div>
              ) : null}
              <div className="summary-row">
                <span>BTW (21%)</span>
                <span>inbegrepen</span>
              </div>
              <div className="summary-row total">
                <span>Totaal</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button className="button" type="button" onClick={checkout} style={{ width: "100%", marginTop: 14, minHeight: 46 }}>
                {isVisitor ? "Log in om af te rekenen" : "Naar afrekenen"} <ArrowRight size={17} />
              </button>
              {isVisitor ? (
                <p style={{ marginTop: 8, color: "var(--green-500)", fontSize: 12.5, textAlign: "center" }}>
                  Je bent nog niet ingelogd. Klik om als koper in te loggen en af te rekenen.
                </p>
              ) : null}
              <ul className="trust-list">
                <li><CheckCircle2 size={16} /> Veilige test-checkout, geen echte afschrijving</li>
                <li><CheckCircle2 size={16} /> Direct toegang tot bestanden na betaling</li>
                <li><ShieldCheck size={16} /> Geverifieerde creators en review-moderatie</li>
              </ul>
            </aside>
          </div>
        ) : (
          <div className="empty-state" style={{ marginTop: 24 }}>
            <ShoppingBag size={32} style={{ color: "var(--green-500)" }} />
            <h2>Je winkelwagen is leeg</h2>
            <p>Bekijk de catalogus en voeg een tool toe om de aankoop te testen.</p>
            <Link className="button" href="/catalogus" style={{ marginTop: 12 }}>Naar catalogus</Link>
          </div>
        )}
      </div>
    </Shell>
  );
}
