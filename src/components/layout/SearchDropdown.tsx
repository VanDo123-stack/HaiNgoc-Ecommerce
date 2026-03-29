"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { products } from "~/data/products";

export function SearchDropdown() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results =
    query.length >= 2
      ? products
          .filter(
            (product) =>
              product.name.toLowerCase().includes(query.toLowerCase()) ||
              product.slug.includes(query.toLowerCase()) ||
              product.standard.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 8)
      : [];

  function handleSelect(slug: string) {
    router.push(`/san-pham/${slug}`);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="min-h-11"
        onClick={() => setOpen(true)}
        aria-label="Tìm kiếm"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Tìm kiếm</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Tìm sản phẩm..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length >= 2 && results.length === 0 && (
            <CommandEmpty>
              <p className="text-sm font-semibold">Không tìm thấy sản phẩm</p>
              <p className="text-muted-foreground text-xs">
                Thử tìm với từ khóa khác hoặc xem toàn bộ sản phẩm
              </p>
            </CommandEmpty>
          )}
          {results.length > 0 && (
            <CommandGroup heading="Sản phẩm">
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleSelect(product.slug)}
                  className="cursor-pointer"
                >
                  <span>{product.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {query.length >= 2 && (
            <div className="border-t p-2">
              <Link
                href={`/tim-kiem?q=${encodeURIComponent(query)}`}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="text-primary flex items-center justify-center gap-1 rounded-sm px-2 py-1.5 text-sm hover:underline"
              >
                Xem tất cả kết quả cho &ldquo;{query}&rdquo;
              </Link>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
