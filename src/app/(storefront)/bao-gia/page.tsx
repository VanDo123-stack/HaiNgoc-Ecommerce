import Link from "next/link";
import { type Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { QuotationForm } from "~/components/checkout/QuotationForm";

export const metadata: Metadata = {
  title: "Yêu cầu báo giá - Hải Ngọc",
  description: "Điền thông tin để nhận báo giá chi tiết từ Hải Ngọc.",
  robots: "noindex",
};

export default function BaoGiaPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
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
            <BreadcrumbPage>Yêu cầu báo giá</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page title */}
      <h1 className="mb-2 text-2xl font-semibold leading-tight">
        Yêu cầu báo giá
      </h1>

      {/* Back link */}
      <Link
        href="/gio-hang"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Quay lại giỏ hàng
      </Link>

      <QuotationForm />
    </main>
  );
}
