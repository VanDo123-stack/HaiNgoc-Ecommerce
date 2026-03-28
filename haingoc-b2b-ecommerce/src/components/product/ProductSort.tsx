"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const sortLabels: Record<string, string> = {
  newest: "Mới nhất",
  name: "Tên A-Z",
  price: "Giá",
};

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "newest";

  function handleSortChange(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Sắp xếp</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-36">
          <span>{sortLabels[currentSort] ?? currentSort}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="name">Tên A-Z</SelectItem>
          <SelectItem value="price">Giá</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
