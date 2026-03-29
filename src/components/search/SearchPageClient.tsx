"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";


import { type Product } from "~/types/product";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ProductSort } from "~/components/product/ProductSort";
import { ProductGrid } from "~/components/product/ProductGrid";

interface SearchPageClientProps {
  products: Product[];
}

export function SearchPageClient({ products }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const qParam = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort") ?? "newest";

  const [inputValue, setInputValue] = useState(qParam);

  // Handle Enter key to submit search and update URL
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const encoded = encodeURIComponent(inputValue.trim());
      if (sortParam && sortParam !== "newest") {
        router.replace(`/tim-kiem?q=${encoded}&sort=${sortParam}`);
      } else {
        router.replace(`/tim-kiem?q=${encoded}`);
      }
    }
  }

  // Determine mode: no query, short query, or full search
  const hasQuery = qParam.length > 0;
  const queryTooShort = hasQuery && qParam.length < 2;

  // Client-side filtering
  let filtered = [...products];
  if (hasQuery && qParam.length >= 2) {
    const query = qParam.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.origin.toLowerCase().includes(query) ||
        product.standard.toLowerCase().includes(query),
    );
  }

  // Client-side sorting
  if (sortParam === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  } else if (sortParam === "price") {
    filtered.sort((a, b) => {
      // null prices (contact) go to end
      if (a.price === null && b.price === null) return 0;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return a.price - b.price;
    });
  }
  // "newest" = default order from data array

  // Trending products for no-query state: discountPercent > 0, sorted desc, capped at 8
  const trendingProducts = [...products]
    .filter((p) => (p.discountPercent ?? 0) > 0)
    .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
    .slice(0, 8);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tìm kiếm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search input */}
      <div className="mb-8">
        <div className="relative mx-auto max-w-2xl">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập từ khóa tìm kiếm..."
            className="border-input bg-background focus:ring-ring w-full rounded-lg border py-3 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        {!hasQuery && (
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Nhấn Enter để tìm kiếm
          </p>
        )}
      </div>

      {/* Query too short */}
      {queryTooShort && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground text-sm">
            Vui lòng nhập ít nhất 2 ký tự để tìm kiếm
          </p>
        </div>
      )}

      {/* No query — show trending products */}
      {!hasQuery && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Sản phẩm nổi bật</h2>
          <ProductGrid products={trendingProducts} />
        </div>
      )}

      {/* Search results */}
      {hasQuery && !queryTooShort && (
        <div>
          {/* Result count + sort */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {filtered.length > 0
                ? `Tìm thấy ${filtered.length} sản phẩm cho "${qParam}"`
                : ""}
            </p>
            <ProductSort />
          </div>

          {/* Results or empty state */}
          {filtered.length > 0 ? (
            <ProductGrid products={filtered} />
          ) : (
            <div className="py-16 text-center">
              <h3 className="mb-2 text-lg font-semibold">
                Không tìm thấy sản phẩm nào cho &ldquo;{qParam}&rdquo;
              </h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Thử tìm với từ khóa khác
              </p>
              <Link
                href="/san-pham"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
