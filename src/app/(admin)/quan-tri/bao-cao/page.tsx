"use client";

import { RevenueChart } from "~/components/admin/RevenueChart";
import { TopProductsChart } from "~/components/admin/TopProductsChart";
import { CustomerSegmentsChart } from "~/components/admin/CustomerSegmentsChart";
import { reportData } from "~/data/admin/reports";
import { MOCK_DATA_DISCLAIMER } from "~/data/admin/customers";

export default function BaoCaoPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Báo cáo</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Panel 1: Monthly Revenue Line Chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Doanh thu theo tháng</h2>
          <RevenueChart />
        </div>

        {/* Panel 2: Top 8 Products Bar Chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Top 8 sản phẩm theo doanh thu</h2>
          <TopProductsChart />
        </div>

        {/* Panel 3: Customer Segments Pie Chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Phân khúc khách hàng</h2>
          <CustomerSegmentsChart />
        </div>

        {/* Panel 4: Inventory Alerts Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Cảnh báo tồn kho</h2>
          {reportData.inventoryAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có cảnh báo tồn kho</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Sản phẩm
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Tồn kho hiện tại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Mức đặt lại
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.inventoryAlerts.map((alert) => (
                    <tr
                      key={alert.productSlug}
                      className="border-b border-border bg-red-50 last:border-0"
                    >
                      <td className="px-4 py-3">{alert.productSlug}</td>
                      <td className="px-4 py-3 font-semibold text-destructive">
                        {alert.currentStock}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{alert.reorderLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{MOCK_DATA_DISCLAIMER}</p>
    </div>
  );
}
