"use client";

import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { type Category, type Product } from "~/types/product";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ProductFilters } from "~/components/product/ProductFilters";
import { ProductSort } from "~/components/product/ProductSort";
import { ProductGrid } from "~/components/product/ProductGrid";

interface ProductListingClientProps {
  products: Product[];
  categories: Category[];
}

export function ProductListingClient({
  products,
  categories,
}: ProductListingClientProps) {
  const searchParams = useSearchParams();

  // Read URL params
  const categoryParam = searchParams.get("category");
  const originParam = searchParams.get("origin");
  const standardParam = searchParams.get("standard");
  const standardTypeParam = searchParams.get("standardType");
  const materialGradeParam = searchParams.get("materialGrade");
  const dimensionCategoryParam = searchParams.get("dimensionCategory");
  const sortParam = searchParams.get("sort") ?? "newest";

  // Client-side filtering
  let filtered = [...products];
  if (categoryParam) {
    filtered = filtered.filter((p) => p.categorySlug === categoryParam);
  }
  if (originParam) {
    filtered = filtered.filter((p) => p.origin === originParam);
  }
  if (standardParam) {
    filtered = filtered.filter((p) => p.standard === standardParam);
  }
  if (standardTypeParam) {
    filtered = filtered.filter((p) => p.standardType === standardTypeParam);
  }
  if (materialGradeParam) {
    filtered = filtered.filter((p) => p.materialGrade === materialGradeParam);
  }
  if (dimensionCategoryParam) {
    filtered = filtered.filter(
      (p) => p.dimensionCategory === dimensionCategoryParam,
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
  // "newest" = default order from data array (already sorted by scrape order)

  // Breadcrumb active category
  const activeCategory = categories.find((c) => c.slug === categoryParam);

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
            {activeCategory ? (
              <BreadcrumbLink href="/san-pham">Sản phẩm</BreadcrumbLink>
            ) : (
              <BreadcrumbPage>Sản phẩm</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {activeCategory && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{activeCategory.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main layout */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Mobile filter trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="border-input hover:bg-accent hover:text-accent-foreground inline-flex h-8 items-center gap-2 rounded-lg border bg-transparent px-3 text-sm">
              <SlidersHorizontal className="h-4 w-4" />
              Bộ lọc
            </SheetTrigger>
            <SheetContent side="left" className="p-4">
              <ProductFilters categories={categories} products={products} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <ProductFilters categories={categories} products={products} />
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {filtered.length} sản phẩm
            </p>
            <ProductSort />
          </div>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
