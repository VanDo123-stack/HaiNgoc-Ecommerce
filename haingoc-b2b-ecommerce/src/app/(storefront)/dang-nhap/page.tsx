"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "~/context/AuthContext";

export default function DangNhapPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("demo@haingoc.com.vn");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const ok = login(email, password);
    if (ok) {
      router.push("/tai-khoan");
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold">Đăng nhập</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@haingoc.com.vn"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
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
            Đăng nhập
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/dang-ky" className="text-primary hover:underline">
            Đăng ký
          </Link>
        </p>

        <div className="mt-4 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium">Tài khoản demo:</p>
          <p>Email: demo@haingoc.com.vn</p>
          <p>Mật khẩu: 123456</p>
        </div>
      </div>
    </main>
  );
}
