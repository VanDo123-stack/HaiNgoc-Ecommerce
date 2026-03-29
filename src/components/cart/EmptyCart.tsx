import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <ShoppingCart className="h-16 w-16 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Giỏ hàng trống</h2>
      <p className="max-w-sm text-center text-muted-foreground">
        Bạn chưa thêm sản phẩm nào. Khám phá danh mục sản phẩm của chúng tôi.
      </p>
      <Link
        href="/san-pham"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        Xem sản phẩm
      </Link>
    </div>
  );
}
