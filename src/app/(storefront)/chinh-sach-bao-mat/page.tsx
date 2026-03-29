import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật – Hải Ngọc",
  description: "Chính sách bảo mật thông tin khách hàng tại Hải Ngọc.",
};

export default function ChinhSachBaoMatPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Chính sách bảo mật</h1>

      <div className="prose prose-sm text-muted-foreground mt-6 max-w-none space-y-4">
        <p>
          Hải Ngọc cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách
          hàng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và
          bảo vệ dữ liệu của bạn.
        </p>

        <h2 className="text-lg font-semibold text-foreground">1. Thông tin thu thập</h2>
        <p>
          Chúng tôi có thể thu thập các thông tin sau khi bạn sử dụng dịch vụ:
          họ tên, số điện thoại, địa chỉ email, địa chỉ giao hàng, tên công ty
          và mã số thuế (đối với khách hàng doanh nghiệp).
        </p>

        <h2 className="text-lg font-semibold text-foreground">2. Mục đích sử dụng</h2>
        <p>
          Thông tin được sử dụng để: xử lý đơn hàng và báo giá, liên hệ xác
          nhận đơn hàng, gửi thông tin khuyến mãi (nếu bạn đồng ý), và cải
          thiện chất lượng dịch vụ.
        </p>

        <h2 className="text-lg font-semibold text-foreground">3. Bảo mật thông tin</h2>
        <p>
          Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo
          vệ thông tin cá nhân khỏi truy cập trái phép, mất mát hoặc tiết lộ.
          Thông tin thanh toán được mã hóa và không lưu trữ trên hệ thống.
        </p>

        <h2 className="text-lg font-semibold text-foreground">4. Chia sẻ thông tin</h2>
        <p>
          Hải Ngọc không bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn
          cho bên thứ ba, ngoại trừ các đối tác vận chuyển phục vụ việc giao
          hàng và cơ quan nhà nước khi có yêu cầu theo quy định pháp luật.
        </p>

        <h2 className="text-lg font-semibold text-foreground">5. Cookie</h2>
        <p>
          Website sử dụng cookie để lưu trữ giỏ hàng, danh sách yêu thích và
          cải thiện trải nghiệm duyệt web. Bạn có thể tắt cookie trong cài đặt
          trình duyệt, tuy nhiên một số tính năng có thể không hoạt động đầy
          đủ.
        </p>

        <h2 className="text-lg font-semibold text-foreground">6. Quyền của bạn</h2>
        <p>
          Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân
          bất kỳ lúc nào bằng cách liên hệ với chúng tôi qua email hoặc hotline.
        </p>

        <h2 className="text-lg font-semibold text-foreground">7. Liên hệ</h2>
        <p>
          Nếu có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ
          qua trang Liên hệ hoặc email info@haingoc.com.vn.
        </p>

        <p className="text-xs text-muted-foreground/60 pt-4">
          Cập nhật lần cuối: Tháng 3, 2026
        </p>
      </div>
    </main>
  );
}
