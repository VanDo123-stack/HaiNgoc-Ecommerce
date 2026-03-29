import { notFound } from "next/navigation";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { news } from "~/data/news";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";

// Static generation for all 10 articles
export function generateStaticParams() {
  return news.map((a) => ({ slug: a.slug }));
}

// Dynamic SEO metadata per UI-SPEC
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((a) => a.slug === slug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  return {
    title: `${article.title} - Hải Ngọc`,
    description: article.summary.slice(0, 160),
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = news.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <main className="py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb per UI-SPEC */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/tin-tuc">Tin tức</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {article.title.length > 40
                    ? article.title.slice(0, 40) + "..."
                    : article.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Article header */}
          <div className="mb-6 mt-4">
            <h1 className="text-2xl font-semibold">{article.title}</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {article.publishedAt}
            </p>
          </div>

          {/* Hero image (conditional) */}
          {article.image && (
            <div className="bg-muted relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 768px"
              />
            </div>
          )}

          {/* Article body */}
          <div className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>

          {/* Back link */}
          <Link
            href="/tin-tuc"
            className="text-primary mt-8 inline-flex items-center gap-2 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại tin tức
          </Link>
        </div>
      </div>
    </main>
  );
}
