import { type ReportData } from "~/types/admin";

// IMPORTANT: Admin panel data only — never import in storefront code.
// Deterministic report data — no Math.random(), all values fixed.

export const reportData: ReportData = {
  // 1. Monthly revenue — 12 months T1-T12 (2024 full year)
  monthlyRevenue: [
    { month: "T1", revenue: 98_450_000, orders: 18 },
    { month: "T2", revenue: 112_780_000, orders: 22 },
    { month: "T3", revenue: 145_230_000, orders: 28 },
    { month: "T4", revenue: 128_960_000, orders: 25 },
    { month: "T5", revenue: 167_340_000, orders: 31 },
    { month: "T6", revenue: 189_750_000, orders: 35 },
    { month: "T7", revenue: 176_580_000, orders: 33 },
    { month: "T8", revenue: 203_420_000, orders: 38 },
    { month: "T9", revenue: 158_670_000, orders: 30 },
    { month: "T10", revenue: 214_890_000, orders: 41 },
    { month: "T11", revenue: 237_150_000, orders: 44 },
    { month: "T12", revenue: 248_360_000, orders: 45 },
  ],

  // 2. Top 8 best-selling products
  topProducts: [
    {
      productSlug: "que-han-kobelco-lb-52-18-e7018-thailand",
      productName: "Que hàn Kobelco LB-52-18 E7018 Thailand",
      soldCount: 1240,
      revenue: 260_400_000,
    },
    {
      productSlug: "da-cat-sat-125mm-a-24-extra-klingspor",
      productName: "Đá cắt sắt 125mm A24 Extra Klingspor",
      soldCount: 8750,
      revenue: 161_875_000,
    },
    {
      productSlug: "que-han-kobelco-lb52u-thailand-singapore",
      productName: "Que hàn Kobelco LB52U Thailand-Singapore",
      soldCount: 780,
      revenue: 152_100_000,
    },
    {
      productSlug: "da-mai-125mm-a314-extra-klingspor",
      productName: "Đá mài 125mm A314 Extra Klingspor",
      soldCount: 5420,
      revenue: 120_866_000,
    },
    {
      productSlug: "da-cat-inox-125mm-a-24-r36-special-klingspor",
      productName: "Đá cắt inox 125mm A24 R36 Special Klingspor",
      soldCount: 3680,
      revenue: 90_160_000,
    },
    {
      productSlug: "may-mai-cam-tay-wp13-125-quick-metabogermany",
      productName: "Máy mài cầm tay WP13-125 Quick Metabo Germany",
      soldCount: 142,
      revenue: 489_900_000,
    },
    {
      productSlug: "que-han-kobelco-tgs316l-thailand",
      productName: "Que hàn Kobelco TGS316L Thailand",
      soldCount: 145,
      revenue: 84_100_000,
    },
    {
      productSlug: "bec-cat-dung-khi-oxypropan-morristaiwan",
      productName: "Béc cắt dùng khí oxy-propan Morris Taiwan",
      soldCount: 234,
      revenue: 66_690_000,
    },
  ],

  // 3. Customer segments
  customerSegments: {
    new: 23,
    returning: 67,
    inactive: 15,
  },

  // 4. Inventory alerts — 4 products below reorder level
  inventoryAlerts: [
    {
      productSlug: "que-han-kobelco-tgs308l-thailand",
      currentStock: 18,
      reorderLevel: 20,
    },
    {
      productSlug: "que-han-kobelco-tgs309l-er309l-thailand",
      currentStock: 12,
      reorderLevel: 15,
    },
    {
      productSlug: "may-mai-cam-tay-wepba17-150-metabogermany",
      currentStock: 8,
      reorderLevel: 10,
    },
    {
      productSlug: "dong-ho-co22200v",
      currentStock: 7,
      reorderLevel: 10,
    },
  ],
};
