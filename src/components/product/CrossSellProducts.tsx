import { type Product } from "~/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { ProductCard } from "~/components/product/ProductCard";

// CrossSellProducts — horizontal carousel for combo/cross-category products, hidden when empty (D-11)
export function CrossSellProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-semibold">Sản phẩm mua kèm</h2>
      <div className="relative px-10">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.slug} className="basis-1/2 md:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
