"use client";

import { adminCustomers, MOCK_DATA_DISCLAIMER } from "~/data/admin/customers";
import { adminOrders } from "~/data/admin/orders";
import { adminInventory } from "~/data/admin/inventory";
import { reportData } from "~/data/admin/reports";
import { formatVND } from "~/lib/format";

export default function AdminDashboardPage() {
  const totalCustomers = adminCustomers.length;
  const totalOrders = adminOrders.length;
  const revenueYTD = formatVND(
    reportData.monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0),
  );
  const lowStockAlerts = adminInventory.filter(
    (i) => i.currentStock < i.reorderLevel,
  ).length;

  const summaryCards = [
    { label: "Khách hàng", value: totalCustomers },
    { label: "Đơn hàng", value: totalOrders },
    { label: "Doanh thu năm nay", value: revenueYTD },
    { label: "Cảnh báo tồn kho", value: lowStockAlerts },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Tổng quan</h1>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-card p-6"
          >
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-[28px] font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{MOCK_DATA_DISCLAIMER}</p>
    </div>
  );
}
