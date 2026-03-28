"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "~/context/CartContext";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function CartBadge() {
  const { totalItems } = useCart();
  const [bouncing, setBouncing] = useState(false);
  // Track previous count to skip animation on initial mount
  const prevCountRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip animation on first render
    if (prevCountRef.current === null) {
      prevCountRef.current = totalItems;
      return;
    }
    if (totalItems !== prevCountRef.current) {
      prevCountRef.current = totalItems;
      setBouncing(true);
      const timer = setTimeout(() => setBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <Link href="/gio-hang">
      <Button variant="ghost" size="icon" className="relative min-h-11">
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Giỏ hàng</span>
        <span
          className={cn(
            "absolute -right-1 -top-1 flex h-4 min-w-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground",
            bouncing && "animate-bounce",
          )}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      </Button>
    </Link>
  );
}
