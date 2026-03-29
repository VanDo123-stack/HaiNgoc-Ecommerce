import Image from "next/image";
import Link from "next/link";

import { type NewsArticle } from "~/types/news";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/tin-tuc/${article.slug}`}>
      <div className="bg-card border-border overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
        {article.image && (
          <div className="bg-muted relative aspect-video">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          <p className="text-muted-foreground mt-2 text-sm line-clamp-3">
            {article.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}
