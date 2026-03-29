"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Menu,
} from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "~/components/ui/sheet";

const navItems = [
  { href: "/quan-tri", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/quan-tri/khach-hang", label: "Khách hàng", icon: Users },
  { href: "/quan-tri/san-pham", label: "Sản phẩm", icon: Package },
  { href: "/quan-tri/don-hang", label: "Đơn hàng", icon: ShoppingCart },
  { href: "/quan-tri/bao-cao", label: "Báo cáo", icon: BarChart3 },
] as const;

function NavLinks({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map((item) => {
        const isActive =
          item.href === "/quan-tri"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "flex h-11 items-center gap-3 rounded-lg px-4 text-sm",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-foreground hover:bg-muted/60",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[240px] flex-shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-14 items-center gap-2 px-4 text-xl font-semibold">
          Hải Ngọc Quản Trị
        </div>
        <div className="border-t border-border" />
        <NavLinks pathname={pathname} />
      </aside>

      {/* Mobile header */}
      <div className="flex h-14 items-center border-b border-border px-4 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Mở menu điều hướng"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex h-14 items-center gap-2 px-4 text-xl font-semibold">
              Hải Ngọc Quản Trị
            </div>
            <div className="border-t border-border" />
            <NavLinks
              pathname={pathname}
              onLinkClick={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <span className="ml-3 text-xl font-semibold">Hải Ngọc Quản Trị</span>
      </div>
    </>
  );
}
