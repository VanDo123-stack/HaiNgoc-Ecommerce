import { Suspense } from "react";
import { type Metadata } from "next";

import { products } from "~/data/products";
import { SearchPageClient } from "~/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "Tìm kiếm - Hải Ngọc",
  description:
    "Tìm kiếm sản phẩm vật tư công nghiệp: que hàn, máy mài, đá mài, dụng cụ cắt hàn.",
};

export default function SearchPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <Suspense
          fallback={
            <div className="text-muted-foreground text-sm">Đang tải...</div>
          }
        >
          <SearchPageClient products={products} />
        </Suspense>
      </div>
    </main>
  );
}
