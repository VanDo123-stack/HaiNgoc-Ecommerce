import { type Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ConfirmationContent } from "~/components/checkout/ConfirmationContent";

export const metadata: Metadata = {
  title: "Xác nhận đơn hàng - Hải Ngọc",
  description:
    "Đơn yêu cầu báo giá đã được ghi nhận. Thông tin chuyển khoản bên dưới.",
  robots: "noindex",
};

export default function XacNhanPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/gio-hang">Giỏ hàng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Xác nhận đơn hàng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ConfirmationContent />
    </main>
  );
}
