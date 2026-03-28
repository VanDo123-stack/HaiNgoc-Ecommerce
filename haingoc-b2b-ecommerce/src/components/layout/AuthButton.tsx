"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useAuth } from "~/context/AuthContext";

export function AuthButton() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return null;

  if (user) {
    return (
      <div className="hidden items-center gap-1.5 lg:flex">
        <Link
          href="/tai-khoan"
          className="flex h-7 items-center gap-1.5 rounded-lg border border-white/30 px-2.5 text-[0.8rem] font-medium text-white hover:bg-white/10"
        >
          <User className="h-3.5 w-3.5" />
          {user.name}
        </Link>
        <button
          onClick={logout}
          className="flex h-7 items-center justify-center rounded-lg px-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          title="Đăng xuất"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-1.5 lg:flex">
      <Link
        href="/dang-nhap"
        className="flex h-7 items-center justify-center rounded-lg border border-white/30 px-2.5 text-[0.8rem] font-medium text-white hover:bg-white/10"
      >
        Đăng nhập
      </Link>
      <Link
        href="/dang-ky"
        className="flex h-7 items-center justify-center rounded-lg bg-white/10 px-2.5 text-[0.8rem] font-medium text-white hover:bg-white/20"
      >
        Đăng ký
      </Link>
    </div>
  );
}
