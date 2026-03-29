import Link from "next/link";

import { ProductGrid } from "~/components/product/ProductGrid";
import { products } from "~/data/products";

export function TrendingProducts() {
  const trendingProducts = products
    .filter((p) => p.discountPercent != null && p.discountPercent > 0)
    .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
    .slice(0, 8);

  if (trendingProducts.length === 0) return null;

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl leading-tight font-semibold">
            Sản phẩm bán chạy
          </h2>
          <Link
            href="/san-pham"
            className="text-primary text-sm hover:underline"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
        <ProductGrid products={trendingProducts} />
      </div>
    </section>
  );
}
