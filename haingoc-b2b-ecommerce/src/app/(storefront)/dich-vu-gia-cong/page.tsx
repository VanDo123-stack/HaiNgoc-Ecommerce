import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Dịch vụ gia công – Hải Ngọc",
  description: "Dịch vụ gia công cơ khí chuyên nghiệp tại Hải Ngọc.",
};

export default function DichVuGiaCongPage() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Dịch vụ gia công</h1>
      <p className="text-muted-foreground mt-4">
        Nội dung đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.
      </p>
    </main>
  );
}
