"use client";

import { useCart } from "~/context/CartContext";
import { products } from "~/data/products";
import { CartRow } from "~/components/cart/CartRow";
import { EmptyCart } from "~/components/cart/EmptyCart";

export function CartItemsTable() {
  const { items } = useCart();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div>
      {/* Column headers — desktop only */}
      <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 pb-2 lg:grid">
        <span className="text-sm font-semibold text-muted-foreground">
          Sản phẩm
        </span>
        <span className="text-sm font-semibold text-muted-foreground">
          Số lượng
        </span>
        <span className="w-28 text-right text-sm font-semibold text-muted-foreground">
          Đơn giá
        </span>
        <span className="sr-only">Xóa</span>
      </div>

      {/* Cart rows */}
      {items.map((item) => {
        const product = products.find((p) => p.slug === item.slug);
        // Skip items where product no longer exists in catalog (stale localStorage)
        if (!product) return null;
        return <CartRow key={item.slug} item={item} product={product} />;
      })}
    </div>
  );
}
