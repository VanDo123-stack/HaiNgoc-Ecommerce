"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { BankTransferCard } from "~/components/checkout/BankTransferCard";
import { products } from "~/data/products";
import { type CartItem } from "~/context/CartContext";

// 1. Types

interface OrderContact {
  companyName: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

interface OrderSnapshot {
  items: CartItem[];
  contact: OrderContact;
  ref: string;
  date: string;
}

// 2. Component

export function ConfirmationContent() {
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("haingoc_order");
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        setOrder(parsed as OrderSnapshot);
      }
    } catch {
      // Corrupt data — treat as missing
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-muted-foreground">
          Không tìm thấy thông tin đơn hàng.
        </p>
        <Link
          href="/san-pham"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success icon and heading */}
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h1 className="text-2xl font-semibold leading-tight">
          Cảm ơn bạn đã gửi yêu cầu!
        </h1>
        <p className="text-muted-foreground">
          Chúng tôi đã nhận được yêu cầu báo giá và sẽ liên hệ lại trong thời
          gian sớm nhất.
        </p>
        <p className="font-semibold">Mã yêu cầu: {order.ref}</p>
      </div>

      <Separator />

      {/* Order items */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">Đơn hàng đã ghi nhận</h2>
        <div>
          {order.items.map((item) => {
            const product = products.find((p) => p.slug === item.slug);
            return (
              <div
                key={item.slug}
                className="flex items-center justify-between border-b border-border py-2 text-sm"
              >
                <span className="flex-1 pr-4">
                  {product?.name ?? item.slug}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  x{item.quantity}
                </span>
                <span className="ml-4 shrink-0 font-medium">
                  {product?.price != null
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)
                    : "Liên hệ"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Bank transfer card */}
      <BankTransferCard
        orderRef={order.ref}
        amount={order.items.reduce((sum, item) => {
          const product = products.find((p) => p.slug === item.slug);
          return sum + (product?.salePrice ?? product?.price ?? 0) * item.quantity;
        }, 0)}
      />

      {/* Continue shopping CTA */}
      <div className="flex justify-center pt-2">
        <Link href="/san-pham">
          <Button variant="outline">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    </div>
  );
}
