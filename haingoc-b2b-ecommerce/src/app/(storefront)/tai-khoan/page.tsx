import { type Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { ProfileForm } from "~/components/account/ProfileForm";
import { OrderHistory } from "~/components/account/OrderHistory";
import { QuotationHistory } from "~/components/account/QuotationHistory";
import { StatsCards } from "~/components/account/StatsCards";
import { WishlistSection } from "~/components/account/WishlistSection";
import { DebtTrackingCard } from "~/components/account/DebtTrackingCard";
import { SupportForm } from "~/components/account/SupportForm";
import { mockOrders, mockProfile, mockQuotations } from "~/data/account";

export const metadata: Metadata = {
  title: "Tài khoản - Hải Ngọc",
  description: "Quản lý thông tin tài khoản và lịch sử đơn hàng.",
  robots: { index: false },
};

export default function TaiKhoanPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tài khoản</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mb-8 text-2xl font-semibold">Tài khoản của tôi</h1>

          {/* Section 1: Profile */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Thông tin cá nhân</h2>
            <ProfileForm defaultProfile={mockProfile} />
          </section>

          <Separator className="my-8" />

          {/* Section 2: Thống kê */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Thống kê</h2>
            <StatsCards />
          </section>

          <Separator className="my-8" />

          {/* Section 3: Danh sách yêu thích */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Danh sách yêu thích (Wishlist)</h2>
            <WishlistSection />
          </section>

          <Separator className="my-8" />

          {/* Section 4: Order History */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Lịch sử đơn hàng</h2>
            <OrderHistory orders={mockOrders} />
          </section>

          <Separator className="my-8" />

          {/* Section 5: Quotation History */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Yêu cầu báo giá</h2>
            <QuotationHistory quotations={mockQuotations} />
          </section>

          <Separator className="my-8" />

          {/* Section 6: Công nợ */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Công nợ</h2>
            <DebtTrackingCard />
          </section>

          <Separator className="my-8" />

          {/* Section 7: Hỗ trợ & Khiếu nại */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Hỗ trợ & Khiếu nại</h2>
            <SupportForm />
          </section>
        </div>
      </div>
    </main>
  );
}
