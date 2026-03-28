"use client";

import { type Product } from "~/types/product";
import { useCart } from "~/context/CartContext";
import { combos } from "~/data/promotions";
import { products } from "~/data/products";
import { CrossSellProducts } from "~/components/product/CrossSellProducts";

// CartCrossSell — shows cross-sell products from combo bundles matching cart items (D-01)
export function CartCrossSell() {
  const { items } = useCart();
  const cartSlugs = items.map((i) => i.slug);

  // Find combos that include any cart item
  const matchedCombos = combos.filter((c) =>
    c.productSlugs.some((s) => cartSlugs.includes(s)),
  );

  // Collect slugs from matched combos that are NOT already in cart
  const crossSellSlugs = [
    ...new Set(
      matchedCombos.flatMap((c) =>
        c.productSlugs.filter((s) => !cartSlugs.includes(s)),
      ),
    ),
  ];

  // Resolve slugs to Product objects
  const crossSellProducts = crossSellSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  return <CrossSellProducts products={crossSellProducts} />;
}
