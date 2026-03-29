"use client";

import { ChevronDown, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { categories } from "~/data/categories";

const navLinks = [
  { href: "/", label: "Trang chủ", icon: true, exact: true },
  { href: "/san-pham", label: "Sản phẩm", dropdown: true },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/dich-vu-gia-cong", label: "Dịch vụ gia công" },
  { href: "/ho-tro-ky-thuat", label: "Hỗ trợ kỹ thuật" },
];

export function NavBar() {
  const pathname = usePathname();

  function isActive(link: (typeof navLinks)[number]) {
    if (link.exact) return pathname === link.href;
    return pathname === link.href || pathname.startsWith(link.href + "/");
  }

  const baseClass =
    "flex h-10 items-center px-4 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white/10";
  const activeClass = "bg-white/20";

  return (
    <nav className="hidden bg-blue-900 lg:block">
      <div className="container mx-auto max-w-7xl px-4">
        <ul className="flex items-center justify-center gap-0">
          {navLinks.map((link) =>
            link.dropdown ? (
              <li key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className={`${baseClass} gap-1 ${isActive(link) ? activeClass : ""}`}
                >
                  {link.label}
                  <ChevronDown className="h-3 w-3" />
                </Link>
                <ul className="invisible absolute left-0 top-full z-50 min-w-48 rounded-b-md bg-blue-900 py-1 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/san-pham?category=${cat.slug}`}
                        className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  className={`${baseClass} ${isActive(link) ? activeClass : ""}`}
                >
                  {link.icon ? <Home className="h-4 w-4" /> : link.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </nav>
  );
}
