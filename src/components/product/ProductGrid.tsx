import { type Product } from "~/types/product";

import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-foreground text-xl font-semibold">
          Không có sản phẩm phù hợp
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Thử xóa bộ lọc hoặc tìm kiếm với từ khóa khác.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
