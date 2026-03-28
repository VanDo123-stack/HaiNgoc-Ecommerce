import { notFound } from "next/navigation";
import { type Metadata } from "next";

import { products } from "~/data/products";
import { categories } from "~/data/categories";
import { ProductDetail } from "~/components/product/ProductDetail";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";

// Static generation for all 22 products
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

// Dynamic SEO metadata per UI-SPEC
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  return {
    title: `${product.name} - Hải Ngọc`,
    description:
      product.description.slice(0, 160) ||
      `${product.name} - Vật tư công nghiệp Hải Ngọc`,
    openGraph: {
      title: product.name,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.categorySlug);
  const categoryName = category?.name ?? product.categorySlug;

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb per D-16, UI-SPEC */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/san-pham">Sản phẩm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/san-pham?category=${product.categorySlug}`}
              >
                {categoryName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {product.name.length > 40
                  ? product.name.slice(0, 40) + "..."
                  : product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ProductDetail product={product} categoryName={categoryName} />
      </div>
    </main>
  );
}
