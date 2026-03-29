import { Badge } from "~/components/ui/badge";
import { formatVND } from "~/lib/format";
import { type Product } from "~/types/product";

// 1. Price display component — handles discounted, plain, and no-price states

export function PriceDisplay({
  product,
  size = "detail",
}: {
  product: Product;
  size?: "card" | "detail";
}) {
  const hasDiscount =
    product.discountPercent != null && product.discountPercent > 0;

  if (!hasDiscount) {
    if (product.price === null) {
      return (
        <p
          className={
            size === "detail"
              ? "text-xl text-muted-foreground"
              : "text-sm text-muted-foreground"
          }
        >
          Lien he
        </p>
      );
    }
    return (
      <p className={size === "detail" ? "text-xl font-bold text-red-600" : "text-sm font-bold text-red-600"}>
        {formatVND(product.price)}
      </p>
    );
  }

  // Discounted product: sale price + strikethrough original + badge
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={
          size === "detail"
            ? "text-xl font-bold text-red-600"
            : "text-sm font-bold text-red-600"
        }
      >
        {formatVND(product.salePrice ?? product.price)}
      </span>
      <span className="text-sm text-muted-foreground line-through">
        {formatVND(product.originalPrice)}
      </span>
      <Badge className="border-orange-200 bg-orange-100 text-orange-700">
        -{product.discountPercent}%
      </Badge>
    </div>
  );
}
