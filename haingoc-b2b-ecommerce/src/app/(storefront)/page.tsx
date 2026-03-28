import { type Metadata } from "next";
import Link from "next/link";

import { CategoryGrid } from "~/components/home/CategoryGrid";
import { HeroBanner } from "~/components/home/HeroBanner";
import { NewsSection } from "~/components/home/NewsSection";
import { PartnerCarousel } from "~/components/home/PartnerCarousel";
import { PromoBanners } from "~/components/home/PromoBanners";
import { TrendingProducts } from "~/components/home/TrendingProducts";
import { ProductGrid } from "~/components/product/ProductGrid";
import { categories } from "~/data/categories";
import { news } from "~/data/news";
import { products } from "~/data/products";

export const metadata: Metadata = {
  title: "Hải Ngọc - Vật tư công nghiệp cơ khí và dầu khí",
  description:
    "Cung cấp que hàn, máy mài, dụng cụ cắt hàn chuyên dụng cho ngành cơ khí và dầu khí.",
};

export default function Home() {
  const featuredProducts = [
    ...products.filter((p) => p.categorySlug === "que-han").slice(0, 2),
    ...products.filter((p) => p.categorySlug === "dung-cu-cat-han").slice(0, 2),
    ...products.filter((p) => p.categorySlug === "da-mai-da-cat").slice(0, 2),
    ...products.filter((p) => p.categorySlug === "may-mai").slice(0, 1),
    ...products.filter((p) => p.categorySlug === "vat-tu-thiet-bi").slice(0, 1),
  ];
  const latestNews = news.slice(0, 3);

  return (
    <main>
      <HeroBanner />
      <CategoryGrid categories={categories} />
      <PromoBanners />
      <section className="bg-background py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl leading-tight font-semibold">
              Sản phẩm nổi bật
            </h2>
            <Link
              href="/san-pham"
              className="text-primary text-sm hover:underline"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      <TrendingProducts />
      <NewsSection articles={latestNews} />
      <PartnerCarousel />
    </main>
  );
}
