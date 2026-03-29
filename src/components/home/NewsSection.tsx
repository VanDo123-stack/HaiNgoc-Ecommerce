import Image from "next/image";
import Link from "next/link";

import { type NewsArticle } from "~/types/news";

export function NewsSection({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl leading-tight font-semibold">
            Tin tức &amp; Cập nhật
          </h2>
          <Link
            href="/tin-tuc"
            className="text-primary text-sm hover:underline"
          >
            Xem tất cả tin tức
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/tin-tuc/${article.slug}`}>
              <div className="bg-card border-border overflow-hidden rounded-lg border border-b-2 transition-all hover:border-b-blue-800 hover:shadow-md">
                {article.image && (
                  <div className="bg-muted relative aspect-video">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {article.publishedAt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
