"use client";

import { useState } from "react";
import { Minus, Plus, Heart } from "lucide-react";
import { toast } from "sonner";

import { type Product } from "~/types/product";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/context/WishlistContext";

export function AddToCartArea({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  if (product.status === "out-of-stock") {
    return (
      <div className="flex gap-2">
        <Button
          className="flex-1"
          size="lg"
          disabled
        >
          Hết hàng
        </Button>
        <Button
          variant="outline"
          size="lg"
          type="button"
          onClick={() => {
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
            size={18}
            className={
              isWishlisted(product.slug) ? "fill-red-500 text-red-500" : ""
            }
          />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label htmlFor="quantity" className="sr-only">
          Số lượng
        </label>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          aria-label="Giảm"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={999}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Math.min(999, Number(e.target.value) || 1)))
          }
          className="w-20 text-center"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.min(999, quantity + 1))}
          aria-label="Tăng"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          size="lg"
          onClick={() => {
            addItem(product.slug, quantity);
            toast("Đã thêm vào giỏ hàng");
            setQuantity(1);
          }}
        >
          Thêm vào giỏ
        </Button>
        <Button
          variant="outline"
          size="lg"
          type="button"
          onClick={() => {
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
            size={18}
            className={
              isWishlisted(product.slug) ? "fill-red-500 text-red-500" : ""
            }
          />
        </Button>
      </div>
    </div>
  );
}
