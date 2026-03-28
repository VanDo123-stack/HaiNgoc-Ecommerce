"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useCart } from "~/context/CartContext";
import { products } from "~/data/products";
import { promotions } from "~/data/promotions";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function OrderSummary() {
  const router = useRouter();
  const { items } = useCart();

  // Compute subtotal for priced items and count contact-only items
  const pricedItems = items.filter((item) => {
    const product = products.find((p) => p.slug === item.slug);
    return product?.price !== null && product?.price !== undefined;
  });

  const contactItems = items.filter((item) => {
    const product = products.find((p) => p.slug === item.slug);
    return product?.price === null || product?.price === undefined;
  });

  const subtotal = pricedItems.reduce((sum, item) => {
    const product = products.find((p) => p.slug === item.slug);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const contactCount = contactItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>
      <Separator className="my-4" />

      {/* Item count */}
      <div className="flex items-center justify-between text-sm">
        <span>{totalItems} sản phẩm</span>
      </div>

      {/* Priced subtotal */}
      {pricedItems.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Tạm tính (sản phẩm có giá)
          </span>
          <span className="font-medium">
            {subtotal.toLocaleString("vi-VN")} đ
          </span>
        </div>
      )}

      {/* Contact-only items note */}
      {contactItems.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-sm text-muted-foreground">
            {contactCount} sản phẩm liên hệ báo giá
          </p>
          <p className="text-sm text-muted-foreground">Sẽ báo giá sau</p>
        </div>
      )}

      {/* Total row — shown when there are contact items */}
      {contactItems.length > 0 && pricedItems.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium">Cần báo giá thêm</span>
        </div>
      )}

      {/* Promo note — display-only, no actual discount calculation (D-02) */}
      {promotions.filter((p) => p.isActive && p.type === "cart-discount").length > 0 && (
        <div className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Mã{" "}
          <span className="font-mono font-semibold">
            {promotions.find((p) => p.isActive && p.type === "cart-discount")?.discountCode}
          </span>
          :{" "}
          {promotions.find((p) => p.isActive && p.type === "cart-discount")?.title}
        </div>
      )}

      <Separator className="my-4" />

      {/* CTA: Checkout */}
      <Button
        className="w-full bg-blue-800 hover:bg-blue-700"
        disabled={items.length === 0}
        onClick={() => router.push("/thanh-toan")}
      >
        Thanh toán
      </Button>

      {/* CTA: Proceed to quotation */}
      <Button
        variant="outline"
        className="mt-2 w-full"
        disabled={items.length === 0}
        onClick={() => router.push("/bao-gia")}
      >
        Yêu cầu báo giá
      </Button>

      {/* Continue shopping link */}
      <Link
        href="/san-pham"
        className={cn(buttonVariants({ variant: "ghost" }), "mt-2 w-full")}
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}
