"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { type Product } from "~/types/product";
import { useWishlist } from "~/context/WishlistContext";

import { PriceDisplay } from "./PriceDisplay";
import { ProductImageWithFallback } from "./ProductImageWithFallback";

export function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Deterministic mock rating from slug (3.5–5.0 range)
  const hash = product.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rating = 3.5 + (hash % 4) * 0.5;

  return (
    <Link href={`/san-pham/${product.slug}`}>
      <div className="group bg-card border-border overflow-hidden rounded-lg border border-b-2 transition-all hover:border-b-blue-800 hover:shadow-md">
        <div className="bg-muted relative aspect-square overflow-hidden">
          <ProductImageWithFallback
            src={product.image}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <Badge
            className={
              product.status === "in-stock"
                ? "absolute top-2 right-2 border-green-200 bg-green-100 text-green-700"
                : "bg-secondary text-secondary-foreground absolute top-2 right-2"
            }
          >
            {product.status === "in-stock" ? "Còn hàng" : "Hết hàng"}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.slug);
              toast(
                isWishlisted(product.slug)
                  ? "Đã xóa khỏi yêu thích"
                  : "Đã thêm vào yêu thích",
              );
            }}
            aria-label={
              isWishlisted(product.slug)
                ? "Xóa khỏi yêu thích"
                : "Thêm vào yêu thích"
            }
          >
            <Heart
              size={16}
              className={
                isWishlisted(product.slug) ? "fill-red-500 text-red-500" : ""
              }
            />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
            {product.name}
          </h3>
          {product.origin && (
            <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
              {product.origin}
            </p>
          )}
          <div className="mt-1 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i <= Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i - 0.5 <= rating ? "fill-yellow-400/50 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
          </div>
          <div className="mt-2">
            <PriceDisplay product={product} size="card" />
          </div>
        </div>
      </div>
    </Link>
  );
}
