import { type Product } from "~/types/product";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { AddToCartArea } from "~/components/product/AddToCartArea";
import { ImageGallery } from "~/components/product/ImageGallery";
import { PriceDisplay } from "~/components/product/PriceDisplay";
import { ReviewSection } from "~/components/product/ReviewSection";
import { RelatedProducts } from "~/components/product/RelatedProducts";
import { CrossSellProducts } from "~/components/product/CrossSellProducts";
import { products } from "~/data/products";
import { combos } from "~/data/promotions";
import { getReviewsBySlug } from "~/data/reviews";

export function ProductDetail({
  product,
  categoryName,
}: {
  product: Product;
  categoryName: string;
}) {
  // 1. Reviews
  const reviews = getReviewsBySlug(product.slug);

  // 2. Related products (D-09): relatedSlugs → same-category fallback
  const relatedFromSlugs = (product.relatedSlugs ?? [])
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);
  const relatedProducts =
    relatedFromSlugs.length > 0
      ? relatedFromSlugs
      : products
          .filter(
            (p) =>
              p.categorySlug === product.categorySlug &&
              p.slug !== product.slug,
          )
          .slice(0, 4);

  // 3. Cross-sell products (D-10): combo bundle → cross-category relatedSlugs fallback
  const combo = combos.find((c) => c.productSlugs.includes(product.slug));
  const crossSellSlugs = combo
    ? combo.productSlugs.filter((s) => s !== product.slug)
    : (product.relatedSlugs ?? []).filter((s) => {
        const rel = products.find((p) => p.slug === s);
        return rel != null && rel.categorySlug !== product.categorySlug;
      });
  const crossSellProducts = crossSellSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);

  return (
    <div>
      {/* 2-column grid: image gallery + product info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left column: ImageGallery replaces static image */}
        <ImageGallery product={product} />

        {/* Right column: product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl leading-tight font-semibold">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge
                className={
                  product.status === "in-stock"
                    ? "border-green-200 bg-green-100 text-green-700"
                    : "bg-secondary text-secondary-foreground"
                }
              >
                {product.status === "in-stock" ? "Còn hàng" : "Hết hàng"}
              </Badge>
              {product.origin && (
                <span className="text-muted-foreground text-sm">
                  {product.origin}
                </span>
              )}
            </div>
          </div>

          {/* Price display — per D-06, below name+badge, above specs */}
          <PriceDisplay product={product} />

          <Separator />

          {/* Technical specs table — UNCHANGED from current */}
          <div>
            <h2 className="mb-4 text-xl leading-tight font-semibold">
              Thông số kỹ thuật
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {product.material && (
                  <tr className="border-border border-b">
                    <td className="text-muted-foreground w-1/3 py-2 font-semibold">
                      Vật liệu
                    </td>
                    <td className="py-2">{product.material}</td>
                  </tr>
                )}
                {product.origin && (
                  <tr className="border-border border-b">
                    <td className="text-muted-foreground w-1/3 py-2 font-semibold">
                      Xuất xứ
                    </td>
                    <td className="py-2">{product.origin}</td>
                  </tr>
                )}
                {product.standard && (
                  <tr className="border-border border-b">
                    <td className="text-muted-foreground w-1/3 py-2 font-semibold">
                      Tiêu chuẩn
                    </td>
                    <td className="py-2">{product.standard}</td>
                  </tr>
                )}
                <tr className="border-border border-b">
                  <td className="text-muted-foreground w-1/3 py-2 font-semibold">
                    Danh mục
                  </td>
                  <td className="py-2">{categoryName}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {product.description && (
            <div>
              <h2 className="mb-4 text-xl leading-tight font-semibold">
                Mô tả
              </h2>
              <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}

          <Separator />

          <AddToCartArea product={product} />
        </div>
      </div>

      {/* Below-the-grid sections — each self-hides when empty */}
      <ReviewSection reviews={reviews} />
      <RelatedProducts products={relatedProducts} />
      <CrossSellProducts products={crossSellProducts} />
    </div>
  );
}
