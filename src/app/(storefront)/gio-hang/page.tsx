import { type Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { CartItemsTable } from "~/components/cart/CartItemsTable";
import { CartCrossSell } from "~/components/cart/CartCrossSell";
import { CartPromoBanner } from "~/components/cart/CartPromoBanner";
import { OrderSummary } from "~/components/cart/OrderSummary";

export const metadata: Metadata = {
  title: "Giỏ hàng - Hải Ngọc",
  description: "Xem và quản lý sản phẩm trong giỏ hàng của bạn.",
  robots: "noindex",
};

export default function CartPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Giỏ hàng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page title */}
      <h1 className="mt-4 text-2xl font-semibold leading-tight">Giỏ hàng</h1>

      {/* Active promotion banner — shown above cart items when cart-discount promos exist */}
      <div className="mt-4">
        <CartPromoBanner />
      </div>

      {/* 2-column grid: items table + order summary sidebar */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: cart items table (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <CartItemsTable />
        </div>

        {/* Right: order summary sidebar (1/3 width on desktop, sticky) */}
        <div className="lg:col-span-1 lg:self-start lg:sticky lg:top-4">
          <OrderSummary />
        </div>
      </div>

      {/* Cross-sell carousel — combo bundle products not already in cart (D-01) */}
      <CartCrossSell />
    </main>
  );
}
