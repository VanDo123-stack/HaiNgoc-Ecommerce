"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { type CartItem } from "~/context/CartContext";
import { useCart } from "~/context/CartContext";
import { type Product } from "~/types/product";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";


interface CartRowProps {
  item: CartItem;
  product: Product;
}

export function CartRow({ item, product }: CartRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const [inputValue, setInputValue] = useState(String(item.quantity));

  // Keep local input in sync when external quantity changes (e.g. from other interactions)
  // We use the controlled input pattern: local state for editing, dispatch on change
  const handleQuantityChange = (value: string) => {
    setInputValue(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1) {
      updateQuantity(item.slug, num);
    }
  };

  const handleBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < 1) {
      setInputValue("1");
      updateQuantity(item.slug, 1);
    } else {
      setInputValue(String(Math.min(999, num)));
    }
  };

  const handleDecrement = () => {
    const newQty = Math.max(1, item.quantity - 1);
    setInputValue(String(newQty));
    updateQuantity(item.slug, newQty);
  };

  const handleIncrement = () => {
    const newQty = Math.min(999, item.quantity + 1);
    setInputValue(String(newQty));
    updateQuantity(item.slug, newQty);
  };

  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 lg:flex-row lg:items-center lg:gap-4">
      {/* Row 1 (mobile) / Left columns (desktop): image + name + price */}
      <div className="flex items-start gap-3 lg:contents">
        {/* Product image */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-muted lg:h-20 lg:w-20">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 64px, 80px"
          />
        </div>

        {/* Name + origin */}
        <div className="min-w-0 flex-1 lg:flex-1">
          <p className="text-base font-normal">{product.name}</p>
          {product.origin && (
            <p className="truncate text-sm text-muted-foreground">
              {product.origin}
            </p>
          )}
          {/* Price shown inline on mobile */}
          <p className="mt-1 text-sm font-medium lg:hidden">
            {product.price !== null ? (
              `${product.price.toLocaleString("vi-VN")} đ`
            ) : (
              <span className="text-muted-foreground">Liên hệ</span>
            )}
          </p>
        </div>

        {/* Price column — desktop only */}
        <div className="hidden w-28 shrink-0 text-right lg:block">
          {product.price !== null ? (
            <span>{product.price.toLocaleString("vi-VN")} đ</span>
          ) : (
            <span className="text-muted-foreground">Liên hệ</span>
          )}
        </div>
      </div>

      {/* Row 2 (mobile) / Right columns (desktop): quantity stepper + remove */}
      <div className="flex items-center gap-2 lg:contents">
        {/* Quantity stepper */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="min-h-11 min-w-11"
            onClick={handleDecrement}
            aria-label="Giảm"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min={1}
            max={999}
            value={inputValue}
            onChange={(e) => handleQuantityChange(e.target.value)}
            onBlur={handleBlur}
            className="w-16 text-center"
            aria-label="Số lượng"
          />
          <Button
            variant="outline"
            size="icon"
            className="min-h-11 min-w-11"
            onClick={handleIncrement}
            aria-label="Tăng"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Remove button */}
        <Button
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11"
          onClick={() => removeItem(item.slug)}
          aria-label="Xóa"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
