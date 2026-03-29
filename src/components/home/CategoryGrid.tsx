import { Disc, Flame, Package, Scissors, Settings2 } from "lucide-react";
import Link from "next/link";

import { type Category } from "~/types/product";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "que-han": Flame,
  "may-mai": Settings2,
  "da-mai-da-cat": Disc,
  "dung-cu-cat-han": Scissors,
  "vat-tu-thiet-bi": Package,
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-xl leading-tight font-semibold">
          Danh mục sản phẩm
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.slug] ?? Package;
            return (
              <Link key={cat.slug} href={`/san-pham?category=${cat.slug}`}>
                <div className="bg-card border-border hover:bg-secondary flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors">
                  <Icon className="text-muted-foreground h-8 w-8" />
                  <span className="text-center text-sm font-semibold">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
