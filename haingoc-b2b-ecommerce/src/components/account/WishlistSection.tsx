"use client";

import { Heart, X } from "lucide-react";
import { toast } from "sonner";

import { type Product } from "~/types/product";
import { Button } from "~/components/ui/button";
import { useWishlist } from "~/context/WishlistContext";
import { products } from "~/data/products";
import { ProductCard } from "~/components/product/ProductCard";

export function WishlistSection() {
  const { slugs, removeFromWishlist } = useWishlist();

  const wishlistProducts = slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => p !== undefined);

  if (wishlistProducts.length === 0) {
    return (
      <div className="py-12 text-center">
        <Heart size={40} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-base font-semibold">Chưa có sản phẩm yêu thích</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Thêm sản phẩm vào danh sách yêu thích để dễ dàng tìm lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {wishlistProducts.map((product) => (
        <div key={product.slug} className="relative">
          <ProductCard product={product} />
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-destructive hover:text-destructive-foreground absolute top-2 right-10 z-10 h-8 w-8"
            onClick={() => {
              removeFromWishlist(product.slug);
              toast("Đã xóa khỏi yêu thích");
            }}
            aria-label="Xóa khỏi danh sách yêu thích"
          >
            <X size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
}
