import { Suspense } from "react";
import { type Metadata } from "next";

import { products } from "~/data/products";
import { categories } from "~/data/categories";
import { ProductListingClient } from "~/components/product/ProductListingClient";

export const metadata: Metadata = {
  title: "Sản phẩm - Hải Ngọc",
  description:
    "Danh sách vật tư công nghiệp: que hàn, máy mài, đá mài, dụng cụ cắt hàn.",
};

export default function ProductsPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <Suspense
          fallback={
            <div className="text-muted-foreground text-sm">Đang tải...</div>
          }
        >
          <ProductListingClient products={products} categories={categories} />
        </Suspense>
      </div>
    </main>
  );
}
