import Image from "next/image";
import Link from "next/link";

import { AuthButton } from "~/components/layout/AuthButton";
import { CartBadge } from "~/components/layout/CartBadge";
import { SearchDropdown } from "~/components/layout/SearchDropdown";
import { HeaderSearchInput } from "~/components/layout/HeaderSearchInput";
import { MobileNav } from "~/components/layout/MobileNav";
import { NavBar } from "~/components/layout/NavBar";

export function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* Top bar: Logo + Search + Cart/Account */}
      <div className="bg-blue-800 text-white">
        <div className="container mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          {/* Mobile hamburger */}
          <MobileNav />

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Hải Ngọc"
              width={120}
              height={40}
              className="h-10 w-auto"
              sizes="120px"
              priority
            />
          </Link>

          {/* Search bar - visible from sm (640px) up */}
          <div className="hidden flex-1 justify-center sm:flex">
            <HeaderSearchInput />
          </div>

          {/* Right side: mobile search + Cart + Account */}
          <div className="ml-auto flex items-center gap-2">
            <div className="sm:hidden">
              <SearchDropdown />
            </div>
            <CartBadge />
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Menu bar - desktop only, with active page highlighting */}
      <NavBar />
    </header>
  );
}
