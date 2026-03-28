// 1. Promotion and Combo interfaces
export interface Promotion {
  id: string;
  type: "banner" | "cart-discount" | "product-discount";
  title: string;
  description: string;
  discountPercent?: number;
  discountCode?: string;
  appliesTo: "all" | string[]; // "all" or product slugs
  startDate: string;
  endDate: string;
  isActive: boolean;
  image?: string;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  productSlugs: string[]; // products in this bundle
  discountPercent: number;
}

// 2. Promotions — 5 promotions (4 active, 1 expired)
export const promotions: Promotion[] = [
  {
    id: "promo-001",
    type: "banner",
    title: "Khuyến mãi mua sắm công nghiệp tháng 3",
    description:
      "Ưu đãi đặc biệt tháng 3 cho tất cả sản phẩm hàn & cắt. Tiết kiệm chi phí, nâng cao hiệu quả sản xuất cùng thiết bị chính hãng từ Hải Ngọc.",
    appliesTo: "all",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    isActive: true,
    image: "/images/promotions/thang-3-2025.webp",
  },
  {
    id: "promo-002",
    type: "cart-discount",
    title: "Giảm 5% cho đơn hàng từ 5.000.000đ",
    description:
      "Áp dụng mã HAINGOC5 để được giảm ngay 5% cho đơn hàng có giá trị từ 5.000.000 VNĐ trở lên. Không giới hạn số lần sử dụng trong tháng.",
    discountPercent: 5,
    discountCode: "HAINGOC5",
    appliesTo: "all",
    startDate: "2025-03-01",
    endDate: "2025-06-30",
    isActive: true,
  },
  {
    id: "promo-003",
    type: "product-discount",
    title: "Giảm 10% toàn bộ que hàn Kobelco",
    description:
      "Nhập mã QUEHAN10 khi đặt hàng để được giảm 10% cho tất cả các loại que hàn Kobelco chính hãng. Ưu đãi áp dụng cho đơn hàng từ 2 gói trở lên.",
    discountPercent: 10,
    discountCode: "QUEHAN10",
    appliesTo: [
      "que-han-kobelco-lb-52-18-e7018-thailand",
      "que-han-kobelco-lb52u-thailand-singapore",
      "que-han-kobelco-tgs308l-thailand",
      "que-han-kobelco-tgs316l-thailand",
      "que-han-kobelco-tgs51t-er70s-6-thailand",
      "que-han-kobelco-tgs309l-er309l-thailand",
      "que-han-kobelco-tgs50-er70s-g-thailand",
    ],
    startDate: "2025-03-01",
    endDate: "2025-05-31",
    isActive: true,
  },
  {
    id: "promo-004",
    type: "banner",
    title: "Ưu đãi cuối năm 2024 – Tri ân khách hàng",
    description:
      "Chương trình khuyến mãi tri ân khách hàng cuối năm 2024 đã kết thúc. Cảm ơn quý khách đã tin tưởng và đồng hành cùng Hải Ngọc.",
    appliesTo: "all",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    isActive: false,
    image: "/images/promotions/cuoi-nam-2024.webp",
  },
  {
    id: "promo-005",
    type: "product-discount",
    title: "Giảm 8% đá mài Klingspor – Mua sắm hè",
    description:
      "Ưu đãi mùa hè: giảm 8% cho toàn bộ đá mài Klingspor chính hãng Đức. Áp dụng tự động khi thêm vào giỏ hàng, không cần mã giảm giá.",
    discountPercent: 8,
    appliesTo: [
      "da-mai-125mm-a314-extra-klingspor",
      "da-mai-150mm-a314-extra-klingspor",
    ],
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    isActive: true,
  },
];

// 3. Combo bundles — 3 product bundles with suggested pairings
export const combos: Combo[] = [
  {
    id: "combo-001",
    name: "Bộ dụng cụ hàn cơ bản",
    description:
      "Trọn bộ dụng cụ hàn cơ bản cho thợ hàn: que hàn Kobelco chất lượng cao, kìm hàn 500A và bút thử nhiệt độ mối hàn. Tiết kiệm 12% so với mua lẻ.",
    productSlugs: [
      "que-han-kobelco-lb-52-18-e7018-thailand",
      "kim-han-500a-revoltindia",
      "but-thu-nhiet-do-moi-han-tempindicindia",
    ],
    discountPercent: 12,
  },
  {
    id: "combo-002",
    name: "Bộ cắt mài chuyên nghiệp",
    description:
      "Combo hoàn chỉnh cho cắt và mài kim loại: máy mài cầm tay Metabo, đá cắt sắt Klingspor và đá mài Klingspor. Tiết kiệm 10% so với mua lẻ từng sản phẩm.",
    productSlugs: [
      "may-mai-cam-tay-wp13-125-quick-metabogermany",
      "da-cat-sat-125mm-a-24-extra-klingspor",
      "da-mai-125mm-a314-extra-klingspor",
    ],
    discountPercent: 10,
  },
  {
    id: "combo-003",
    name: "Bộ thiết bị khí cắt",
    description:
      "Trọn bộ thiết bị cắt khí đầy đủ: béc cắt oxy-propan Morris Taiwan, đồng hồ điều áp và van chống cháy ngược. An toàn và hiệu quả cho cắt thép dày. Tiết kiệm 8%.",
    productSlugs: [
      "bec-cat-dung-khi-oxypropan-morristaiwan",
      "dong-ho-oxygas-morristaiwan-vm-series-regulator-victorr-style-single-stage-with-2-gauges",
      "van-chong-chay-nguoc-dung-cho-dong-ho-den-cat-gasoxy-hieu-morristaiwan",
    ],
    discountPercent: 8,
  },
];
