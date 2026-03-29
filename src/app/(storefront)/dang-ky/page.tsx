"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "~/context/AuthContext";

export default function DangKyPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("Trần Văn B");
  const [email, setEmail] = useState("test@haingoc.com.vn");
  const [phone, setPhone] = useState("0912345678");
  const [company, setCompany] = useState("Công ty TNHH Test");
  const [password, setPassword] = useState("123456");
  const [confirmPassword, setConfirmPassword] = useState("123456");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !email || !phone || !password) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    const ok = register({ name, email, phone, company }, password);
    if (ok) {
      router.push("/tai-khoan");
    } else {
      setError("Email đã được sử dụng");
    }
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold">Đăng ký tài khoản</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Họ và tên *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Số điện thoại *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tên công ty</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Mật khẩu *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Xác nhận mật khẩu *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Đăng ký
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
