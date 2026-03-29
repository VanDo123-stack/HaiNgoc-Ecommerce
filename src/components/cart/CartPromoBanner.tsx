"use client";

import { promotions } from "~/data/promotions";

// CartPromoBanner — shows active cart-discount promotions above the cart items table (D-02, D-03)
export function CartPromoBanner() {
  const activePromos = promotions.filter(
    (p) => p.isActive && p.type === "cart-discount",
  );

  if (activePromos.length === 0) return null;

  return (
    <div className="space-y-2">
      {activePromos.map((promo) => (
        <div
          key={promo.id}
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <p className="text-sm text-amber-800">
            {promo.description}
            {promo.discountCode && (
              <>
                {" "}
                — Mã:{" "}
                <span className="font-mono font-semibold text-amber-900">
                  {promo.discountCode}
                </span>
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
