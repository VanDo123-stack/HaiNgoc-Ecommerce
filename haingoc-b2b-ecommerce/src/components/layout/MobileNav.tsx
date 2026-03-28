"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import Link from "next/link";

import { Separator } from "~/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { categories } from "~/data/categories";
import { useAuth } from "~/context/AuthContext";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  function close() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="hover:bg-accent inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 lg:hidden"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="mt-8 flex flex-col gap-4 px-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Danh mục</h3>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/san-pham?category=${cat.slug}`}
                onClick={close}
                className="text-muted-foreground hover:text-foreground block py-2 text-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <Separator />
          <Link href="/san-pham" onClick={close} className="text-sm font-semibold">
            Sản phẩm
          </Link>
          <Link href="/tin-tuc" onClick={close} className="text-sm font-semibold">
            Tin tức
          </Link>
          <Link href="/lien-he" onClick={close} className="text-sm font-semibold">
            Liên hệ
          </Link>
          <Link href="/dich-vu-gia-cong" onClick={close} className="text-sm font-semibold">
            Dịch vụ gia công
          </Link>
          <Link href="/ho-tro-ky-thuat" onClick={close} className="text-sm font-semibold">
            Hỗ trợ kỹ thuật
          </Link>
          <Separator />
          {user ? (
            <>
              <Link href="/tai-khoan" onClick={close} className="text-sm font-semibold">
                Tài khoản ({user.name})
              </Link>
              <button
                onClick={() => { logout(); close(); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/dang-nhap" onClick={close} className="text-sm font-semibold">
                Đăng nhập
              </Link>
              <Link href="/dang-ky" onClick={close} className="text-sm font-semibold">
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
