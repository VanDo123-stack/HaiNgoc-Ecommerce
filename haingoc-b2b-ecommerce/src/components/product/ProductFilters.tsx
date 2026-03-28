"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { type Category, type Product } from "~/types/product";

interface ProductFiltersProps {
  categories: Category[];
  products: Product[];
}

export function ProductFilters({ categories, products }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const activeOrigin = searchParams.get("origin");
  const activeStandard = searchParams.get("standard");
  const activeStandardType = searchParams.get("standardType");
  const activeMaterialGrade = searchParams.get("materialGrade");
  const activeDimensionCategory = searchParams.get("dimensionCategory");

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && params.get(key) !== value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    router.replace(`${pathname}?${params.toString()}`);
  }

  // Derive unique non-empty origin values
  const origins = [...new Set(products.map((p) => p.origin).filter(Boolean))];
  // Derive unique non-empty standard values
  const standards = [
    ...new Set(products.map((p) => p.standard).filter(Boolean)),
  ];
  const standardTypes = [
    ...new Set(products.map((p) => p.standardType).filter(Boolean)),
  ] as string[];
  const materialGrades = [
    ...new Set(products.map((p) => p.materialGrade).filter(Boolean)),
  ] as string[];
  const dimensionCategories = [
    ...new Set(products.map((p) => p.dimensionCategory).filter(Boolean)),
  ] as string[];

  const hasActiveFilters =
    activeCategory ??
    activeOrigin ??
    activeStandard ??
    activeStandardType ??
    activeMaterialGrade ??
    activeDimensionCategory;

  return (
    <div className="space-y-6">
      {/* Header with clear button */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Bộ lọc</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-primary text-xs hover:underline"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Danh mục</h3>
        <ul className="space-y-1">
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            return (
              <li key={category.slug}>
                <button
                  onClick={() => setFilter("category", category.slug)}
                  className={`hover:text-foreground w-full text-left text-sm transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="line-clamp-1">{category.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Origin filter — only show if 2+ distinct values */}
      {origins.length >= 2 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Xuất xứ</h3>
          <ul className="space-y-1">
            {origins.map((origin) => {
              const isActive = activeOrigin === origin;
              return (
                <li key={origin}>
                  <button
                    onClick={() => setFilter("origin", origin)}
                    className={`hover:text-foreground w-full text-left text-sm transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="line-clamp-1">{origin}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Standard filter — only show if 2+ distinct values */}
      {standards.length >= 2 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Tiêu chuẩn</h3>
          <ul className="space-y-1">
            {standards.map((standard) => {
              const isActive = activeStandard === standard;
              return (
                <li key={standard}>
                  <button
                    onClick={() => setFilter("standard", standard)}
                    className={`hover:text-foreground w-full text-left text-sm transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="line-clamp-1">{standard}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Standard type filter — only show if 2+ distinct values */}
      {standardTypes.length >= 2 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Tiêu chuẩn kỹ thuật</h3>
          <ul className="space-y-1">
            {standardTypes.map((st) => {
              const isActive = activeStandardType === st;
              return (
                <li key={st}>
                  <button
                    onClick={() => setFilter("standardType", st)}
                    className={`hover:text-foreground w-full text-left text-sm transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="line-clamp-1">{st}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Material grade filter — only show if 2+ distinct values */}
      {materialGrades.length >= 2 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Mác vật liệu</h3>
          <ul className="space-y-1">
            {materialGrades.map((mg) => {
              const isActive = activeMaterialGrade === mg;
              return (
                <li key={mg}>
                  <button
                    onClick={() => setFilter("materialGrade", mg)}
                    className={`hover:text-foreground w-full text-left text-sm transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="line-clamp-1">{mg}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Dimension category filter — only show if 2+ distinct values */}
      {dimensionCategories.length >= 2 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Kích thước</h3>
          <ul className="space-y-1">
            {dimensionCategories.map((dc) => {
              const isActive = activeDimensionCategory === dc;
              return (
                <li key={dc}>
                  <button
                    onClick={() => setFilter("dimensionCategory", dc)}
                    className={`hover:text-foreground w-full text-left text-sm transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="line-clamp-1">{dc}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
