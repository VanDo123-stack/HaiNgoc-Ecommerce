import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Hỗ trợ kỹ thuật – Hải Ngọc",
  description: "Hỗ trợ kỹ thuật và tư vấn giải pháp công nghiệp từ Hải Ngọc.",
};

export default function HoTroKyThuatPage() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Hỗ trợ kỹ thuật</h1>
      <p className="text-muted-foreground mt-4">
        Nội dung đang được cập nhật. Vui lòng liên hệ để biết thêm chi tiết.
      </p>
    </main>
  );
}
