"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeaderSearchInput() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim() !== "") {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-white/60" />
      <input
        type="search"
        placeholder="Tìm sản phẩm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-8 w-full rounded-md border border-white/30 bg-white/10 pl-8 pr-3 text-sm text-white placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
      />
    </div>
  );
}
