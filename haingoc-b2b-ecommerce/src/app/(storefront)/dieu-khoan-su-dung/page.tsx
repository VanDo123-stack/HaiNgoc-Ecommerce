import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng – Hải Ngọc",
  description: "Điều khoản sử dụng website Hải Ngọc.",
};

export default function DieuKhoanSuDungPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Điều khoản sử dụng</h1>

      <div className="prose prose-sm text-muted-foreground mt-6 max-w-none space-y-4">
        <p>
          Chào mừng bạn đến với website Hải Ngọc. Khi truy cập và sử dụng
          website này, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây.
        </p>

        <h2 className="text-lg font-semibold text-foreground">1. Quyền sở hữu trí tuệ</h2>
        <p>
          Tất cả nội dung trên website bao gồm văn bản, hình ảnh, logo, thiết
          kế và mã nguồn đều thuộc quyền sở hữu của Công ty Hải Ngọc. Nghiêm
          cấm sao chép, phân phối hoặc sử dụng lại mà không có sự đồng ý bằng
          văn bản.
        </p>

        <h2 className="text-lg font-semibold text-foreground">2. Thông tin sản phẩm</h2>
        <p>
          Chúng tôi nỗ lực đảm bảo thông tin sản phẩm chính xác và cập nhật.
          Tuy nhiên, giá cả và tình trạng hàng hóa có thể thay đổi mà không
          cần báo trước. Vui lòng liên hệ trực tiếp để xác nhận thông tin đặt
          hàng.
        </p>

        <h2 className="text-lg font-semibold text-foreground">3. Đặt hàng và thanh toán</h2>
        <p>
          Đơn hàng được xác nhận sau khi bạn nhận được email hoặc cuộc gọi xác
          nhận từ nhân viên. Thanh toán được thực hiện qua chuyển khoản ngân
          hàng theo thông tin cung cấp trong đơn hàng.
        </p>

        <h2 className="text-lg font-semibold text-foreground">4. Giao hàng</h2>
        <p>
          Thời gian giao hàng phụ thuộc vào khu vực và loại sản phẩm. Đối với
          các đơn hàng lớn hoặc sản phẩm đặc biệt, thời gian có thể từ 3-7
          ngày làm việc. Chi phí vận chuyển sẽ được thông báo khi xác nhận đơn
          hàng.
        </p>

        <h2 className="text-lg font-semibold text-foreground">5. Đổi trả và bảo hành</h2>
        <p>
          Sản phẩm lỗi do nhà sản xuất sẽ được đổi trả trong vòng 7 ngày kể
          từ ngày nhận hàng. Sản phẩm phải còn nguyên bao bì và không có dấu
          hiệu sử dụng. Liên hệ bộ phận hỗ trợ để được hướng dẫn quy trình
          đổi trả.
        </p>

        <h2 className="text-lg font-semibold text-foreground">6. Giới hạn trách nhiệm</h2>
        <p>
          Hải Ngọc không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh
          từ việc sử dụng sai mục đích sản phẩm hoặc thông tin trên website.
        </p>

        <p className="text-xs text-muted-foreground/60 pt-4">
          Cập nhật lần cuối: Tháng 3, 2026
        </p>
      </div>
    </main>
  );
}
