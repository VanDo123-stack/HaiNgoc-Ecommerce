import { type Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ContactForm } from "~/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Liên hệ - Hải Ngọc",
  description:
    "Liên hệ với Hải Ngọc qua hotline, Zalo hoặc gửi tin nhắn trực tiếp.",
};

export default function LienHePage() {
  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Liên hệ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mb-6 text-2xl font-semibold">
          Liên hệ với chúng tôi
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: Contact info panel */}
          <div className="bg-secondary border-border rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Thông tin liên hệ</h2>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Hotline</p>
                  <p className="text-muted-foreground text-sm">1900 xxxx</p>
                </div>
              </div>

              {/* Zalo */}
              <div className="flex items-start gap-3">
                <MessageCircle className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Zalo</p>
                  <a
                    href="https://zalo.me/0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    Nhắn tin qua Zalo
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Địa chỉ</p>
                  <p className="text-muted-foreground text-sm">
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-muted-foreground text-sm">
                    info@haingoc.com.vn
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <h2 className="mb-2 text-xl font-semibold">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* Branch & Warehouse info */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">Chi nhánh & Kho hàng</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-border rounded-lg border p-5">
              <h3 className="mb-2 font-semibold text-blue-800">Trụ sở chính</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>172 Nguyễn Tri Phương, Phường 7, TP. Vũng Tàu, Bà Rịa-Vũng Tàu</p>
                <p>ĐT: (028) 1234 5678</p>
                <p>Fax: (028) 1234 5679</p>
                <p>Giờ làm việc: T2-T7, 8:00 - 17:30</p>
              </div>
            </div>
            <div className="border-border rounded-lg border p-5">
              <h3 className="mb-2 font-semibold text-blue-800">Chi nhánh Bình Dương</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>456 Đại lộ Bình Dương, TP. Thủ Dầu Một, Bình Dương</p>
                <p>ĐT: (0274) 234 5678</p>
                <p>Giờ làm việc: T2-T7, 7:30 - 17:00</p>
              </div>
            </div>
            <div className="border-border rounded-lg border p-5">
              <h3 className="mb-2 font-semibold text-blue-800">Kho hàng Đồng Nai</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>KCN Biên Hòa 2, TP. Biên Hòa, Đồng Nai</p>
                <p>ĐT: (0251) 345 6789</p>
                <p>Giờ làm việc: T2-T6, 7:30 - 17:00</p>
                <p>Xuất kho: T2-T6, 8:00 - 16:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Vị trí của chúng tôi</h2>
          <div className="overflow-hidden rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0!2d107.0843!3d10.3460!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31756fce89d1e9d3%3A0x1234567890abcdef!2s172%20Nguy%E1%BB%85n%20Tri%20Ph%C6%B0%C6%A1ng%2C%20Ph%C6%B0%E1%BB%9Dng%207%2C%20V%C5%A9ng%20T%C3%A0u!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vị trí Hải Ngọc"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
