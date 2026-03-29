import { type InventoryItem } from "~/types/admin";

// IMPORTANT: Admin panel data only — never import in storefront code.
// Inventory for all 22 products. Items with currentStock < reorderLevel are alerts.

export const adminInventory: InventoryItem[] = [
  // --- que-han category (7 products) ---
  {
    productSlug: "que-han-kobelco-lb-52-18-e7018-thailand",
    productName: "Que hàn Kobelco LB-52-18 E7018 Thailand",
    currentStock: 85,
    reorderLevel: 30,
    unit: "gói",
    lastRestocked: "2025-02-15",
  },
  {
    productSlug: "que-han-kobelco-lb52u-thailand-singapore",
    productName: "Que hàn Kobelco LB52U Thailand-Singapore",
    currentStock: 72,
    reorderLevel: 30,
    unit: "gói",
    lastRestocked: "2025-02-10",
  },
  {
    productSlug: "que-han-kobelco-tgs308l-thailand",
    productName: "Que hàn Kobelco TGS308L Thailand",
    currentStock: 18,
    reorderLevel: 20, // ALERT: 18 < 20
    unit: "gói",
    lastRestocked: "2024-12-20",
  },
  {
    productSlug: "que-han-kobelco-tgs316l-thailand",
    productName: "Que hàn Kobelco TGS316L Thailand",
    currentStock: 24,
    reorderLevel: 20,
    unit: "gói",
    lastRestocked: "2025-01-08",
  },
  {
    productSlug: "que-han-kobelco-tgs51t-er70s-6-thailand",
    productName: "Que hàn Kobelco TGS51T ER70S-6 Thailand",
    currentStock: 45,
    reorderLevel: 25,
    unit: "gói",
    lastRestocked: "2025-01-25",
  },
  {
    productSlug: "que-han-kobelco-tgs309l-er309l-thailand",
    productName: "Que hàn Kobelco TGS309L Thailand",
    currentStock: 12,
    reorderLevel: 15, // ALERT: 12 < 15
    unit: "gói",
    lastRestocked: "2024-11-30",
  },
  {
    productSlug: "que-han-kobelco-tgs50-er70s-g-thailand",
    productName: "Que hàn Kobelco TGS50 ER70S-G Thailand",
    currentStock: 38,
    reorderLevel: 20,
    unit: "gói",
    lastRestocked: "2025-02-01",
  },

  // --- may-mai category (2 products) ---
  {
    productSlug: "may-mai-cam-tay-wp13-125-quick-metabogermany",
    productName: "Máy mài cầm tay WP13-125 Quick Metabo Germany",
    currentStock: 14,
    reorderLevel: 10,
    unit: "cái",
    lastRestocked: "2025-01-20",
  },
  {
    productSlug: "may-mai-cam-tay-wepba17-150-metabogermany",
    productName: "Máy mài cầm tay WEPBA17-150 Metabo Germany",
    currentStock: 8,
    reorderLevel: 10, // ALERT: 8 < 10
    unit: "cái",
    lastRestocked: "2024-12-15",
  },

  // --- dung-cu-cat-han category (6 products) ---
  {
    productSlug: "bec-cat-dung-khi-oxypropan-morristaiwan",
    productName: "Béc cắt dùng khí oxy-propan Morris Taiwan",
    currentStock: 45,
    reorderLevel: 20,
    unit: "cái",
    lastRestocked: "2025-02-08",
  },
  {
    productSlug: "bec-cat-dung-khi-oxyacetylen-morristaiwan",
    productName: "Béc cắt dùng khí oxy-acetylen Morris Taiwan",
    currentStock: 38,
    reorderLevel: 20,
    unit: "cái",
    lastRestocked: "2025-02-08",
  },
  {
    productSlug: "den-kho-he-505-4-heating-torch",
    productName: "Đèn khò HE-505-4 Heating Torch",
    currentStock: 22,
    reorderLevel: 15,
    unit: "cái",
    lastRestocked: "2025-01-15",
  },
  {
    productSlug: "dong-ho-oxygas-morristaiwan-vm-series-regulator-victorr-style-single-stage-with-2-gauges",
    productName: "Đồng hồ oxy-gas Morris Taiwan VM Series",
    currentStock: 17,
    reorderLevel: 12,
    unit: "cái",
    lastRestocked: "2025-01-12",
  },
  {
    productSlug: "dau-bec-kho-4h5h",
    productName: "Đầu béc khò 4H/5H",
    currentStock: 55,
    reorderLevel: 25,
    unit: "cái",
    lastRestocked: "2025-02-20",
  },
  {
    productSlug: "dong-ho-co22200v",
    productName: "Đồng hồ CO22200V",
    currentStock: 7,
    reorderLevel: 10, // ALERT: 7 < 10
    unit: "cái",
    lastRestocked: "2025-01-05",
  },

  // --- vat-tu-thiet-bi category (1 product) ---
  {
    productSlug: "van-chong-chay-nguoc-dung-cho-dong-ho-den-cat-gasoxy-hieu-morristaiwan",
    productName: "Van chống cháy ngược Morris Taiwan",
    currentStock: 62,
    reorderLevel: 30,
    unit: "cái",
    lastRestocked: "2025-02-18",
  },

  // --- da-mai-da-cat category (4 products) ---
  {
    productSlug: "da-cat-sat-125mm-a-24-extra-klingspor",
    productName: "Đá cắt sắt 125mm A24 Extra Klingspor",
    currentStock: 185,
    reorderLevel: 50,
    unit: "viên",
    lastRestocked: "2025-03-01",
  },
  {
    productSlug: "da-cat-inox-125mm-a-24-r36-special-klingspor",
    productName: "Đá cắt inox 125mm A24 R36 Special Klingspor",
    currentStock: 120,
    reorderLevel: 50,
    unit: "viên",
    lastRestocked: "2025-02-22",
  },
  {
    productSlug: "da-mai-125mm-a314-extra-klingspor",
    productName: "Đá mài 125mm A314 Extra Klingspor",
    currentStock: 160,
    reorderLevel: 50,
    unit: "viên",
    lastRestocked: "2025-02-28",
  },
  {
    productSlug: "da-mai-150mm-a314-extra-klingspor",
    productName: "Đá mài 150mm A314 Extra Klingspor",
    currentStock: 95,
    reorderLevel: 40,
    unit: "viên",
    lastRestocked: "2025-02-25",
  },

  // --- Miscellaneous tools (2 products) ---
  {
    productSlug: "but-thu-nhiet-do-moi-han-tempindicindia",
    productName: "Bút thử nhiệt độ mối hàn Tempindic India",
    currentStock: 32,
    reorderLevel: 15,
    unit: "cái",
    lastRestocked: "2025-01-18",
  },
  {
    productSlug: "kim-han-500a-revoltindia",
    productName: "Kìm hàn 500A Revolt India",
    currentStock: 28,
    reorderLevel: 15,
    unit: "cái",
    lastRestocked: "2025-02-05",
  },
];
