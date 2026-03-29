import { type Review } from "~/types/review";


// 1. Reviews data — 21 reviews across 8 key products
export const reviews: Review[] = [
  // que-han-kobelco-lb-52-18-e7018-thailand (4 reviews)
  {
    id: "rv-001",
    productSlug: "que-han-kobelco-lb-52-18-e7018-thailand",
    authorName: "Trần Văn Minh",
    company: "Công ty TNHH Cơ Khí Thanh Đạt",
    rating: 5,
    comment:
      "Que hàn LB-52-18 chất lượng rất tốt, hồ quang ổn định, ít bắn tia lửa. Chúng tôi đã sử dụng sản phẩm này cho các dự án hàn kết cấu thép và rất hài lòng với kết quả. Mối hàn đẹp, ít xỉ, dễ bóc. Sẽ tiếp tục đặt hàng.",
    date: "2025-01-15",
    verified: true,
  },
  {
    id: "rv-002",
    productSlug: "que-han-kobelco-lb-52-18-e7018-thailand",
    authorName: "Nguyễn Hoàng Nam",
    company: "Công ty CP Xây Dựng Minh Quang",
    rating: 5,
    comment:
      "Sản phẩm đúng như mô tả, hàng chính hãng Kobelco. Giao hàng nhanh, đóng gói cẩn thận. Que hàn đồng đều, không bị ẩm. Kết quả hàn rất đẹp, ứng dụng tốt cho hàn góc và hàn đứng.",
    date: "2024-11-20",
    verified: true,
  },
  {
    id: "rv-003",
    productSlug: "que-han-kobelco-lb-52-18-e7018-thailand",
    authorName: "Lê Thanh Hùng",
    company: "Công ty TNHH Thương Mại Thiết Bị Công Nghiệp Phú An",
    rating: 4,
    comment:
      "Chất lượng que hàn ổn, phù hợp tiêu chuẩn AWS E7018. Giá cả hợp lý so với thị trường. Hàn trần cũng khá dễ. Chỉ cần chú ý bảo quản tránh ẩm là ổn.",
    date: "2024-09-05",
    verified: true,
  },
  {
    id: "rv-004",
    productSlug: "que-han-kobelco-lb-52-18-e7018-thailand",
    authorName: "Phạm Đức Thắng",
    company: "Tập Đoàn Dầu Khí Việt Nam – Chi Nhánh Vũng Tàu",
    rating: 5,
    comment:
      "Chúng tôi sử dụng que hàn LB-52-18 cho các công trình dầu khí đòi hỏi độ bền cao. Chất lượng mối hàn đạt yêu cầu kỹ thuật, vượt qua kiểm tra siêu âm. Rất tin tưởng vào sản phẩm của Kobelco phân phối qua Hải Ngọc.",
    date: "2025-02-08",
    verified: true,
  },

  // que-han-kobelco-lb52u-thailand-singapore (3 reviews)
  {
    id: "rv-005",
    productSlug: "que-han-kobelco-lb52u-thailand-singapore",
    authorName: "Võ Thị Hoa",
    company: "Công ty TNHH Sản Xuất Kim Loại Hòa Phát",
    rating: 4,
    comment:
      "Que hàn LB52U chất lượng khá tốt, hồ quang mượt mà, ít bắn tia lửa hơn một số loại khác tôi đã dùng. Phù hợp cho hàn thép carbon thấp. Giao hàng đúng hẹn, sẽ đặt thêm.",
    date: "2024-12-10",
    verified: true,
  },
  {
    id: "rv-006",
    productSlug: "que-han-kobelco-lb52u-thailand-singapore",
    authorName: "Đỗ Văn Hải",
    company: "Công ty CP Cơ Khí Chính Xác Bình Dương",
    rating: 5,
    comment:
      "Sử dụng LB52U cho hàn kết cấu nhà xưởng, kết quả rất tốt. Mối hàn đều, ít khuyết tật. Đội thợ hàn của chúng tôi đánh giá cao loại que này. Giá cả phải chăng, chất lượng đảm bảo.",
    date: "2025-01-28",
    verified: true,
  },
  {
    id: "rv-007",
    productSlug: "que-han-kobelco-lb52u-thailand-singapore",
    authorName: "Bùi Quang Khải",
    company: "Công ty TNHH Kỹ Thuật An Toàn Công Nghiệp",
    rating: 4,
    comment:
      "Hàng đúng chủng loại, chất lượng ổn định. Đã đặt nhiều lần và luôn nhận được hàng đúng tiêu chuẩn. Dịch vụ tư vấn của Hải Ngọc cũng rất nhiệt tình.",
    date: "2024-10-15",
    verified: false,
  },

  // may-mai-cam-tay-wp13-125-quick-metabogermany (3 reviews)
  {
    id: "rv-008",
    productSlug: "may-mai-cam-tay-wp13-125-quick-metabogermany",
    authorName: "Nguyễn Tuấn Anh",
    company: "Công ty CP Xây Dựng và Lắp Máy Đông Nam",
    rating: 5,
    comment:
      "Máy mài Metabo WP13-125 Quick rất mạnh mẽ, động cơ êm, ít rung. Thay đá nhanh chóng nhờ hệ thống Quick. Đã dùng liên tục 3 tháng không có vấn đề gì. Hàng chính hãng Metabo Đức, đáng đồng tiền.",
    date: "2025-01-05",
    verified: true,
  },
  {
    id: "rv-009",
    productSlug: "may-mai-cam-tay-wp13-125-quick-metabogermany",
    authorName: "Trương Văn Phúc",
    company: "Xưởng Cơ Khí Phúc Thành",
    rating: 5,
    comment:
      "Máy bền, công suất tốt, phù hợp cho công việc nặng. Bảo vệ tốc độ điện tử rất hữu ích khi bắt đầu mài. Tay cầm thoải mái, chịu được cường độ công việc cao. Khuyến nghị cho các anh em thợ cơ khí.",
    date: "2024-11-12",
    verified: true,
  },
  {
    id: "rv-010",
    productSlug: "may-mai-cam-tay-wp13-125-quick-metabogermany",
    authorName: "Hoàng Minh Tuấn",
    company: "Công ty TNHH Gia Công Cơ Khí Hà Thành",
    rating: 4,
    comment:
      "Máy mài chất lượng Đức đáng tin cậy. Hộp số chắc chắn, không bị nóng khi sử dụng lâu. Một điểm trừ nhỏ là hơi nặng so với các máy cùng loại. Nhưng bù lại độ bền thì hơn hẳn.",
    date: "2025-02-20",
    verified: true,
  },

  // da-cat-sat-125mm-a-24-extra-klingspor (3 reviews)
  {
    id: "rv-011",
    productSlug: "da-cat-sat-125mm-a-24-extra-klingspor",
    authorName: "Lý Văn Cường",
    company: "Công ty CP Sản Xuất Kết Cấu Thép Việt Đức",
    rating: 5,
    comment:
      "Đá cắt Klingspor A24 Extra chất lượng vượt trội so với hàng Trung Quốc. Cắt nhanh, ít tỏa nhiệt, tuổi thọ dài gấp đôi. Cắt thép hộp 5mm như dao cắt bơ. Mua về xài là biết ngay chất lượng.",
    date: "2024-12-25",
    verified: true,
  },
  {
    id: "rv-012",
    productSlug: "da-cat-sat-125mm-a-24-extra-klingspor",
    authorName: "Đinh Văn Tú",
    company: "Công ty TNHH Thép Xây Dựng Phong Phú",
    rating: 5,
    comment:
      "Sản phẩm chất lượng cao, giá tốt hơn mua ngoài chợ lẻ. Đặt nhiều lần rồi, luôn hài lòng. Đá không bị nứt vỡ khi cắt, an toàn cho người dùng. Sẽ tiếp tục ủng hộ Hải Ngọc.",
    date: "2025-01-18",
    verified: true,
  },
  {
    id: "rv-013",
    productSlug: "da-cat-sat-125mm-a-24-extra-klingspor",
    authorName: "Phan Thị Thanh",
    company: "Công ty CP Công Nghiệp Cơ Điện Miền Nam",
    rating: 4,
    comment:
      "Đá cắt bền, cắt sắc. Phù hợp cho cắt thép tấm và thép hình. Thỉnh thoảng giao hàng hơi chậm nhưng chất lượng thì không có gì để chê.",
    date: "2024-08-30",
    verified: false,
  },

  // da-cat-inox-125mm-a-24-r36-special-klingspor (2 reviews)
  {
    id: "rv-014",
    productSlug: "da-cat-inox-125mm-a-24-r36-special-klingspor",
    authorName: "Ngô Văn Đức",
    company: "Công ty TNHH Thiết Bị Bếp Inox Thành Công",
    rating: 5,
    comment:
      "Đá cắt inox R36 Special của Klingspor rất tuyệt. Cắt không để lại vết ố vàng, không làm nóng inox. Phù hợp cho sản xuất thiết bị nhà bếp và trang trí inox. Chất lượng Đức đáng tin cậy.",
    date: "2025-02-14",
    verified: true,
  },
  {
    id: "rv-015",
    productSlug: "da-cat-inox-125mm-a-24-r36-special-klingspor",
    authorName: "Hồ Ngọc Phương",
    company: "Xưởng Gia Công Inox Hoàng Gia",
    rating: 4,
    comment:
      "Đá cắt chuyên dùng cho inox, không gây ô nhiễm bề mặt. Lát cắt mịn, ít phải đánh bóng lại. Giá hơi cao nhưng tiết kiệm thời gian hậu xử lý, tính ra vẫn có lợi hơn.",
    date: "2024-10-05",
    verified: true,
  },

  // kim-han-500a-revoltindia (2 reviews)
  {
    id: "rv-016",
    productSlug: "kim-han-500a-revoltindia",
    authorName: "Vũ Đình Lâm",
    company: "Công ty CP Thiết Bị Điện Công Nghiệp Bắc Việt",
    rating: 4,
    comment:
      "Kìm hàn 500A Revolt chất lượng tốt, cặp que chắc chắn, không bị trượt. Dây dẫn điện tốt, ít phát nhiệt. Đã dùng 6 tháng vẫn hoạt động bình thường. Phù hợp cho máy hàn công nghiệp.",
    date: "2025-01-22",
    verified: true,
  },
  {
    id: "rv-017",
    productSlug: "kim-han-500a-revoltindia",
    authorName: "Trần Thị Ngọc Ánh",
    company: "Công ty TNHH Hàn Công Nghệ Cao Phước Long",
    rating: 5,
    comment:
      "Kìm hàn bền, tản nhiệt tốt, không bị nóng khi hàn liên tục. Lò xo cặp chắc, tiếp điện ổn định. Rất phù hợp cho các xưởng hàn công suất lớn. Giá cả hợp lý, giao hàng nhanh.",
    date: "2024-12-18",
    verified: true,
  },

  // bec-cat-dung-khi-oxypropan-morristaiwan (2 reviews)
  {
    id: "rv-018",
    productSlug: "bec-cat-dung-khi-oxypropan-morristaiwan",
    authorName: "Lê Hoàng Sơn",
    company: "Xưởng Cắt Kim Loại Hoàng Sơn",
    rating: 5,
    comment:
      "Béc cắt Morris Taiwan chất lượng tốt, ngọn lửa ổn định, cắt đều. Đã dùng nhiều loại béc cắt nhưng Morris vẫn là lựa chọn ưa thích nhờ độ bền và chính xác. Phù hợp cắt thép tấm 10-50mm.",
    date: "2024-11-08",
    verified: true,
  },
  {
    id: "rv-019",
    productSlug: "bec-cat-dung-khi-oxypropan-morristaiwan",
    authorName: "Phạm Văn Toàn",
    company: "Công ty TNHH Kỹ Thuật Cắt Hàn Thiên Phú",
    rating: 4,
    comment:
      "Béc cắt bền, không bị cháy mòn nhanh. Lỗ béc đồng đều, cho ngọn lửa ổn định. Tư vấn chọn cỡ béc phù hợp với độ dày thép rất hữu ích. Chất lượng đúng như kỳ vọng.",
    date: "2025-02-01",
    verified: true,
  },

  // da-mai-125mm-a314-extra-klingspor (2 reviews)
  {
    id: "rv-020",
    productSlug: "da-mai-125mm-a314-extra-klingspor",
    authorName: "Nguyễn Bá Thịnh",
    company: "Công ty CP Cơ Khí Và Xây Dựng Tiến Phát",
    rating: 5,
    comment:
      "Đá mài Klingspor A314 Extra rất tốt, mài sắc và bền. Phù hợp cho mài thép sau khi hàn, bề mặt nhẵn bóng. Tuổi thọ đá dài hơn nhiều so với hàng rẻ tiền. Tiết kiệm chi phí dài hạn.",
    date: "2025-01-10",
    verified: true,
  },
  {
    id: "rv-021",
    productSlug: "da-mai-125mm-a314-extra-klingspor",
    authorName: "Cao Thị Lan",
    company: "Xưởng Chế Tác Kim Loại Thiên Tân",
    rating: 4,
    comment:
      "Đá mài chất lượng tốt, mài đều, không bị rung. Phù hợp cả mài thô và mài hoàn thiện. Giao hàng đúng số lượng, đóng gói bảo vệ tốt. Sẽ tiếp tục mua tại Hải Ngọc.",
    date: "2024-09-22",
    verified: false,
  },
];

// 2. Helper — get reviews for a specific product slug
export function getReviewsBySlug(slug: string): Review[] {
  return reviews.filter((r) => r.productSlug === slug);
}
