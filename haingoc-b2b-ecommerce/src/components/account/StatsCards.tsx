"use client";

import { Eye, ShoppingBag, Clock, Wallet } from "lucide-react";

import { formatVND } from "~/lib/format";
import { mockOrders, mockViewCount } from "~/data/account";

export function StatsCards() {
  const viewedCount = mockViewCount;
  const orderCount = mockOrders.length;
  const processingCount = mockOrders.filter(
    (o) => o.status === "Đang xử lý",
  ).length;
  const totalSpend = 15_750_000;

  const cards = [
    {
      icon: Eye,
      value: viewedCount,
      label: "Sản phẩm đã xem",
      display: String(viewedCount),
    },
    {
      icon: ShoppingBag,
      value: orderCount,
      label: "Đơn hàng",
      display: String(orderCount),
    },
    {
      icon: Clock,
      value: processingCount,
      label: "Đang xử lý",
      display: String(processingCount),
    },
    {
      icon: Wallet,
      value: totalSpend,
      label: "Tổng chi tiêu",
      display: formatVND(totalSpend),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-card border-border rounded-lg border p-4"
          >
            <Icon size={20} className="text-muted-foreground mb-2" />
            <p className="text-2xl font-semibold">{card.display}</p>
            <p className="text-muted-foreground text-sm">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
