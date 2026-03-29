import { type Metadata } from "next";

import { AdminSidebar } from "~/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Hải Ngọc Quản Trị",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        {children}
      </main>
    </div>
  );
}
